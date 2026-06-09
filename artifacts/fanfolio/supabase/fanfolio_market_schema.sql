-- ============================================================
-- Fanfolio Market Schema v1
-- ============================================================
-- Safe to run SEPARATELY from the existing cloud-save schema
-- (schema.sql). Does not alter user_profiles or user_game_state.
--
-- How to run:
--   Supabase Dashboard → SQL Editor → paste this file → Run
--
-- All user-facing asset names use generic Fanfolio names only.
-- No real team names, player names, coach names, league marks,
-- logos, mascots, or official branding are stored in these tables.
-- ============================================================

-- ── Shared updated_at trigger (idempotent) ────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ─────────────────────────────────────────────────────────────
-- 1. sports
-- Reference table for top-level sport categories.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.sports (
  id            uuid primary key default gen_random_uuid(),
  name          text not null unique,
  slug          text not null unique,
  display_order int  not null default 0,
  is_active     boolean not null default true,
  created_at    timestamptz not null default now()
);

alter table public.sports enable row level security;

drop policy if exists "anon_read_sports" on public.sports;
create policy "anon_read_sports" on public.sports
  for select using (true);

comment on table public.sports is
  'Top-level sport categories. Uses generic Fanfolio names only (Pro Football, MMA, etc.).';

-- ─────────────────────────────────────────────────────────────
-- 2. leagues
-- Sub-groupings within a sport.
-- ─────────────────────────────────────────────────────────────
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

alter table public.leagues enable row level security;

drop policy if exists "anon_read_leagues" on public.leagues;
create policy "anon_read_leagues" on public.leagues
  for select using (true);

comment on table public.leagues is
  'League groupings within a sport. Uses generic Fanfolio names — no official league marks.';

