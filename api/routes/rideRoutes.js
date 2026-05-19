const express =
require('express');

const router =
express.Router();

const {
  offerRide,
  getMyRides,
} = require(
  '../controllers/rideController'
);

router.post(
  '/offer',
  offerRide
);
router.get(
  '/my-rides/:phone',
  getMyRides
);
module.exports = router;