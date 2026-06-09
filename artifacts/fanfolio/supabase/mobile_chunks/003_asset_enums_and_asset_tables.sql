-- ============================================================
-- 003 — Asset Enums and Asset Tables
-- Depends on: 002
-- Creates: asset_type_enum, asset_status_enum,
--          asset_sentiment_enum, assets, asset_price_history
-- RLS/policies are in 005. Comments are in 006.
-- ============================================================

-- ── Enum: asset_type_enum ─────────────────────────────────
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

-- ── Enum: asset_status_enum ───────────────────────────────
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

-- ── Enum: asset_sentiment_enum ────────────────────────────
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

-- ── 6. assets ─────────────────────────────────────────────
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

-- ── 7. asset_price_history ────────────────────────────────
create table if not exists public.asset_price_history (
  id              uuid primary key default gen_random_uuid(),
  asset_id        uuid not null references public.assets(id) on delete cascade,
  price           numeric not null check (price >= 0),
  change_percent  numeric not null default 0.0,
  reason          text,
  source_type     text not null default 'simulated',
  created_at      timestamptz not null default now()
);

create index if not exists price_history_asset_id_idx   on public.asset_price_history(asset_id);
create index if not exists price_history_created_at_idx on public.asset_price_history(created_at desc);
