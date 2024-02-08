const {Model, DataTypes} = require('sequelize');

class ResetCode extends Model {
  static init(sequelize){
    super.init({
      code: DataTypes.STRING,
      status: DataTypes.INTEGER
    },
    {
      sequelize,
      tableName: 'reset_code'
    })
  }
}

module.exports = ResetCode;