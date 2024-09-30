const express = require('express');
const route = express.Router();
const hash = require('../middlewares/hashPasswordMiddleware');
const UserController = require('../controllers/UserController')
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

route.post('/', hash.hashPassword, UserController.setUser);
route.post('/send_support_email', accessTokenMiddleware.verifyToken, UserController.sendSupportEmail);

module.exports =  route;