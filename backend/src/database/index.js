const { Sequelize } = require('sequelize');
const dbConfig = require('../config/database');
const User = require('../models/User');
const Category = require('../models/Category');
const ResetCode = require('../models/ResetCode');
const Project = require('../models/Project');
const UserProject = require('../models/UserProject');
const ProjectInvite = require('../models/ProjectInvite');

// Inicialize a conexão
const connection = new Sequelize(dbConfig);

// Inicialize todos os modelos
const models = [User, Category, ResetCode, Project, UserProject, ProjectInvite];
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

// Chame a função associate, se ela existir
models.forEach(model => {
  if (model.associate) {
    model.associate(connection.models);
  }
});

module.exports = connection;
