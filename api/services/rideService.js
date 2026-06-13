const moment = require('moment');
const { Op, fn, col } = require('sequelize');
const db = require('../models');
const rideRepository = require('../repositories/rideRepository');
const userRepository = require('../repositories/userRepository');
const vehicleRepository = require('../repositories/vehicleRepository');

class RideService {
  async offerRide(body) {
    const {
      phone,
      pickup_location,
      drop_location,
      via_location,
      trip_date,
      trip_time,
      available_seats,
      price_per_seat,
      ride_note,
      trip_type,
      is_flexible_time,
      availability,
      vehicle,
    } = body;

    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }

    let vehicle_id = null;
    if (vehicle) {
      const { name, plate_number, type, seats } = vehicle;
      const [vehicleRecord] = await vehicleRepository.findOrCreate({
        where: { user_id: user.id, plate_number },
        defaults: { name, type, seats }
      });
      vehicle_id = vehicleRecord.id;
    }

    const formattedTime = moment(trip_time, 'HH:mm').isValid()
      ? moment(trip_time, 'HH:mm').format('HH:mm:ss')
      : moment(trip_time, 'h:mm A').format('HH:mm:ss');

    return await rideRepository.create({
      user_id: user.id,
      pickup_location,
      drop_location,
      via_location,
      trip_date,
      trip_time: formattedTime,
      total_seats: available_seats,
      available_seats: available_seats,
      price_per_seat,
      ride_note,
      trip_type,
      is_flexible_time,
      availability,
      vehicle_id,
    });
  }

  async getMyRides(phone) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }
    return await rideRepository.findMyRides(user.id);
  }

  async findRides(query, userId) {
    const where = this.rideRepository.buildSearchWhere(query);
    const { pickup, drop, date, time, seats } = query;

    await this.rideRepository.upsertFindRide({
      user_id: userId,
      pickup_location: pickup || '',
      drop_location: drop || '',
      trip_date: date ? new Date(date) : null,
      trip_time: time ? parseTimeToSql(time) : null,
      required_seats: seats ? parseInt(seats, 10) : null,
      status: 'active',
    });

    const rides = await this.rideRepository.searchActiveRides({ where });
    return { matching_pools: rides, total_matching_rides: rides.length };
  }


  async getRideDetails(rideId) {
    const rideDetails = await rideRepository.findOneWithDetails(rideId);
    if (!rideDetails) {
      throw new Error('Ride not found');
    }

    let totalBookedSeats = 0;
    rideDetails.bookings.forEach((booking) => {
      if (booking.booking_status === 'accepted') {
        totalBookedSeats += booking.seats_booked;
      }
    });

    const formattedBookings = rideDetails.bookings.map((booking) => ({
      id: booking.id,
      seats_booked: booking.seats_booked,
      booking_status: booking.booking_status,
      booking_note: booking.booking_note,
      created_at: booking.created_at,
      passenger: booking.passenger,
    }));

    return {
      ride: {
        id: rideDetails.id,
        pickup_location: rideDetails.pickup_location,
        drop_location: rideDetails.drop_location,
        via_location: rideDetails.via_location,
        trip_date: rideDetails.trip_date,
        trip_time: rideDetails.trip_time,
        available_seats: rideDetails.available_seats,
        price_per_seat: rideDetails.price_per_seat,
        ride_note: rideDetails.ride_note,
        status: rideDetails.status,
        trip_type: rideDetails.trip_type,
        is_flexible_time: rideDetails.is_flexible_time,
        availability: rideDetails.availability,
        created_at: rideDetails.createdAt,
        vehicle: rideDetails.vehicle,
      },
      driver: rideDetails.user,
      bookings: formattedBookings,
      total_booked_seats: totalBookedSeats,
      total_seats: rideDetails.total_seats,
      booked_seats: rideDetails.total_seats - rideDetails.available_seats,
      remaining_seats: rideDetails.available_seats,
    };
  }

  async startRide(rideId) {
    const ride = await rideRepository.findById(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    if (ride.status === 'started') {
      throw new Error('Ride already started');
    }

    if (ride.status === 'completed') {
      throw new Error('Ride already completed');
    }

    ride.status = 'started';
    await ride.save();
    return ride;
  }

  async cancelRide(rideId) {
    const ride = await rideRepository.findById(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    ride.status = 'cancelled';
    await ride.save();
    return true;
  }

  async updateRide(rideId, data) {
    const ride = await rideRepository.findById(rideId);
    if (!ride) {
      throw new Error('Ride not found');
    }

    const {
      pickup_location,
      drop_location,
      trip_date,
      trip_time,
      available_seats,
      price_per_seat,
      ride_note,
    } = data;

    if (pickup_location !== undefined) ride.pickup_location = pickup_location;
    if (drop_location !== undefined) ride.drop_location = drop_location;
    if (trip_date !== undefined) ride.trip_date = trip_date;
    if (trip_time !== undefined) {
      ride.trip_time = moment(trip_time, 'h:mm A').format('HH:mm:ss');
    }
    if (available_seats !== undefined) {
      ride.total_seats = available_seats;
      ride.available_seats = available_seats;
    }
    if (price_per_seat !== undefined) ride.price_per_seat = price_per_seat;
    if (ride_note !== undefined) ride.ride_note = ride_note;

    await ride.save();
    return ride;
  }

  async getUserVehicles(phone) {
    const user = await userRepository.findByPhone(phone);
    if (!user) {
      throw new Error('User not found');
    }
    return await vehicleRepository.findAll({ where: { user_id: user.id } });
  }
}

module.exports = new RideService();
