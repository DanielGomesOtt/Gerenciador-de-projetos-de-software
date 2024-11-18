const Administrator = require('../models/Administrator');
const jwt = require('../middlewares/accessTokenMiddleware');
const User = require('../models/User');
const Payment = require('../models/Payment');
const Project = require('../models/Project');
const Task = require('../models/Task');
const UserProject = require('../models/UserProject');
const { Op, fn, col } = require('sequelize');
const { sendAdminCredentialEmail } = require('../utils/email');
const { hashPassword } = require('../utils/hashPassword');

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

async function getProjects(req, res) {
    try {
        
        const projectWhere = {};
        const userWhere = {};

        
        if (req.headers.name) {
            projectWhere.name = {
                [Op.like]: fn('UPPER', `%${req.headers.name.toUpperCase()}%`)
            };
        }

        
        if (req.headers.email) {
            userWhere.email = {
                [Op.like]: fn('UPPER', `%${req.headers.email.toUpperCase()}%`)
            };
        }

        
        const projects = await Project.findAll({
            where: projectWhere,
            include: [
                {
                    model: UserProject,
                    include: [
                        {
                            model: User,
                            where: userWhere
                        }
                    ]
                }
            ],
            order: [['id', 'DESC']]
        });

        res.send(projects);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function setManageProject(req, res){
    try{
        
        const user = await UserProject.findOne({
            where: {
                id_project: req.body.id_project,
                status: 1
            },
            include: [
                {
                    model: User,
                    required: true,
                    where: {
                        
                        email: req.body.email.toUpperCase(),
                        status: 1
                    }
                }
            ]
        });
        if(user && user.User.dataValues){
            let update = {
                administrator: req.body.permission
            }
            await UserProject.update(update, {
                where: {
                    id_project: req.body.id_project,
                    id_user: user.User.dataValues.id
                }
            })
            res.status(201).json({ message: 'success' });
        }else{
            res.status(200).json({ message: 'This user is not in this project' });
        }
        
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function setAdministrator(req, res){
    try{
        const administrator = await Administrator.findOne({
            where: {
                email: req.body.email,
                status: 1
            }
        });
        
        if(administrator && administrator.dataValues){
            res.status(409).json({ message: 'Email already registered' });
        }else{
            let adminData = {
                admin_register: req.body.admin_register,
                name: req.body.name,
                email: req.body.email,
                password: generateRandomPassword(),
                status: req.body.status
            }
            
            const newAdmin = await Administrator.create(adminData);

            if(newAdmin){
                sendAdminCredentialEmail(adminData.email, adminData.password, adminData.admin_register);
                res.status(201).json({ message: 'Administrator created successfully' });
            }else{
                res.status(500).json({ message: 'An error occurred while trying to create the administrator' });
            }
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function recoverCredentials(req, res){
    try{
        const administrator = await Administrator.findOne({
            where: {
                email: req.headers.email,
                status: 1
            }
        });
        
        if(administrator){
            sendAdminCredentialEmail(req.headers.email, administrator.dataValues.password, administrator.dataValues.admin_register);
            res.status(200).json({ message: 'Your credentials have been sent to your email' });
        }else{
            res.status(404).json({ message: 'User not found' });
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function setTestAccount(req, res){
    try{
        const account = await User.findOne({
            where: {
                email: req.body.email,
                status: 1
            }
        });

        if(account){
            res.status(409).json({ message: 'Email already used in an account' });
        }else{
            const administrator = await Administrator.findOne({
                where: {
                    email: req.body.email,
                    status: 1
                }
            });

            const testUser = {
                name: req.body.name,
                email: req.body.email,
                password: hashPassword(administrator.dataValues.password),
                id_category: req.body.id_category,
                end_plan_premium: req.body.end_plan_premium,
                type_premium: req.body.type_premium,
                premium_user: req.body.premium_user,
                id_group: 0,
                status: 1
            }

            const createdTestUser = await User.create(testUser);

            if(createdTestUser){
                let testPassword = administrator.dataValues.password;
                await Administrator.update({ test_password: testPassword }, {
                    where: {
                        email: req.body.email,
                        status: 1
                    }
                })

                res.status(201).json({ message: 'Test account successfully created' });
            }
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}

function generateRandomPassword(length = 12) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let password = '';
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      password += characters[randomIndex];
    }
  
    return password;
}

module.exports = {handleLogin, usersReport, paymentsReport, projectsReport, tasksReport, monthlyPlanReport, yearlyPlanReport, getProjects, setManageProject, setAdministrator, recoverCredentials, setTestAccount};
