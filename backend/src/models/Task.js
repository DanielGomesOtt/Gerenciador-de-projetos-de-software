const {Model, DataTypes} = require('sequelize');

class Task extends Model {
  static init(sequelize){
    super.init({
      id_user: DataTypes.INTEGER,
      id_project: DataTypes.INTEGER,
      title: DataTypes.TEXT,
      expected_end_date: DataTypes.DATE,
      real_end_date: DataTypes.INTEGER,
      status: DataTypes.STRING,
      project_stage: DataTypes.STRING,
      type_task: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    {
      sequelize,
      tableName: 'task'
    })
  }

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: 'id_project', as: 'project' });
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  }
}

module.exports = Task;