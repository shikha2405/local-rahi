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
  startRide,
  cancelRide,
  updateRide,
  getUserVehicles,
  addVehicle
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
  '/vehicles/:phone',
  getUserVehicles
);
router.post(
  '/vehicles',
  addVehicle
);
router.put(
  '/cancel/:ride_id',
  cancelRide
);
router.put(
  '/:ride_id',
  updateRide
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