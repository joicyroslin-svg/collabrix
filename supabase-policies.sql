-- Run in Supabase SQL Editor.
-- Purpose: allow leaders to assign tasks and members to see/update their own assigned tasks.

alter table public.tasks enable row level security;

-- Remove older restrictive policies if present.
drop policy if exists "Insert own tasks" on public.tasks;
drop policy if exists "Select own tasks" on public.tasks;
drop policy if exists "Delete own tasks" on public.tasks;
drop policy if exists "Enable all access for authenticated users" on public.tasks;
drop policy if exists "tasks_select_creator_owner_assignee" on public.tasks;
drop policy if exists "tasks_insert_creator_or_owner" on public.tasks;
drop policy if exists "tasks_update_creator_owner_assignee" on public.tasks;
drop policy if exists "tasks_delete_creator_or_owner" on public.tasks;

-- Read: creator, owner, or assignee can read.
create policy "tasks_select_creator_owner_assignee"
  on public.tasks
  for select
  to authenticated
  using (
    auth.uid() = created_by
    or auth.uid() = user_id
    or auth.uid() = assigned_to
  );

-- Insert: creator/owner must be current user (assignee may be someone else).
create policy "tasks_insert_creator_or_owner"
  on public.tasks
  for insert
  to authenticated
  with check (
    auth.uid() = created_by
    or auth.uid() = user_id
  );

-- Update: creator, owner, or assignee can update (needed for mark-complete).
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

-- Delete: creator or owner can delete.
create policy "tasks_delete_creator_or_owner"
  on public.tasks
  for delete
  to authenticated
  using (
    auth.uid() = created_by
    or auth.uid() = user_id
  );
