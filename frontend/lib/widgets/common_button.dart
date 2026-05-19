import 'package:flutter/material.dart';

class CommonButton extends StatelessWidget {
  final String title;

  final VoidCallback onPressed;

  final bool isLoading;

  const CommonButton({
    super.key,

    required this.title,
    required this.onPressed,

    this.isLoading = false,
  });

  @override
  Widget build(BuildContext context) {
    return SizedBox(
      width: double.infinity,
      height: 55,

      child: ElevatedButton(
        onPressed: isLoading ? null : onPressed,

        style: ElevatedButton.styleFrom(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(14),
          ),
        ),

        child: isLoading
            ? const CircularProgressIndicator(color: Colors.white)
            : Text(title, style: const TextStyle(fontSize: 18)),
      ),
    );
  }
}
