const express = require('express');
const route = express.Router();
const AdministratorController = require('../controllers/AdministratorController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

route.post('/administrator/login', AdministratorController.handleLogin);
route.get('/administrator/users_report', accessTokenMiddleware.verifyToken, AdministratorController.usersReport);
route.get('/administrator/payments_report', accessTokenMiddleware.verifyToken, AdministratorController.paymentsReport);
route.get('/administrator/projects_report', accessTokenMiddleware.verifyToken, AdministratorController.projectsReport);
route.get('/administrator/tasks_report', accessTokenMiddleware.verifyToken, AdministratorController.tasksReport);
route.get('/administrator/monthly_plan_report', accessTokenMiddleware.verifyToken, AdministratorController.monthlyPlanReport);
route.get('/administrator/yearly_plan_report', accessTokenMiddleware.verifyToken, AdministratorController.yearlyPlanReport);
module.exports =  route;