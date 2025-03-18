The error **`0A000: cannot truncate a table referenced in a foreign key constraint`** occurs because `categories` is referenced by `sub_categories` through a foreign key constraint.  

To fix this issue, you have **two options**:

---

## **Option 1: Truncate with CASCADE (Recommended)**
If you want to delete all records in both `categories` and `sub_categories`, you can use:
```sql
TRUNCATE TABLE categories CASCADE;
```
This will **automatically remove all dependent records** in `sub_categories`.

---

## **Option 2: Truncate in the Correct Order**
1. First, truncate `sub_categories` (child table).
2. Then, truncate `categories` (parent table).

```sql
TRUNCATE TABLE sub_categories;
TRUNCATE TABLE categories;
```

---

## **Alternative: Delete Instead of Truncate**
If you only want to delete rows but keep the structure intact:
```sql
DELETE FROM sub_categories;
DELETE FROM categories;
```
Or if you want to reset the auto-increment:
```sql
DELETE FROM sub_categories;
ALTER SEQUENCE sub_categories_id_seq RESTART WITH 1;

DELETE FROM categories;
ALTER SEQUENCE categories_id_seq RESTART WITH 1;
```

---

### **Final Notes**
- If you **don't want to lose data permanently**, use `DELETE` instead of `TRUNCATE`.
- If you **must truncate**, use `CASCADE` or truncate in the correct order.

Let me know if you need further adjustments! 🚀
