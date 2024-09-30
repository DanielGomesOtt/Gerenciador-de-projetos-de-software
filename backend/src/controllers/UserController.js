const User = require('../models/User');
const jwt = require('../middlewares/accessTokenMiddleware');
const Email = require('../utils/email');

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

async function sendSupportEmail(req, res){
    try{
        Email.sendSupportEmail(req.body);
        
        res.status(200).send({ message: 'success' });
        
    }catch(error){
        res.status(500).json({ message: error });
    }
}


module.exports = {setUser, getUserAvatar, getUserById, sendSupportEmail};