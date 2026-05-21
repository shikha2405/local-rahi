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
    await queryInterface.createTable('ride_bookings', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      ride_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'rides', // Must match the exact table name in the DB
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      passenger_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'users', // Must match the exact table name in the DB
          key: 'id'
        },
        onDelete: 'CASCADE'
      },
      seats_booked: {
        type: Sequelize.INTEGER,
        defaultValue: 1
      },
      booking_status: {
        type: Sequelize.ENUM('pending', 'accepted', 'rejected', 'cancelled', 'completed'),
        defaultValue: 'pending'
      },
      booking_note: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('ride_bookings');
  }
};
