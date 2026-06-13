const db = require('../models');
const Ride = db.rides;
const User = db.users;
const RideBooking = db.ride_bookings;
const { Op, fn, col } = require('sequelize');
const moment = require('moment');

class RideRepository {
  constructor(models = db) {
    this.Ride = models.rides;
    this.User = models.users;
    this.RideRating = models.rideRatings;
    this.FindRide = models.find_rides;
  }

  async create(data) {
    return await Ride.create(data);
  }

  async findById(id) {
    return await Ride.findByPk(id);
  }

  async findOneWithDetails(ride_id) {
    return await Ride.findOne({
      where: { id: ride_id },
      include: [
        {
          model: User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
        },
        {
          model: db.vehicles,
          as: 'vehicle',
        },
        {
          model: RideBooking,
          as: 'bookings',
          include: [
            {
              model: User,
              as: 'passenger',
              attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
            },
          ],
        },
      ],
    });
  }

  async findMyRides(userId) {
    return await Ride.findAll({
      where: { user_id: userId },
      order: [['id', 'DESC']],
    });
  }

  async findAll(options) {
    return await Ride.findAll(options);
  }

  async searchActiveRides(filters) {
    const { where } = filters;
    return this.Ride.findAll({
      where,
      include: [
        {
          model: this.User,
          as: 'user',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
          include: [
            { model: this.RideRating, as: 'rideRating', attributes: [] },
            {
              model: this.Ride,
              as: 'rides',
              attributes: [],
              where: { status: 'completed' },
              required: false,
            },
          ],
        },
      ],
      attributes: {
        include: [
          [fn('ROUND', fn('AVG', col('user.rideRating.rating')), 1), 'average_rating'],
          [fn('COUNT', col('user.rideRating.id')), 'total_reviews'],
          [fn('COUNT', col('user.rides.id')), 'total_completed_rides'],
        ],
      },
      group: ['Ride.id', 'user.id'],
      order: [['id', 'DESC']],
    });
  }

  buildSearchWhere(query) {
    const { pickup, drop, date, time, seats, timeRangeFilter } = query;
    const where = {
      status: 'active',
      trip_date: { [Op.gte]: moment().format('YYYY-MM-DD') },
    };

    if (pickup) where.pickup_location = { [Op.like]: `%${pickup}%` };
    if (drop) where.drop_location = { [Op.like]: `%${drop}%` };
    if (date) where.trip_date = { [Op.eq]: moment(date).format('YYYY-MM-DD') };
    if (seats) where.available_seats = { [Op.gte]: parseInt(seats, 10) };

    if (time) {
      // const { parseTimeToSql } = require('../core/timeHelper');
      // const sqlTime = parseTimeToSql(time);
      //if (sqlTime) where.trip_time = { [Op.eq]: time };
      where.trip_time = { [Op.eq]: time };
    }

    if (timeRangeFilter && time) {
      const range = parseInt(timeRangeFilter, 10);
      const { parseTimeToSql } = require('../helper/timeHelper');
      const sqlTime = parseTimeToSql(time);
      if (sqlTime && range) {
        const base = moment(sqlTime, 'HH:mm:ss');
        where.trip_time = {
          [Op.between]: [
            base.clone().subtract(range, 'hours').format('HH:mm:ss'),
            base.clone().add(range, 'hours').format('HH:mm:ss'),
          ],
        };
      }
    }

    return where;
  }

  async upsertFindRide(payload) {
    try {
      console.log('Payload:', payload);
      return await this.FindRide.upsert(payload);
    } catch (err) {
      console.error('UPSERT ERROR:', err);
      throw err;
    }
  }

}

module.exports = new RideRepository();
