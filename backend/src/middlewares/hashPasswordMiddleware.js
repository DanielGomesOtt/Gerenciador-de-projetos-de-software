const bcrypt = require('bcrypt');

function hashPassword(req, res, next){
    try{
        let salt = bcrypt.genSaltSync(10);
        let hash = bcrypt.hashSync(req.body.password, salt);
        req.body.password = hash;
        next();
    }catch(error){
        res.sendStatus(500);
    }
}

module.exports = {hashPassword};