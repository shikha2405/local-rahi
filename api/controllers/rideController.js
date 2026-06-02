const db = require('../models');

const Ride = db.rides;
const moment = require('moment');
const User = db.users;
const RideBooking = db.ride_bookings;
const RideRating = db.rideRatings;
const { Op, fn, col, literal } = require('sequelize');

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
    const formattedTime = moment(
      trip_time,
      'h:mm A'
    ).format('HH:mm:ss');
    const ride =
      await Ride.create({

        user_id: user.id,

        pickup_location,

        drop_location,

        trip_date,

        trip_time: formattedTime,

        total_seats: available_seats,
        available_seats: available_seats,

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

exports.findRides = async (req, res) => {

  try {

    const { pickup, drop } = req.query;

    const where = {
      status: 'active',

      trip_date: {
        [Op.gte]: new Date(),
      },
    };

    if (pickup) {

      where.pickup_location = {
        [Op.like]: `%${pickup}%`,
      };

    }

    if (drop) {

      where.drop_location = {
        [Op.like]: `%${drop}%`,
      };

    }
     console.log('Ride Associations:', Object.keys(Ride.associations));

    const rides = await Ride.findAll({

      where,

      include: [

        {
          model: User,
          as: 'user',

          attributes: [
            'id',
            'first_name',
            'last_name',
            'phone',
            'email',
          ],

          include: [

            {
              model: RideRating,
              as: 'rideRating',
              attributes: [],
            },
            {
              model: Ride,
              as: 'rides',

              attributes: [],

              where: {
                status: 'completed',
              },

              required: false,
            },
          ],
        },
      ],

      attributes: {

        include: [

          [
            fn(
              'ROUND',
              fn(
                'AVG',
                col('user.rideRating.rating')
              ),
              1
            ),
            'average_rating',
          ],

          [
            fn(
              'COUNT',
              col('user.rideRating.id')
            ),
            'total_reviews',
          ],

          [
            fn(
              'COUNT',
              col('user.rides.id')
            ),
            'total_completed_rides',
          ],
        ],
      },

      group: [
        'Ride.id',
        'user.id',
      ],

      order: [['id', 'DESC']],
    });

    res.status(200).json({

      success: true,
      data: rides,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to fetch rides',

    });

  }
};

//Ride Details Api with Bookings and Driver Info
exports.getRideDetails = async (req, res) => {

  try {

    const { ride_id } = req.params;

    const ride = await Ride.findOne({

      where: {
        id: ride_id,
      },

      include: [

        {
          model: User,
          as: 'user',

          attributes: [
            'id',
            'first_name',
            'last_name',
            'phone',
            'email',
          ],
        },

        {
          model: RideBooking,
          as: 'bookings',

          include: [

            {
              model: User,
              as: 'passenger',

              attributes: [
                'id',
                'first_name',
                'last_name',
                'phone',
                'email',
              ],
            },

          ],

        },

      ],

    });

    if (!ride) {

      return res.status(404).json({

        success: false,
        message: 'Ride not found',

      });

    }

    // TOTAL BOOKED SEATS

    let totalBookedSeats = 0;

    ride.bookings.forEach((booking) => {

      if (booking.booking_status === 'accepted') {

        totalBookedSeats += booking.seats_booked;

      }

    });

    // FORMAT BOOKINGS

    const formattedBookings = ride.bookings.map((booking) => {

      return {

        id: booking.id,

        seats_booked: booking.seats_booked,

        booking_status: booking.booking_status,

        booking_note: booking.booking_note,

        created_at: booking.created_at,

        passenger: booking.passenger,

      };

    });

    // FINAL RESPONSE

    res.status(200).json({

      success: true,

      data: {

        ride: {

          id: ride.id,

          pickup_location:
            ride.pickup_location,

          drop_location:
            ride.drop_location,

          trip_date:
            ride.trip_date,

          trip_time:
            ride.trip_time,

          available_seats:
            ride.available_seats,
          

          price_per_seat:
            ride.price_per_seat,

          ride_note:
            ride.ride_note,

          status:
            ride.status,

          created_at:
            ride.createdAt,

        },

        driver: ride.user,

        bookings: formattedBookings,

        total_booked_seats:
          totalBookedSeats,
        total_seats: ride.total_seats,

        booked_seats:
          ride.total_seats - ride.available_seats,

        remaining_seats:
          ride.available_seats,


      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to fetch ride details',

    });

  }

};

exports.startRide = async (req, res) => {

  try {

    const { ride_id } = req.params;

    const ride = await Ride.findByPk(ride_id);

    if (!ride) {

      return res.status(404).json({

        success: false,
        message: 'Ride not found',

      });

    }

    // CHECK ALREADY STARTED

    if (ride.status === 'started') {

      return res.status(400).json({

        success: false,
        message: 'Ride already started',

      });

    }

    // CHECK COMPLETED

    if (ride.status === 'completed') {

      return res.status(400).json({

        success: false,
        message: 'Ride already completed',

      });

    }

    // Create Start Ride API

    ride.status = 'started';

    await ride.save();

    res.status(200).json({

      success: true,

      message: 'Ride started successfully',

      data: {

        ride_id: ride.id,

        ride_status: ride.status,

      },

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to start ride',

    });

  }

};