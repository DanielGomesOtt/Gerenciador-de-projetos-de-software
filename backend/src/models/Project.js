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
    },
    {
      sequelize,
      tableName: 'project'
    })
  }
}

module.exports = Project;