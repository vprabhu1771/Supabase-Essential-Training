Using a **`.env` file** is a good practice to keep your **Supabase keys** secure and manageable. Here’s how to update your **`registerUser.js`** script to use a `.env` file.

---

### ✅ **Step 1: Install dotenv**
Run the following command to install `dotenv`:
```sh
npm install dotenv
```

---

### ✅ **Step 2: Create a `.env` File**
Inside your project folder, create a `.env` file and add:
```
SUPABASE_URL=https://xxllfyzeciydpjwwyeef.supabase.co
SUPABASE_ANON_KEY=your_anon_key_here
```

🚨 **Never share your keys publicly!** If using Git, add `.env` to `.gitignore`.

---

### ✅ **Step 3: Update `registerUser.js`**
Now modify your script to use **environment variables**:

```javascript
import { createClient } from "@supabase/supabase-js";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

// Get Supabase credentials from .env
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY;

// Initialize Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function registerUser(email, password) {
  const { data, error } = await supabase.auth.signUp({
    email: email,
    password: password,
  });

  if (error) {
    console.error("User registration failed:", error.message);
  } else {
    console.log("User registered successfully:", data);
  }
}

// Replace with actual user details
registerUser("newuser@example.com", "SecurePassword123");
```

---

### ✅ **Step 4: Run the Script**
Use the following command:
```sh
node registerUser.js
```

---

### 🎯 **Why Use `.env`?**
- **Security:** Avoid exposing keys in code.
- **Flexibility:** Easily change keys without modifying code.
- **Best Practices:** Ideal for deployment & different environments (dev, production).

---

### 🚀 **Let me know if you need any modifications!**
