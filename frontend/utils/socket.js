import { io } from "socket.io-client";


export const connectSocket = (socketURL) => {

    const socket = io(socketURL);

    socket.on('connect', () => {
        const userId = JSON.parse(localStorage.getItem('userStorage')).id;
        socket.emit('connected', userId);
    });
}

export const sendMessage = (socketURL, senderId, recipientId, message) => {

    const socket = io(socketURL);

    socket.emit('send_message', {
        senderId: senderId,
        recipientId: recipientId,
        message: message
    });
};
