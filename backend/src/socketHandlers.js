const Message = require('./models/Message');

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

        socket.on('send_message',  async function({ senderId, recipientId, message }) {
            const recipientSocketId = userSocketMap.get(recipientId);
    
            if (recipientSocketId) {
                io.to(recipientSocketId).emit('receive_message', {
                    senderId,
                    message,
                });

                let data = {
                    'id_sender': senderId,
                    'message': message,
                    'id_recipient': recipientId,
                    'status': 1
                };

                await Message.create(data);
                console.log(message);
            } else {
                let data = {
                    'id_sender': senderId,
                    'message': message,
                    'id_recipient': recipientId,
                    'status': 1
                };

                await Message.create(data);
                console.log(message);
                console.log('Usuário destinatário não está conectado.');
            }
        });
    });
};