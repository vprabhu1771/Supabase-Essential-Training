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

# Supabase Login

```
supabase login
```

# Initialize Supabase in Your Project
Once the CLI is installed, navigate to your Flutter project folder and run:
```sh
supabase init
```

This will create a `supabase/` directory inside your project.

# Config Setting.json

```json
{
  "deno.enablePaths": [
    "supabase/functions"
  ],
  "deno.lint": true,
  "deno.unstable": [
    "bare-node-builtins",
    "byonm",
    "sloppy-imports",
    "unsafe-proto",
    "webgpu",
    "broadcast-channel",
    "worker-options",
    "cron",
    "kv",
    "ffi",
    "fs",
    "http",
    "net"
  ],
  "[typescript]": {
    "editor.defaultFormatter": "denoland.vscode-deno"
  }
}
```

```
npm install supabase --save-dev
```

```
brew install supabase/tap/supabase
```
