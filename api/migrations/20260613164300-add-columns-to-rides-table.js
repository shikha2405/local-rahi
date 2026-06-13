'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const table = 'rides';
    
    await queryInterface.addColumn(table, 'preferences_smoking', {
      type: Sequelize.ENUM('allowed', 'not_allowed'),
      defaultValue: 'not_allowed',
      allowNull: false
    });

    await queryInterface.addColumn(table, 'preferences_music', {
      type: Sequelize.ENUM('allowed', 'not_allowed'),
      defaultValue: 'allowed',
      allowNull: false
    });

    await queryInterface.addColumn(table, 'preferences_pets', {
      type: Sequelize.ENUM('allowed', 'not_allowed'),
      defaultValue: 'not_allowed',
      allowNull: false
    });

    await queryInterface.addColumn(table, 'preferences_luggage', {
      type: Sequelize.ENUM('small', 'medium', 'large'),
      defaultValue: 'medium',
      allowNull: false
    });
  },

  async down(queryInterface, Sequelize) {
    const table = 'rides';

    await queryInterface.removeColumn(table, 'preferences_smoking');
    await queryInterface.removeColumn(table, 'preferences_music');
    await queryInterface.removeColumn(table, 'preferences_pets');
    await queryInterface.removeColumn(table, 'preferences_luggage');
  }
};
