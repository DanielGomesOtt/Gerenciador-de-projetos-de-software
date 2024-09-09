const {Model, DataTypes} = require('sequelize');

class Project extends Model {
  static init(sequelize){
    super.init({
      name: DataTypes.STRING,
      description: DataTypes.STRING,
      initial_date: DataTypes.DATE,
      expected_end_date: DataTypes.DATE,
      real_end_date: DataTypes.INTEGER,
      status: DataTypes.STRING,
      priority: DataTypes.STRING,
      project_model: DataTypes.STRING,
      id_project_creator: DataTypes.INTEGER,
      project_premium: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'project'
    })
  }

  static associate(models) {
    this.hasMany(models.UserProject, { foreignKey: 'id_project', as: 'userProjects' });
    this.hasMany(models.UserProject, { foreignKey: 'id_project', as: 'task' });
    this.belongsTo(models.User, {foreignKey: 'id_project_creator', as: 'user'});
  }
}

module.exports = Project;