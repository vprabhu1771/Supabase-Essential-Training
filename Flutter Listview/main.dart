import 'package:supabase_flutter/supabase_flutter.dart';

void main() async
{
  WidgetsFlutterBinding.ensureInitialized();
  await Supabase.initialize(
    url: 'https://sujkhstcrknxrqamzfrp.supabase.co',
    anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InN1amtoc3RjcmtueHJxYW16ZnJwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk2MDA3OTYsImV4cCI6MjA1NTE3Njc5Nn0.ebIjFOBcSmopTHjV_984QcymHiFVjYuGXiiS89WsI48',
  );
  runApp(MyApp());
}