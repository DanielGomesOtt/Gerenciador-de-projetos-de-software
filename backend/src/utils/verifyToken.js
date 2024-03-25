const jwt = require('jsonwebtoken');
require('dotenv').config();


async function verify(req, res) {
    try {
        let token = req.headers.token;
        if (!token) {
            res.send(false);
        }
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET, {expiresIn: process.env.ACCESS_TOKEN_EXPIRATION});
        res.send(true);
    } catch (error) {
        res.send(false);
    }
}




module.exports = { verify }