const Task = require('../models/Task');
const { Sequelize, Op } = require('sequelize');

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
            status: {
                [Op.or]: ['in progress', 'overdue', 'urgent']
            }
        };

        if (!administrator) {
            condition.id_user = id_user;
        }


        const tasks = await Task.findAll({ where: condition, order: [['id', 'DESC']], limit: 10 });

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
                            [Sequelize.Op.notIn]: ['cancelled', 'completed', 'in progress', 'urgent']
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

async function updateTask(req, res){
    try{
        let data = {
            'title': req.body.title,
            'description': req.body.description,
            'expected_end_date': req.body.expected_end_date,
            'type_task': req.body.type_task,
            'status': req.body.status,
            'id_user': req.body.id_user,
        };


        if(data.status == 'completed'){
            let today = new Date();

            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');

            today = `${year}-${month}-${day}`;
            
            data.real_end_date = today;
        }

        const updateTask = await Task.update(data, {
            where: {
                id: req.body.id_task
            }
        });

        if(updateTask){
            res.status(200).json({ message: 'Task updated successfully.' })
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function searchTasks(req, res){
    try{
        let filter = {};
        
        if (req.query.filter && req.query.filter !== undefined && req.query.filter.length > 0 && req.query.search && req.query.search !== undefined && req.query.search.length > 0) {
            if(req.query.filter == 'title'){
                filter.title = req.query.search.toLowerCase();
            }
        }
        
        if (req.query.status && req.query.status !== undefined && req.query.status.length > 0) {
            filter.status = req.query.status;
        }

        if (req.query.type_task && req.query.type_task !== undefined && req.query.type_task.length > 0) {
            filter.type_task = req.query.type_task;
        }

        if(Object.keys(filter).length === 0){
            filter.status = { [Op.or]: ['in progress', 'overdue', 'urgent'] };
        }

        if(req.headers.administrator == false){
            filter.id_user = req.headers.id_user;
        }

        const tasks = await Task.findAll({
            where: filter,
            order: [['id', 'DESC']]
        });
        res.send(tasks);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

module.exports = { setTask, getTasks, checkTasksLimit, updateTask, searchTasks };