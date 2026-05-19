import 'package:flutter/material.dart';

import '../services/api_service.dart';
import 'complete_profile_screen.dart';
import 'home/home_screen.dart';
import 'otp_screen.dart';

class MobileNumberScreen extends StatefulWidget {
  const MobileNumberScreen({super.key});

  @override
  State<MobileNumberScreen> createState() => _MobileNumberScreenState();
}

class _MobileNumberScreenState extends State<MobileNumberScreen> {
  final phoneController = TextEditingController();

  final passwordController = TextEditingController();

  bool showPasswordLogin = false;

  bool isLoading = false;

  loginWithPassword() async {
    setState(() {
      isLoading = true;
    });

    final response = await ApiService.loginWithPassword(
      phone: phoneController.text,
      password: passwordController.text,
    );

    setState(() {
      isLoading = false;
    });

    if (response['success']) {
      final user = response['user'];

      if (user['is_profile_completed']) {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(builder: (_) => const HomeScreen()),
        );
      } else {
        Navigator.pushReplacement(
          context,
          MaterialPageRoute(
            builder: (_) => CompleteProfileScreen(phone: phoneController.text),
          ),
        );
      }
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(response['message'])));
    }
  }

  sendOtp() async {
    setState(() {
      isLoading = true;
    });

    final response = await ApiService.sendOtp(phoneController.text);

    setState(() {
      isLoading = false;
    });

    if (response['success']) {
      Navigator.push(
        context,

        MaterialPageRoute(
          builder: (_) => OtpScreen(phone: phoneController.text),
        ),
      );
    } else {
      ScaffoldMessenger.of(
        context,
      ).showSnackBar(SnackBar(content: Text(response['message'])));
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.white,

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              const SizedBox(height: 60),

              const Center(
                child: Icon(Icons.directions_car, size: 80, color: Colors.blue),
              ),

              const SizedBox(height: 30),

              const Text(
                'Welcome to Local Rahi',
                style: TextStyle(fontSize: 32, fontWeight: FontWeight.bold),
              ),

              const SizedBox(height: 10),

              const Text(
                'India’s trusted local ride sharing app',
                style: TextStyle(color: Colors.grey, fontSize: 16),
              ),

              const SizedBox(height: 50),

              TextField(
                controller: phoneController,
                keyboardType: TextInputType.phone,

                decoration: InputDecoration(
                  hintText: 'Mobile Number',

                  prefixIcon: const Icon(Icons.phone),

                  prefixText: '+91 ',

                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(14),
                  ),
                ),
              ),

              const SizedBox(height: 20),

              if (showPasswordLogin)
                TextField(
                  controller: passwordController,
                  obscureText: true,

                  decoration: InputDecoration(
                    hintText: 'Password',

                    prefixIcon: const Icon(Icons.lock),

                    border: OutlineInputBorder(
                      borderRadius: BorderRadius.circular(14),
                    ),
                  ),
                ),

              const SizedBox(height: 30),

              SizedBox(
                width: double.infinity,
                height: 55,

                child: ElevatedButton(
                  onPressed: isLoading
                      ? null
                      : () {
                          if (showPasswordLogin) {
                            loginWithPassword();
                          } else {
                            sendOtp();
                          }
                        },

                  child: isLoading
                      ? const CircularProgressIndicator()
                      : Text(
                          showPasswordLogin ? 'Login' : 'Send OTP',

                          style: const TextStyle(fontSize: 18),
                        ),
                ),
              ),

              const SizedBox(height: 20),

              Center(
                child: TextButton(
                  onPressed: () {
                    setState(() {
                      showPasswordLogin = !showPasswordLogin;
                    });
                  },

                  child: Text(
                    showPasswordLogin
                        ? 'Login with OTP'
                        : 'Already registered? Login with password',
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
