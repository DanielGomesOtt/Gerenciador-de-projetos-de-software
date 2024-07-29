const express = require('express');
const route = express.Router();
const TasktController = require('../controllers/TaskController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

route.post('/task', accessTokenMiddleware.verifyToken, TasktController.setTask);
route.get('/task', accessTokenMiddleware.verifyToken, TasktController.getTasks);
route.patch('/task/check_limit', accessTokenMiddleware.verifyToken, TasktController.checkTasksLimit);

module.exports = route;