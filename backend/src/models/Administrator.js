const {Model, DataTypes} = require('sequelize');

class Administrator extends Model {
  static init(sequelize){
    super.init({
      admin_register: DataTypes.STRING,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      test_password: DataTypes.TEXT,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      tableName: 'administrator'
    })
  }
}

module.exports = Administrator;