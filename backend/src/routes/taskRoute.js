const express = require('express');
const route = express.Router();
const TaskController = require('../controllers/TaskController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

route.post('/task', accessTokenMiddleware.verifyToken, TaskController.setTask);
route.get('/task', accessTokenMiddleware.verifyToken, TaskController.getTasks);
route.patch('/task/check_limit', accessTokenMiddleware.verifyToken, TaskController.checkTasksLimit);
route.patch('/task', accessTokenMiddleware.verifyToken, TaskController.updateTask);
route.get('/task/search', accessTokenMiddleware.verifyToken, TaskController.searchTasks);

module.exports = route;