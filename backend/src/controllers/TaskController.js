const Task = require('../models/Task');
const { Sequelize, Op } = require('sequelize');
const { jsonModel } = require('../config/gemini');


async function setTask(req, res){
    try{

        if(req.body.status == 'in progress'){
            req.body.in_progress_date = new Date();
        }

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
                [Op.or]: ['to do', 'in progress', 'overdue', 'urgent']
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
            status: 'to do'
        }, {
            where: {
                [Sequelize.Op.and]: [
                    Sequelize.where(Sequelize.fn('DATE', Sequelize.col('expected_end_date')), '>=', today),
                    { id_project: id_project },
                    {
                        status: {
                            [Sequelize.Op.notIn]: ['to do', 'cancelled', 'completed', 'in progress', 'urgent']
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

        const currentTask = await Task.findByPk(req.body.id_task);

        if(currentTask && currentTask.dataValues && currentTask.dataValues.status !== 'in progress' && data.status == 'in progress'){
            data.in_progress_date = new Date();
            data.in_progress_date.setHours(data.in_progress_date.getHours() - 3);
        }

        if(data.status == 'completed'){
            let today = new Date();

            const year = today.getFullYear();
            const month = String(today.getMonth() + 1).padStart(2, '0');
            const day = String(today.getDate()).padStart(2, '0');

            today = `${year}-${month}-${day} ${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
            
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
            filter.status = { [Op.or]: ['to do', 'in progress', 'overdue', 'urgent'] };
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

async function setTaskByGemini(req, res) {
    try {
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
                            "status": "to do",
                            "project_stage": { "type": "empty string" },
                            "type_task": "created by gemini",
                            "description": { "type": "string" }
                        }
                    }
                    `;
        prompt = prompt + `: ${json}`;
        let result = await jsonModel.generateContent(prompt);
        let response = new Array(result.response.text());
        response = JSON.parse(response);

        
        let errors = [];

        if (response) {
            response.forEach(async (task) => {
                try {
                    let verifyDate = '';
                    let today = new Date();
                    if (task && task.expected_end_date && task.expected_end_date.end_date) {
                        verifyDate = new Date(task.expected_end_date.end_date);
                    } else {
                        task.expected_end_date = {
                            ...task.expected_end_date,
                            end_date: `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 00:00:00`
                        };
                    }

                    if (isNaN(verifyDate.getDate())) {
                        task.expected_end_date.end_date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()} 00:00:00`;
                    }

                    let taskData = {
                        'id_user': req.body.id_user,
                        'id_project': req.body.id_project,
                        'title': task?.title || '',
                        'description': task?.description || '',
                        'expected_end_date': task?.expected_end_date?.end_date || '',
                        'type_task': task?.type_task || 'created by gemini',
                        'status': task?.status === 'to do' ? 'to do' : 'to do'
                    };

                    await Task.create(taskData);
                } catch (taskError) {
                    errors.push({ task, error: taskError.message });
                }
            });
        }

        if (errors.length > 0) {
            res.status(207).json({ message: 'Some tasks encountered errors.', errors });
        } else {
            res.status(201).json({ message: 'Tasks created successfully.' });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error.', error: error.message });
    }
}


module.exports = { setTask, getTasks, checkTasksLimit, updateTask, searchTasks, setTaskByGemini };