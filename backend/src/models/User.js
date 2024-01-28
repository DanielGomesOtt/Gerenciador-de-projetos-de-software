const {Model, DataTypes} = require('sequelize');

class User extends Model {
  static init(sequelize){
    super.init({
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      id_group: DataTypes.INTEGER,
      id_category: DataTypes.INTEGER,
      status: DataTypes.INTEGER
    },
    {
      sequelize,
      tableName: 'user'
    })
  }
}

module.exports = User;