import 'package:flutter/material.dart';
import 'package:pinput/pinput.dart';

import 'complete_profile_screen.dart';
import '../services/api_service.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'home_screen.dart';
import '../widgets/auth_header.dart';
import '../widgets/common_button.dart';

class OtpScreen extends StatefulWidget {
  final String phone;

  const OtpScreen({super.key, required this.phone});

  @override
  State<OtpScreen> createState() => _OtpScreenState();
}

class _OtpScreenState extends State<OtpScreen> {
  final TextEditingController otpController = TextEditingController();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(),

      body: Padding(
        padding: const EdgeInsets.all(24),

        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,

          children: [
            const SizedBox(height: 30),

            // const Text(
            //   'OTP Verification',
            //   style: TextStyle(fontSize: 30, fontWeight: FontWeight.bold),
            // ),
            const AuthHeader(
              title: 'OTP Verification',

              subtitle: 'Verify your mobile number',
            ),
            const SizedBox(height: 10),

            Text(
              'Enter OTP sent to +91 ${widget.phone}',
              style: const TextStyle(color: Colors.grey),
            ),

            const SizedBox(height: 40),

            Center(child: Pinput(controller: otpController, length: 6)),

            const SizedBox(height: 40),

            SizedBox(
              width: double.infinity,
              height: 55,

              child: ElevatedButton(
                onPressed: () async {
                  final response = await ApiService.verifyOtp(
                    phone: widget.phone,
                    otp: otpController.text,
                  );

                  if (response['success']) {
                    final prefs = await SharedPreferences.getInstance();

                    await prefs.setString('token', response['token']);

                    await prefs.setString('phone', widget.phone);

                    // Navigator.push(
                    //   context,
                    //   MaterialPageRoute(
                    //     builder: (_) =>
                    //         CompleteProfileScreen(phone: widget.phone),
                    //   ),
                    // );/
                    final user = response['user'];

                    if (user['is_profile_completed'] == true) {
                      debugPrint('Profile completed, navigating to home');
                      Navigator.pushReplacement(
                        context,

                        MaterialPageRoute(builder: (_) => const HomeScreen()),
                      );
                    } else {
                      debugPrint(
                        'Profile completed, navigating to complete profile',
                      );
                      Navigator.pushReplacement(
                        context,

                        MaterialPageRoute(
                          builder: (_) =>
                              CompleteProfileScreen(phone: widget.phone),
                        ),
                      );
                    }
                  } else {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text(response['message'])),
                    );
                  }
                },

                child: const Text('Verify OTP', style: TextStyle(fontSize: 18)),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
