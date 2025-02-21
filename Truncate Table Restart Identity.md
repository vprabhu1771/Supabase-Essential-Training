To **truncate a table** in PostgreSQL and **restart the identity (auto-increment) counter**, use the following command:

```sql
TRUNCATE TABLE table_name RESTART IDENTITY;
```

### Explanation:
- **`TRUNCATE TABLE table_name`**: Deletes all rows from the table.
- **`RESTART IDENTITY`**: Resets the sequences (like `SERIAL` or `BIGSERIAL` columns) associated with the table to their initial value.
- **Optional:** Add **`CASCADE`** to truncate related tables with foreign key dependencies:
  ```sql
  TRUNCATE TABLE table_name RESTART IDENTITY CASCADE;
  ```

### Example:
```sql
TRUNCATE TABLE users RESTART IDENTITY;
```
This will:
1. Delete all rows from the `users` table.
2. Reset the primary key (if auto-incremented) to start from 1.
