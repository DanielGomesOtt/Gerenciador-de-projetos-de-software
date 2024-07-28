const Task = require('../models/Task');
const jwt = require('../middlewares/accessTokenMiddleware');

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

module.exports = { setTask };