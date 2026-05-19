import 'package:flutter/material.dart';

import 'find_ride/find_ride_screen.dart';

import 'offer_ride/my_offered_rides_screen.dart';

import 'hire_driver/hire_driver_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int currentIndex = 0;

  final List screens = [
    const FindRideScreen(),

    const MyOfferedRidesScreen(),

    const HireDriverScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: screens[currentIndex],

      bottomNavigationBar: BottomNavigationBar(
        currentIndex: currentIndex,

        onTap: (index) {
          setState(() {
            currentIndex = index;
          });
        },

        items: const [
          BottomNavigationBarItem(icon: Icon(Icons.search), label: 'Find Ride'),

          BottomNavigationBarItem(
            icon: Icon(Icons.directions_car),

            label: 'Offer Ride',
          ),

          BottomNavigationBarItem(
            icon: Icon(Icons.person),

            label: 'Hire Driver',
          ),
        ],
      ),
    );
  }
}
