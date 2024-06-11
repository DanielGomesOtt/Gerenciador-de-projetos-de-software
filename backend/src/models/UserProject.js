const { Model, DataTypes } = require('sequelize');

class UserProject extends Model {
  static init(sequelize) {
    super.init({
      id_user: DataTypes.INTEGER,
      id_project: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    }, {
      sequelize,
      tableName: 'user_project'
    });
  }

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: 'id_project', as: 'project' });
  }
}

module.exports = UserProject;
