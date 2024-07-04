const Sequelize = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const ResetCode = require('../models/ResetCode');
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');

const connection = new Sequelize(dbConfig);

User.init(connection);
Category.init(connection);
ResetCode.init(connection);
Project.init(connection);
UserProject.init(connection);


Project.hasMany(UserProject, { foreignKey: 'id_project' });
UserProject.belongsTo(Project, { foreignKey: 'id_project' });

User.hasMany(UserProject, { foreignKey: 'id_user' });
UserProject.belongsTo(User, { foreignKey: 'id_user' });

module.exports = connection;
