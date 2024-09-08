const Message = require('../models/Message');

module.exports = (io) => {    
    const userSocketMap = new Map();

    io.on('connection', (socket) => {
        socket.on('connected', function(userId) {
            userSocketMap.set(userId, socket.id)
        });

        socket.on('disconnect', function() {
            userSocketMap.forEach((value, key) => {
                if (value === socket.id) {
                  userSocketMap.delete(key);
                }
            });
        });

        socket.on('send_message',  async function({ senderId, recipientId, message }, callback) {
            const recipientSocketId = userSocketMap.get(recipientId);
    
            if (recipientSocketId) {

                let data = {
                    'id_sender': senderId,
                    'message': message,
                    'id_recipient': recipientId,
                    'status': 1,
                    'message_read': false,
                };

                let response = await Message.create(data);
                socket.to(recipientSocketId).emit('receive_message', {
                    senderId,
                    message,
                    id: response.dataValues.id,
                });
                if (callback) {
                    callback({
                        success: true,
                        message: 'Message sent successfully!',
                        messageId: response.dataValues.id
                    });
                }
            } else {
                
                let data = {
                    'id_sender': senderId,
                    'message': message,
                    'id_recipient': recipientId,
                    'status': 1,
                    'message_read': false,
                };

                let response = await Message.create(data);
                socket.to(recipientSocketId).emit('receive_message', {
                    senderId,
                    message,
                    id: response.dataValues.id,
                });
                if (callback) {
                    callback({
                        success: true,
                        message: 'Message sent successfully!',
                        messageId: response.dataValues.id
                    });
                }
            }
        });
    });
};