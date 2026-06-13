const bookingService = require('../services/bookingService');

exports.bookRide = async (req, res) => {
  try {
    const { ride_id, passenger_id, seats_booked, booking_note } = req.body;
    const booking = await bookingService.bookRide({
      ride_id,
      passenger_id,
      seats_booked,
      booking_note,
    });
    return res.status(200).json({
      success: true,
      message: 'Ride booked successfully',
      data: booking,
    });
  } catch (error) {
    const isNotFound = error.message === 'Ride not found';
    return res.status(isNotFound ? 404 : 400).json({
      success: false,
      message: error.message || 'Booking failed',
    });
  }
};

exports.getDriverBookingRequests = async (req, res) => {
  try {
    const { driver_id } = req.params;
    const bookings = await bookingService.getDriverBookingRequests(driver_id);
    return res.status(200).json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch booking requests',
    });
  }
};

exports.acceptBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    await bookingService.acceptBooking(booking_id);
    return res.status(200).json({
      success: true,
      message: 'Booking accepted',
    });
  } catch (error) {
    const isNotFound = error.message === 'Booking not found' || error.message === 'Ride not found';
    return res.status(isNotFound ? 404 : 400).json({
      success: false,
      message: error.message || 'Failed to accept booking',
    });
  }
};

exports.rejectBooking = async (req, res) => {
  try {
    const { booking_id } = req.params;
    await bookingService.rejectBooking(booking_id);
    return res.status(200).json({
      success: true,
      message: 'Booking rejected',
    });
  } catch (error) {
    const isNotFound = error.message === 'Booking not found';
    return res.status(isNotFound ? 404 : 500).json({
      success: false,
      message: error.message || 'Failed to reject booking',
    });
  }
};

exports.getPassengerBookings = async (req, res) => {
  try {
    const { passenger_id } = req.params;
    const formattedBookings = await bookingService.getPassengerBookings(passenger_id);
    return res.status(200).json({
      success: true,
      data: formattedBookings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch bookings',
    });
  }
};