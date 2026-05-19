import 'package:flutter/material.dart';

class HireDriverScreen extends StatelessWidget {
  const HireDriverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,

        children: const [
          Icon(Icons.person, size: 80, color: Colors.grey),

          SizedBox(height: 20),

          Text(
            'Coming Soon',

            style: TextStyle(fontSize: 26, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }
}
