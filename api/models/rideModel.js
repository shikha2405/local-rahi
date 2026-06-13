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

      total_seats: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
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

      via_location: {
        type: DataTypes.STRING,
        allowNull: true,
      },

      trip_type: {
        type: DataTypes.ENUM('one_way', 'round_trip'),
        defaultValue: 'one_way',
      },

      is_flexible_time: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      availability: {
        type: DataTypes.ENUM('only_this_time', 'repeat_daily', 'repeat_weekly', 'custom_schedule'),
        defaultValue: 'only_this_time',
      },

      vehicle_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      preferences_smoking: {
        type: DataTypes.ENUM('allowed', 'not_allowed'),
        defaultValue: 'not_allowed',
      },

      preferences_music: {
        type: DataTypes.ENUM('allowed', 'not_allowed'),
        defaultValue: 'allowed',
      },

      preferences_pets: {
        type: DataTypes.ENUM('allowed', 'not_allowed'),
        defaultValue: 'not_allowed',
      },

      preferences_luggage: {
        type: DataTypes.ENUM('small', 'medium', 'large'),
        defaultValue: 'medium',
      },

      status: {
        type: DataTypes.ENUM(
          'active',
          'started',
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
    Ride.hasMany(models.rideRatings, {
      foreignKey: 'ride_id',
      as: 'rideRatings',
    });
    Ride.belongsTo(models.vehicles, {
      foreignKey: 'vehicle_id',
      as: 'vehicle',
    });

  };

  return Ride;

};