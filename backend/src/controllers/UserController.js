const User = require('../models/User');
const jwt = require('../middlewares/accessTokenMiddleware');
const Email = require('../utils/email');
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const { Op, Sequelize } = require('sequelize');



async function setUser(req, res) {
    try {
        const [user, created] = await User.findOrCreate({
            where: { email: req.body.email, status: 1 },
            defaults: req.body
        });

        if (created) {
            const token = jwt.sign({'id': user.dataValues.id});
            if(token !== 401 && token !== 500){
                delete user.dataValues.password;
                res.status(201).json({ 'user': user, 'token': token});
            }
        } else {
            res.status(200).json({ message: 'User already exists' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUserAvatar(req, res){
    try{
        let user = JSON.parse(req.headers.user);
        const avatar_path = await User.findOne({
            attributes: ['avatar_path'],
            where : {
                'id': user.id
            }
        })
        if(avatar_path){
            res.status(200).send(user);
        }
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

async function getUserById(req, res){
    try{
        const id_user = req.headers.id_user_task;
        const user = await User.findOne({where: {id: id_user}});
        if(user){
            res.send(user);
        }else{
            res.status(404).json({ message: 'User not found.' });
        }
    }catch(error){
        res.status(500).json({ message: error });
    }
}

async function sendSupportEmail(req, res) {
    try {
        
        const { email, id_user, description, subject } = req.body; 
        const file = req.file;

        const emailData = {
            email,
            id_user,
            description,
            subject,
            file: file ? file.path : null 
        };

        
        await Email.sendSupportEmail(emailData);
        
        res.status(200).send({ message: 'success' });
        
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


async function getUsersForReport(req, res) {
    try {
        const users = await UserProject.findAll({
            include: [
                {
                    model: User,
                    required: true,
                    as: 'user',
                     // Use o alias correto se necessário
                },
                
                {
                    model: Project,
                    required: true,
                    as: 'project', // Use o alias correto se necessário
                }
            ],
            where: {
                id_project: {
                    [Op.in]: Sequelize.literal(`(
                        SELECT user_project.id_project 
                        FROM project 
                        JOIN user_project ON user_project.id_project = project.id 
                        JOIN user ON user.id = user_project.id_user
                        WHERE user_project.id_user = ${req.headers.id_user} AND user_project.administrator = 1
                    )`)
                }
            },
            distinct: true,
        });
        
        

        res.send(users);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

async function getUsersTableForReport(req, res) {
    try {
        if(req.headers.id_user.length > 0){
            const users = await UserProject.findAll({
                include: [
                    {
                        model: User,
                        required: true,
                        as: 'user', // Use o alias correto se necessário
                    },
                    {
                        model: Project,
                        required: true,
                        as: 'project', // Use o alias correto se necessário
                    }
                ],
                where: {
                    id_user: req.headers.id_user,
                    id_project: {
                        [Op.in]: Sequelize.literal(`(
                            SELECT user_project.id_project 
                            FROM project 
                            JOIN user_project ON user_project.id_project = project.id 
                            JOIN user ON user.id = user_project.id_user
                            WHERE user_project.id_user = ${req.headers.id_current_user} AND user_project.administrator = 1
                        )`)
                    }
                }
            });
            
    
            res.send(users);
        }else{
            const users = await UserProject.findAll({
                include: [
                    {
                        model: User,
                        required: true,
                        as: 'user', // Use o alias correto se necessário
                    },
                    {
                        model: Project,
                        required: true,
                        as: 'project', // Use o alias correto se necessário
                    }
                ],
                where: {
                    id_project: {
                        [Op.in]: Sequelize.literal(`(
                            SELECT user_project.id_project 
                            FROM project 
                            JOIN user_project ON user_project.id_project = project.id 
                            JOIN user ON user.id = user_project.id_user
                            WHERE user_project.id_user = ${req.headers.id_current_user} AND user_project.administrator = 1
                        )`)
                    }
                }
            });
            
            
            res.send(users);
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}


module.exports = {setUser, getUserAvatar, getUserById, sendSupportEmail, getUsersForReport, getUsersTableForReport};