'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.bulkInsert('roles', [
      {
        id: 1,
        role_name: 'super_admin',
        created_at: new Date(),
      },

      {
        id: 2,
        role_name: 'admin',
        created_at: new Date(),
      },

      {
        id: 3,
        role_name: 'customer',
        created_at: new Date(),
      }
    ]);
  },

  async down (queryInterface, Sequelize) {
     await queryInterface.bulkDelete('roles', null, {});
  }
};
