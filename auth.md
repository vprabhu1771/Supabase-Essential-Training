Here's a **Flutter Supabase Register (Sign Up) Screen** with **Email & Password Authentication**. It includes form validation and error handling.

---

## **📌 Steps to Implement**
1. **Initialize Supabase** in `main.dart`
2. **Create the Registration Screen**
3. **Handle Sign-Up with Supabase Auth**
4. **Navigate to the Home Screen after Successful Signup**

---

### **📌 Install Dependencies**
Add `supabase_flutter` to `pubspec.yaml`:
```yaml
dependencies:
  flutter:
    sdk: flutter
  supabase_flutter: ^2.0.0
  fluttertoast: ^8.2.2  # For toast messages (optional)
```
Run:
```bash
flutter pub get
```

---

### **📌 Initialize Supabase in `main.dart`**
```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: 'https://your-project-url.supabase.co',
    anonKey: 'your-anon-key',
  );
  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      home: RegisterScreen(),
    );
  }
}
```

---

### **📌 Create the Register Screen (`register_screen.dart`)**
```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:fluttertoast/fluttertoast.dart';

class RegisterScreen extends StatefulWidget {
  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;

  final supabase = Supabase.instance.client;

  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _isLoading = true);

    try {
      await supabase.auth.signUp(
        email: _emailController.text,
        password: _passwordController.text,
      );

      Fluttertoast.showToast(msg: "Registration Successful!");
      Navigator.pushReplacementNamed(context, '/home'); // Navigate to Home
    } catch (error) {
      Fluttertoast.showToast(msg: "Error: ${error.toString()}");
    }

    setState(() => _isLoading = false);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('Register')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: _emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(labelText: 'Email'),
                validator: (value) =>
                    value!.isEmpty ? 'Enter a valid email' : null,
              ),
              SizedBox(height: 10),
              TextFormField(
                controller: _passwordController,
                obscureText: true,
                decoration: InputDecoration(labelText: 'Password'),
                validator: (value) =>
                    value!.length < 6 ? 'Password must be at least 6 characters' : null,
              ),
              SizedBox(height: 20),
              _isLoading
                  ? CircularProgressIndicator()
                  : ElevatedButton(
                      onPressed: _signUp,
                      child: Text('Register'),
                    ),
              TextButton(
                onPressed: () {
                  Navigator.pushReplacementNamed(context, '/login');
                },
                child: Text("Already have an account? Login"),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
```

---

### **📌 Create Home Screen (`home_screen.dart`)**
```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

class HomeScreen extends StatelessWidget {
  final supabase = Supabase.instance.client;

  Future<void> _signOut(BuildContext context) async {
    await supabase.auth.signOut();
    Navigator.pushReplacementNamed(context, '/register');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Home'),
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            onPressed: () => _signOut(context),
          ),
        ],
      ),
      body: Center(
        child: Text('Welcome to Supabase!'),
      ),
    );
  }
}
```

---

### **📌 Define Routes in `main.dart`**
Update `main.dart` to define routes:
```dart
class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      debugShowCheckedModeBanner: false,
      initialRoute: '/register',
      routes: {
        '/register': (context) => RegisterScreen(),
        '/home': (context) => HomeScreen(),
      },
    );
  }
}
```

---

## **📌 Features Implemented**
✅ Email & Password Registration  
✅ Form Validation  
✅ Supabase Authentication  
✅ Navigation Between Screens  
✅ Error Handling with **Toast Messages**  
✅ Logout Functionality  

This is a solid starting point for authentication in a Supabase-powered Flutter app. 🚀 Would you like to add **Google Sign-In** or **Phone Authentication**?