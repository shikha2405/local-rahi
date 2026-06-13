const ratingService = require('../services/ratingService');

exports.giveRideRating = async (req, res) => {
  try {
    const { ride_id, from_user_id, to_user_id, rating, review, rating_type } = req.body;
    const newRating = await ratingService.giveRideRating({
      ride_id,
      from_user_id,
      to_user_id,
      rating,
      review,
      rating_type,
    });
    return res.status(201).json({
      success: true,
      message: 'Rating submitted successfully',
      data: newRating,
    });
  } catch (error) {
    const isAlreadySubmitted = error.message === 'Rating already submitted';
    return res.status(isAlreadySubmitted ? 400 : 500).json({
      success: false,
      message: error.message || 'Failed to submit rating',
    });
  }
};

exports.getUserRatings = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await ratingService.getUserRatings(user_id);
    return res.status(200).json({
      success: true,
      average_rating: result.average_rating,
      total_reviews: result.total_reviews,
      data: result.ratings,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to fetch ratings',
    });
  }
};