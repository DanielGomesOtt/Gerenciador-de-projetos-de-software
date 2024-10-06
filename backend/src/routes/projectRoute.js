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
route.get('/project_group/invites', accessTokenMiddleware.verifyToken, ProjectController.getMyInvites);
route.patch('/project_group/invites', accessTokenMiddleware.verifyToken, ProjectController.respondInvite);
route.patch('/project_group/remove_member', accessTokenMiddleware.verifyToken, ProjectController.removeMemberFromProject);
route.patch('/project/exit_project', accessTokenMiddleware.verifyToken, ProjectController.exitProject);
route.patch('/project/check_limit', accessTokenMiddleware.verifyToken, ProjectController.checkProjectsLimit);
route.get('/get_all_projects', accessTokenMiddleware.verifyToken, ProjectController.getAllProjects);
route.get('/project_progress', accessTokenMiddleware.verifyToken, ProjectController.getProjectProgress);
module.exports =  route;