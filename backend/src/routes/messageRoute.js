const express = require('express');
const route = express.Router();
const MessageController = require('../controllers/MessageController');
const accessTokenMiddleware = require('../middlewares/accessTokenMiddleware');

route.get('/message', accessTokenMiddleware.verifyToken, MessageController.getConversationMessages);
route.get('/unread_messages', accessTokenMiddleware.verifyToken, MessageController.getNumberOfUnreadMessages);
route.patch('/unread_messages', MessageController.updateMessageToRead);

module.exports = route;