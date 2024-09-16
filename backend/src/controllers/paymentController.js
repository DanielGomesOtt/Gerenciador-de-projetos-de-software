require('dotenv').config();
const mercadoPago = require('mercadopago');
const Payment = require('../models/Payment');
const User = require('../models/User');
const Project = require('../models/Project');

async function setPaymentMonthlyPlan (req, res){
    try{
        const client = new mercadoPago.MercadoPagoConfig({ accessToken:  process.env.MERCADO_PAGO_TOKEN});

        const preference = new mercadoPago.Preference(client);

        const body = {
            items: [
                {
                    id: '1',
                    title: 'Monthly Plan',
                    description: 'Monthly plan for task life premium',
                    picture_url: '',
                    category_id: 'subscription',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: 15.00,
                },
            ],
            payer: {
                name: req.body.name,
                email: req.body.email,
            },
            back_urls: {
                success: `${process.env.BASE_URL}:3000/payment_success`,
                failure: `${process.env.BASE_URL}:3000/payment_failure`,
                pending: `${process.env.BASE_URL}:3000/payment_pending`,
            },
            auto_return: 'approved',
            statement_descriptor: 'Task Life Monthly Plan',
        };

        const response = await preference.create({ body });

        await Payment.create({ 'id_user': req.body.id_user, 'id_payment_mercado_pago': response.id, 'status': 'monthly', 'value': response.items[0].unit_price });
        res.send(response);
        
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function setPaymentYearlyPlan (req, res){
    try{
        const client = new mercadoPago.MercadoPagoConfig({ accessToken:  process.env.MERCADO_PAGO_TOKEN});

        const preference = new mercadoPago.Preference(client);

        const body = {
            items: [
                {
                    id: '2',
                    title: 'Yearly Plan',
                    description: 'Yearly plan for task life premium',
                    picture_url: '',
                    category_id: 'subscription',
                    quantity: 1,
                    currency_id: 'BRL',
                    unit_price: 150.00,
                },
            ],
            payer: {
                name: req.body.name,
                email: req.body.email,
            },
            back_urls: {
                success: `${process.env.BASE_URL}:3000/payment_success`,
                failure: `${process.env.BASE_URL}:3000/payment_failure`,
                pending: `${process.env.BASE_URL}:3000/payment_pending`,
            },
            auto_return: 'approved',
            statement_descriptor: 'Task Life Yearly Plan',
        };

        const response = await preference.create({ body });
        
        await Payment.create({ 'id_user': req.body.id_user, 'id_payment_mercado_pago': response.id, 'status': 'yearly', 'value': response.items[0].unit_price });
        res.send(response);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function confirmPayment(req, res){
    try{

        let payment = await Payment.findOne({
            where: {
                'id_user': req.body.id_user
            },
            order: [['id', 'DESC']]
        });
        if(payment && payment.dataValues){
            let endPlan = new Date();
            if(payment.dataValues.status == 'monthly'){
                endPlan.setDate(endPlan.getDate() + 30);
                endPlan = `${endPlan.getFullYear()}-${endPlan.getMonth() + 1}-${endPlan.getDate()}`;
            }else if(payment.dataValues.status == 'yearly'){
                endPlan.setDate(endPlan.getDate() + 365);
                endPlan = `${endPlan.getFullYear()}-${endPlan.getMonth() + 1}-${endPlan.getDate()}`;
            }

            let plan = {
                'premium_user': 1,
                'type_premium': payment.dataValues.status,
                'end_plan_premium': endPlan,
            };
            
            await User.update(plan, {
                where: {
                    'id': req.body.id_user
                }    
            });


           await Project.update({ 'project_premium': 1 }, {
                where: {
                    'id_project_creator': req.body.id_user
                }
           });

            const user = await User.findOne({
                where: {
                    'id': req.body.id_user
                }
            });

            res.status(201).send(user);
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}

module.exports = { setPaymentMonthlyPlan, setPaymentYearlyPlan, confirmPayment };