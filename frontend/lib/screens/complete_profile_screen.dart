import 'package:flutter/material.dart';

import '../services/api_service.dart';

import '../widgets/auth_header.dart';
import '../widgets/common_button.dart';
import '../widgets/common_textfield.dart';

import 'home_screen.dart';

class CompleteProfileScreen extends StatefulWidget {
  final String phone;

  const CompleteProfileScreen({super.key, required this.phone});

  @override
  State<CompleteProfileScreen> createState() => _CompleteProfileScreenState();
}

class _CompleteProfileScreenState extends State<CompleteProfileScreen> {
  final firstNameController = TextEditingController();

  final lastNameController = TextEditingController();

  final emailController = TextEditingController();

  final passwordController = TextEditingController();

  bool isLoading = false;

  completeProfile() async {
    setState(() {
      isLoading = true;
    });

    final response = await ApiService.completeProfile(
      phone: widget.phone,

      firstName: firstNameController.text,

      lastName: lastNameController.text,

      email: emailController.text,

      password: passwordController.text,
    );

    setState(() {
      isLoading = false;
    });

    if (response['success']) {
      Navigator.pushAndRemoveUntil(
        context,

        MaterialPageRoute(builder: (_) => const HomeScreen()),

        (route) => false,
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

      appBar: AppBar(elevation: 0, backgroundColor: Colors.white),

      body: SafeArea(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),

          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,

            children: [
              const SizedBox(height: 20),

              const AuthHeader(
                title: 'Complete Profile',

                subtitle: 'Complete your account setup',
              ),

              const SizedBox(height: 40),

              CommonTextField(
                controller: firstNameController,

                hint: 'First Name',

                icon: Icons.person,
              ),

              const SizedBox(height: 20),

              CommonTextField(
                controller: lastNameController,

                hint: 'Last Name',

                icon: Icons.person_outline,
              ),

              const SizedBox(height: 20),

              CommonTextField(
                controller: emailController,

                hint: 'Email Address',

                icon: Icons.email,

                keyboardType: TextInputType.emailAddress,
              ),

              const SizedBox(height: 20),

              CommonTextField(
                controller: passwordController,

                hint: 'Create Password',

                icon: Icons.lock,

                obscureText: true,
              ),

              const SizedBox(height: 40),

              CommonButton(
                title: 'Complete Setup',

                isLoading: isLoading,

                onPressed: () {
                  if (firstNameController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Enter first name')),
                    );

                    return;
                  }

                  if (emailController.text.isEmpty) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Enter email')),
                    );

                    return;
                  }

                  if (passwordController.text.length < 6) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(
                        content: Text('Password must be at least 6 characters'),
                      ),
                    );

                    return;
                  }

                  completeProfile();
                },
              ),
            ],
          ),
        ),
      ),
    );
  }
}
