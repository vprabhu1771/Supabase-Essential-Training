If you're looking for an alternative to `ON DELETE CASCADE` in a foreign key constraint, here are some common options:

### 1. **`ON DELETE SET NULL`**  
Sets the foreign key column to `NULL` when the referenced row is deleted.  
```sql
product_id UUID REFERENCES products(id) ON DELETE SET NULL
```

🔎 **When to use:**  
- When you want to retain the record but indicate the referenced product no longer exists.

---

### 2. **`ON DELETE RESTRICT`** *(Default behavior if not specified)*  
Prevents deletion of the referenced row if it's still being referenced.  
```sql
product_id UUID REFERENCES products(id) ON DELETE RESTRICT
```

🔎 **When to use:**  
- When you want to avoid accidental deletions that break relationships.

---

### 3. **`ON DELETE NO ACTION`** *(Similar to `RESTRICT`)*  
No immediate action is taken; the constraint is enforced at the end of the statement.  
```sql
product_id UUID REFERENCES products(id) ON DELETE NO ACTION
```

🔎 **When to use:**  
- When you're handling deletions manually in your application logic.

---

### 4. **`ON DELETE SET DEFAULT`**  
Sets the foreign key column to its default value upon deletion.  
```sql
product_id UUID REFERENCES products(id) ON DELETE SET DEFAULT
```

🔎 **When to use:**  
- When you want a fallback product or a placeholder after deletion.

---

Let me know which option suits your case, and I can help with more details or examples! 😊
