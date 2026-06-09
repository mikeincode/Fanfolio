-- ============================================================
-- 004 — Index Definitions, Futures, Market Pulses,
--       and Private Entity Aliases
-- Depends on: 003
-- Creates: index_definitions, index_members,
--          future_type_enum, future_status_enum,
--          futures_markets, market_pulses,
--          market_pulse_impacts, private_entity_aliases
-- RLS/policies are in 005. Comments are in 006.
-- ============================================================

-- ── 8. index_definitions ──────────────────────────────────
create table if not exists public.index_definitions (
  id                uuid primary key default gen_random_uuid(),
  asset_id          uuid not null unique references public.assets(id) on delete cascade,
  name              text not null,
  description       text,
  weighting_method  text not null default 'equal',
  created_at        timestamptz not null default now()
);

-- ── 9. index_members ──────────────────────────────────────
create table if not exists public.index_members (
  id             uuid primary key default gen_random_uuid(),
  index_id       uuid not null references public.index_definitions(id) on delete cascade,
  asset_id       uuid not null references public.assets(id) on delete cascade,
  weight_percent numeric not null default 0.0
    check (weight_percent >= 0 and weight_percent <= 100),
  created_at     timestamptz not null default now(),
  unique (index_id, asset_id)
);

create index if not exists index_members_index_id_idx on public.index_members(index_id);

-- ── Enum: future_type_enum ────────────────────────────────
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

-- ── Enum: future_status_enum ──────────────────────────────
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

-- ── 10. futures_markets ───────────────────────────────────
create table if not exists public.futures_markets (
  id               uuid primary key default gen_random_uuid(),
  asset_id         uuid not null unique references public.assets(id) on delete cascade,
  future_type      public.future_type_enum not null,
  public_name      text not null,
  settlement_rule  text,
  status           public.future_status_enum not null default 'open',
  created_at       timestamptz not null default now()
);

-- ── 11. market_pulses ─────────────────────────────────────
create table if not exists public.market_pulses (
  id                  uuid primary key default gen_random_uuid(),
  title               text not null,
  summary             text,
  category            text not null,
  sport_id            uuid references public.sports(id) on delete set null,
  league_id           uuid references public.leagues(id) on delete set null,
  source_type         text not null default 'simulated',
  is_generated        boolean not null default false,
  educational_lesson  text,
  created_at          timestamptz not null default now()
);

create index if not exists market_pulses_sport_id_idx   on public.market_pulses(sport_id);
create index if not exists market_pulses_created_at_idx on public.market_pulses(created_at desc);

-- ── 12. market_pulse_impacts ──────────────────────────────
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

-- ── 13. private_entity_aliases ────────────────────────────
-- BACKEND/ADMIN USE ONLY — NOT READABLE BY THE PUBLIC CLIENT APP.
-- Maps real-world entity names to generic Fanfolio counterparts.
-- No anon read policy — only service role / backend workers.
create table if not exists public.private_entity_aliases (
  id                    uuid primary key default gen_random_uuid(),
  private_alias         text not null,
  public_name           text not null,
  entity_type           text not null,
  mapped_asset_id       uuid references public.assets(id) on delete set null,
  mapped_team_id        uuid references public.generic_teams(id) on delete set null,
  mapped_player_role_id uuid references public.generic_player_roles(id) on delete set null,
  confidence_weight     numeric not null default 1.0
    check (confidence_weight between 0 and 1),
  notes                 text,
  created_at            timestamptz not null default now()
);

create index if not exists entity_aliases_alias_idx       on public.private_entity_aliases(private_alias);
create index if not exists entity_aliases_entity_type_idx on public.private_entity_aliases(entity_type);
