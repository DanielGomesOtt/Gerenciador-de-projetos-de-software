const express = require('express');
const route = express.Router();
const passwordRecoveryController = require('../controllers/PasswordRecoveryController');

route.get('/password_recovery', passwordRecoveryController.sendResetCode);
route.post('/password_recovery', passwordRecoveryController.verifyResetCode);
route.patch('/password_recovery', passwordRecoveryController.updateUserPassword);

module.exports =  route;