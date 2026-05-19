import 'package:flutter/material.dart';

import 'package:shared_preferences/shared_preferences.dart';

import 'screens/home_screen.dart';

import 'screens/mobile_number_screen.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatefulWidget {
  const MyApp({super.key});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  bool isLoading = true;

  bool isLoggedIn = false;

  @override
  void initState() {
    super.initState();

    checkLogin();
  }

  checkLogin() async {
    final prefs = await SharedPreferences.getInstance();

    final token = prefs.getString('token');

    if (token != null && token.isNotEmpty) {
      isLoggedIn = true;
    }

    setState(() {
      isLoading = false;
    });
  }

  @override
  Widget build(BuildContext context) {
    if (isLoading) {
      return const MaterialApp(
        home: Scaffold(body: Center(child: CircularProgressIndicator())),
      );
    }

    return MaterialApp(
      debugShowCheckedModeBanner: false,

      home: isLoggedIn ? const HomeScreen() : const MobileNumberScreen(),
    );
  }
}
