import 'package:flutter/material.dart';
import '../../services/api_service.dart'; // Imported your ApiService
import '../../theme/app_theme.dart';
import '../book_ride/book_ride_screen.dart';

class FindRideScreen extends StatefulWidget {
  const FindRideScreen({super.key});

  @override
  State<FindRideScreen> createState() => _FindRideScreenState();
}

class _FindRideScreenState extends State<FindRideScreen> {
  final pickupController = TextEditingController();
  final dropController = TextEditingController();
  int? requiredSeats;

  DateTime? selectedDate;
  TimeOfDay? selectedTime;

  List rides = [];
  bool isLoading = true;

  @override
  void initState() {
    super.initState();
    rides = [];
    isLoading = false;
  }

  @override
  void dispose() {
    pickupController.dispose();
    dropController.dispose();
    super.dispose();
  }

  Future<void> fetchRides() async {
    // Keep internal loading handling robust
    try {
      if (pickupController.text.trim().isEmpty ||
          dropController.text.trim().isEmpty ||
          selectedDate == null ||
          selectedTime == null ||
          requiredSeats == null) {
        return;
      }
      final data = await ApiService.findRides(
        pickup: pickupController.text,
        drop: dropController.text,
        //date: pickDate,
        // time: selectedTime!.format(context),
        // seats: requiredSeats!,
      );

      if (!mounted) return;

      setState(() {
        rides = data ?? [];
        isLoading = false;
      });
    } catch (e) {
      if (!mounted) return;
      setState(() {
        isLoading = false;
      });
    }
  }

  Future<void> pickDate() async {
    final picked = await showDatePicker(
      context: context,
      initialDate: selectedDate ?? DateTime.now(),
      firstDate: DateTime.now(),
      lastDate: DateTime(2030),
    );

    if (picked != null) {
      setState(() {
        selectedDate = picked;
      });
    }
  }

  Future<void> pickTime() async {
    final picked = await showTimePicker(
      context: context,
      initialTime: selectedTime ?? TimeOfDay.now(),
    );

    if (picked != null) {
      setState(() {
        selectedTime = picked;
      });
    }
  }

