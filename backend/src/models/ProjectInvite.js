const { Model, DataTypes } = require('sequelize');

class ProjectInvite extends Model {
  static init(sequelize) {
    super.init({
      id_user: DataTypes.INTEGER,
      id_project: DataTypes.INTEGER,
      accept: DataTypes.BOOLEAN,
      reject: DataTypes.BOOLEAN,
      administrator_invite: DataTypes.BOOLEAN
    }, {
      sequelize,
      tableName: 'project_invite'
    });
  }

  static associate(models) {
    this.belongsTo(models.Project, { foreignKey: 'id_project', as: 'project' });
    this.belongsTo(models.User, { foreignKey: 'id_user', as: 'user' });
  }
}

module.exports = ProjectInvite;
