const {Model, DataTypes} = require('sequelize');

class User extends Model {
  static init(sequelize){
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      id_group: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
      avatar_path: DataTypes.STRING,
      premium_user: DataTypes.BOOLEAN,
      type_premium: DataTypes.STRING,
      end_plan_premium: DataTypes.DATE,
    },
    {
      sequelize,
      tableName: 'user'
    })
  }

  static associate(models) {
    this.hasMany(models.UserProject, { foreignKey: 'id_project', as: 'userProjects' });
    this.hasMany(models.UserProject, { foreignKey: 'id_project', as: 'task' });
  }
}

module.exports = User;