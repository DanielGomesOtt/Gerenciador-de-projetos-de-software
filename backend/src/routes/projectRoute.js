const express = require('express');
const route = express.Router();
const ProjectController = require('../controllers/ProjectController')
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');


route.post('/project', accessTokenMiddleware.verifyToken, ProjectController.setProject);
route.get('/project', accessTokenMiddleware.verifyToken, ProjectController.getProjects);
route.patch('/project', accessTokenMiddleware.verifyToken, ProjectController.updateProject);
route.get('/project/:id', accessTokenMiddleware.verifyToken, ProjectController.getProjectById);
route.get('/my_projects', accessTokenMiddleware.verifyToken, ProjectController.getProjectsByFilter);
route.get('/project_group', accessTokenMiddleware.verifyToken, ProjectController.getUsersByProject);
route.get('/project_group/my_project_data', accessTokenMiddleware.verifyToken, ProjectController.getMyProjectData);
route.post('/project_group/send_invite', accessTokenMiddleware.verifyToken, ProjectController.sendInvite);
module.exports =  route;