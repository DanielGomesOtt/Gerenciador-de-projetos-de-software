const Task = require('../models/Task');
const { Sequelize, Op } = require('sequelize');
const { jsonModel } = require('../config/gemini');


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
        const { id_project } = req.headers;

        const condition = {
            id_project,
            status: {
                [Op.or]: ['in progress', 'overdue', 'urgent']
            }
        };

        const tasks = await Task.findAll({ where: condition, order: [['expected_end_date', 'ASC']] });

        if (tasks && tasks.length > 0) {
            res.send(tasks);
        } else {
            res.send([]);
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
                filter.title = {[Op.like]: `%${req.query.search.toLowerCase()}%`};
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

        filter.id_project = req.headers.id_project;


        const tasks = await Task.findAll({
            where: filter,
            order: [['expected_end_date']]
        });
        res.send(tasks);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function setTaskByGemini(req, res){
    try{
        let prompt = `Crie ${req.body.quantity_task} tasks para um projeto de desenvolvimento relacionado ao tópico: ${req.body.topic}`;
        let json = `{
                        "type": "object",
                        "properties": {
                            "id_user": ${req.body.id_user},
                            "id_project": ${req.body.id_project},
                            "title": { "type": "string" },
                            "expected_end_date": {
                                "type": "object",
                                "properties": {
                                    "start_date": ${req.body.initial_date},
                                    "end_date": ${req.body.end_date}
                                },
                                "required": ["start_date", "end_date"]
                            },
                            "status": "in progress",
                            "project_stage": { "type": "empty string" },
                            "type_task": "created by gemini",
                            "description": { "type": "string" }
                        }
                    }
                    `
        prompt = prompt + `: ${json}`;
        let result = await jsonModel.generateContent(prompt);
        let response = new Array(result.response.text());
        response = JSON.parse(response);
        response.forEach(async (task) => {
            let taskData = {
                'id_user': req.body.id_user,
                'id_project': req.body.id_project,
                'title': (task && task.title && task !== undefined && task.title !== undefined ? task.title : ''),
                'description': (task && task.description && task !== undefined && task.description !== undefined ? task.description : ''),
                'expected_end_date': (task && task.expected_end_date && task.expected_end_date.end_date && task !== undefined && task.expected_end_date !== undefined &&task.expected_end_date.end_date !== undefined ? task.expected_end_date.end_date : ''),
                'type_task': (task && task.type_task && task !== undefined && task.type_task !== undefined ? task.type_task : ''),
                'status': (task && task.status && task !== undefined && task.status !== undefined && task.status == 'in progress' ? task.status : 'in progress')
            }

            await Task.create(taskData);
        });
        res.status(201).json({ message: 'Tasks created successfully.' });
    }catch(error){
        res.status(500).json({ message: error });
    }
}

module.exports = { setTask, getTasks, checkTasksLimit, updateTask, searchTasks, setTaskByGemini };