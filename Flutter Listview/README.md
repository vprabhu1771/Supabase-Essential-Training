To migrate your Flutter app from Firebase to Supabase, you'll need to replace Firebase-specific packages and code with Supabase equivalents. Below is the modified version of your `TopicScreen` file for Supabase integration.

### **Updated Code for Supabase**
1. Install the Supabase Flutter package by adding it to `pubspec.yaml`:
   ```yaml
   dependencies:
     supabase_flutter: ^1.2.0
   ```

2. Replace Firebase-specific imports and logic with Supabase equivalents.

Here’s the updated `TopicScreen`:

```dart
import 'package:flutter/material.dart';
import 'package:supabase_flutter/supabase_flutter.dart';

import '../models/Topic.dart';
import '../widgets/CustomDrawer.dart';
import 'ExamScreen.dart';

class TopicScreen extends StatefulWidget {
  final String title;

  const TopicScreen({super.key, required this.title});

  @override
  State<TopicScreen> createState() => _TopicScreenState();
}

class _TopicScreenState extends State<TopicScreen> {
  final SupabaseClient _supabase = Supabase.instance.client;

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      drawer: CustomDrawer(),
      body: FutureBuilder<List<Map<String, dynamic>>>(
        future: _fetchTopics(),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (snapshot.hasError) {
            return Center(child: Text('Error: ${snapshot.error}'));
          }

          final List<Map<String, dynamic>> topics = snapshot.data ?? [];

          return ListView.builder(
            itemCount: topics.length,
            itemBuilder: (context, index) {
              final topic = Topic.fromMap(topics[index]);

              return ListTile(
                title: Text(topic.name), // Use the name from the Topic model
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => ExamScreen(topic: topic),
                    ),
                  );
                },
              );
            },
          );
        },
      ),
    );
  }

  Future<List<Map<String, dynamic>>> _fetchTopics() async {
    final response = await _supabase.from('topic').select().execute();

    if (response.error != null) {
      throw Exception(response.error?.message);
    }

    return (response.data as List<dynamic>)
        .map((e) => e as Map<String, dynamic>)
        .toList();
  }
}
```

---

### **Key Changes**
1. **Supabase Setup**:
   - Initialize Supabase in your `main.dart` file:
     ```dart
     import 'package:supabase_flutter/supabase_flutter.dart';

     Future<void> main() async {
       WidgetsFlutterBinding.ensureInitialized();
       await Supabase.initialize(
         url: 'https://your-supabase-url.supabase.co',
         anonKey: 'your-anon-key',
       );
       runApp(MyApp());
     }
     ```

2. **Fetching Data**:
   - Replace Firebase's `StreamBuilder` with Supabase's `FutureBuilder` for a simpler `select` query. 
   - Use the Supabase client to fetch data with `.from('table_name').select()`.

3. **Topic Model**:
   Update the `Topic` model to handle data from Supabase:

   ```dart
   class Topic {
     final String id;
     final String name;

     Topic({required this.id, required this.name});

     factory Topic.fromMap(Map<String, dynamic> map) {
       return Topic(
         id: map['id'] as String,
         name: map['name'] as String,
       );
     }
   }
   ```

4. **Error Handling**:
   Supabase errors are handled with `.error`. You can provide additional handling to display error messages.

5. **Database Schema**:
   Ensure your Supabase database has a `topic` table with the necessary columns (e.g., `id`, `name`, etc.).

---

### **Optional: Using Realtime Updates**
If you want real-time updates (similar to Firebase's `StreamBuilder`), you can use Supabase subscriptions:

```dart
@override
void initState() {
  super.initState();

  _supabase
      .from('topic')
      .stream(['id'])
      .execute()
      .listen((data) {
    setState(() {
      _topics = data.map((e) => Topic.fromMap(e)).toList();
    });
  });
}
```

This listens for changes in the `topic` table and updates the UI accordingly.

Let me know if you need help with specific parts of the migration!