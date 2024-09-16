const {Model, DataTypes} = require('sequelize');

class Payment extends Model {
  static init(sequelize){
    super.init({
      id_user: DataTypes.INTEGER,
      id_payment_mercado_pago: DataTypes.STRING,
      status: DataTypes.STRING,
      value: DataTypes.DECIMAL,
    },
    {
      sequelize,
      tableName: 'payment'
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_user' });
  }
}

module.exports = Payment;