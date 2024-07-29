const express = require('express');
const route = express.Router();
const TasktController = require('../controllers/TaskController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

route.post('/task', accessTokenMiddleware.verifyToken, TasktController.setTask);
route.get('/task', accessTokenMiddleware.verifyToken, TasktController.getTasks);

module.exports = route;