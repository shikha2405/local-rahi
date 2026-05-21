const {
  ride_bookings: RideBooking,
  rides: Ride,
  users: User,
} = require('../models');

exports.bookRide = async (req, res) => {

  try {

    const {
      ride_id,
      passenger_id,
      seats_booked,
      booking_note,
    } = req.body;

    const ride = await Ride.findByPk(ride_id);

    if (!ride) {

      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });

    }

    if (ride.available_seats < seats_booked) {

      return res.status(400).json({
        success: false,
        message: 'Seats not available',
      });

    }

    const booking = await RideBooking.create({

      ride_id,
      passenger_id,
      seats_booked,
      booking_note,

    });

    res.status(200).json({

      success: true,
      message: 'Ride booked successfully',
      data: booking,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({
      success: false,
      message: 'Booking failed',
    });

  }

};

//Get Driver Booking Requests API
exports.getDriverBookingRequests = async (req, res) => {

  try {

    const { driver_id } = req.params;

    const bookings = await RideBooking.findAll({

      include: [

        {
          model: Ride,
          as: 'ride',

          where: {
            user_id: driver_id,
          },

          attributes: [
            'id',
            'pickup_location',
            'drop_location',
            'trip_date',
            'trip_time',
            'price_per_seat',
          ],
        },

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

      order: [['id', 'DESC']],

    });

    res.status(200).json({

      success: true,
      data: bookings,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to fetch booking requests',

    });

  }

};


//Accept Booking API
exports.acceptBooking = async (req, res) => {

  try {

    const { booking_id } = req.params;

    const booking = await RideBooking.findByPk(booking_id);

    if (!booking) {

      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });

    }

    const ride = await Ride.findByPk(booking.ride_id);

    if (!ride) {

      return res.status(404).json({
        success: false,
        message: 'Ride not found',
      });

    }

    if (ride.available_seats < booking.seats_booked) {

      return res.status(400).json({
        success: false,
        message: 'Seats not available',
      });

    }

    await booking.update({
      booking_status: 'accepted',
    });

    await ride.update({
      available_seats:
        ride.available_seats - booking.seats_booked,
    });

    res.status(200).json({

      success: true,
      message: 'Booking accepted',

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to accept booking',

    });

  }

};

//Reject Booking API
exports.rejectBooking = async (req, res) => {

  try {

    const { booking_id } = req.params;

    const booking = await RideBooking.findByPk(booking_id);

    if (!booking) {

      return res.status(404).json({
        success: false,
        message: 'Booking not found',
      });

    }

    await booking.update({
      booking_status: 'rejected',
    });

    res.status(200).json({

      success: true,
      message: 'Booking rejected',

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to reject booking',

    });

  }

};

//Passenger Booking History API
exports.getPassengerBookings = async (req, res) => {

  try {

    const { passenger_id } = req.params;

    const bookings = await RideBooking.findAll({

      where: {
        passenger_id,
      },

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

        {
          model: Ride,
          as: 'ride',

          attributes: [
            'id',
            'pickup_location',
            'drop_location',
            'trip_date',
            'trip_time',
            'available_seats',
            'price_per_seat',
            'ride_note',
            'status',
          ],

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

          ],

        },

      ],

      order: [['id', 'DESC']],

    });

    // CUSTOM RESPONSE FORMAT

    const formattedBookings = bookings.map((booking) => {

      return {

        id: booking.id,

        ride_id: booking.ride_id,

        passenger_id: booking.passenger_id,

        seats_booked: booking.seats_booked,

        booking_status: booking.booking_status,

        booking_note: booking.booking_note,

        created_at: booking.created_at,

        updated_at: booking.updated_at,

        passenger: booking.passenger,

        driver: booking.ride.user,

        ride: {

          id: booking.ride.id,

          pickup_location:
            booking.ride.pickup_location,

          drop_location:
            booking.ride.drop_location,

          trip_date:
            booking.ride.trip_date,

          trip_time:
            booking.ride.trip_time,

          available_seats:
            booking.ride.available_seats,

          price_per_seat:
            booking.ride.price_per_seat,

          ride_note:
            booking.ride.ride_note,

          status:
            booking.ride.status,

        },

      };

    });

    res.status(200).json({

      success: true,

      data: formattedBookings,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,

      message: 'Failed to fetch bookings',

    });

  }

};