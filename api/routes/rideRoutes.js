const express =
require('express');

const router =
express.Router();

const {
  offerRide,
  getMyRides,
  findRides,
  getRideDetails
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
router.get(
  '/:ride_id',
  getRideDetails
);

router.get('/find-rides', findRides);
module.exports = router;