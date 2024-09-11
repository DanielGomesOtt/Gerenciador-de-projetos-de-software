const express = require('express');
const route = express.Router();
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');
const paymentController = require('../controllers/paymentController');

route.post('/set_payment_monthly_plan', accessTokenMiddleware.verifyToken, paymentController.setPaymentMonthlyPlan);
route.post('/set_payment_yearly_plan', accessTokenMiddleware.verifyToken, paymentController.setPaymentYearlyPlan);

module.exports = route;
