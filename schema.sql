create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null,
  university text,
  major text,
  study_year text,
  updated_at timestamptz default now()
);

create table public.lectures (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  subject text not null,
  day text not null,
  start_time time not null,
  end_time time,
  room text,
  created_at timestamptz default now()
);

create table public.grades (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  subject text not null,
  study_year text not null,
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.lectures enable row level security;
alter table public.grades   enable row level security;

create policy "own profile" on public.profiles
  for all using (auth.uid() = id) with check (auth.uid() = id);
create policy "own lectures" on public.lectures
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
create policy "own grades" on public.grades
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
