const db = require('../models');
const RideBooking = db.ride_bookings;

class BookingRepository {
  async create(data) {
    return await RideBooking.create(data);
  }

  async findById(id) {
    return await RideBooking.findByPk(id);
  }

  async findAll(options) {
    return await RideBooking.findAll(options);
  }
}

module.exports = new BookingRepository();