-- ─────────────────────────────────────────────────────────────
-- 3. generic_teams
-- Generic franchise entities. City names only — no mascots,
-- no official logos, no trademark branding.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.generic_teams (
  id               uuid primary key default gen_random_uuid(),
  sport_id         uuid not null references public.sports(id) on delete cascade,
  league_id        uuid references public.leagues(id) on delete set null,
  city             text not null,
  public_name      text not null,        -- e.g. "Kansas City Football Team"
  short_name       text not null,        -- e.g. "KC Football"
  symbol_prefix    text not null,        -- e.g. "KC" → stock symbol "KCFT"
  primary_color    text,                 -- hex color for UI theming
  secondary_color  text,
  risk_baseline    numeric not null default 4.0 check (risk_baseline between 1 and 10),
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists generic_teams_sport_id_idx  on public.generic_teams(sport_id);
create index if not exists generic_teams_league_id_idx on public.generic_teams(league_id);

alter table public.generic_teams enable row level security;

drop policy if exists "anon_read_generic_teams" on public.generic_teams;
create policy "anon_read_generic_teams" on public.generic_teams
  for select using (true);

comment on table public.generic_teams is
  'Generic team entities using city + sport suffix only. No mascots, logos, or official marks.
   Displays as "Kansas City Football Team", "Baltimore Football Team", etc.';

-- ─────────────────────────────────────────────────────────────
-- 4. generic_player_roles
-- Generic positional roles linked to a team.
-- Describes the role/position, not a real individual.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.generic_player_roles (
  id                uuid primary key default gen_random_uuid(),
  team_id           uuid not null references public.generic_teams(id) on delete cascade,
  public_role       text not null,       -- e.g. "QB1", "TE1", "WR1", "Edge Rusher"
  public_name       text not null,       -- e.g. "Kansas City QB1"
  position_group    text not null,       -- e.g. "Quarterback", "Tight End", "Wide Receiver"
  asset_symbol      text not null unique,-- e.g. "KCQB1"
  importance_score  int not null default 5 check (importance_score between 1 and 10),
  risk_baseline     numeric not null default 5.0 check (risk_baseline between 1 and 10),
  is_active         boolean not null default true,
  created_at        timestamptz not null default now()
);

create index if not exists player_roles_team_id_idx on public.generic_player_roles(team_id);

alter table public.generic_player_roles enable row level security;

drop policy if exists "anon_read_player_roles" on public.generic_player_roles;
create policy "anon_read_player_roles" on public.generic_player_roles
  for select using (true);

comment on table public.generic_player_roles is
  'Positional roles attached to teams. Describes roles (QB1, TE1) not real individuals.
   Display name: "Kansas City QB1 Coin", "Las Vegas RB1 Coin". No real player names.';

-- ─────────────────────────────────────────────────────────────
-- 5. coach_roles
-- Generic coaching archetype assets (optional team link).
-- ─────────────────────────────────────────────────────────────
create table if not exists public.coach_roles (
  id               uuid primary key default gen_random_uuid(),
  team_id          uuid references public.generic_teams(id) on delete set null,
  public_name      text not null,        -- e.g. "Offensive Mastermind Coach Stock"
  coach_archetype  text not null,        -- e.g. "offensive", "defensive", "hot_seat"
  risk_baseline    numeric not null default 5.0 check (risk_baseline between 1 and 10),
  is_active        boolean not null default true,
  created_at       timestamptz not null default now()
);

create index if not exists coach_roles_team_id_idx on public.coach_roles(team_id);

alter table public.coach_roles enable row level security;

drop policy if exists "anon_read_coach_roles" on public.coach_roles;
create policy "anon_read_coach_roles" on public.coach_roles
  for select using (true);

comment on table public.coach_roles is
  'Generic coaching archetype assets. No real coach names. Uses archetypes like
   "Offensive Mastermind", "Defensive Architect", "Hot Seat" as the display identity.';

-- ─────────────────────────────────────────────────────────────
-- 6. assets
-- The core tradeable asset table. References sports/leagues/
-- teams/roles as optional foreign keys.
-- ─────────────────────────────────────────────────────────────
do $$
begin
  create type public.asset_type_enum as enum (
    'team_stock',
    'player_coin',
    'coach_stock',
    'sport_index',
    'meme_coin',
    'award_future',
    'season_future'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.asset_status_enum as enum (
    'active',
    'paused',
    'settled',
    'retired'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.asset_sentiment_enum as enum (
    'bullish',
    'bearish',
    'neutral',
    'volatile'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.assets (
  id                    uuid primary key default gen_random_uuid(),
  asset_type            public.asset_type_enum not null,
  sport_id              uuid references public.sports(id) on delete set null,
  league_id             uuid references public.leagues(id) on delete set null,
  team_id               uuid references public.generic_teams(id) on delete set null,
  player_role_id        uuid references public.generic_player_roles(id) on delete set null,
  coach_role_id         uuid references public.coach_roles(id) on delete set null,
  symbol                text not null unique,
  public_name           text not null,
  subtitle              text,
  description           text,
  educational_note      text,
  risk_score            numeric not null default 5.0 check (risk_score between 1 and 10),
  sentiment             public.asset_sentiment_enum not null default 'neutral',
  current_price         numeric not null default 100.0 check (current_price >= 0),
  daily_change_percent  numeric not null default 0.0,
  status                public.asset_status_enum not null default 'active',
  tags                  jsonb not null default '[]'::jsonb,
  metadata              jsonb not null default '{}'::jsonb,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now()
);

create index if not exists assets_sport_id_idx      on public.assets(sport_id);
create index if not exists assets_league_id_idx     on public.assets(league_id);
create index if not exists assets_team_id_idx       on public.assets(team_id);
create index if not exists assets_player_role_idx   on public.assets(player_role_id);
create index if not exists assets_symbol_idx        on public.assets(symbol);
create index if not exists assets_asset_type_idx    on public.assets(asset_type);
create index if not exists assets_status_idx        on public.assets(status);

drop trigger if exists trg_assets_updated_at on public.assets;
create trigger trg_assets_updated_at
  before update on public.assets
  for each row execute function public.set_updated_at();

alter table public.assets enable row level security;

drop policy if exists "anon_read_active_assets" on public.assets;
create policy "anon_read_active_assets" on public.assets
  for select using (status = 'active');

comment on table public.assets is
  'Core tradeable asset registry. All public_name values use generic Fanfolio names.
   No real player/team/league branding in any user-visible column.';

-- ─────────────────────────────────────────────────────────────
-- 7. asset_price_history
-- Append-only log of simulated price movements.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.asset_price_history (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references public.assets(id) on delete cascade,
  price           numeric not null check (price >= 0),
  change_percent  numeric not null default 0.0,
  reason          text,
  source_type     text not null default 'simulated',   -- 'simulated' | 'market_event' | 'seed'
  created_at      timestamptz not null default now()
);

create index if not exists price_history_asset_id_idx on public.asset_price_history(asset_id);
create index if not exists price_history_created_at_idx on public.asset_price_history(created_at desc);

alter table public.asset_price_history enable row level security;

drop policy if exists "anon_read_price_history" on public.asset_price_history;
create policy "anon_read_price_history" on public.asset_price_history
  for select using (true);

comment on table public.asset_price_history is
  'Append-only simulated price history. source_type tracks whether the movement
   was seeded, triggered by a market event, or generated by the simulation engine.';

-- ─────────────────────────────────────────────────────────────
-- 8. index_definitions
-- Metadata for sport index assets.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.index_definitions (
  id                uuid primary key default gen_random_uuid(),
  asset_id          uuid not null unique references public.assets(id) on delete cascade,
  name              text not null,
  description       text,
  weighting_method  text not null default 'equal',   -- 'equal' | 'market_cap' | 'manual'
  created_at        timestamptz not null default now()
);

alter table public.index_definitions enable row level security;

drop policy if exists "anon_read_index_definitions" on public.index_definitions;
create policy "anon_read_index_definitions" on public.index_definitions
  for select using (true);

-- ─────────────────────────────────────────────────────────────
-- 9. index_members
-- Composition of each index asset.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.index_members (
  id           uuid primary key default gen_random_uuid(),
  index_id     uuid not null references public.index_definitions(id) on delete cascade,
  asset_id     uuid not null references public.assets(id) on delete cascade,
  weight_percent numeric not null default 0.0 check (weight_percent >= 0 and weight_percent <= 100),
  created_at   timestamptz not null default now(),
  unique (index_id, asset_id)
);

create index if not exists index_members_index_id_idx on public.index_members(index_id);

alter table public.index_members enable row level security;

drop policy if exists "anon_read_index_members" on public.index_members;
create policy "anon_read_index_members" on public.index_members
  for select using (true);

-- ─────────────────────────────────────────────────────────────
-- 10. futures_markets
-- Settlement rules for future-type assets.
-- ─────────────────────────────────────────────────────────────
do $$
begin
  create type public.future_type_enum as enum (
    'award',
    'season',
    'championship',
    'comeback',
    'coach_momentum'
  );
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create type public.future_status_enum as enum (
    'open',
    'pending_settlement',
    'settled',
    'voided'
  );
exception
  when duplicate_object then null;
end $$;

create table if not exists public.futures_markets (
  id               uuid primary key default gen_random_uuid(),
  asset_id         uuid not null unique references public.assets(id) on delete cascade,
  future_type      public.future_type_enum not null,
  public_name      text not null,
  settlement_rule  text,
  status           public.future_status_enum not null default 'open',
  created_at       timestamptz not null default now()
);

alter table public.futures_markets enable row level security;

drop policy if exists "anon_read_futures_markets" on public.futures_markets;
create policy "anon_read_futures_markets" on public.futures_markets
  for select using (true);

comment on table public.futures_markets is
  'Settlement definitions for future-type assets. No real odds, lines, or sportsbook data.
   Fanfolio futures are purely educational market simulations — LuckyCoin has no cash value.';

-- ─────────────────────────────────────────────────────────────
-- 11. market_pulses
-- Generated or seeded market event summaries that move assets.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.market_pulses (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  summary             text,
  category            text not null,       -- 'Chaos', 'Rally', 'Defense', etc.
  sport_id            uuid references public.sports(id) on delete set null,
  league_id           uuid references public.leagues(id) on delete set null,
  source_type         text not null default 'simulated',
  is_generated        boolean not null default false,
  educational_lesson  text,
  created_at          timestamptz not null default now()
);

create index if not exists market_pulses_sport_id_idx on public.market_pulses(sport_id);
create index if not exists market_pulses_created_at_idx on public.market_pulses(created_at desc);

alter table public.market_pulses enable row level security;

drop policy if exists "anon_read_market_pulses" on public.market_pulses;
create policy "anon_read_market_pulses" on public.market_pulses
  for select using (true);

-- ─────────────────────────────────────────────────────────────
-- 12. market_pulse_impacts
-- Per-asset impact records linked to a market pulse.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.market_pulse_impacts (
  id               uuid primary key default gen_random_uuid(),
  market_pulse_id  uuid not null references public.market_pulses(id) on delete cascade,
  asset_id         uuid not null references public.assets(id) on delete cascade,
  impact_percent   numeric not null default 0.0,
  impact_reason    text,
  created_at       timestamptz not null default now()
);

create index if not exists pulse_impacts_pulse_id_idx on public.market_pulse_impacts(market_pulse_id);
create index if not exists pulse_impacts_asset_id_idx on public.market_pulse_impacts(asset_id);

alter table public.market_pulse_impacts enable row level security;

drop policy if exists "anon_read_pulse_impacts" on public.market_pulse_impacts;
create policy "anon_read_pulse_impacts" on public.market_pulse_impacts
  for select using (true);

-- ─────────────────────────────────────────────────────────────
-- 13. private_entity_aliases
-- ─────────────────────────────────────────────────────────────
-- BACKEND/ADMIN USE ONLY — NOT READABLE BY THE PUBLIC CLIENT APP.
--
-- This table maps real-world entity names (as they might appear in
-- a future sports news API feed) to their generic Fanfolio counterparts.
--
-- Example: a live news article might mention a real quarterback by name.
-- The entity adapter pipeline looks up that name here and maps it to
-- the generic "Kansas City QB1" asset — never surfacing the real name
-- in the public app.
--
-- Security: RLS is enabled. No anon select policy is created.
-- Only service-role / backend workers should ever read this table.
-- The client app must NEVER query this table directly.
-- ─────────────────────────────────────────────────────────────
create table if not exists public.private_entity_aliases (
  id                   uuid primary key default gen_random_uuid(),
  private_alias        text not null,         -- real-world name (kept private)
  public_name          text not null,         -- generic Fanfolio display name
  entity_type          text not null,         -- 'player' | 'team' | 'coach' | 'league'
  mapped_asset_id      uuid references public.assets(id) on delete set null,
  mapped_team_id       uuid references public.generic_teams(id) on delete set null,
  mapped_player_role_id uuid references public.generic_player_roles(id) on delete set null,
  confidence_weight    numeric not null default 1.0 check (confidence_weight between 0 and 1),
  notes                text,
  created_at           timestamptz not null default now()
);

create index if not exists entity_aliases_alias_idx on public.private_entity_aliases(private_alias);
create index if not exists entity_aliases_entity_type_idx on public.private_entity_aliases(entity_type);

-- RLS enabled — intentionally NO anon read policy
alter table public.private_entity_aliases enable row level security;

comment on table public.private_entity_aliases is
  'PRIVATE — backend/admin use only. Maps real-world entity names to generic Fanfolio names.
   Used by the server-side article entity adapter to resolve live news references
   into generic Fanfolio assets without ever exposing real names to the client app.
   No anon read policy — only service role / backend workers may access this table.
   The public client app must never query this table directly.';
