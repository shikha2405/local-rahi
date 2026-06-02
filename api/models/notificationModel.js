'use strict';
const { notifications } = require(".");

module.exports = (
  sequelize,
  DataTypes
) => {

  const Notification = sequelize.define(

    'Notification',

    {

      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      message: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

      notification_type: {
        type: DataTypes.ENUM(
          'ride_booking',
          'ride_cancelled',
          'ride_completed',
          'rating_received'
        ),
        allowNull: true,
      },

      reference_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },

      is_read: {
        type: DataTypes.TINYINT(1),
        defaultValue: 0,
        allowNull: false,
      },

    },

    {

      tableName: 'notifications',

      underscored: true,
      timestamps: true,

      createdAt: 'created_at',

      updatedAt: 'updated_at',

    }

  );

  Notification.associate = function(models) {

    Notification.belongsTo(models.users, {
      foreignKey: 'user_id',
      as: 'user',
    });

    Notification.belongsTo(models.users, {
      foreignKey: 'reference_id',
      as: 'referenceUser',
    });

  };

  return Notification;

};