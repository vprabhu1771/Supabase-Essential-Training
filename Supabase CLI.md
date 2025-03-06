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

# Supabase Version

```
supabase --version
```

```
2.15.8
```

# Initialize Supabase in Your Project
Once the CLI is installed, navigate to your Flutter project folder and run:
```sh
supabase init
```

This will create a `supabase/` directory inside your project.

```
npm install supabase --save-dev
```

```
brew install supabase/tap/supabase
```
