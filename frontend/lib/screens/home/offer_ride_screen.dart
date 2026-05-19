import 'package:flutter/material.dart';

import '../../services/api_service.dart';

import '../../widgets/common_button.dart';
import '../../widgets/common_textfield.dart';

class OfferRideScreen extends StatefulWidget {
  const OfferRideScreen({super.key});

  @override
  State<OfferRideScreen> createState() => _OfferRideScreenState();
}

class _OfferRideScreenState extends State<OfferRideScreen> {
  final pickupController = TextEditingController();

  final dropController = TextEditingController();

  final seatsController = TextEditingController(text: '1');

  final priceController = TextEditingController();

  final noteController = TextEditingController();

  DateTime? selectedDate;

  TimeOfDay? selectedTime;

  bool isLoading = false;

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

        tripDate: selectedDate!.toString(),

        tripTime: selectedTime!.format(context),

        availableSeats: seatsController.text,

        pricePerSeat: priceController.text,

        rideNote: noteController.text,
      );

      if (!mounted) return;

      setState(() {
        isLoading = false;
      });

      if (response['success']) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Ride offered successfully')),
        );

        Future.delayed(const Duration(milliseconds: 500), () {
          Navigator.of(context).pop(true);
        });
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

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Offer Ride')),

      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),

        child: Column(
          children: [
            CommonTextField(
              controller: pickupController,

              hint: 'Pickup Location',

              icon: Icons.location_on,
            ),

            const SizedBox(height: 20),

            CommonTextField(
              controller: dropController,

              hint: 'Drop Location',

              icon: Icons.location_searching,
            ),

            const SizedBox(height: 20),

            ListTile(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),

                side: const BorderSide(color: Colors.grey),
              ),

              title: Text(
                selectedDate == null
                    ? 'Select Date'
                    : selectedDate!.toString().split(' ')[0],
              ),

              trailing: const Icon(Icons.calendar_month),

              onTap: pickDate,
            ),

            const SizedBox(height: 20),

            ListTile(
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),

                side: const BorderSide(color: Colors.grey),
              ),

              title: Text(
                selectedTime == null
                    ? 'Select Time'
                    : selectedTime!.format(context),
              ),

              trailing: const Icon(Icons.access_time),

              onTap: pickTime,
            ),

            const SizedBox(height: 20),

            CommonTextField(
              controller: seatsController,

              hint: 'Available Seats',

              icon: Icons.event_seat,

              keyboardType: TextInputType.number,
            ),

            const SizedBox(height: 20),

            CommonTextField(
              controller: priceController,

              hint: 'Price Per Seat',

              icon: Icons.currency_rupee,

              keyboardType: TextInputType.number,
            ),

            const SizedBox(height: 20),

            CommonTextField(
              controller: noteController,

              hint: 'Ride Note',

              icon: Icons.note,
            ),

            const SizedBox(height: 40),

            CommonButton(
              title: 'Offer Ride',

              isLoading: isLoading,

              onPressed: offerRide,
            ),
          ],
        ),
      ),
    );
  }
}
