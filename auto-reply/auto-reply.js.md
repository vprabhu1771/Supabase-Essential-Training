Here's a **Node.js script** for an **auto-reply function** using Supabase Edge Functions. Since you're using **Node.js (not Deno)**, you need to ensure your project is set up properly.  

---

### **1️⃣ Install Dependencies**
First, install **Supabase SDK**:
```sh
npm install @supabase/supabase-js express dotenv
```

---

### **2️⃣ Create `.env` File**
Save this in a `.env` file to store your **Supabase credentials**:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE=your-service-role-key
```
> ⚠️ **Do not expose the service role key in public!** It has admin privileges.

---

### **3️⃣ Create `autoReply.js` Script**
```javascript
import express from "express";
import dotenv from "dotenv";
import { createClient } from "@supabase/supabase-js";

dotenv.config();

const app = express();
app.use(express.json());

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE);

// Auto-reply function
app.post("/auto-reply", async (req, res) => {
  try {
    const { message, user_id } = req.body;

    if (!message || !user_id) {
      return res.status(400).json({ error: "Message and user_id are required" });
    }

    // Custom auto-reply logic
    const reply = `Hello! You said: "${message}". How can I assist you today?`;

    // Store in Supabase (Optional)
    const { error } = await supabase
      .from("messages")
      .insert([{ user_id, message, reply }]);

    if (error) throw error;

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Auto-reply error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Auto-reply server running on port ${PORT}`));
```

---

### **4️⃣ Run the Auto-Reply Service**
```sh
node autoReply.js
```

---

### **5️⃣ Test API with Postman**
Make a **POST request** to:
```
http://localhost:3000/auto-reply
```
With **JSON Body**:
```json
{
  "user_id": "2dba03b7-1286-46ff-848a-70a1a09d85c0",
  "message": "Hello there!"
}
```

**✅ Expected Response**:
```json
{
  "success": true,
  "reply": "Hello! You said: \"Hello there!\". How can I assist you today?"
}
```

---

### **🚀 Summary**
✔️ **Uses Node.js + Express** (not Deno)  
✔️ **Stores messages in Supabase (Optional)**  
✔️ **Auto-replies to messages**  
✔️ **Secure with `.env` for API keys**  

Let me know if you need modifications! 🚀🔥
