Designing a **WhatsApp Clone** database in **Supabase** requires structuring tables to support messaging, user authentication, group chats, media storage, and real-time updates. Here’s a well-structured **database schema** for a WhatsApp-like app using Supabase.

---

## **📌 Database Schema**
We will create the following tables:
1. **users** - Stores user information.
2. **contacts** - Manages user contacts.
3. **chats** - Stores chat metadata (1-on-1 and group chats).
4. **messages** - Stores messages exchanged between users.
5. **group_members** - Manages members of group chats.
6. **media_files** - Handles file storage for messages.

---

### **1. Users Table (`users`)**
Stores user details and authentication data.
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    full_name TEXT NOT NULL,
    phone_number TEXT UNIQUE NOT NULL,
    profile_picture TEXT,  -- URL to profile picture
    about TEXT DEFAULT 'Hey there! I am using WhatsApp',
    last_seen TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);
```
- Uses **UUID** for unique identification.
- Phone numbers are unique.
- Includes **last_seen** for status tracking.

---

### **2. Contacts Table (`contacts`)**
Stores a user's saved contacts.
```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(user_id, contact_id)
);
```
- Ensures a **user can’t save duplicate contacts**.
- References `users` table.

---

### **3. Chats Table (`chats`)**
Stores both private and group chat details.
```sql
CREATE TABLE chats (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_name TEXT,  -- Null for private chats
    is_group BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMP DEFAULT NOW()
);
```
- **Private chats**: No `chat_name`, `is_group = FALSE`
- **Group chats**: Have a `chat_name`, `is_group = TRUE`
- The `created_by` field tracks the group creator.

---

### **4. Messages Table (`messages`)**
Stores individual messages in a chat.
```sql
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message TEXT,  -- Null for media messages
    media_url TEXT,  -- Stores image, video, audio, or document URL
    message_type TEXT CHECK (message_type IN ('text', 'image', 'video', 'audio', 'document')),
    created_at TIMESTAMP DEFAULT NOW()
);
```
- Supports **text, image, video, audio, and document** messages.
- The `message_type` field defines the message format.

---

### **5. Group Members Table (`group_members`)**
Manages users in a group chat.
```sql
CREATE TABLE group_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    chat_id UUID REFERENCES chats(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    is_admin BOOLEAN DEFAULT FALSE,
    added_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(chat_id, user_id)
);
```
- Ensures **one user can’t join the same group multiple times**.
- Tracks **admins** in group chats.

---

### **6. Media Files Table (`media_files`)**
Stores file uploads separately.
```sql
CREATE TABLE media_files (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    message_id UUID REFERENCES messages(id) ON DELETE CASCADE,
    file_url TEXT NOT NULL,
    file_type TEXT CHECK (file_type IN ('image', 'video', 'audio', 'document')),
    uploaded_at TIMESTAMP DEFAULT NOW()
);
```
- Each media file is linked to a message.
- Supports **images, videos, audio, and documents**.

---

## **📌 Real-Time Features**
- Supabase supports **real-time messaging** using `RLS` (Row-Level Security) and **PostgreSQL LISTEN/NOTIFY**.
- Enable **real-time message updates** using:
  ```dart
  supabase
      .from('messages')
      .stream(primaryKey: ['id'])
      .eq('chat_id', chatId)
      .listen((messages) {
        print('New message: $messages');
      });
  ```

---

## **📌 Storage for Media**
- Use **Supabase Storage** to store images/videos.
- Upload a file:
  ```dart
  final file = await FilePicker.platform.pickFiles();
  final fileBytes = file.files.single.bytes;
  final filePath = 'chat_media/${file.files.single.name}';

  await supabase.storage.from('chat_media').uploadBinary(filePath, fileBytes);
  ```

- Get the file URL:
  ```dart
  final publicUrl = supabase.storage.from('chat_media').getPublicUrl(filePath);
  ```

---

## **📌 Authentication**
- Use **Supabase Auth** for phone number authentication.
- Example:
  ```dart
  final response = await supabase.auth.signInWithOtp(
    phone: '+1234567890',
  );
  ```

---

## **📌 Indexing & Performance Optimization**
To **improve query performance**, add indexes:
```sql
CREATE INDEX idx_messages_chat ON messages(chat_id);
CREATE INDEX idx_users_phone ON users(phone_number);
CREATE INDEX idx_chats_created ON chats(created_at);
```

---

## **📌 Example Queries**
### **Get User Chats**
```sql
SELECT c.id, c.chat_name, c.is_group, c.created_at
FROM chats c
JOIN group_members gm ON c.id = gm.chat_id
WHERE gm.user_id = 'user-uuid';
```

### **Get Messages in a Chat**
```sql
SELECT * FROM messages WHERE chat_id = 'chat-uuid' ORDER BY created_at ASC;
```

### **Get User Contacts**
```sql
SELECT u.id, u.full_name, u.phone_number
FROM contacts c
JOIN users u ON c.contact_id = u.id
WHERE c.user_id = 'user-uuid';
```

---

## **📌 Summary**
| Table         | Purpose |
|--------------|---------|
| `users`      | Stores user profiles |
| `contacts`   | Manages user contacts |
| `chats`      | Tracks chat rooms (private & groups) |
| `messages`   | Stores messages with text & media support |
| `group_members` | Manages users in a group chat |
| `media_files` | Stores media messages |

This **WhatsApp-like** database design supports **real-time messaging, media sharing, group chats, and authentication** using Supabase.

Would you like a **Flutter frontend** to go with this? 🚀