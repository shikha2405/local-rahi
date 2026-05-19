import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'package:intl/intl.dart';

import '../../services/api_service.dart';

class OfferRideScreen extends StatefulWidget {
  const OfferRideScreen({super.key});
  @override
  State<OfferRideScreen> createState() => _OfferRideScreenState();
}

class _OfferRideScreenState extends State<OfferRideScreen> {
  final pickupController = TextEditingController();
  final dropController = TextEditingController();
  final priceController = TextEditingController();
  final noteController = TextEditingController();

  List pickupSuggestions = [];
  List dropSuggestions = [];

  bool showPickupSuggestions = false;
  bool showDropSuggestions = false;

  int seats = 1;

  bool isLoading = false;

  DateTime? selectedDate;
  TimeOfDay? selectedTime;

  // ==============================
  // CHANGE THIS API URL
  // ==============================

  final String baseUrl =
      'http://localhost:5000/api/places/autocomplete?key=AIzaSyBNZZaKMouX8HmW258j0g6UR-VoLFm4Zeo&components=country:in';

  // For Android Emulator use:
  // final String baseUrl = 'http://10.0.2.2:5000/api/places/autocomplete';

  // ==============================

  Future<void> searchPlace(String keyword, bool isPickup) async {
    if (keyword.isEmpty) return;

    try {
      final response = await http.get(Uri.parse('$baseUrl&input=$keyword'));

      final data = jsonDecode(response.body);

      if (response.statusCode == 200) {
        setState(() {
          if (isPickup) {
            pickupSuggestions = data['predictions'];
            showPickupSuggestions = true;
          } else {
            dropSuggestions = data['predictions'];
            showDropSuggestions = true;
          }
        });
      }
    } catch (e) {
      debugPrint(e.toString());
    }
  }

  Future<void> pickDate() async {
    final pickedDate = await showDatePicker(
      context: context,
      firstDate: DateTime.now(),
      lastDate: DateTime(2030),
      initialDate: DateTime.now(),
    );

    if (pickedDate != null) {
      setState(() {
        selectedDate = pickedDate;
      });
    }
  }

  Future<void> pickTime() async {
    final pickedTime = await showTimePicker(
      context: context,
      initialTime: TimeOfDay.now(),
    );

    if (pickedTime != null) {
      setState(() {
        selectedTime = pickedTime;
      });
    }
  }

  Future<void> offerRide() async {
    if (pickupController.text.isEmpty || dropController.text.isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Enter pickup and drop location')),
      );

      return;
    }

    if (selectedDate == null || selectedTime == null) {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(const SnackBar(content: Text('Select date and time')));

      return;
    }

    setState(() {
      isLoading = true;
    });

