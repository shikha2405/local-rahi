'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable(

      'rides',

      {

        id: {

          type: Sequelize.INTEGER,

          autoIncrement: true,

          primaryKey: true,

          allowNull: false,

        },

        user_id: {

          type: Sequelize.INTEGER,

          allowNull: false,

          references: {

            model: 'users',

            key: 'id',

          },

          onUpdate: 'CASCADE',

          onDelete: 'CASCADE',

        },

        pickup_location: {

          type: Sequelize.STRING,

          allowNull: false,

        },

        drop_location: {

          type: Sequelize.STRING,

          allowNull: false,

        },

        trip_date: {

          type: Sequelize.DATEONLY,

          allowNull: false,

        },

        trip_time: {

          type: Sequelize.TIME,

          allowNull: false,

        },

        total_seats: {

          type: Sequelize.INTEGER,

          defaultValue: 1,

        },

        available_seats: {

          type: Sequelize.INTEGER,

          defaultValue: 1,

        },

        price_per_seat: {

          type: Sequelize.DECIMAL(10, 2),

          defaultValue: 0,

        },

        ride_note: {

          type: Sequelize.TEXT,

          allowNull: true,

        },

        status: {

          type: Sequelize.ENUM(
            'active',
            'started',
            'completed',
            'cancelled'
          ),

          defaultValue: 'active',

        },

        created_at: {

          type: Sequelize.DATE,

          allowNull: false,

          defaultValue:
            Sequelize.literal(
              'CURRENT_TIMESTAMP'
            ),

        },

        updated_at: {

          type: Sequelize.DATE,

          allowNull: false,

          defaultValue:
            Sequelize.literal(
              'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'
            ),

        },

      }

    );
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('rides');
  }
};
