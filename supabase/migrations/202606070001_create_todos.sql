create extension if not exists pgcrypto;

create table if not exists public.todos (
  id uuid primary key default gen_random_uuid(),
  title text not null check (char_length(title) <= 280),
  is_complete boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.todos enable row level security;

drop policy if exists "Todos are publicly readable" on public.todos;
drop policy if exists "Todos are publicly insertable" on public.todos;
drop policy if exists "Todos are publicly updateable" on public.todos;
drop policy if exists "Todos are publicly deletable" on public.todos;

create policy "Todos are publicly readable"
  on public.todos for select
  to anon
  using (true);

create policy "Todos are publicly insertable"
  on public.todos for insert
  to anon
  with check (true);

create policy "Todos are publicly updateable"
  on public.todos for update
  to anon
  using (true)
  with check (true);

create policy "Todos are publicly deletable"
  on public.todos for delete
  to anon
  using (true);
