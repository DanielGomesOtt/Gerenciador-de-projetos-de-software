import { io } from "socket.io-client";

let socket;

export const connectSocket = (socketURL) => {
    if (!socket) {
        socket = io(socketURL);

        socket.on('connect', () => {
            const userId = JSON.parse(localStorage.getItem('userStorage')).id;
            socket.emit('connected', userId);
        });
    }
    return socket;
};

export const sendMessage = (senderId, recipientId, message) => {
    if (socket) {
        socket.emit('send_message', {
            senderId: senderId,
            recipientId: recipientId,
            message: message
        });
    } else {
        console.error('Socket not connected. Please call connectSocket first.');
    }
};

export const receiveMessage = (callback) => {
    if (socket) {
        socket.on('receive_message', (data) => {
            callback(data);
        });
    } else {
        console.error('Socket not connected. Please call connectSocket first.');
    }
};

export const disconnectSocket = () => {
    if (socket) {
        socket.disconnect();
        socket = null;
    }
};
