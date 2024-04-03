const User = require('../models/User');
const fs = require('fs');
const path = require('path');

async function findOrCreateUserUploadDirectory(req, res, next){
    try{    
        if(!fs.existsSync(path.resolve(__dirname, 'uploads', `user_${req.body.id}`))){
            let directory = `uploads/user_${req.body.id}`;
            fs.mkdirSync(path.resolve(__dirname, 'uploads', `user_${req.body.id}`));
            req.body.directory =  directory;
            next();
        }else{
            const user = await User.findOne({
                attributes: ['avatar_path'],
                where: {
                    'id': req.body.id,
                }
            })
            req.body.directory = user.dataValues.avatar_path;
            next();
        }
    }catch(error){
        res.status(500).send(error);
    }
}

module.exports = { findOrCreateUserUploadDirectory }
