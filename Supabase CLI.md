# Install the scoop

```
https://scoop.sh/
```

```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

```
Invoke-RestMethod -Uri https://get.scoop.sh | Invoke-Expression
```

# Install the Supabase CLI

```
scoop bucket add supabase https://github.com/supabase/scoop-bucket.git
```

```
scoop install supabase
```

```
npm install supabase --save-dev
```

```
brew install supabase/tap/supabase
```
