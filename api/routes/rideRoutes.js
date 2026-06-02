const express =
require('express');
const auth = require('../middleware/auth');
const router =
express.Router();
router.use(auth);
const {
  offerRide,
  getMyRides,
  findRides,
  getRideDetails,
  startRide
} = require(
  '../controllers/rideController'
);

router.get('/find-rides', findRides);
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

module.exports = router;