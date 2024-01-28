const jwt = require('jsonwebtoken');
require('dotenv').config();

async function verify (req, res) {
    try{
        let token = req.headers.token;
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        return true;
    }catch(error){
        return false;
    }
};

module.exports = { verify }