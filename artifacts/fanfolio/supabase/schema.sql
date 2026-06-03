-- ============================================================
-- Fanfolio Supabase Schema
-- Paste this entire file into the Supabase SQL Editor and run it.
-- Dashboard: https://app.supabase.com → Your Project → SQL Editor
-- ============================================================

-- ── updated_at trigger function ──────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ── user_profiles ────────────────────────────────────────────
create table if not exists public.user_profiles (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  email      text,
  username   text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists user_profiles_user_id_idx on public.user_profiles(user_id);

drop trigger if exists trg_user_profiles_updated_at on public.user_profiles;
create trigger trg_user_profiles_updated_at
  before update on public.user_profiles
  for each row execute function public.set_updated_at();

alter table public.user_profiles enable row level security;

drop policy if exists "users_select_own_profile"  on public.user_profiles;
drop policy if exists "users_insert_own_profile"  on public.user_profiles;
drop policy if exists "users_update_own_profile"  on public.user_profiles;
drop policy if exists "users_delete_own_profile"  on public.user_profiles;

create policy "users_select_own_profile"  on public.user_profiles for select  using (auth.uid() = user_id);
create policy "users_insert_own_profile"  on public.user_profiles for insert  with check (auth.uid() = user_id);
create policy "users_update_own_profile"  on public.user_profiles for update  using (auth.uid() = user_id);
create policy "users_delete_own_profile"  on public.user_profiles for delete  using (auth.uid() = user_id);

-- ── user_game_state ──────────────────────────────────────────
create table if not exists public.user_game_state (
  user_id            uuid primary key references auth.users(id) on delete cascade,
  balance            numeric,
  holdings           jsonb not null default '[]'::jsonb,
  transactions       jsonb not null default '[]'::jsonb,
  watchlist          jsonb not null default '[]'::jsonb,
  applied_events     jsonb not null default '[]'::jsonb,
  claimed_challenges jsonb not null default '[]'::jsonb,
  challenge_flags    jsonb not null default '[]'::jsonb,
  lessons_opened     integer default 0,
  xp                 integer default 0,
  -- Full game state snapshot so future fields are never lost
  game_state         jsonb not null default '{}'::jsonb,
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index if not exists user_game_state_user_id_idx on public.user_game_state(user_id);

drop trigger if exists trg_user_game_state_updated_at on public.user_game_state;
create trigger trg_user_game_state_updated_at
  before update on public.user_game_state
  for each row execute function public.set_updated_at();

alter table public.user_game_state enable row level security;

drop policy if exists "users_select_own_game_state"  on public.user_game_state;
drop policy if exists "users_insert_own_game_state"  on public.user_game_state;
drop policy if exists "users_update_own_game_state"  on public.user_game_state;
drop policy if exists "users_delete_own_game_state"  on public.user_game_state;

create policy "users_select_own_game_state"  on public.user_game_state for select  using (auth.uid() = user_id);
create policy "users_insert_own_game_state"  on public.user_game_state for insert  with check (auth.uid() = user_id);
create policy "users_update_own_game_state"  on public.user_game_state for update  using (auth.uid() = user_id);
create policy "users_delete_own_game_state"  on public.user_game_state for delete  using (auth.uid() = user_id);
