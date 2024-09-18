require('dotenv').config();
require('./database');
const express = require('express');
const cors = require('cors');
const homeRoute = require('../src/routes/homeRoute');
const loginRoute = require('../src/routes/loginRoute');
const tokenRoute = require('../src/routes/tokenRoute');
const passwordRecoveryRoute = require('../src/routes/passwordRecoveryRoute');
const accountRoute = require('../src/routes/accountRoute');
const projectRoute = require('../src/routes/projectRoute');
const taskRoute = require('../src/routes/taskRoute');
const messageRoute = require('../src/routes/messageRoute');
const paymentRoute = require('../src/routes/paymentRoute');
const { createServer } = require('node:http');
const { Server } = require('socket.io');
const socketHandlers = require('./websocket/socketHandlers');
const verifyPlanPayment = require('./utils/verifyPlanPayment');

const app = express();
const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: process.env.CLIENT_BASE_URL
    }
});

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static('uploads'));
app.use(homeRoute);
app.use(loginRoute);
app.use(tokenRoute);
app.use(passwordRecoveryRoute);
app.use(accountRoute);
app.use(projectRoute);
app.use(taskRoute);
app.use(messageRoute);
app.use(paymentRoute);

socketHandlers(io);

setInterval(() => {
    verifyPlanPayment.verifyPlanPayment();
}, 10000);

server.listen(process.env.APP_PORT);
