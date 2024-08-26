const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const ResetCode = require('../models/ResetCode');
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const ProjectInvite = require('../models/ProjectInvite');
const Task = require('../models/Task');
const Message = require('../models/Message');

// Inicialize a conexão
const connection = new Sequelize(dbConfig);

// Inicialize todos os modelos
const models = [User, Category, ResetCode, Project, UserProject, ProjectInvite, Task, Message];
models.forEach(model => model.init(connection));

// Relacionamentos

// Relacionamento entre Project e UserProject
Project.hasMany(UserProject, { foreignKey: 'id_project' });
UserProject.belongsTo(Project, { foreignKey: 'id_project' });

// Relacionamento entre User e UserProject
User.hasMany(UserProject, { foreignKey: 'id_user' });
UserProject.belongsTo(User, { foreignKey: 'id_user' });

// Relacionamento entre Project e ProjectInvite
Project.hasMany(ProjectInvite, { foreignKey: 'id_project' });
ProjectInvite.belongsTo(Project, { foreignKey: 'id_project' });

// Relacionamento entre User e ProjectInvite
User.hasMany(ProjectInvite, { foreignKey: 'id_user' });
ProjectInvite.belongsTo(User, { foreignKey: 'id_user' });

// Relacionamento entre Task ee Project
Project.hasMany(Task, { foreignKey: 'id_project' });
Task.belongsTo(Project, { foreignKey: 'id_project' });

// Relacionamento entre Task e UserProject
User.hasMany(Task, { foreignKey: 'id_user' });
Task.belongsTo(User, { foreignKey: 'id_user' });

// Relacionamento entre Message e User
User.hasMany(Message, { foreignKey: 'id_sender', as:'sentMessages' });
User.hasMany(Message, { foreignKey: 'id_recipient', as:'receivedMessages' });
Message.belongsTo(User, { foreignKey: 'id_sender', as:'sender' });
Message.belongsTo(User, { foreignKey: 'id_recipient', as:'recipient' });

// Chame a função associate, se ela existir
models.forEach(model => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

module.exports = connection;
