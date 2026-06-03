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

-- ============================================================
-- FUTURE ASSET UNIVERSE TABLES (not yet active — do not run)
-- These are placeholders for when Fanfolio scales to a real
-- sports data backend. User game state tables above are
-- unaffected by this section.
--
-- When a real sports API is connected:
--   1. sports/leagues/teams/people are populated from the API.
--   2. assets are seeded from teams and people records.
--   3. asset_prices are updated on a schedule (e.g. hourly).
--   4. user_game_state.holdings references asset IDs from this table.
--   5. index_components and futures_metadata drive display logic in the app.
-- ============================================================

-- -- ── sports ─────────────────────────────────────────────────
-- create table if not exists public.sports (
--   id          serial primary key,
--   name        text not null unique,   -- e.g. "Football", "Basketball"
--   created_at  timestamptz not null default now()
-- );

-- -- ── leagues ────────────────────────────────────────────────
-- create table if not exists public.leagues (
--   id          serial primary key,
--   sport_id    integer references public.sports(id),
--   name        text not null,          -- e.g. "NFL", "NBA"
--   abbreviation text,
--   created_at  timestamptz not null default now()
-- );

-- -- ── teams ──────────────────────────────────────────────────
-- create table if not exists public.teams (
--   id          serial primary key,
--   league_id   integer references public.leagues(id),
--   name        text not null,          -- e.g. "Kansas City Chiefs"
--   symbol      text not null,          -- e.g. "KCC"
--   city        text,
--   created_at  timestamptz not null default now()
-- );

-- -- ── people ─────────────────────────────────────────────────
-- -- Players, coaches, or any individual-based asset subject
-- create table if not exists public.people (
--   id          serial primary key,
--   team_id     integer references public.teams(id),
--   full_name   text not null,
--   position    text,                   -- e.g. "QB", "WR", "Head Coach"
--   role        text not null,          -- "player" | "coach"
--   created_at  timestamptz not null default now()
-- );

-- -- ── assets ─────────────────────────────────────────────────
-- -- The canonical list of tradable simulated assets
-- create table if not exists public.assets (
--   id               text primary key,  -- e.g. "chiefs-stock", "mahomes-coin"
--   symbol           text not null,
--   name             text not null,
--   type             text not null,     -- AssetType enum value
--   sport_id         integer references public.sports(id),
--   league_id        integer references public.leagues(id),
--   team_id          integer references public.teams(id),
--   person_id        integer references public.people(id),
--   base_price       numeric not null default 100,
--   risk_score       integer not null default 5 check (risk_score between 1 and 10),
--   description      text,
--   market_lesson    text,
--   educational_note text,
--   tags             text[],
--   active           boolean not null default true,
--   created_at       timestamptz not null default now(),
--   updated_at       timestamptz not null default now()
-- );

-- -- ── asset_prices ───────────────────────────────────────────
-- -- Append-only price log; app reads the latest row per asset_id
-- create table if not exists public.asset_prices (
--   id              bigserial primary key,
--   asset_id        text references public.assets(id),
--   price           numeric not null,
--   previous_price  numeric,
--   daily_change_pct numeric,
--   bullish         boolean,
--   chart_data      jsonb,             -- array of 20 price points
--   why_it_moved    text,
--   recorded_at     timestamptz not null default now()
-- );

-- -- ── index_components ───────────────────────────────────────
-- -- Defines which assets make up each Sport Index
-- create table if not exists public.index_components (
--   index_asset_id     text references public.assets(id),
--   component_asset_id text references public.assets(id),
--   weight             numeric default 1.0,
--   primary key (index_asset_id, component_asset_id)
-- );

-- -- ── futures_metadata ───────────────────────────────────────
-- -- Extra metadata for Future-type assets
-- create table if not exists public.futures_metadata (
--   asset_id         text primary key references public.assets(id),
--   future_category  text,             -- e.g. "Award", "Championship"
--   settlement_rule  text,
--   settlement_date  date,
--   settled          boolean default false,
--   settlement_price numeric
-- );
