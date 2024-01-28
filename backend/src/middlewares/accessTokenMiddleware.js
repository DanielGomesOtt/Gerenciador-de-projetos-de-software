const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.sign = payload => jwt.sign(payload, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});

exports.verify = token => {
    try{
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        return decodedToken;
    }catch(error){
        if(error.name === 'TokenExpiredError' || error.name === 'JsonWebTokenError' || error.name === 'NotBeforeError'){
            return 401;
        }else{
            return 500;
        }
    }
};

exports.verifyToken = (req, res, next) => {
    let headers = req.headers.authorization.split(' ');
    let token = headers[1];
    let verify = verify(token);
    if(verify === 401 || verify === 500){
        return verify;
    }
    next();
}
