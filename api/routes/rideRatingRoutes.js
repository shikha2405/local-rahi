const express =
require('express');
const auth = require('../middleware/auth');
const router =
express.Router();
router.use(auth);
const {

  giveRideRating,

  getUserRatings,

} = require(
  '../controllers/rideRatingController'
);


// CREATE RATING

router.post(
  '/',
  giveRideRating
);


// GET USER RATINGS

router.get(
  '/user/:user_id',
  getUserRatings
);


module.exports = router;