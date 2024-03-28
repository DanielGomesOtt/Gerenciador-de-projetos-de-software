const User = require('../models/User');
const hashPassword = require('../utils/hashPassword');

async function getUserData(req, res){
    try{
        let user = JSON.parse(req.headers.user);
        const userData = await User.findOne({
            attributes: ['name', 'email'],
            where: {
                'id': user.id
            }
        });
        if(userData){
            res.status(200).send(userData);
        }
    }catch(error){
        res.status(500).json({message: error})
    }
}

async function updateUserData (req, res) {
    try{
        if(req.body.password){
            req.body.password = hashPassword.hashPassword(req.body.password);
        }
        const update = await User.update(req.body, {
            where: {
                'id': req.body.id,
            }
        })
        if(update){
            res.status(200).send(update);
        }
    }catch(error){
        res.status(500).json({message: error});
    }
}

async function disableAccount(req, res){
    try{
        const disable = await User.update({'status': 0}, {
            where: {
                'id': req.body.id
            }
        })
        if(disable){
            res.status(200).send(disable);
        }
    }catch(error){
        res.status(500).json({message: error});
    }
}

module.exports = { getUserData, updateUserData, disableAccount };