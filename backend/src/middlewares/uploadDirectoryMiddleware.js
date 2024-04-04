const User = require('../models/User');
const fs = require('fs');
const path = require('path');
const multer = require('multer');

async function findOrCreateUserUploadDirectory(req, res, next){
    try {    
        const userDirectory = path.resolve(__dirname, 'uploads', `user_${req.body.id}`);
        if(!fs.existsSync(userDirectory)){
            
            fs.mkdirSync(userDirectory);
            req.body.directory = userDirectory;
            
            
            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, userDirectory);
                },
                filename: (req, file, cb) => {
                    cb(null, req.body.id + '-user');
                }
            });

            
            req.uploadMiddleware = multer({ storage: storage }).single('avatar');
        } else {
            
            const user = await User.findOne({
                attributes: ['avatar_path'],
                where: {
                    'id': req.body.id,
                }
            });
            req.body.directory = user.dataValues.avatar_path;

            const storage = multer.diskStorage({
                destination: (req, file, cb) => {
                    cb(null, req.body.directory);
                },
                filename: (req, file, cb) => {
                    cb(null, req.body.id + '-user');
                }
            });

            
            req.uploadMiddleware = multer({ storage: storage }).single('avatar');
        }
        res.status(200);
    } catch(error) {
        res.status(500).send(error);
    }
}

module.exports = { findOrCreateUserUploadDirectory };
