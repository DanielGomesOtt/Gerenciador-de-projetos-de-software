const express = require('express');
const route = express.Router();
const UserController = require('../controllers/UserController')
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');


route.get('/account/avatar', UserController.getUserAvatar);
// route.post('/account', accessTokenMiddleware.verifyToken, UserController.updateUser);

module.exports =  route;