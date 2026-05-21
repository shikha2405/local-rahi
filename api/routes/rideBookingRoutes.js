const express = require('express');

const router = express.Router();

const {
  bookRide,
} = require('../controllers/rideBookingController');

router.post('/', bookRide);

module.exports = router;