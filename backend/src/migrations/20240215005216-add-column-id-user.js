'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('reset_code', 'id_user', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'User',
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addConstraint('reset_code', {
      fields: ['id_user'],
      type: 'foreign key',
      name: 'FK_reset_code_id_user',
      references: {
        table: 'user',
        field: 'id'
      },
      onDelete: 'CASCADE',
      onUpdate: 'CASCADE'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeConstraint('reset_code', 'FK_reset_code_id_user');
    await queryInterface.removeColumn('reset_code', 'id_user');
  }
};
