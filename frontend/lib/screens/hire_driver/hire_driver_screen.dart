import 'package:flutter/material.dart';

class HireDriverScreen extends StatelessWidget {
  const HireDriverScreen({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('Hire Driver')),

      body: const Center(
        child: Text('Coming Soon', style: TextStyle(fontSize: 18)),
      ),
    );
  }
}
