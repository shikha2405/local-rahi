import 'package:shared_preferences/shared_preferences.dart';

class SessionManager {
  static Future<void> saveUserId(int userId) async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.setInt('user_id', userId);
  }

  static Future<int?> getUserId() async {
    final prefs = await SharedPreferences.getInstance();

    return prefs.getInt('user_id');
  }

  static Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();

    await prefs.clear();
  }
}
