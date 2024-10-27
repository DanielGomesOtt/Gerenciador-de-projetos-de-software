const express = require('express');
const route = express.Router();
const AdminLoginController = require('../controllers/AdminLoginController');

route.post('/administrator/login', AdminLoginController.handleLogin);

module.exports =  route;