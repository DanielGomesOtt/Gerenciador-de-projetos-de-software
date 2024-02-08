const express = require('express');
const cors = require('cors');
require('./database');
require('dotenv').config()
const homeRoute = require('../src/routes/homeRoute');
const loginRoute = require('../src/routes/loginRoute');
const tokenRoute = require('../src/routes/tokenRoute');
const passwordRecoveryRoute = require('../src/routes/passwordRecoveryRoute');
const app = express();

app.use(cors());
app.use(express.json())
app.use(homeRoute);
app.use(loginRoute);
app.use(tokenRoute);
app.use(passwordRecoveryRoute);
app.use(express.urlencoded({ extended: true }));

app.listen(process.env.APP_PORT);