    try {
      final response = await ApiService.offerRide(
        pickupLocation: pickupController.text,
        dropLocation: dropController.text,
        tripDate: selectedDate.toString(),
        tripTime: selectedTime!.format(context),
        availableSeats: seats.toString(),
        pricePerSeat: priceController.text,
        rideNote: noteController.text,
      );

      setState(() {
        isLoading = false;
      });

      if (response['success']) {
        if (!mounted) return;

        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ride Offered Successfully')),
        );

        Navigator.pop(context, true);
      } else {
        ScaffoldMessenger.of(
          context,
        ).showSnackBar(SnackBar(content: Text(response['message'])));
      }
    } catch (e) {
      setState(() {
        isLoading = false;
      });

      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(e.toString())));
    }
  }

  Widget buildSuggestions(
    List suggestions,
    TextEditingController controller,
    bool isPickup,
  ) {
    if (suggestions.isEmpty) {
      return const SizedBox();
    }

    return Container(
      margin: const EdgeInsets.only(top: 5),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(15),
      ),
      child: ListView.builder(
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemCount: suggestions.length,
        itemBuilder: (context, index) {
          final item = suggestions[index];

          return ListTile(
            title: Text(item['description']),
            onTap: () {
              controller.text = item['description'];

              setState(() {
                if (isPickup) {
                  showPickupSuggestions = false;
                } else {
                  showDropSuggestions = false;
                }
              });
            },
          );
        },
      ),
    );
  }

  Widget customField({
    required TextEditingController controller,
    required String hint,
    required IconData icon,
    required Function(String) onChanged,
  }) {
    return TextField(
      controller: controller,
      onChanged: onChanged,
      decoration: InputDecoration(
        hintText: hint,
        prefixIcon: Icon(icon),
        filled: true,
        fillColor: Colors.white,
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(18),
          borderSide: BorderSide.none,
        ),
      ),
    );
  }

  Widget infoCard({
    required IconData icon,
    required String text,
    required VoidCallback onTap,
  }) {
    return Expanded(
      child: GestureDetector(
        onTap: onTap,
        child: Container(
          padding: const EdgeInsets.all(18),
          decoration: BoxDecoration(
            color: Colors.white,
            borderRadius: BorderRadius.circular(18),
          ),
          child: Row(
            children: [
              Icon(icon),
              const SizedBox(width: 10),
              Expanded(child: Text(text, overflow: TextOverflow.ellipsis)),
            ],
          ),
        ),
      ),
    );
  }

  Widget seatButton(IconData icon, VoidCallback onTap) {
    return InkWell(
      onTap: onTap,
      child: Container(
        height: 42,
        width: 42,
        decoration: BoxDecoration(
          color: Colors.green,
          borderRadius: BorderRadius.circular(12),
        ),
        child: Icon(icon, color: Colors.white),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.grey.shade100,

      appBar: AppBar(
        elevation: 0,
        backgroundColor: Colors.white,
        title: const Text('Offer Ride', style: TextStyle(color: Colors.black)),
      ),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [
            // PICKUP
            customField(
              controller: pickupController,
              hint: 'Pickup Location',
              icon: Icons.location_on,
              onChanged: (value) {
                searchPlace(value, true);
              },
            ),

            if (showPickupSuggestions)
              buildSuggestions(pickupSuggestions, pickupController, true),

            const SizedBox(height: 20),

            // DROP
            customField(
              controller: dropController,
              hint: 'Drop Location',
              icon: Icons.location_searching,
              onChanged: (value) {
                searchPlace(value, false);
              },
            ),

            if (showDropSuggestions)
              buildSuggestions(dropSuggestions, dropController, false),

            const SizedBox(height: 20),

            Row(
              children: [
                infoCard(
                  icon: Icons.calendar_month,
                  text: selectedDate == null
                      ? 'Select Date'
                      : DateFormat('dd MMM yyyy').format(selectedDate!),
                  onTap: pickDate,
                ),

                const SizedBox(width: 15),

                infoCard(
                  icon: Icons.access_time,
                  text: selectedTime == null
                      ? 'Select Time'
                      : selectedTime!.format(context),
                  onTap: pickTime,
                ),
              ],
            ),

            const SizedBox(height: 20),

            // SEATS
            Container(
              padding: const EdgeInsets.all(20),
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(18),
              ),
              child: Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text(
                    'Available Seats',
                    style: TextStyle(fontSize: 16, fontWeight: FontWeight.w600),
                  ),

                  Row(
                    children: [
                      seatButton(Icons.remove, () {
                        if (seats > 1) {
                          setState(() {
                            seats--;
                          });
                        }
                      }),

                      Padding(
                        padding: const EdgeInsets.symmetric(horizontal: 18),
                        child: Text(
                          seats.toString(),
                          style: const TextStyle(fontSize: 22),
                        ),
                      ),

                      seatButton(Icons.add, () {
                        if (seats < 6) {
                          setState(() {
                            seats++;
                          });
                        }
                      }),
                    ],
                  ),
                ],
              ),
            ),

            const SizedBox(height: 20),

            customField(
              controller: priceController,
              hint: 'Price Per Seat',
              icon: Icons.currency_rupee,
              onChanged: (v) {},
            ),

            const SizedBox(height: 20),

            customField(
              controller: noteController,
              hint: 'Ride Note',
              icon: Icons.note,
              onChanged: (v) {},
            ),

            const SizedBox(height: 40),

            SizedBox(
              width: double.infinity,
              height: 58,

              child: ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(18),
                  ),
                ),

                onPressed: isLoading ? null : offerRide,

                child: isLoading
                    ? const CircularProgressIndicator(color: Colors.white)
                    : const Text(
                        'Offer Ride',
                        style: TextStyle(fontSize: 18, color: Colors.white),
                      ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
