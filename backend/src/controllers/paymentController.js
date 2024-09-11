require('dotenv').config();
const mercadoPago = require('mercadopago');
const User = require('../models/User');

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

        const response = await preference.create({ body })

        let today = new Date();
        today.setDate(today.getDate() + 30);

        await User.update({
                'premium_user': true,
                'type_premium': 'monthly',
                'end_plan_premium': `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate}`, 
            },{
                where: {
                    'email': req.body.email
                }
            }
        );

        let user = await User.findOne({
            where:{
                'email': req.body.email
            }
        });
        res.send([response, user.dataValues]);
        
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

        const response = await preference.create({ body })
        


        res.send(response);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

module.exports = { setPaymentMonthlyPlan, setPaymentYearlyPlan };