  Widget searchField({
    required TextEditingController controller,
    required String hint,
    required Color dotColor,
    required IconData icon,
  }) {
    return Container(
      padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 4),
      child: Row(
        children: [
          Icon(Icons.circle, color: dotColor, size: 10),
          const SizedBox(width: 14),
          Expanded(
            child: TextField(
              controller: controller,
              decoration: InputDecoration(
                hintText: hint,
                border: InputBorder.none,
                hintStyle: AppTheme.subtitle,
              ),
            ),
          ),
          Icon(icon, color: AppTheme.grey),
        ],
      ),
    );
  }

  Widget filterCard({
    required IconData icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(16),
          decoration: AppTheme.cardDecoration,
          child: Row(
            children: [
              Icon(icon, color: AppTheme.black),
              const SizedBox(width: 10),
              Expanded(
                child: Text(
                  text,
                  style: const TextStyle(fontWeight: FontWeight.w500),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Widget rideCard(Map ride) {
    // Added safe database key fallbacks (??) to prevent NoSuchMethodErrors
    // if your backend serves properties with snake_case variations.
    final user = ride['user'];

    final String name = '${user['first_name'] ?? ''} ${user['last_name'] ?? ''}'
        .trim();

    final String rating = ride['average_rating']?.toString() ?? '5.0';
    final String completedRides =
        ride['total_completed_rides']?.toString() ?? '0';
    final String pickupLoc =
        ride['pickup'] ?? ride['pickup_location'] ?? 'Unknown';
    final String dropLoc = ride['drop_location'] ?? 'Unknown';
    final String pTime = ride['trip_time'] ?? ride['trip_time'] ?? '--:--';
    final String trip_date = ride['trip_date'] ?? ride['trip_date'] ?? '--:--';
    final String price = ride['price_per_seat']?.toString() ?? '0';
    final String seats = ride['available_seats']?.toString() ?? '0';

    return Container(
      margin: const EdgeInsets.only(bottom: 18),
      padding: const EdgeInsets.all(18),
      decoration: AppTheme.cardDecoration,
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // DRIVER INFO
          Row(
            children: [
              const CircleAvatar(
                radius: 24,
                backgroundImage: NetworkImage(
                  'https://i.pravatar.cc/150?img=12',
                ),
              ),
              const SizedBox(width: 12),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(name, style: AppTheme.title),
                    const SizedBox(height: 4),
                    Text(
                      '$completedRides rides completed',
                      style: AppTheme.subtitle,
                    ),
                  ],
                ),
              ),
              Row(
                children: [
                  const Icon(Icons.star, color: Colors.orange, size: 18),
                  const SizedBox(width: 4),
                  Text(
                    rating,
                    style: const TextStyle(fontWeight: FontWeight.w600),
                  ),
                ],
              ),
            ],
          ),

          const SizedBox(height: 18),

          // PICKUP
          Row(
            children: [
              const Icon(Icons.circle, color: AppTheme.primaryGreen, size: 10),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  dropLoc,
                  style: const TextStyle(
                    fontWeight: FontWeight.w500,
                    fontSize: 16,
                  ),
                ),
              ),
              Text(trip_date, style: AppTheme.subtitle),
            ],
          ),

          Container(
            margin: const EdgeInsets.only(left: 4),
            height: 28,
            width: 1,
            color: AppTheme.border,
          ),

          // DROP
          Row(
            children: [
              const Icon(Icons.circle, color: AppTheme.red, size: 10),
              const SizedBox(width: 12),
              Expanded(
                child: Text(
                  pickupLoc,
                  style: const TextStyle(
                    fontWeight: FontWeight.w600,
                    fontSize: 16,
                  ),
                ),
              ),
              Text(pTime, style: AppTheme.subtitle),
            ],
          ),

          const SizedBox(height: 16),
          Divider(color: AppTheme.border),
          const SizedBox(height: 12),

          Row(
            children: [
              const Icon(Icons.event_seat, size: 18, color: AppTheme.grey),
              const SizedBox(width: 6),
              Text('$seats Seats Left', style: AppTheme.subtitle),
              const Spacer(),
              Text(
                '₹$price',
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.w700,
                ),
              ),
              const SizedBox(width: 12),
              SizedBox(
                height: 42,
                child: ElevatedButton(
                  style: AppTheme.primaryButton,
                  onPressed: () {
                    Navigator.push(
                      context,
                      MaterialPageRoute(
                        builder: (_) => BookRideScreen(ride: ride),
                      ),
                    );
                  },

                  child: const Text('Book Ride', style: AppTheme.buttonText),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    // Keep filter text dynamic layout friendly
    String dateText = selectedDate == null
        ? DateTime.now().toString().split(' ')[0]
        : '${selectedDate!.day}/${selectedDate!.month}/${selectedDate!.year}';

    String timeText = selectedTime == null
        ? 'Any Time'
        : selectedTime!.format(context);

    return Scaffold(
      backgroundColor: AppTheme.background,
      appBar: AppTheme.appBar('Find Ride'),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(18),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // SEARCH CARD
            Container(
              decoration: AppTheme.cardDecoration,
              child: Column(
                children: [
                  searchField(
                    controller: pickupController,
                    hint: 'Pickup Location',
                    dotColor: AppTheme.primaryGreen,
                    icon: Icons.swap_vert,
                  ),
                  Divider(height: 1, color: AppTheme.border),
                  searchField(
                    controller: dropController,
                    hint: 'Drop Location',
                    dotColor: AppTheme.red,
                    icon: Icons.location_on_outlined,
                  ),
                ],
              ),
            ),

            const SizedBox(height: 18),

            // FILTERS

            // FILTERS
            Row(
              children: [
                filterCard(
                  icon: Icons.calendar_month,
                  text: dateText,
                  onTap: pickDate,
                ),
                const SizedBox(width: 12),
                filterCard(
                  icon: Icons.access_time,
                  text: timeText,
                  onTap: pickTime,
                ),
              ],
            ),

            const SizedBox(height: 12),

            Container(
              padding: const EdgeInsets.symmetric(horizontal: 16),
              decoration: AppTheme.cardDecoration,
              child: DropdownButton<int>(
                value: requiredSeats,
                hint: const Text('Seats Required'),
                isExpanded: true,
                underline: const SizedBox(),
                items: [1, 2, 3, 4, 5]
                    .map(
                      (seat) => DropdownMenuItem(
                        value: seat,
                        child: Text('$seat Seat${seat > 1 ? 's' : ''}'),
                      ),
                    )
                    .toList(),
                onChanged: (value) {
                  setState(() {
                    requiredSeats = value;
                  });
                },
              ),
            ),

            const SizedBox(height: 16),

            SizedBox(
              width: double.infinity,
              height: 50,
              child: ElevatedButton(
                style: AppTheme.primaryButton,
                onPressed: () async {
                  if (pickupController.text.trim().isEmpty ||
                      dropController.text.trim().isEmpty ||
                      selectedDate == null ||
                      selectedTime == null ||
                      requiredSeats == null) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Please fill all fields')),
                    );
                    return;
                  }

                  setState(() {
                    isLoading = true;
                  });

                  await fetchRides();
                },
                child: const Text('Search Rides', style: AppTheme.buttonText),
              ),
            ),

            const SizedBox(height: 26),

            const Text('Available Rides', style: AppTheme.heading),

            const SizedBox(height: 18),
            // const SizedBox(height: 26),
            // const Text('Available Rides', style: AppTheme.heading),
            const SizedBox(height: 18),

            // RIDES LIST (With network protection fallback checks)
            isLoading
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(18.0),
                      child: CircularProgressIndicator(),
                    ),
                  )
                : rides.isEmpty
                ? const Center(
                    child: Padding(
                      padding: EdgeInsets.all(18.0),
                      child: Text(
                        'No available rides found.',
                        style: TextStyle(color: Colors.grey),
                      ),
                    ),
                  )
                : ListView.builder(
                    shrinkWrap: true,
                    physics: const NeverScrollableScrollPhysics(),
                    itemCount: rides.length,
                    itemBuilder: (context, index) {
                      return rideCard(rides[index]);
                    },
                  ),
          ],
        ),
      ),
    );
  }
}
