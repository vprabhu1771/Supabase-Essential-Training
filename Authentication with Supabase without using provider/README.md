Here's a **Flutter Supabase Register (Sign Up) Screen** with **Email & Password Authentication**. It includes form validation and error handling.

---

## **📌 Steps to Implement**
1. **Initialize Supabase** in `main.dart`
2. **Create the Registration Screen**
3. **Handle Sign-Up with Supabase Auth**
4. **Navigate to the Home Screen after Successful Signup**

`.env`

```env
SUPA_BASE_URL=
SUPA_BASE_ANON_KEY=
```


---

### **📌 Install Dependencies**
Add `supabase_flutter` to `pubspec.yaml`:
```yaml
dependencies:
  flutter:
    sdk: flutter  
  supabase_flutter: ^2.0.0
  flutter_dotenv: ^5.2.1
  flutter_secure_storage: ^9.0.0
  fluttertoast: ^8.2.2  # For toast messages (optional)


  assets:
    - .env
```
Run:
```bash
flutter pub get
```

---

### **📌 Initialize Supabase in `main.dart`**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_supabase_authentication_demo/HomeScreen.dart';
import 'package:flutter_supabase_authentication_demo/auth/LoginScreen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import 'package:flutter_dotenv/flutter_dotenv.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await dotenv.load(fileName: ".env");

  await Supabase.initialize(
    url: dotenv.env['SUPA_BASE_URL'] ?? "",
    anonKey: dotenv.env['SUPA_BASE_ANON_KEY'] ?? "",
  );

  runApp(MyApp());
}

class MyApp extends StatelessWidget {
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      // home: LoginScreen(title: 'Login',),
      home: HomeScreen(title: 'Home',),
    );
  }
}
```

---

### **📌 Create the Register Screen (`screens/RegisterScreen.dart`)**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:flutter_supabase_authentication_demo/auth/LoginScreen.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:fluttertoast/fluttertoast.dart';

import '../HomeScreen.dart';

class RegisterScreen extends StatefulWidget {
  final String title;

  const RegisterScreen({super.key, required this.title});

  @override
  _RegisterScreenState createState() => _RegisterScreenState();
}

class _RegisterScreenState extends State<RegisterScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController emailController = TextEditingController();
  final TextEditingController passwordController = TextEditingController();

  final storage = FlutterSecureStorage(); // Secure storage instance
  final supabase = Supabase.instance.client;

  bool _isLoading = false;
  bool _obscureText = true; // To toggle password visibility

  @override
  void initState() {
    super.initState();
    emailController.text = "admin@gmail.com";
    passwordController.text = "admin@123";
  }

  Future<void> _signUp() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() => _isLoading = true);

    try {
      await supabase.auth.signUp(
        email: emailController.text,
        password: passwordController.text,
      );

      Fluttertoast.showToast(msg: "Registration Successful!");
      signIn();
    } catch (error) {
      Fluttertoast.showToast(msg: "Error: ${error.toString()}");
      print("Error: ${error.toString()}");
    }
    setState(() => _isLoading = false);
  }

  Future<void> signIn() async {
    try {
      final response = await supabase.auth.signInWithPassword(
        email: emailController.text.trim(),
        password: passwordController.text.trim(),
      );

      if (response.session != null) {
        await storage.write(key: 'session', value: response.session!.accessToken);

        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login successful!')),
        );

        Navigator.pop(context);
        Navigator.of(context).push(
          MaterialPageRoute(builder: (context) => HomeScreen(title: 'Home')),
        );
      } else {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(content: Text('Login failed. Please try again.')),
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
      appBar: AppBar(title: Text('Register')),
      body: Padding(
        padding: EdgeInsets.all(16.0),
        child: Form(
          key: _formKey,
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              TextFormField(
                controller: emailController,
                keyboardType: TextInputType.emailAddress,
                decoration: InputDecoration(labelText: 'Email'),
                validator: (value) =>
                value!.isEmpty ? 'Enter a valid email' : null,
              ),
              SizedBox(height: 10),
              TextFormField(
                controller: passwordController,
                obscureText: _obscureText,
                decoration: InputDecoration(
                  labelText: 'Password',
                  suffixIcon: IconButton(
                    icon: Icon(_obscureText ? Icons.visibility_off : Icons.visibility),
                    onPressed: () {
                      setState(() {
                        _obscureText = !_obscureText;
                      });
                    },
                  ),
                ),
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
                  Navigator.of(context).pushReplacement(
                    MaterialPageRoute(builder: (context) => LoginScreen(title: 'Login')),
                  );
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

## **2. Implement Login with Email and Password(`screens/LoginScreen.dart`)**
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

---

### **📌 Create Home Screen (`screens/HomeScreen.dart`)**
```dart
import 'package:flutter/material.dart';
import 'package:flutter_supabase_authentication_demo/widgets/CustomDrawer.dart';

