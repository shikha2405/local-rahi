const db = require('../models');

const Ride = db.rides;

const User = db.users;

exports.offerRide = async (
  req,
  res
) => {

  try {

    const {

      phone,

      pickup_location,

      drop_location,

      trip_date,

      trip_time,

      available_seats,

      price_per_seat,

      ride_note,

    } = req.body;

    const user =
      await User.findOne({

      where: { phone }

    });

    if (!user) {

      return res.status(404)
          .json({

        success: false,

        message:
            'User not found',

      });

    }

    const ride =
      await Ride.create({

        user_id: user.id,

        pickup_location,

        drop_location,

        trip_date,

        trip_time,

        available_seats,

        price_per_seat,

        ride_note,

      });

    return res.json({

      success: true,

      message:
          'Ride offered successfully',

      data: ride,

    });

  } catch (error) {

    return res.status(500)
        .json({

      success: false,

      message:
          'Server Error',

      error: error.message,

    });

  }

};

exports.getMyRides =
async (req, res) => {

  try {

    const { phone } =
      req.params;

    const user =
      await User.findOne({

      where: { phone }

    });

    if (!user) {

      return res.status(404)
          .json({

        success: false,

        message:
          'User not found',

      });

    }

    const rides =
      await Ride.findAll({

      where: {
        user_id: user.id,
      },

      order: [
        ['id', 'DESC']
      ],

    });

    return res.json({

      success: true,

      data: rides,

    });

  } catch (error) {

    return res.status(500)
        .json({

      success: false,

      message:
          'Server Error',

      error: error.message,

    });

  }

};