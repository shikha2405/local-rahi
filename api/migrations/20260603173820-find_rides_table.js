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
     await queryInterface.createTable(
      'find_rides',
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
        
        status: {
          type: Sequelize.ENUM(
            'active',
            'offered',
            'matched',
            'completed',
            'cancelled',
            'expired'
          ),
          allowNull: false,
        },
        required_seats: {

          type: Sequelize.INTEGER,

          defaultValue: 1,

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

        note: {
          type: Sequelize.TEXT,
          allowNull: true,
        },
        created_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        updated_at: {
          type: Sequelize.DATE,
          allowNull: false,
          defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
        }
      }
    );
    // Composite Unique Index
    await queryInterface.addIndex('find_rides', {
      fields: ['user_id', 'trip_date', 'trip_time', 'pickup_location', 'drop_location'],
      unique: true,
      name: 'find_rides_user_trip_date_unique',
    });
  },

  async down (queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
