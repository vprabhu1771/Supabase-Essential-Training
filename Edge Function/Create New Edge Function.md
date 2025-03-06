```
https://www.restack.io/docs/supabase-knowledge-supabase-install-windows
```

# Create a function

```
supabase functions new hello-world
```

# Deploy your function

```
supabase functions deploy hello-world --project-ref <SUPABASE_URL>
```

# Invoke your function

curl -L -X POST 'https://<SUPABASE_URL>/functions/v1/hello-world' -H 'Authorization: Bearer <SUPABASE_ANON_KEY> --data '{"name":"Functions"}'
