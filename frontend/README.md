# Frontend Flutter Application

This is a Flutter frontend application built using Flutter SDK.

---

# Prerequisites

Before running the project, make sure the following tools are installed on your system:

* Flutter SDK
* Dart SDK
* Android Studio / VS Code
* Android Emulator or Physical Device
* Git

---

# Flutter Installation Check

Run the following command to verify Flutter installation:

```bash
flutter doctor
```

Fix any issues shown in the report before proceeding.

---

# Project Structure

```bash
frontend/
│
├── android/        # Android native files
├── ios/            # iOS native files
├── lib/            # Main Flutter application code
├── web/            # Web support
├── windows/        # Windows support
├── linux/          # Linux support
├── macos/          # macOS support
├── test/           # Test files
├── build/          # Generated build files
│
├── pubspec.yaml    # Flutter dependencies
├── pubspec.lock    # Locked dependency versions
└── README.md       # Project documentation
```

---

# Clone Project

```bash
git clone <repository-url>
```

Move into project directory:

```bash
cd frontend
```

---

# Install Dependencies

Run the following command:

```bash
flutter pub get
```

---

# Run Application

## Android

```bash
flutter run
```

## Chrome Web

```bash
flutter run -d chrome
```

## Windows Desktop

```bash
flutter run -d windows
```

---

# Build Application

## Android APK

```bash
flutter build apk
```

APK Location:

```bash
build/app/outputs/flutter-apk/app-release.apk
```

---

## Android App Bundle

```bash
flutter build appbundle
```

---

## Web Build

```bash
flutter build web
```

---

## Windows Build

```bash
flutter build windows
```

---

# Clean Project

If you face dependency or build issues:

```bash
flutter clean
flutter pub get
```

---

# Useful Flutter Commands

## Check Connected Devices

```bash
flutter devices
```

## Check Flutter Version

```bash
flutter --version
```

## Upgrade Flutter

```bash
flutter upgrade
```

---

# Environment Configuration

If the project uses API URLs or environment variables, configure them inside:

```bash
lib/config/
```

or

```bash
.env
```

---

# Recommended VS Code Extensions

* Flutter
* Dart
* Error Lens
* Awesome Flutter Snippets

---

# Troubleshooting

## Gradle Build Error

```bash
flutter clean
flutter pub get
```

Then rebuild the project.

---

## Emulator Not Detected

Check available devices:

```bash
flutter devices
```

Start emulator manually from Android Studio.

---

# Technologies Used

* Flutter
* Dart
* Material UI
* REST API Integration

---

# Author

Developed using Flutter Framework.
