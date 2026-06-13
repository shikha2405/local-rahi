'use strict';

module.exports = (sequelize, DataTypes) => {
  const Vehicle = sequelize.define(
    'vehicles',
    {
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      plate_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      type: {
        type: DataTypes.ENUM('four_wheeler', 'two_wheeler'),
        allowNull: false,
      },
      seats: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      tableName: 'vehicles',
      underscored: true,
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    }
  );

  Vehicle.associate = function(models) {
    Vehicle.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });
    Vehicle.hasMany(models.rides, {
      foreignKey: 'vehicle_id',
      as: 'rides',
    });
  };

  return Vehicle;
};
