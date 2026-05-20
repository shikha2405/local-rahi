import 'package:flutter/material.dart';

import '../../services/api_service.dart';

import 'offer_ride_screen.dart';
import '../../theme/app_theme.dart';

class MyOfferedRidesScreen extends StatefulWidget {
  const MyOfferedRidesScreen({super.key});

  @override
  State<MyOfferedRidesScreen> createState() => _MyOfferedRidesScreenState();
}

class _MyOfferedRidesScreenState extends State<MyOfferedRidesScreen> {
  List rides = [];

  bool isLoading = true;

  @override
  void initState() {
    super.initState();

    fetchRides();
  }

  Future<void> fetchRides() async {
    try {
      final data = await ApiService.getMyRides();

      if (!mounted) return;

      setState(() {
        rides = data;

        isLoading = false;
      });
    } catch (e) {
      setState(() {
        isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppTheme.appBar('Offer Ride'),

      body: isLoading
          ? const Center(child: CircularProgressIndicator())
          : rides.isEmpty
          ? const Center(child: Text('No rides offered yet'))
          : ListView.builder(
              itemCount: rides.length,

              padding: const EdgeInsets.all(16),

              itemBuilder: (context, index) {
                final ride = rides[index];

                return Card(
                  margin: const EdgeInsets.only(bottom: 16),

                  child: Padding(
                    padding: const EdgeInsets.all(16),

                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,

                      children: [
                        Text(
                          '${ride['pickup_location']} → ${ride['drop_location']}',

                          style: const TextStyle(
                            fontSize: 18,

                            fontWeight: FontWeight.bold,
                          ),
                        ),

                        const SizedBox(height: 10),

                        Text('Date: ${ride['trip_date']}'),

                        Text('Time: ${ride['trip_time']}'),

                        Text('Seats: ${ride['available_seats']}'),

                        Text('₹${ride['price_per_seat']} / seat'),

                        if (ride['ride_note'] != null)
                          Padding(
                            padding: const EdgeInsets.only(top: 8),

                            child: Text(ride['ride_note']),
                          ),
                      ],
                    ),
                  ),
                );
              },
            ),

      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          // Use a named route to avoid referencing an undefined widget constructor
          final result = await Navigator.push(
            context,

            MaterialPageRoute(builder: (context) => OfferRideScreen()),
          );

          if (result == true) {
            fetchRides();
          }
        },

        child: const Icon(Icons.add),
      ),
    );
  }
}
