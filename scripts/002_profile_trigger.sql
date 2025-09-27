-- Function to handle new user creation
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, role, grade, subjects, school)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'name', 'New User'),
    coalesce(new.raw_user_meta_data ->> 'role', 'student'),
    case 
      when new.raw_user_meta_data ->> 'grade' is not null 
      then (new.raw_user_meta_data ->> 'grade')::integer 
      else null 
    end,
    case 
      when new.raw_user_meta_data ->> 'subjects' is not null 
      then string_to_array(new.raw_user_meta_data ->> 'subjects', ',')
      else null 
    end,
    coalesce(new.raw_user_meta_data ->> 'school', 'Rural High School')
  )
  on conflict (id) do nothing;

  return new;
end;
$$;

-- Drop existing trigger if it exists
drop trigger if exists on_auth_user_created on auth.users;

-- Create trigger for new user creation
create trigger on_auth_user_created
  after insert on auth.users
  for each row
  execute function public.handle_new_user();

-- Function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Create trigger for updated_at
create trigger profiles_updated_at
  before update on public.profiles
  for each row
  execute function public.handle_updated_at();
