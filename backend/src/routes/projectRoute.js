const express = require('express');
const route = express.Router();
const ProjectController = require('../controllers/ProjectController')
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');


route.post('/project', accessTokenMiddleware.verifyToken, ProjectController.setProject);
route.get('/project', accessTokenMiddleware.verifyToken, ProjectController.getProjects);
route.patch('/project', accessTokenMiddleware.verifyToken, ProjectController.updateProject);
route.get('/project/:id', accessTokenMiddleware.verifyToken, ProjectController.getProjectById);
route.get('/project/:filter/:search/:status/:priority', accessTokenMiddleware.verifyToken, ProjectController.getProjectsByFilter);
module.exports =  route;