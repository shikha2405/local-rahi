const express =
require('express');

const router =
express.Router();

const {
  offerRide,
  getMyRides,
  findRides,
  getRideDetails,
  startRide
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

router.put(
  '/start/:ride_id',
  startRide
);

router.get('/find-rides', findRides);
module.exports = router;