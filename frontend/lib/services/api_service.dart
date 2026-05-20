import 'dart:convert';

import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart';

class ApiService {
  static const String baseUrl = 'http://localhost:5000/api';

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
    final response = await http.post(
      Uri.parse('$baseUrl/auth/complete-profile'),

      headers: {'Content-Type': 'application/json'},

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

    final response = await http.post(
      Uri.parse('$baseUrl/rides/offer'),

      headers: {'Content-Type': 'application/json'},

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

    final response = await http.get(
      Uri.parse('$baseUrl/rides/my-rides/$phone'),
    );

    final data = jsonDecode(response.body);

    return data['data'];
  }

  static Future<List<dynamic>> searchPlaces(String input) async {
    final response = await http.get(
      Uri.parse('$baseUrl/places/autocomplete?input=$input'),
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
    );

    final data = jsonDecode(response.body);

    return data['data'];
  }
}
