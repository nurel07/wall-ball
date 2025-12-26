import 'dart:io';

class AppConstants {
  // Use localhost for iOS, 10.0.2.2 for Android Emulator
  static String get baseUrl {
    if (Platform.isAndroid) {
      return 'http://10.0.2.2:3000/api';
    }
    return 'http://localhost:3000/api';
  }
}
