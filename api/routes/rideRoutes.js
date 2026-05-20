const express =
require('express');

const router =
express.Router();

const {
  offerRide,
  getMyRides,
  findRides,
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

router.get('/find-rides', findRides);
module.exports = router;