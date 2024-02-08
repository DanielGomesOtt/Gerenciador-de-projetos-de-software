const express = require('express');
const route = express.Router();
const passwordRecoveryController = require('../controllers/PasswordRecoveryController');

route.get('/password_recovery', passwordRecoveryController.sendResetCode);

module.exports =  route;