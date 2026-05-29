const {
  rideRatings: RideRating,
} = require('../models');


// GIVE RATING AND REVIEW TO DRIVER OR PASSENGER

exports.giveRideRating = async (req, res) => {

  try {

    const {
      ride_id,
      from_user_id,
      to_user_id,
      rating,
      review,
      rating_type,
    } = req.body;

    const alreadyRated =
      await RideRating.findOne({

        where: {
          ride_id,
          from_user_id,
          to_user_id,
        },

      });

    if (alreadyRated) {

      return res.status(400).json({

        success: false,
        message: 'Rating already submitted',

      });

    }

    const newRating =
      await RideRating.create({

        ride_id,
        from_user_id,
        to_user_id,
        rating,
        review,
        rating_type,

      });

    res.status(201).json({

      success: true,
      message: 'Rating submitted successfully',
      data: newRating,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to submit rating',

    });

  }

};


// GET USER RATINGS Api

exports.getUserRatings = async (req, res) => {

  try {

    const { user_id } = req.params;

    const ratings =
      await RideRating.findAll({

        where: {
          to_user_id: user_id,
        },

        order: [['id', 'DESC']],

      });

    let avgRating = 0;

    if (ratings.length > 0) {

      const total =
        ratings.reduce((sum, item) => {

          return sum + item.rating;

        }, 0);

      avgRating =
        total / ratings.length;

    }

    res.status(200).json({

      success: true,

      average_rating:
        avgRating.toFixed(1),

      total_reviews:
        ratings.length,

      data: ratings,

    });

  } catch (error) {

    console.log(error);

    res.status(500).json({

      success: false,
      message: 'Failed to fetch ratings',

    });

  }

};