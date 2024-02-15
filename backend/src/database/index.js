const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const ResetCode = require('../models/ResetCode');

const connection = new Sequelize(dbConfig);

User.init(connection);
Category.init(connection);
ResetCode.init(connection);

module.exports = connection;