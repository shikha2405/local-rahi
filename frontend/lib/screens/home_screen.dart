import 'package:flutter/material.dart';

import 'find_ride/find_ride_screen.dart';

import 'offer_ride/my_offered_rides_screen.dart';

import 'hire_driver/hire_driver_screen.dart';
import 'notification/notification_screen.dart';
import '../widgets/app_drawer.dart';

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
    const NotificationScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Rahi'),

        leading: Builder(
          builder: (context) {
            return IconButton(
              icon: const Icon(Icons.menu),
              onPressed: () {
                Scaffold.of(context).openDrawer();
              },
            );
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications),
            onPressed: () {
              Navigator.push(
                context,
                MaterialPageRoute(builder: (_) => const NotificationScreen()),
              );
            },
          ),
        ],
      ),

      drawer: const AppDrawer(),
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
