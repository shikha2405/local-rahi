'use strict';

module.exports = (
  sequelize,
  DataTypes
) => {

  const RideRating = sequelize.define(

    'RideRating',

    {

      ride_id: {
        type: DataTypes.INTEGER,
      },

      from_user_id: {
        type: DataTypes.INTEGER,
      },

      to_user_id: {
        type: DataTypes.INTEGER,
      },

      rating: {
        type: DataTypes.INTEGER,
      },

      review: {
        type: DataTypes.TEXT,
      },

      rating_type: {
        type: DataTypes.ENUM(
          'driver',
          'passenger'
        ),
      },

    },

    {

      tableName: 'ride_ratings',

      underscored: true,

      createdAt: 'created_at',

      updatedAt: 'updated_at',

    }

  );

  return RideRating;

};