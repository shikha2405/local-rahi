'use strict';
const { rides } = require(".");

module.exports = (
  sequelize,
  DataTypes
) => {

  const Ride = sequelize.define(

    'Ride',

    {

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      pickup_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      drop_location: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      trip_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
      },

      trip_time: {
        type: DataTypes.TIME,
        allowNull: false,
      },

      available_seats: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      price_per_seat: {
        type: DataTypes.DECIMAL(10,2),
        defaultValue: 0,
      },

      ride_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      status: {
        type: DataTypes.ENUM(
          'active',
          'completed',
          'cancelled'
        ),

        defaultValue: 'active',
      },

    },

    {

      tableName: 'rides',

      underscored: true,

    }

  );

  Ride.associate = function(models) {

    Ride.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Ride.hasMany(models.ride_bookings, {
      foreignKey: 'ride_id',
      as: 'bookings',
    });

  };

  return Ride;

};