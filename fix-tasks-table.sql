-- Run this in Supabase SQL Editor to align the tasks schema with dashboard.html

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text,
  assigned_to uuid references auth.users(id),
  user_id uuid references auth.users(id),
  created_by uuid references auth.users(id),
  deadline date,
  created_at timestamptz default now()
);

alter table public.tasks add column if not exists description text;
alter table public.tasks add column if not exists assigned_to uuid references auth.users(id);
alter table public.tasks add column if not exists user_id uuid references auth.users(id);
alter table public.tasks add column if not exists created_by uuid references auth.users(id);
alter table public.tasks add column if not exists deadline date;
alter table public.tasks add column if not exists created_at timestamptz default now();

-- Keep older status columns optional if present in older projects.
alter table public.tasks add column if not exists status text;
alter table public.tasks add column if not exists task_status text;

alter table public.tasks enable row level security;

drop policy if exists "Insert own tasks" on public.tasks;
drop policy if exists "Select own tasks" on public.tasks;
drop policy if exists "Delete own tasks" on public.tasks;
drop policy if exists "Enable all access for authenticated users" on public.tasks;
drop policy if exists "tasks_select_creator_owner_assignee" on public.tasks;
drop policy if exists "tasks_insert_creator_or_owner" on public.tasks;
drop policy if exists "tasks_update_creator_owner_assignee" on public.tasks;
drop policy if exists "tasks_delete_creator_or_owner" on public.tasks;

create policy "tasks_select_creator_owner_assignee"
  on public.tasks
  for select
  to authenticated
  using (
    auth.uid() = created_by
    or auth.uid() = user_id
    or auth.uid() = assigned_to
  );

create policy "tasks_insert_creator_or_owner"
  on public.tasks
  for insert
  to authenticated
  with check (
    auth.uid() = created_by
    or auth.uid() = user_id
  );

create policy "tasks_update_creator_owner_assignee"
  on public.tasks
  for update
  to authenticated
  using (
    auth.uid() = created_by
    or auth.uid() = user_id
    or auth.uid() = assigned_to
  )
  with check (
    auth.uid() = created_by
    or auth.uid() = user_id
    or auth.uid() = assigned_to
  );

create policy "tasks_delete_creator_or_owner"
  on public.tasks
  for delete
  to authenticated
  using (
    auth.uid() = created_by
    or auth.uid() = user_id
  );
