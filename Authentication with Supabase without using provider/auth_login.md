To implement **Supabase login in Flutter**, follow these steps:

---

## **1. Setup Supabase in Your Flutter Project**
1. **Add dependencies**  
   In your `pubspec.yaml`, add:
   ```yaml
   dependencies:
     flutter:
       sdk: flutter
     supabase_flutter: ^2.0.0
   ```
   Then, run:
   ```sh
   flutter pub get
   ```

2. **Initialize Supabase**  
   In your `main.dart`, initialize Supabase:
   ```dart
   import 'package:flutter/material.dart';
   import 'package:supabase_flutter/supabase_flutter.dart';

   void main() async {
     WidgetsFlutterBinding.ensureInitialized();
     await Supabase.initialize(
       url: 'https://your-supabase-url.supabase.co',
       anonKey: 'your-anon-key',
     );
     runApp(MyApp());
   }

   class MyApp extends StatelessWidget {
     @override
     Widget build(BuildContext context) {
       return MaterialApp(
         home: LoginPage(),
       );
     }
   }
   ```

---

