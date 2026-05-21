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