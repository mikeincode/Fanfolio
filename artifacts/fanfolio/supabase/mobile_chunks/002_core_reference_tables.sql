-- ============================================================
-- 002 — Core Reference Tables
-- Depends on: 001
-- Creates: sports, leagues, generic_teams,
--          generic_player_roles, coach_roles
-- RLS/policies are in 005. Comments are in 006.
-- ============================================================

-- ── 1. sports ─────────────────────────────────────────────
create table if not exists public.sports (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  display_order int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

-- ── 2. leagues ────────────────────────────────────────────
create table if not exists public.leagues (
  id            uuid primary key default gen_random_uuid(),
  sport_id      uuid not null references public.sports(id) on delete cascade,
  name          text not null,
  slug          text not null unique,
  display_order int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

create index if not exists leagues_sport_id_idx on public.leagues(sport_id);

-- ── 3. generic_teams ──────────────────────────────────────
create table if not exists public.generic_teams (
  id               uuid primary key default gen_random_uuid(),
  sport_id         uuid not null references public.sports(id) on delete cascade,
  league_id        uuid references public.leagues(id) on delete set null,
  city             text not null,
  public_name      text not null,
  short_name       text not null,
  symbol_prefix    text not null,
  primary_color    text,
  secondary_color  text,
  risk_baseline    numeric not null default 4.0 check (risk_baseline between 1 and 10),
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists generic_teams_sport_id_idx  on public.generic_teams(sport_id);
create index if not exists generic_teams_league_id_idx on public.generic_teams(league_id);

-- ── 4. generic_player_roles ───────────────────────────────
create table if not exists public.generic_player_roles (
  id                uuid primary key default gen_random_uuid(),
  team_id           uuid not null references public.generic_teams(id) on delete cascade,
  public_role       text not null,
  public_name       text not null,
  position_group    text not null,
  asset_symbol      text not null unique,
  importance_score  int not null default 5 check (importance_score between 1 and 10),
  risk_baseline     numeric not null default 5.0 check (risk_baseline between 1 and 10),
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

create index if not exists player_roles_team_id_idx on public.generic_player_roles(team_id);

-- ── 5. coach_roles ────────────────────────────────────────
create table if not exists public.coach_roles (
  id               uuid primary key default gen_random_uuid(),
  team_id          uuid references public.generic_teams(id) on delete set null,
  public_name      text not null,
  coach_archetype  text not null,
  risk_baseline    numeric not null default 5.0 check (risk_baseline between 1 and 10),
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists coach_roles_team_id_idx on public.coach_roles(team_id);
