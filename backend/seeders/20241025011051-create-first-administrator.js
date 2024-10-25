'use strict';
require('dotenv').config()
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('Administrator', [
      {
        admin_register: '21502',
        name: 'root',
        email: process.env.ROOT_EMAIL,
        password: 'taskliferoot21502',
        status: 1,
        created_at: Sequelize.literal('CURRENT_TIMESTAMP'),
        updated_at: Sequelize.literal('CURRENT_TIMESTAMP')
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Administrator', { id: 1 }, {});
  }  
};
