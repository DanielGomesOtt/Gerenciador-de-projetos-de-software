'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    await queryInterface.createTable('Project', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING,
        allowNull: true
      },
      initial_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      expected_end_date: {
        type: Sequelize.DATE,
        allowNull: false
      },
      real_end_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false
      },
      priority: {
        type: Sequelize.STRING,
        allowNull: false
      },
      project_model: {
        type: Sequelize.STRING,
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
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('Project')
  }
};
