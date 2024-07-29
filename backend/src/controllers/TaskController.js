const Task = require('../models/Task');


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


module.exports = { setTask, getTasks };