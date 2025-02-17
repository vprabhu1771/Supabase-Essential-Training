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

## **2. Implement Login with Email and Password**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_supabase_authentication_demo/HomeScreen.dart';
import 'package:flutter_supabase_authentication_demo/auth/RegisterScreen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

final supabase = Supabase.instance.client;

class LoginScreen extends StatefulWidget {
  final String title;

  const LoginScreen({super.key, required this.title});

  @override
  _LoginScreenState createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {

  final TextEditingController emailController = TextEditingController();

  final TextEditingController passwordController = TextEditingController();

  final storage = FlutterSecureStorage(); // Secure storage instance

  bool _isPasswordVisible = false; // Track password visibility

  @override
  void initState() {
    super.initState();
    emailController.text = "admin@gmail.com";
    passwordController.text = "admin@123";
  }

  Future<void> signIn() async {
    try {
      final response = await supabase.auth.signInWithPassword(
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );

      if (response.session != null) {
        // Save session data securely
        await storage.write(key: 'session', value: response.session!.accessToken);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login successful!')),
        );

        // Navigate to home screen
        Navigator.pop(context);
        Navigator.of(context).push(
          MaterialPageRoute(builder: (context) => HomeScreen(title: 'Home')),
        );
      }
    } catch (error) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('Login failed: $error')),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text(widget.title)),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Column(
          children: [
            TextField(
              controller: emailController,
              decoration: InputDecoration(labelText: 'Email'),
            ),
            TextField(
              controller: passwordController,
              decoration: InputDecoration(
                labelText: 'Password',
                suffixIcon: IconButton(
                  icon: Icon(
                    _isPasswordVisible ? Icons.visibility : Icons.visibility_off,
                  ),
                  onPressed: () {
                    setState(() {
                      _isPasswordVisible = !_isPasswordVisible;
                    });
                  },
                ),
              ),
              obscureText: !_isPasswordVisible,
            ),
            SizedBox(height: 20),
            ElevatedButton(
              onPressed: signIn,
              child: Text('Login'),
            ),
            SizedBox(height: 20),
            TextButton(
              onPressed: () {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(
                    builder: (context) => RegisterScreen(title: 'Register'),
                  ),
                );
              },
              child: Text("Don't have an account? Register"),
            ),
          ],
        ),
      ),
    );
  }
}
```

---

## **3. Implement Signup (Optional)**
To allow users to **sign up**:
```dart
Future<void> signUp() async {
  try {
    await supabase.auth.signUp(
      email: emailController.text,
      password: passwordController.text,
    );
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Signup successful! Check your email.')),
    );
  } catch (error) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text('Signup failed: $error')),
    );
  }
}
```

---

## **4. Implement Social Login (Google)**
To enable Google login:
1. **Enable Google Auth in Supabase**  
   - Go to **Supabase Dashboard** → **Authentication** → **Providers**  
   - Enable **Google** and configure credentials.

2. **Add Google Sign-In**
   ```dart
   Future<void> signInWithGoogle() async {
     try {
       await supabase.auth.signInWithOAuth(Provider.google);
     } catch (error) {
       print('Google sign-in failed: $error');
     }
   }
   ```
   Add a button to trigger it:
   ```dart
   ElevatedButton(
     onPressed: signInWithGoogle,
     child: Text('Sign in with Google'),
   ),
   ```

---

## **5. Handle Session and Logout**
Check if a user is logged in:
```dart
final user = supabase.auth.currentUser;
if (user != null) {
  print('User is logged in: ${user.email}');
}
```

To **log out**:
```dart
Future<void> signOut() async {
  await supabase.auth.signOut();
  print('User signed out');
}
```

---

### ✅ **That's it! Now you have Supabase authentication working in Flutter.**  
Would you like to add anything specific, like **password reset** or **phone authentication**? 🚀