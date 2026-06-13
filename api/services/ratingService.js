const ratingRepository = require('../repositories/ratingRepository');

class RatingService {
  async giveRideRating({ ride_id, from_user_id, to_user_id, rating, review, rating_type }) {
    const alreadyRated = await ratingRepository.findOne({
      where: {
        ride_id,
        from_user_id,
        to_user_id,
      },
    });

    if (alreadyRated) {
      throw new Error('Rating already submitted');
    }

    return await ratingRepository.create({
      ride_id,
      from_user_id,
      to_user_id,
      rating,
      review,
      rating_type,
    });
  }

  async getUserRatings(user_id) {
    const ratings = await ratingRepository.findAll({
      where: {
        to_user_id: user_id,
      },
      order: [['id', 'DESC']],
    });

    let avgRating = 0;
    if (ratings.length > 0) {
      const total = ratings.reduce((sum, item) => sum + item.rating, 0);
      avgRating = total / ratings.length;
    }

    return {
      average_rating: avgRating.toFixed(1),
      total_reviews: ratings.length,
      ratings,
    };
  }
}

module.exports = new RatingService();
