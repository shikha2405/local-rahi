'use strict';

module.exports = (sequelize, DataTypes) => {

  const User = sequelize.define(
    'users',
    {
      role_id: {
        type: DataTypes.INTEGER,
        defaultValue: 3,
      },

      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,

      email: {
        type: DataTypes.STRING,
        unique: true,
      },

      phone: {
        type: DataTypes.STRING,
        unique: true,
      },

      password: DataTypes.STRING,

      otp: DataTypes.STRING,

      otp_expiry: DataTypes.DATE,

      mobile_verified: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },

      is_profile_completed: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
    },
    {
      tableName: 'users',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'modified_at',
    }
  );

  User.associate = function(models) {

    User.hasMany(models.rideRatings, {
      foreignKey: 'to_user_id',
      as: 'rideRating',
    });

    User.hasMany(models.rides, {
      foreignKey: 'user_id',
      as: 'rides',
    });

    User.hasMany(models.ride_bookings, {
      foreignKey: 'passenger_id',
      as: 'bookings',
    });

  };

  return User;
};