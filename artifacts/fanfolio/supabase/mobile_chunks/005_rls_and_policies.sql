-- ============================================================
-- 005 — Row Level Security and Policies
-- Depends on: 004 (all tables must exist)
-- Enables RLS and creates anon-read policies for all
-- public-facing tables.
-- NOTE: private_entity_aliases intentionally has NO anon
--       read policy — backend/service-role access only.
-- ============================================================

-- ── sports ────────────────────────────────────────────────
alter table public.sports enable row level security;

drop policy if exists "anon_read_sports" on public.sports;
create policy "anon_read_sports" on public.sports
  for select using (true);

-- ── leagues ───────────────────────────────────────────────
alter table public.leagues enable row level security;

drop policy if exists "anon_read_leagues" on public.leagues;
create policy "anon_read_leagues" on public.leagues
  for select using (true);

-- ── generic_teams ─────────────────────────────────────────
alter table public.generic_teams enable row level security;

drop policy if exists "anon_read_generic_teams" on public.generic_teams;
create policy "anon_read_generic_teams" on public.generic_teams
  for select using (true);

-- ── generic_player_roles ──────────────────────────────────
alter table public.generic_player_roles enable row level security;

drop policy if exists "anon_read_player_roles" on public.generic_player_roles;
create policy "anon_read_player_roles" on public.generic_player_roles
  for select using (true);

-- ── coach_roles ───────────────────────────────────────────
alter table public.coach_roles enable row level security;

drop policy if exists "anon_read_coach_roles" on public.coach_roles;
create policy "anon_read_coach_roles" on public.coach_roles
  for select using (true);

-- ── assets ────────────────────────────────────────────────
alter table public.assets enable row level security;

drop policy if exists "anon_read_active_assets" on public.assets;
create policy "anon_read_active_assets" on public.assets
  for select using (status = 'active');

-- ── asset_price_history ───────────────────────────────────
alter table public.asset_price_history enable row level security;

drop policy if exists "anon_read_price_history" on public.asset_price_history;
create policy "anon_read_price_history" on public.asset_price_history
  for select using (true);

-- ── index_definitions ─────────────────────────────────────
alter table public.index_definitions enable row level security;

drop policy if exists "anon_read_index_definitions" on public.index_definitions;
create policy "anon_read_index_definitions" on public.index_definitions
  for select using (true);

-- ── index_members ─────────────────────────────────────────
alter table public.index_members enable row level security;

drop policy if exists "anon_read_index_members" on public.index_members;
create policy "anon_read_index_members" on public.index_members
  for select using (true);

-- ── futures_markets ───────────────────────────────────────
alter table public.futures_markets enable row level security;

drop policy if exists "anon_read_futures_markets" on public.futures_markets;
create policy "anon_read_futures_markets" on public.futures_markets
  for select using (true);

-- ── market_pulses ─────────────────────────────────────────
alter table public.market_pulses enable row level security;

drop policy if exists "anon_read_market_pulses" on public.market_pulses;
create policy "anon_read_market_pulses" on public.market_pulses
  for select using (true);

-- ── market_pulse_impacts ──────────────────────────────────
alter table public.market_pulse_impacts enable row level security;

drop policy if exists "anon_read_pulse_impacts" on public.market_pulse_impacts;
create policy "anon_read_pulse_impacts" on public.market_pulse_impacts
  for select using (true);

-- ── private_entity_aliases ────────────────────────────────
-- RLS enabled — intentionally NO anon read policy.
-- Only service-role / backend workers may access this table.
alter table public.private_entity_aliases enable row level security;
