const express = require('express');
const route = express.Router();
const UserController = require('../controllers/UserController')

route.get('/account/avatar', UserController.getUserAvatar);

module.exports =  route;