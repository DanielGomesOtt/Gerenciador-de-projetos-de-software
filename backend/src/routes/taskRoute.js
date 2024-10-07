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
route.get('/task_progress', accessTokenMiddleware.verifyToken, TaskController.getTaskProgress);
route.get('/users_report', accessTokenMiddleware.verifyToken, UserController.getUsersForReport);
route.get('/users_table_report', accessTokenMiddleware.verifyToken, UserController.getUsersTableForReport);
route.get('/tasks_by_user', accessTokenMiddleware.verifyToken, TaskController.getTasksByUser);

module.exports = route;