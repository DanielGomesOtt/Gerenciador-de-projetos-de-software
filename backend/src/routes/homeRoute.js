const express = require('express');
const route = express.Router();
const hash = require('../middlewares/hashPasswordMiddleware');
const UserController = require('../controllers/UserController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});
const upload = multer({ storage });


route.post('/', hash.hashPassword, UserController.setUser);


route.post('/send_support_email', accessTokenMiddleware.verifyToken, upload.single('image'), UserController.sendSupportEmail);

module.exports = route;
