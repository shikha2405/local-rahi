import 'package:flutter/material.dart';

class FindRideScreen extends StatelessWidget {
  const FindRideScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Find Ride')),

      body: const Center(
        child: Text('Find Ride Coming Soon', style: TextStyle(fontSize: 18)),
      ),
    );
  }
}
