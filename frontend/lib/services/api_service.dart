import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';

  static Future<Map<String, String>> getAuthHeaders() async {
    final prefs = await SharedPreferences.getInstance();

    final token = prefs.getString('token');

    return {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer $token',
    };
  }

  static Future<Map<String, dynamic>> sendOtp(String phone) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/send-otp'),

      headers: {'Content-Type': 'application/json'},

      body: jsonEncode({'phone': phone}),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> verifyOtp({
    required String phone,
    required String otp,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/verify-otp'),

      headers: {'Content-Type': 'application/json'},

      body: jsonEncode({'phone': phone, 'otp': otp}),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> completeProfile({
    required String phone,
    required String firstName,
    required String lastName,
    required String email,
    required String password,
  }) async {
    final headers = await getAuthHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/auth/complete-profile'),

      headers: headers,

      body: jsonEncode({
        'phone': phone,
        'first_name': firstName,
        'last_name': lastName,
        'email': email,
        'password': password,
      }),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> loginWithPassword({
    required String phone,
    required String password,
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/auth/login-password'),

      headers: {'Content-Type': 'application/json'},

      body: jsonEncode({'phone': phone, 'password': password}),
    );

    return jsonDecode(response.body);
  }

  static Future<Map<String, dynamic>> offerRide({
    required String pickupLocation,

    required String dropLocation,

    required String tripDate,

    required String tripTime,

    required String availableSeats,

    required String pricePerSeat,

    required String rideNote,
  }) async {
    final prefs = await SharedPreferences.getInstance();

    final phone = prefs.getString('phone');
    final headers = await getAuthHeaders();
    final response = await http.post(
      Uri.parse('$baseUrl/rides/offer'),

      headers: headers,

      body: jsonEncode({
        'phone': phone,

        'pickup_location': pickupLocation,

        'drop_location': dropLocation,

        'trip_date': tripDate,

        'trip_time': tripTime,

        'available_seats': availableSeats,

        'price_per_seat': pricePerSeat,

        'ride_note': rideNote,
      }),
    );

    return jsonDecode(response.body);
  }

  static Future<List<dynamic>> getMyRides() async {
    final prefs = await SharedPreferences.getInstance();

    final phone = prefs.getString('phone');
    final headers = await getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/rides/my-rides/$phone'),
      headers: headers,
    );

    final data = jsonDecode(response.body);

    return data['data'];
  }

  static Future<List<dynamic>> searchPlaces(String input) async {
    final headers = await getAuthHeaders();
    final response = await http.get(
      Uri.parse('$baseUrl/places/autocomplete?input=$input'),
      headers: headers,
    );

    final data = jsonDecode(response.body);

    return data['predictions'];
  }

  static Future<List<dynamic>> findRides({
    String pickup = '',
    String drop = '',
  }) async {
    final response = await http.get(
      Uri.parse('$baseUrl/rides/find-rides?pickup=$pickup&drop=$drop'),
      headers: await getAuthHeaders(),
    );

    final data = jsonDecode(response.body);

    return data['data'];
  }

  static Future<Map<String, dynamic>> rideBooking({
    required int rideId,
    required int passengerId,
    required int seatsBooked,
    String bookingNote = '',
  }) async {
    final response = await http.post(
      Uri.parse('$baseUrl/ride-bookings'),
      headers: await getAuthHeaders(),
      body: jsonEncode({
        'ride_id': rideId,
        'passenger_id': passengerId,
        'seats_booked': seatsBooked,
        'booking_note': bookingNote,
      }),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200 || response.statusCode == 201) {
      return data;
    } else {
      throw Exception(data['message'] ?? 'Failed to book ride');
    }
  }

  static Future<List<dynamic>> getNotifications(int userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications/$userId'),
      headers: await getAuthHeaders(),
    );

    final data = jsonDecode(response.body);

    if (response.statusCode == 200 && data['success'] == true) {
      return data['data'];
    } else {
      throw Exception(data['message'] ?? 'Failed to load notifications');
    }
  }

  static Future<int> getNotificationCount(int userId) async {
    final response = await http.get(
      Uri.parse('$baseUrl/notifications/unread-count/$userId'),
      headers: await getAuthHeaders(),
    );

    final data = jsonDecode(response.body);

    return data['count'] ?? 0;
  }
}
