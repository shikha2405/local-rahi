const bookingRepository = require('../repositories/bookingRepository');
const rideRepository = require('../repositories/rideRepository');
const db = require('../models');

class BookingService {
  async bookRide({ ride_id, passenger_id, seats_booked, booking_note }) {
    const ride = await rideRepository.findById(ride_id);
    if (!ride) {
      throw new Error('Ride not found');
    }

    if (ride.available_seats < seats_booked) {
      throw new Error('Seats not available');
    }

    return await bookingRepository.create({
      ride_id,
      passenger_id,
      seats_booked,
      booking_note,
    });
  }

  async getDriverBookingRequests(driver_id) {
    return await bookingRepository.findAll({
      include: [
        {
          model: db.rides,
          as: 'ride',
          where: { user_id: driver_id },
          attributes: [
            'id',
            'pickup_location',
            'drop_location',
            'trip_date',
            'trip_time',
            'price_per_seat',
          ],
        },
        {
          model: db.users,
          as: 'passenger',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
        },
      ],
      order: [['id', 'DESC']],
    });
  }

  async acceptBooking(booking_id) {
    const booking = await bookingRepository.findById(booking_id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const ride = await rideRepository.findById(booking.ride_id);
    if (!ride) {
      throw new Error('Ride not found');
    }

    if (ride.available_seats < booking.seats_booked) {
      throw new Error('Seats not available');
    }

    await booking.update({ booking_status: 'accepted' });
    await ride.update({
      available_seats: ride.available_seats - booking.seats_booked,
    });

    return true;
  }

  async rejectBooking(booking_id) {
    const booking = await bookingRepository.findById(booking_id);
    if (!booking) {
      throw new Error('Booking not found');
    }

    await booking.update({ booking_status: 'rejected' });
    return true;
  }

  async getPassengerBookings(passenger_id) {
    const bookings = await bookingRepository.findAll({
      where: { passenger_id },
      include: [
        {
          model: db.users,
          as: 'passenger',
          attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
        },
        {
          model: db.rides,
          as: 'ride',
          attributes: [
            'id',
            'pickup_location',
            'drop_location',
            'trip_date',
            'trip_time',
            'available_seats',
            'price_per_seat',
            'ride_note',
            'status',
          ],
          include: [
            {
              model: db.users,
              as: 'user',
              attributes: ['id', 'first_name', 'last_name', 'phone', 'email'],
            },
          ],
        },
      ],
      order: [['id', 'DESC']],
    });

    return bookings.map((booking) => ({
      id: booking.id,
      ride_id: booking.ride_id,
      passenger_id: booking.passenger_id,
      seats_booked: booking.seats_booked,
      booking_status: booking.booking_status,
      booking_note: booking.booking_note,
      created_at: booking.created_at,
      updated_at: booking.updated_at,
      passenger: booking.passenger,
      driver: booking.ride.user,
      ride: {
        id: booking.ride.id,
        pickup_location: booking.ride.pickup_location,
        drop_location: booking.ride.drop_location,
        trip_date: booking.ride.trip_date,
        trip_time: booking.ride.trip_time,
        available_seats: booking.ride.available_seats,
        price_per_seat: booking.ride.price_per_seat,
        ride_note: booking.ride.ride_note,
        status: booking.ride.status,
      },
    }));
  }
}

module.exports = new BookingService();
