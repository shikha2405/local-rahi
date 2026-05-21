'use strict';

module.exports = (
  sequelize,
  DataTypes
) => {

  const RideBooking = sequelize.define(

    'ride_bookings',

    {

      ride_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      passenger_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      seats_booked: {
        type: DataTypes.INTEGER,
        defaultValue: 1,
      },

      booking_status: {
        type: DataTypes.ENUM(
          'pending',
          'accepted',
          'rejected',
          'cancelled',
          'completed'
        ),

        defaultValue: 'pending',
      },

      booking_note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },

    },

    {

      tableName: 'ride_bookings',

      underscored: true,

      timestamps: true,

      createdAt: 'created_at',

      updatedAt: 'updated_at',

    }

  );

  RideBooking.associate = function(models) {

    RideBooking.belongsTo(models.rides, {
      foreignKey: 'ride_id',
      as: 'ride',
    });

    RideBooking.belongsTo(models.users, {
      foreignKey: 'passenger_id',
      as: 'passenger',
    });

  };

  return RideBooking;

};