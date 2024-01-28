'use strict';

/** @type {import('sequelize').Sequelize} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Category', [
      {
        description: 'personal account',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        description: 'group administrator',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      {
        description: 'group member',
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Category', null, {});
  }
};

