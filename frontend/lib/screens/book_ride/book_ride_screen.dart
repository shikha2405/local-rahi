import 'package:flutter/material.dart';
import '../../theme/app_theme.dart';
import '../../services/api_service.dart';

class BookRideScreen extends StatefulWidget {
  final Map ride;

  const BookRideScreen({super.key, required this.ride});

  @override
  State<BookRideScreen> createState() => _BookRideScreenState();
}

class _BookRideScreenState extends State<BookRideScreen> {
  int selectedSeats = 1;

  bool agreed = false;
  bool isBooking = false;
  final messageController = TextEditingController();

  @override
  void dispose() {
    messageController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    final ride = widget.ride;

    final user = ride['user'];

    final String driverName =
        '${user['first_name'] ?? ''} ${user['last_name'] ?? ''}';

    final double rating =
        double.tryParse(ride['average_rating']?.toString() ?? '0') ?? 0;

    final int availableSeats =
        int.tryParse(ride['available_seats'].toString()) ?? 1;

    final double seatPrice =
        double.tryParse(ride['price_per_seat'].toString()) ?? 0;

    final String pickup = ride['pickup_location'] ?? '';

    final String drop = ride['drop_location'] ?? '';

    final String tripDate = ride['trip_date'] ?? '';

    final String tripTime = ride['trip_time'] ?? '';

    final totalAmount = selectedSeats * seatPrice;

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppTheme.appBar('Book Ride'),
      bottomNavigationBar: Container(
        padding: const EdgeInsets.all(16),
        decoration: const BoxDecoration(color: Colors.white),
        child: SafeArea(
          child: SizedBox(
            height: 52,
            child: ElevatedButton(
              style: AppTheme.primaryButton,
              onPressed: agreed
                  ? () {
                      bookRide();
                    }
                  : null,
              child: Text(
                'Confirm Booking ₹${totalAmount.toStringAsFixed(0)}',
                style: AppTheme.buttonText,
              ),
            ),
          ),
        ),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            rideInfoCard(driverName, rating),

            const SizedBox(height: 16),

            routeCard(pickup, drop, tripDate, tripTime),

            const SizedBox(height: 16),

            seatSelectionCard(availableSeats, seatPrice),

            const SizedBox(height: 16),

            notesCard(),

            const SizedBox(height: 16),

            termsCard(),
          ],
        ),
      ),
    );
  }

  Widget rideInfoCard(String driverName, double rating) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.cardDecoration,
      child: Row(
        children: [
          const CircleAvatar(
            radius: 28,
            backgroundImage: NetworkImage('https://i.pravatar.cc/150?img=12'),
          ),
          const SizedBox(width: 14),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(driverName, style: AppTheme.title),
                const SizedBox(height: 4),
                Text('Verified Driver', style: AppTheme.subtitle),
              ],
            ),
          ),
          Row(
            children: [
              const Icon(Icons.star, color: Colors.orange, size: 18),
              const SizedBox(width: 4),
              Text(
                rating.toStringAsFixed(1),
                style: const TextStyle(fontWeight: FontWeight.bold),
              ),
            ],
          ),
        ],
      ),
    );
  }

  Widget routeCard(
    String pickup,
    String drop,
    String tripDate,
    String tripTime,
  ) {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.cardDecoration,
      child: Column(
        children: [
          Row(
            children: [
              const Icon(Icons.circle, size: 10, color: AppTheme.primaryGreen),
              const SizedBox(width: 12),
              Expanded(child: Text(pickup, style: AppTheme.title)),
            ],
          ),

          Container(
            margin: const EdgeInsets.only(left: 4, top: 4, bottom: 4),
            height: 30,
            width: 1,
            color: Colors.grey,
          ),

          Row(
            children: [
              const Icon(Icons.circle, size: 10, color: Colors.red),
              const SizedBox(width: 12),
              Expanded(child: Text(drop, style: AppTheme.title)),
            ],
          ),

          const Divider(),

          Row(
            children: [
              const Icon(Icons.calendar_month),
              const SizedBox(width: 8),
              Text(tripDate),

              const Spacer(),

              const Icon(Icons.access_time),
              const SizedBox(width: 8),
              Text(tripTime),
            ],
          ),
        ],
      ),
    );
  }

  Widget seatSelectionCard(int availableSeats, double seatPrice) {
    final total = selectedSeats * seatPrice;

    return Container(
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.cardDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Select Seats', style: AppTheme.title),

          const SizedBox(height: 16),

          Row(
            children: [
              Text('Available Seats: $availableSeats'),
              const Spacer(),
              Container(
                decoration: BoxDecoration(
                  border: Border.all(color: Colors.grey),
                  borderRadius: BorderRadius.circular(12),
                ),
                child: Row(
                  children: [
                    IconButton(
                      onPressed: selectedSeats > 1
                          ? () {
                              setState(() {
                                selectedSeats--;
                              });
                            }
                          : null,
                      icon: const Icon(Icons.remove),
                    ),
                    Text(
                      '$selectedSeats',
                      style: const TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    IconButton(
                      onPressed: selectedSeats < availableSeats
                          ? () {
                              setState(() {
                                selectedSeats++;
                              });
                            }
                          : null,
                      icon: const Icon(Icons.add),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 18),

          Text('Price Per Seat : ₹${seatPrice.toStringAsFixed(0)}'),

          const SizedBox(height: 10),

          Text(
            'Total Amount : ₹${total.toStringAsFixed(0)}',
            style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget notesCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.cardDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text('Message to Driver', style: AppTheme.title),
          const SizedBox(height: 12),
          TextField(
            controller: messageController,
            maxLines: 4,
            decoration: const InputDecoration(
              hintText: 'Pickup landmark or special instructions...',
            ),
          ),
        ],
      ),
    );
  }

  Widget termsCard() {
    return Container(
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.cardDecoration,
      child: CheckboxListTile(
        value: agreed,
        contentPadding: EdgeInsets.zero,
        onChanged: (value) {
          setState(() {
            agreed = value!;
          });
        },
        title: const Text('I agree to ride rules and cancellation policy'),
      ),
    );
  }

  Future<void> bookRide() async {
    setState(() {
      isBooking = true;
    });

    try {
      final ride = widget.ride;

      final response = await ApiService.rideBooking(
        rideId: ride['id'],
        passengerId: 4, // Replace with actual user id
        seatsBooked: selectedSeats,
        bookingNote: messageController.text,
      );

      if (!mounted) return;

      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(response['message'] ?? 'Ride booked successfully'),
        ),
      );

      Navigator.pop(context, true);
    } catch (e) {
      if (!mounted) return;

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    } finally {
      if (mounted) {
        setState(() {
          isBooking = false;
        });
      }
    }
  }
}
