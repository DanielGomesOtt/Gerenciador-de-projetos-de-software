const express = require('express');
const route = express.Router();
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');
const PaymentController = require('../controllers/PaymentController');

route.post('/set_payment_monthly_plan', accessTokenMiddleware.verifyToken, PaymentController.setPaymentMonthlyPlan);
route.post('/set_payment_yearly_plan', accessTokenMiddleware.verifyToken, PaymentController.setPaymentYearlyPlan);
route.post('/confirm_payment', accessTokenMiddleware.verifyToken, PaymentController.confirmPayment);

module.exports = route;
