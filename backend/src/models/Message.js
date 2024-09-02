const {Model, DataTypes} = require('sequelize');

class Message extends Model {
  static init(sequelize){
    super.init({
      id_sender: DataTypes.INTEGER,
      id_recipient: DataTypes.INTEGER,
      message: DataTypes.TEXT,
      conversation: DataTypes.STRING,
      status: DataTypes.INTEGER,
      message_read: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      tableName: 'message'
    })
  }

  static associate(models) {
    this.belongsTo(models.User, { foreignKey: 'id_sender' });
    this.belongsTo(models.User, { foreignKey: 'id_recipient' });
  }
}

module.exports = Message;