const express = require('express');
const route = express.Router();
const LoginController = require('../controllers/LoginController');

route.post('/login', LoginController.handleLogin);

module.exports =  route;