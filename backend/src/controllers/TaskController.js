const Task = require('../models/Task');
const { Sequelize } = require('sequelize');

async function setTask(req, res){
    try{
        const task = await Task.create(req.body);

        if(task){
            res.status(201).json({ message: 'Task created successfully.' });
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}


async function getTasks(req, res) {
    try {
        const { id_project, id_user, administrator } = req.headers;

        const condition = {
            id_project,
        };

        if (!administrator) {
            condition.id_user = id_user;
        }

        const tasks = await Task.findAll({ where: condition });

        if (tasks && tasks.length > 0) {
            res.send(tasks);
        } else {
            res.status(404).json({ message: 'No tasks found' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function checkTasksLimit(req, res) {
    try {
        const id_project = req.body.id_project;
        let today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');

        today = `${year}-${month}-${day}`;

        let check_limit = await Task.update({
            status: 'overdue'
        }, {
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('expected_end_date')), '<', today),
                    { id_project: id_project },
                    {
                        status: {
                            [Sequelize.Op.notIn]: ['cancelled', 'completed', 'overdue']
                        }
                    }
                ]
            }
        });

        check_limit = await Task.update({
            status: 'in progress'
        }, {
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('expected_end_date')), '>=', today),
                    { id_project: id_project },
                    {
                        status: {
                            [Sequelize.Op.notIn]: ['cancelled', 'completed', 'in progress']
                        }
                    }
                ]
            }
        });

        res.status(200).json({ message: 'Tasks updated successfully', updatedRows: check_limit[0] });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = { setTask, getTasks, checkTasksLimit };