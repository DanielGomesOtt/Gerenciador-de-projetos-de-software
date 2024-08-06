const express = require('express');
const route = express.Router();
const TaskController = require('../controllers/TaskController');
const UserController = require('../controllers/UserController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');
const { jsonModel } = require('../config/gemini');

route.post('/task', accessTokenMiddleware.verifyToken, TaskController.setTask);
route.post('/task/gemini', accessTokenMiddleware.verifyToken, TaskController.setTaskByGemini);
route.get('/task', accessTokenMiddleware.verifyToken, TaskController.getTasks);
route.patch('/task/check_limit', accessTokenMiddleware.verifyToken, TaskController.checkTasksLimit);
route.patch('/task', accessTokenMiddleware.verifyToken, TaskController.updateTask);
route.get('/task/search', accessTokenMiddleware.verifyToken, TaskController.searchTasks);
route.get('/user_task', accessTokenMiddleware.verifyToken, UserController.getUserById);

module.exports = route;