# Hashir Supabase Todos

A minimal no-auth todo app for testing GitHub, Supabase, and Vercel access.

## Environment

Set these before building or deploying:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
```

## Supabase

Apply `supabase/migrations/202606070001_create_todos.sql` to create the `todos` table and public no-auth row level security policies.
