const express = require('express');
const route = express.Router();
const hash = require('../middlewares/hashPasswordMiddleware');
const UserController = require('../controllers/UserController')

route.post('/', hash.hashPassword, UserController.setUser);

module.exports =  route;