-- ============================================================
-- 999 — Count Check
-- Run AFTER all schema (001–006) and seed (101–105) chunks.
-- Expected counts after a clean seed:
--   sports                  7
--   leagues                 7
--   generic_teams           32
--   generic_player_roles    160
--   coach_roles             6
--   assets                  208  (32 stocks + 160 coins + 4 indexes + 6 futures + 6 memes)
--   asset_price_history     208  (one seed row per asset)
--   index_definitions       0    (not seeded in v1)
--   index_members           0    (not seeded in v1)
--   futures_markets         6
--   market_pulses           0    (not seeded in v1)
--   market_pulse_impacts    0    (not seeded in v1)
--   private_entity_aliases  0    (backend-only, not seeded)
-- ============================================================

select
  'sports'                 as table_name, count(*) as row_count from public.sports
union all select
  'leagues',                              count(*) from public.leagues
union all select
  'generic_teams',                        count(*) from public.generic_teams
union all select
  'generic_player_roles',                 count(*) from public.generic_player_roles
union all select
  'coach_roles',                          count(*) from public.coach_roles
union all select
  'assets',                               count(*) from public.assets
union all select
  'asset_price_history',                  count(*) from public.asset_price_history
union all select
  'index_definitions',                    count(*) from public.index_definitions
union all select
  'index_members',                        count(*) from public.index_members
union all select
  'futures_markets',                      count(*) from public.futures_markets
union all select
  'market_pulses',                        count(*) from public.market_pulses
union all select
  'market_pulse_impacts',                 count(*) from public.market_pulse_impacts
union all select
  'private_entity_aliases',               count(*) from public.private_entity_aliases
order by table_name;
