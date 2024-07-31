const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = payload => jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});

exports.verifyToken = async (req, res, next) => {
    try{
        let headers = req.headers.authorization.split(' ');
        let token = headers[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        next();
    }catch(error){
        if(error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError'){
            res.status(401);
        }else{
            res.status(401);
        }
    }
}
