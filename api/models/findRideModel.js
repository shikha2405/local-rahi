'use strict';
const { find_rides } = require(".");
module.exports = (sequelize, DataTypes) => {
  const FindRide = sequelize.define('find_rides', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    required_seats: {
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
  },
    {

      tableName: 'find_rides',

      underscored: true,

      timestamps: true,

      createdAt: 'created_at',

      updatedAt: 'updated_at',

    });

  return FindRide;
};