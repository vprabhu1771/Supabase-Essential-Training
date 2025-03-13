In Supabase (which uses PostgreSQL), you can set the **timezone** using the `SET TIMEZONE` command. However, you can only set **one timezone** at a time per session.  

### **To set the timezone to `America/New_York`:**  
```sql
ALTER DATABASE postgres SET TIMEZONE TO 'America/New_York';
```
This sets the default timezone for the database.

### **To set the timezone to `Indian Standard Time (IST +5:30)`:**  
If you want to use **Indian Standard Time (IST +5:30)** instead, use:  
```sql
ALTER DATABASE postgres SET TIMEZONE TO 'Asia/Kolkata';
```
(`Asia/Kolkata` is the correct timezone name for IST in PostgreSQL.)

### **Check the Current Timezone:**
```sql
SHOW TIMEZONE;
```

### **Session-Level Timezone Change:**  
If you want to change the timezone **only for the current session**, use:
```sql
SET TIMEZONE TO 'Asia/Kolkata';  -- Indian Timezone
SET TIMEZONE TO 'America/New_York';  -- New York Timezone
```

### **Supabase Limitations:**
- **You cannot set multiple time zones at the same time.**
- **Supabase may reset the timezone on restart.** If you need a consistent timezone, ensure all timestamps are stored in UTC and converted in your application.  
- You can use `CURRENT_TIMESTAMP AT TIME ZONE 'Asia/Kolkata'` to fetch the timestamp in a specific timezone.

Let me know if you need help configuring it in your Supabase project! 🚀
