const express =
require('express');

const router =
express.Router();

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