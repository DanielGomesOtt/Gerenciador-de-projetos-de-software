const express = require('express');
const route = express.Router();
const verifyToken = require('../utils/verifyToken');

route.get('/verifyToken', verifyToken.verify);

module.exports =  route;