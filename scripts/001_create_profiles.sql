-- Create profiles table for user data
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null,
  role text not null check (role in ('student', 'teacher', 'admin')),
  grade integer, -- for students (6-12)
  subjects text[], -- for teachers
  school text default 'Rural High School',
  avatar text,
  total_points integer default 0,
  level integer default 1,
  streak_days integer default 0,
  last_activity timestamp with time zone default now(),
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Enable RLS
alter table public.profiles enable row level security;

-- RLS policies for profiles
create policy "profiles_select_own" on public.profiles 
  for select using (auth.uid() = id);

create policy "profiles_insert_own" on public.profiles 
  for insert with check (auth.uid() = id);

create policy "profiles_update_own" on public.profiles 
  for update using (auth.uid() = id);

create policy "profiles_delete_own" on public.profiles 
  for delete using (auth.uid() = id);

-- Admin can view all profiles
create policy "profiles_admin_select_all" on public.profiles 
  for select using (
    exists (
      select 1 from public.profiles 
      where id = auth.uid() and role = 'admin'
    )
  );

-- Create offline_data table for storing user progress when offline
create table if not exists public.offline_data (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  data_type text not null, -- 'lesson_progress', 'quiz_result', 'achievement', etc.
  data jsonb not null,
  synced boolean default false,
  created_at timestamp with time zone default now()
);

-- Enable RLS for offline_data
alter table public.offline_data enable row level security;

-- RLS policies for offline_data
create policy "offline_data_select_own" on public.offline_data 
  for select using (auth.uid() = user_id);

create policy "offline_data_insert_own" on public.offline_data 
  for insert with check (auth.uid() = user_id);

create policy "offline_data_update_own" on public.offline_data 
  for update using (auth.uid() = user_id);

create policy "offline_data_delete_own" on public.offline_data 
  for delete using (auth.uid() = user_id);
