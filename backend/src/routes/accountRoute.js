const express = require('express');
const route = express.Router();
const AccountController = require('../controllers/AccountController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');


route.get('/account', accessTokenMiddleware.verifyToken, AccountController.getUserData);

module.exports =  route;