class HomeScreen extends StatefulWidget {

  final String title;

  const HomeScreen({super.key, required this.title});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.title),
      ),
      drawer: CustomDrawer(parentContext: context),
      body: Center(
        child: Text(widget.title),
      ),
    );
  }
}
```

---

### **📌 `widgets/CustomDrawer.dart`**

```dart
import 'package:flutter/material.dart';

import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';

import '../HomeScreen.dart';

import '../auth/LoginScreen.dart';
import '../auth/RegisterScreen.dart';

final supabase = Supabase.instance.client;
final storage = FlutterSecureStorage();

class CustomDrawer extends StatelessWidget {
  final BuildContext parentContext;

  CustomDrawer({required this.parentContext});

  Future<void> signOut() async {
    await supabase.auth.signOut();
    await storage.delete(key: 'session');

    // Navigate to login screen and remove all previous routes
    Navigator.pushReplacement(
      parentContext,
      MaterialPageRoute(
        // builder: (context) => LoginScreen(title: 'Login'),
        builder: (context) => HomeScreen(title: 'Home'),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final user = supabase.auth.currentUser;

    return Drawer(
      child: ListView(
        padding: EdgeInsets.zero,
        children: [
          if (user != null) ...[
            UserAccountsDrawerHeader(
              accountName: Text("User Name"),
              accountEmail: Text(user.email ?? "No Email"),
              currentAccountPicture: CircleAvatar(
                child: Icon(Icons.person, size: 40),
              ),
            ),
            ListTile(
              leading: Icon(Icons.home),
              title: Text('Home'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushReplacementNamed(context, '/home');
              },
            ),
            ListTile(
              leading: Icon(Icons.settings),
              title: Text('Settings'),
              onTap: () {
                Navigator.pop(context);
                Navigator.pushNamed(context, '/settings');
              },
            ),
            Divider(),
            ListTile(
              leading: Icon(Icons.exit_to_app, color: Colors.red),
              title: Text('Logout', style: TextStyle(color: Colors.red)),
              onTap: signOut,
            ),
          ] else ...[
            UserAccountsDrawerHeader(
              accountName: Text(user != null ? "User Name" : "Guest"),
              accountEmail: Text(user?.email ?? "No Email"),
              currentAccountPicture: CircleAvatar(
                child: Icon(Icons.person, size: 40),
              ),
            ),
            ListTile(
              leading: Icon(Icons.login),
              title: Text('Login'),
              onTap: () {
                Navigator.pushReplacement(
                  parentContext,
                  MaterialPageRoute(
                    builder: (context) => LoginScreen(title: 'Login'),
                  ),
                );
              },
            ),
            ListTile(
              leading: Icon(Icons.login),
              title: Text('Register'),
              onTap: () {
                Navigator.pushReplacement(
                  parentContext,
                  MaterialPageRoute(
                    builder: (context) => RegisterScreen(title: 'Register'),
                  ),
                );
              },
            ),
          ],
        ],
      ),
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