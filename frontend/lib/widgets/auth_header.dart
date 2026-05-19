import 'package:flutter/material.dart';

class AuthHeader extends StatelessWidget {
  final String title;

  final String subtitle;

  const AuthHeader({super.key, required this.title, required this.subtitle});

  @override
  Widget build(BuildContext context) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,

      children: [
        const Center(
          child: Icon(Icons.directions_car, size: 80, color: Colors.blue),
        ),

        const SizedBox(height: 30),

        Text(
          title,

          style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
        ),

        const SizedBox(height: 10),

        Text(
          subtitle,

          style: const TextStyle(color: Colors.grey, fontSize: 16),
        ),
      ],
    );
  }
}
