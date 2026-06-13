const { rideRatings: RideRating } = require('../models');

class RatingRepository {
  async findOne(options) {
    return await RideRating.findOne(options);
  }

  async create(data) {
    return await RideRating.create(data);
  }

  async findAll(options) {
    return await RideRating.findAll(options);
  }
}

module.exports = new RatingRepository();
