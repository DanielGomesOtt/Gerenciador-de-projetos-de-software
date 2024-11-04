const Administrator = require('../models/Administrator');
const jwt = require('../middlewares/accessTokenMiddleware');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const Task = require('../models/Task');
const UserProject = require('../models/UserProject');

async function handleLogin(req, res){
    try{
        const admin = await Administrator.findOne({
            where: {
                'admin_register': req.body.admin_register,
                'email': req.body.email,
                'status': 1,
            },
        });
        if(admin === null){
            res.status(404).json({message: 'User not found'});
        }else{
            if(req.body.password == admin.dataValues.password){
                delete admin.dataValues.password;
                const token = jwt.sign({ 'id': admin.dataValues.id });
                if(token !== 401 && token !== 500){
                    res.status(200).json({'administrator':admin, 'token': token});
                }else{
                    res.status(token).json({message: 'An error occurred while trying to generate the token'});
                }
            }else{
                res.status(401).json({message: 'Your login credentials are incorrect'});
            }
        }    
    }catch(error){
        console.log(error)
        res.status(500).json({message: 'An error occurred while trying to log in'});
    }
}

async function usersReport(req, res){
    try{
        const users = await User.findAll();

        res.send(users);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function paymentsReport(req, res){
    try{
        const payments = await Payment.findAll();

        res.send(payments);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function projectsReport(req, res){
    try{
        const projects = await Project.findAll();

        res.send(projects);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function tasksReport(req, res){
    try{
        const tasks = await Task.findAll();

        res.send(tasks);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function monthlyPlanReport(req, res){
    try{
        const plans = await Payment.findAll({
            where: {
                status: 'monthly'
            }
        });

        res.send(plans);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function yearlyPlanReport(req, res){
    try{
        const plans = await Payment.findAll({
            where: {
                status: 'yearly'
            }
        });

        res.send(plans);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function getProjects(req, res){
    try{

        let where = {}

        if(req.headers.name !== null && req.headers.name !== undefined && req.headers.name.length > 0){
            where.name = req.headers.name;
        }

        if(req.headers.email !== null && req.headers.email !== undefined && req.headers.email.length > 0){
            where.email = req.headers.email;
        }

        const projects = await Project.findAll({
            order: [
                ['id', 'DESC']
            ]
        });

        res.send(projects);
    }catch(error){
        res.status(500).json({ message: error });
    }
}

module.exports = {handleLogin, usersReport, paymentsReport, projectsReport, tasksReport, monthlyPlanReport, yearlyPlanReport, getProjects};
