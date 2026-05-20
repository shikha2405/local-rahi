import 'package:flutter/material.dart';

class AppTheme {
  // ================= COLORS =================

  static const Color primaryGreen = Color(0xFF16A34A);

  static const Color background = Color(0xFFF5F7FA);

  static const Color white = Colors.white;

  static const Color black = Color(0xFF111827);

  static const Color grey = Color(0xFF6B7280);

  static const Color border = Color(0xFFE5E7EB);

  static const Color red = Color(0xFFEF4444);

  static const Color purple = Color(0xFF5B4BDB);

  static const Color lightGreen = Color(0xFFEFFCF3);

  // ================= TEXT STYLES =================

  static const TextStyle appBarTitle = TextStyle(
    fontSize: 22,
    fontWeight: FontWeight.w700,
    color: black,
  );

  static const TextStyle heading = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.w700,
    color: black,
  );

  static const TextStyle title = TextStyle(
    fontSize: 17,
    fontWeight: FontWeight.w600,
    color: black,
  );

  static const TextStyle subtitle = TextStyle(fontSize: 14, color: grey);

  static const TextStyle buttonText = TextStyle(
    fontSize: 16,
    fontWeight: FontWeight.w600,
    color: white,
  );

  // ================= BOX DECORATION =================

  static BoxDecoration cardDecoration = BoxDecoration(
    color: white,
    borderRadius: BorderRadius.circular(20),
    border: Border.all(color: const Color.fromARGB(255, 3, 16, 43)),
  );

  // ================= INPUT =================

  static InputDecoration inputDecoration({
    required String hint,
    required IconData icon,
  }) {
    return InputDecoration(
      hintText: hint,

      hintStyle: const TextStyle(color: grey),

      prefixIcon: Icon(icon, color: grey),

      filled: true,

      fillColor: white,

      contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 18),

      border: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: BorderSide.none,
      ),

      enabledBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: border),
      ),

      focusedBorder: OutlineInputBorder(
        borderRadius: BorderRadius.circular(18),
        borderSide: const BorderSide(color: primaryGreen, width: 1.5),
      ),
    );
  }

  // ================= BUTTON STYLE =================

  static ButtonStyle primaryButton = ElevatedButton.styleFrom(
    backgroundColor: primaryGreen,

    elevation: 0,

    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(18)),
  );

  // ================= APP BAR =================

  static AppBar appBar(String title) {
    return AppBar(
      elevation: 0,
      centerTitle: true,
      backgroundColor: white,
      surfaceTintColor: white,
      title: Text(title, style: appBarTitle),
    );
  }
}
