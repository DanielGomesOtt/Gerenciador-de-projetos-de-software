'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('User_project', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      id_user: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'user', // Nome da tabela referenciada
          key: 'id'  // Nome da coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      id_project: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'project', // Nome da tabela referenciada
          key: 'id'  // Nome da coluna referenciada
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      status: {
        type: Sequelize.INTEGER,
        defaultValue: 1,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false
      },
    })
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('User_project')
  }
};
