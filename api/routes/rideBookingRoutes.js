const express = require('express');

const router = express.Router();

const {

  bookRide,

  getDriverBookingRequests,

  acceptBooking,

  rejectBooking,

  getPassengerBookings,

} = require('../controllers/rideBookingController');

router.post('/', bookRide);

router.get(
  '/driver-requests/:driver_id',
  getDriverBookingRequests
);

router.put(
  '/accept/:booking_id',
  acceptBooking
);

router.put(
  '/reject/:booking_id',
  rejectBooking
);

router.get(
  '/passenger-bookings/:passenger_id',
  getPassengerBookings
);

module.exports = router;