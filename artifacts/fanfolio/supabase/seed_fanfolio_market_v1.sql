-- ============================================================
-- Fanfolio Market Seed v1
-- ============================================================
-- Run AFTER fanfolio_market_schema.sql.
-- Idempotent: uses INSERT ... ON CONFLICT DO NOTHING.
--
-- Seed coverage:
--   - 7 sports
--   - 7 leagues
--   - 32 generic Pro Football teams (city names only, no mascots)
--   - 160 player role rows (32 teams × 5 roles: QB1/WR1/RB1/Edge Rusher/LB1)
--   - 6 coach role rows
--   - 32 team stock assets
--   - 160 player coin assets (one per player role)
--   - 4 sport index assets
--   - 6 futures assets
--   - 6 meme coin assets
--   - initial price history rows for all seeded assets
--
-- SAFETY: All names are generic Fanfolio names only.
-- No real team names, player names, coach names, mascots, logos,
-- league marks, or official branding in any public-facing column.
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- SPORTS
-- ─────────────────────────────────────────────────────────────
insert into public.sports (id, name, slug, display_order) values
  ('10000000-0000-0000-0000-000000000001', 'Pro Football',    'pro-football',    1),
  ('10000000-0000-0000-0000-000000000002', 'Pro Basketball',  'pro-basketball',  2),
  ('10000000-0000-0000-0000-000000000003', 'Pro Baseball',    'pro-baseball',    3),
  ('10000000-0000-0000-0000-000000000004', 'Pro Hockey',      'pro-hockey',      4),
  ('10000000-0000-0000-0000-000000000005', 'Pro Soccer',      'pro-soccer',      5),
  ('10000000-0000-0000-0000-000000000006', 'MMA',             'mma',             6),
  ('10000000-0000-0000-0000-000000000007', 'College Sports',  'college-sports',  7)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- LEAGUES
-- ─────────────────────────────────────────────────────────────
insert into public.leagues (id, sport_id, name, slug, display_order) values
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Pro Football League',    'pro-football-league',   1),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000002', 'Pro Basketball League',  'pro-basketball-league', 1),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000003', 'Pro Baseball League',    'pro-baseball-league',   1),
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000004', 'Pro Hockey League',      'pro-hockey-league',     1),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000005', 'Pro Soccer League',      'pro-soccer-league',     1),
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000006', 'MMA Circuit',            'mma-circuit',           1),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000007', 'College Sports League',  'college-sports-league', 1)
on conflict (slug) do nothing;

-- ─────────────────────────────────────────────────────────────
-- 32 GENERIC PRO FOOTBALL TEAMS
-- City/market names only — no mascots, no official marks.
-- Duplicate markets: Los Angeles A/B, New York A/B.
-- ─────────────────────────────────────────────────────────────
insert into public.generic_teams
  (id, sport_id, league_id, city, public_name, short_name, symbol_prefix, primary_color, risk_baseline)
values
  ('30000000-0000-0000-0000-000000000001','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Arizona',      'Arizona Football Team',        'AZ Football',  'AZ',   '#97233F', 4.5),
  ('30000000-0000-0000-0000-000000000002','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Atlanta',       'Atlanta Football Team',        'ATL Football', 'ATL',  '#A71930', 5.0),
  ('30000000-0000-0000-0000-000000000003','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Baltimore',     'Baltimore Football Team',      'BAL Football', 'BAL',  '#241773', 3.5),
  ('30000000-0000-0000-0000-000000000004','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Buffalo',       'Buffalo Football Team',        'BUF Football', 'BUF',  '#00338D', 4.0),
  ('30000000-0000-0000-0000-000000000005','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Carolina',      'Carolina Football Team',       'CAR Football', 'CAR',  '#0085CA', 5.5),
  ('30000000-0000-0000-0000-000000000006','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Chicago',       'Chicago Football Team',        'CHI Football', 'CHI',  '#0B162A', 4.5),
  ('30000000-0000-0000-0000-000000000007','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Cincinnati',    'Cincinnati Football Team',     'CIN Football', 'CIN',  '#FB4F14', 5.0),
  ('30000000-0000-0000-0000-000000000008','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Cleveland',     'Cleveland Football Team',      'CLE Football', 'CLE',  '#FF3C00', 5.5),
  ('30000000-0000-0000-0000-000000000009','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Dallas',        'Dallas Football Team',         'DAL Football', 'DAL',  '#041E42', 3.5),
  ('30000000-0000-0000-0000-000000000010','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Denver',        'Denver Football Team',         'DEN Football', 'DEN',  '#FB4F14', 5.0),
  ('30000000-0000-0000-0000-000000000011','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Detroit',       'Detroit Football Team',        'DET Football', 'DET',  '#0076B6', 4.0),
  ('30000000-0000-0000-0000-000000000012','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Green Bay',     'Green Bay Football Team',      'GB Football',  'GB',   '#203731', 3.5),
  ('30000000-0000-0000-0000-000000000013','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Houston',       'Houston Football Team',        'HOU Football', 'HOU',  '#03202F', 5.0),
  ('30000000-0000-0000-0000-000000000014','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Indianapolis',  'Indianapolis Football Team',   'IND Football', 'IND',  '#002C5F', 4.5),
  ('30000000-0000-0000-0000-000000000015','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Jacksonville',  'Jacksonville Football Team',   'JAX Football', 'JAX',  '#006778', 5.5),
  ('30000000-0000-0000-0000-000000000016','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Kansas City',   'Kansas City Football Team',    'KC Football',  'KC',   '#E31837', 3.0),
  ('30000000-0000-0000-0000-000000000017','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Las Vegas',     'Las Vegas Football Team',      'LV Football',  'LV',   '#000000', 5.0),
  ('30000000-0000-0000-0000-000000000018','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Los Angeles',   'Los Angeles Football Team A',  'LA Football A','LAA',  '#003594', 4.5),
  ('30000000-0000-0000-0000-000000000019','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Los Angeles',   'Los Angeles Football Team B',  'LA Football B','LAB',  '#0080C6', 5.5),
  ('30000000-0000-0000-0000-000000000020','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Miami',         'Miami Football Team',          'MIA Football', 'MIA',  '#008E97', 4.5),
  ('30000000-0000-0000-0000-000000000021','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Minnesota',     'Minnesota Football Team',      'MIN Football', 'MIN',  '#4F2683', 4.5),
  ('30000000-0000-0000-0000-000000000022','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','New England',   'New England Football Team',    'NE Football',  'NE',   '#002244', 4.0),
  ('30000000-0000-0000-0000-000000000023','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','New Orleans',   'New Orleans Football Team',    'NO Football',  'NO',   '#101820', 4.5),
  ('30000000-0000-0000-0000-000000000024','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','New York',      'New York Football Team A',     'NY Football A','NYA',  '#0B2265', 5.0),
  ('30000000-0000-0000-0000-000000000025','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','New York',      'New York Football Team B',     'NY Football B','NYB',  '#203731', 5.5),
  ('30000000-0000-0000-0000-000000000026','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Philadelphia',  'Philadelphia Football Team',   'PHI Football', 'PHI',  '#004C54', 3.5),
  ('30000000-0000-0000-0000-000000000027','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Pittsburgh',    'Pittsburgh Football Team',     'PIT Football', 'PIT',  '#FFB612', 3.5),
  ('30000000-0000-0000-0000-000000000028','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','San Francisco', 'San Francisco Football Team',  'SF Football',  'SF',   '#AA0000', 3.5),
  ('30000000-0000-0000-0000-000000000029','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Seattle',       'Seattle Football Team',        'SEA Football', 'SEA',  '#002244', 4.0),
  ('30000000-0000-0000-0000-000000000030','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Tampa Bay',     'Tampa Bay Football Team',      'TB Football',  'TB',   '#D50A0A', 4.5),
  ('30000000-0000-0000-0000-000000000031','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Tennessee',     'Tennessee Football Team',      'TEN Football', 'TEN',  '#4B92DB', 4.5),
  ('30000000-0000-0000-0000-000000000032','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Washington',    'Washington Football Team',     'WAS Football', 'WAS',  '#5A1414', 5.0)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- PLAYER ROLES — 32 teams × 5 roles = 160 total
-- Standard roles: QB1, WR1, RB1, Edge Rusher, LB1.
-- 8 featured teams retain their original role assignments (may
-- include TE1, CB1, DL1 in non-standard slots for variety).
-- All 24 remaining teams use the standard 5-role set.
-- Role UUID pattern: 40000000-0000-0000-{group}-00000000000{1-5}
--   where {group} matches the team sequential position (01-32),
--   except KC which historically used group 0001 (team pos = 16).
--   AZ uses group 0099 to avoid that collision.
-- ─────────────────────────────────────────────────────────────

-- ── Featured Team: Kansas City (team 16, role group 0001) ────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0001-000000000001','30000000-0000-0000-0000-000000000016','QB1',         'Kansas City QB1',           'Quarterback',  'KCQB1', 10, 4.0),
  ('40000000-0000-0000-0001-000000000002','30000000-0000-0000-0000-000000000016','TE1',         'Kansas City TE1',           'Tight End',    'KCTF1',  8, 5.0),
  ('40000000-0000-0000-0001-000000000003','30000000-0000-0000-0000-000000000016','WR1',         'Kansas City WR1',           'Wide Receiver','KCWR1',  7, 5.5),
  ('40000000-0000-0000-0001-000000000004','30000000-0000-0000-0000-000000000016','RB1',         'Kansas City RB1',           'Running Back', 'KCRB1',  6, 5.0),
  ('40000000-0000-0000-0001-000000000005','30000000-0000-0000-0000-000000000016','Edge Rusher', 'Kansas City Edge Rusher',   'Defensive End','KCER1',  7, 5.5)
on conflict do nothing;

-- ── Featured Team: Baltimore (team 03, role group 0003) ──────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0003-000000000001','30000000-0000-0000-0000-000000000003','QB1',         'Baltimore QB1',             'Quarterback',  'BALQB1',10, 4.0),
  ('40000000-0000-0000-0003-000000000002','30000000-0000-0000-0000-000000000003','WR1',         'Baltimore WR1',             'Wide Receiver','BALWR1', 7, 5.5),
  ('40000000-0000-0000-0003-000000000003','30000000-0000-0000-0000-000000000003','Edge Rusher', 'Baltimore Edge Rusher',     'Defensive End','BALER1', 8, 5.0),
  ('40000000-0000-0000-0003-000000000004','30000000-0000-0000-0000-000000000003','LB1',         'Baltimore LB1',             'Linebacker',   'BALLB1', 7, 5.0),
  ('40000000-0000-0000-0003-000000000005','30000000-0000-0000-0000-000000000003','RB1',         'Baltimore RB1',             'Running Back', 'BALRB1', 6, 5.5)
on conflict do nothing;

-- ── Featured Team: Detroit (team 11, role group 0011) ────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0011-000000000001','30000000-0000-0000-0000-000000000011','QB1',         'Detroit QB1',               'Quarterback',  'DETQB1', 9, 4.5),
  ('40000000-0000-0000-0011-000000000002','30000000-0000-0000-0000-000000000011','WR1',         'Detroit WR1',               'Wide Receiver','DETWR1', 9, 5.0),
  ('40000000-0000-0000-0011-000000000003','30000000-0000-0000-0000-000000000011','RB1',         'Detroit RB1',               'Running Back', 'DETRB1', 7, 5.5),
  ('40000000-0000-0000-0011-000000000004','30000000-0000-0000-0000-000000000011','TE1',         'Detroit TE1',               'Tight End',    'DETTE1', 6, 5.5),
  ('40000000-0000-0000-0011-000000000005','30000000-0000-0000-0000-000000000011','Edge Rusher', 'Detroit Edge Rusher',       'Defensive End','DETER1', 7, 5.5)
on conflict do nothing;

-- ── Featured Team: Dallas (team 09, role group 0009) ─────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0009-000000000001','30000000-0000-0000-0000-000000000009','QB1',         'Dallas QB1',                'Quarterback',  'DALQB1', 8, 5.0),
  ('40000000-0000-0000-0009-000000000002','30000000-0000-0000-0000-000000000009','Edge Rusher', 'Dallas Edge Rusher',        'Defensive End','DALER1',10, 5.5),
  ('40000000-0000-0000-0009-000000000003','30000000-0000-0000-0000-000000000009','WR1',         'Dallas WR1',                'Wide Receiver','DALWR1', 8, 5.5),
  ('40000000-0000-0000-0009-000000000004','30000000-0000-0000-0000-000000000009','RB1',         'Dallas RB1',                'Running Back', 'DALRB1', 6, 5.5),
  ('40000000-0000-0000-0009-000000000005','30000000-0000-0000-0000-000000000009','CB1',         'Dallas CB1',                'Cornerback',   'DALCB1', 6, 6.0)
on conflict do nothing;

-- ── Featured Team: San Francisco (team 28, role group 0028) ──
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0028-000000000001','30000000-0000-0000-0000-000000000028','QB1',         'San Francisco QB1',         'Quarterback',  'SFQB1',  9, 4.5),
  ('40000000-0000-0000-0028-000000000002','30000000-0000-0000-0000-000000000028','WR1',         'San Francisco WR1',         'Wide Receiver','SFWR1',  8, 5.5),
  ('40000000-0000-0000-0028-000000000003','30000000-0000-0000-0000-000000000028','RB1',         'San Francisco RB1',         'Running Back', 'SFRB1',  8, 5.5),
  ('40000000-0000-0000-0028-000000000004','30000000-0000-0000-0000-000000000028','TE1',         'San Francisco TE1',         'Tight End',    'SFTE1',  6, 5.5),
  ('40000000-0000-0000-0028-000000000005','30000000-0000-0000-0000-000000000028','DL1',         'San Francisco DL1',         'Defensive Line','SFDL1', 7, 5.0)
on conflict do nothing;

-- ── Featured Team: Buffalo (team 04, role group 0004) ────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0004-000000000001','30000000-0000-0000-0000-000000000004','QB1',         'Buffalo QB1',               'Quarterback',  'BUFQB1',10, 4.0),
  ('40000000-0000-0000-0004-000000000002','30000000-0000-0000-0000-000000000004','WR1',         'Buffalo WR1',               'Wide Receiver','BUFWR1', 8, 5.0),
  ('40000000-0000-0000-0004-000000000003','30000000-0000-0000-0000-000000000004','TE1',         'Buffalo TE1',               'Tight End',    'BUFTE1', 7, 5.5),
  ('40000000-0000-0000-0004-000000000004','30000000-0000-0000-0000-000000000004','RB1',         'Buffalo RB1',               'Running Back', 'BUFRB1', 6, 5.5),
  ('40000000-0000-0000-0004-000000000005','30000000-0000-0000-0000-000000000004','CB1',         'Buffalo CB1',               'Cornerback',   'BUFCB1', 6, 6.0)
on conflict do nothing;

-- ── Featured Team: Philadelphia (team 26, role group 0026) ───
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0026-000000000001','30000000-0000-0000-0000-000000000026','QB1',         'Philadelphia QB1',          'Quarterback',  'PHIQB1',10, 4.0),
  ('40000000-0000-0000-0026-000000000002','30000000-0000-0000-0000-000000000026','WR1',         'Philadelphia WR1',          'Wide Receiver','PHIWR1', 8, 5.0),
  ('40000000-0000-0000-0026-000000000003','30000000-0000-0000-0000-000000000026','Edge Rusher', 'Philadelphia Edge Rusher',  'Defensive End','PHIER1', 8, 5.5),
  ('40000000-0000-0000-0026-000000000004','30000000-0000-0000-0000-000000000026','RB1',         'Philadelphia RB1',          'Running Back', 'PHIRB1', 6, 5.5),
  ('40000000-0000-0000-0026-000000000005','30000000-0000-0000-0000-000000000026','TE1',         'Philadelphia TE1',          'Tight End',    'PHITE1', 7, 5.5)
on conflict do nothing;

-- ── Featured Team: Las Vegas (team 17, role group 0017) ──────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0017-000000000001','30000000-0000-0000-0000-000000000017','QB1',         'Las Vegas QB1',             'Quarterback',  'LVQB1',  8, 5.0),
  ('40000000-0000-0000-0017-000000000002','30000000-0000-0000-0000-000000000017','RB1',         'Las Vegas RB1',             'Running Back', 'LVRB1',  8, 5.5),
  ('40000000-0000-0000-0017-000000000003','30000000-0000-0000-0000-000000000017','WR1',         'Las Vegas WR1',             'Wide Receiver','LVWR1',  7, 5.5),
  ('40000000-0000-0000-0017-000000000004','30000000-0000-0000-0000-000000000017','TE1',         'Las Vegas TE1',             'Tight End',    'LVTE1',  6, 5.5),
  ('40000000-0000-0000-0017-000000000005','30000000-0000-0000-0000-000000000017','Edge Rusher', 'Las Vegas Edge Rusher',     'Defensive End','LVER1',  7, 6.0)
on conflict do nothing;

-- ── Arizona (team 01, role group 0099 — avoids KC group 0001) ─
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0099-000000000001','30000000-0000-0000-0000-000000000001','QB1',         'Arizona QB1',               'Quarterback',  'AZQB1',  7, 5.0),
  ('40000000-0000-0000-0099-000000000002','30000000-0000-0000-0000-000000000001','WR1',         'Arizona WR1',               'Wide Receiver','AZWR1',  6, 5.5),
  ('40000000-0000-0000-0099-000000000003','30000000-0000-0000-0000-000000000001','RB1',         'Arizona RB1',               'Running Back', 'AZRB1',  5, 5.5),
  ('40000000-0000-0000-0099-000000000004','30000000-0000-0000-0000-000000000001','Edge Rusher', 'Arizona Edge Rusher',       'Defensive End','AZER1',  6, 6.0),
  ('40000000-0000-0000-0099-000000000005','30000000-0000-0000-0000-000000000001','LB1',         'Arizona LB1',               'Linebacker',   'AZLB1',  5, 5.5)
on conflict do nothing;

-- ── Atlanta (team 02, role group 0002) ───────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0002-000000000001','30000000-0000-0000-0000-000000000002','QB1',         'Atlanta QB1',               'Quarterback',  'ATLQB1', 8, 5.0),
  ('40000000-0000-0000-0002-000000000002','30000000-0000-0000-0000-000000000002','WR1',         'Atlanta WR1',               'Wide Receiver','ATLWR1', 7, 5.5),
  ('40000000-0000-0000-0002-000000000003','30000000-0000-0000-0000-000000000002','RB1',         'Atlanta RB1',               'Running Back', 'ATLRB1', 6, 5.5),
  ('40000000-0000-0000-0002-000000000004','30000000-0000-0000-0000-000000000002','Edge Rusher', 'Atlanta Edge Rusher',       'Defensive End','ATLER1', 6, 6.0),
  ('40000000-0000-0000-0002-000000000005','30000000-0000-0000-0000-000000000002','LB1',         'Atlanta LB1',               'Linebacker',   'ATLLB1', 5, 5.5)
on conflict do nothing;

-- ── Carolina (team 05, role group 0005) ──────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0005-000000000001','30000000-0000-0000-0000-000000000005','QB1',         'Carolina QB1',              'Quarterback',  'CARQB1', 6, 6.0),
  ('40000000-0000-0000-0005-000000000002','30000000-0000-0000-0000-000000000005','WR1',         'Carolina WR1',              'Wide Receiver','CARWR1', 6, 6.0),
  ('40000000-0000-0000-0005-000000000003','30000000-0000-0000-0000-000000000005','RB1',         'Carolina RB1',              'Running Back', 'CARRB1', 5, 6.0),
  ('40000000-0000-0000-0005-000000000004','30000000-0000-0000-0000-000000000005','Edge Rusher', 'Carolina Edge Rusher',      'Defensive End','CARER1', 6, 6.5),
  ('40000000-0000-0000-0005-000000000005','30000000-0000-0000-0000-000000000005','LB1',         'Carolina LB1',              'Linebacker',   'CARLB1', 5, 6.0)
on conflict do nothing;

-- ── Chicago (team 06, role group 0006) ───────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0006-000000000001','30000000-0000-0000-0000-000000000006','QB1',         'Chicago QB1',               'Quarterback',  'CHIQB1', 7, 5.0),
  ('40000000-0000-0000-0006-000000000002','30000000-0000-0000-0000-000000000006','WR1',         'Chicago WR1',               'Wide Receiver','CHIWR1', 7, 5.5),
  ('40000000-0000-0000-0006-000000000003','30000000-0000-0000-0000-000000000006','RB1',         'Chicago RB1',               'Running Back', 'CHIRB1', 5, 5.5),
  ('40000000-0000-0000-0006-000000000004','30000000-0000-0000-0000-000000000006','Edge Rusher', 'Chicago Edge Rusher',       'Defensive End','CHIER1', 7, 5.5),
  ('40000000-0000-0000-0006-000000000005','30000000-0000-0000-0000-000000000006','LB1',         'Chicago LB1',               'Linebacker',   'CHILB1', 6, 5.5)
on conflict do nothing;

-- ── Cincinnati (team 07, role group 0007) ────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0007-000000000001','30000000-0000-0000-0000-000000000007','QB1',         'Cincinnati QB1',            'Quarterback',  'CINQB1', 9, 5.0),
  ('40000000-0000-0000-0007-000000000002','30000000-0000-0000-0000-000000000007','WR1',         'Cincinnati WR1',            'Wide Receiver','CINWR1', 8, 5.5),
  ('40000000-0000-0000-0007-000000000003','30000000-0000-0000-0000-000000000007','RB1',         'Cincinnati RB1',            'Running Back', 'CINRB1', 6, 5.5),
  ('40000000-0000-0000-0007-000000000004','30000000-0000-0000-0000-000000000007','Edge Rusher', 'Cincinnati Edge Rusher',    'Defensive End','CINER1', 7, 5.5),
  ('40000000-0000-0000-0007-000000000005','30000000-0000-0000-0000-000000000007','LB1',         'Cincinnati LB1',            'Linebacker',   'CINLB1', 6, 5.5)
on conflict do nothing;

-- ── Cleveland (team 08, role group 0008) ─────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0008-000000000001','30000000-0000-0000-0000-000000000008','QB1',         'Cleveland QB1',             'Quarterback',  'CLEQB1', 7, 5.5),
  ('40000000-0000-0000-0008-000000000002','30000000-0000-0000-0000-000000000008','WR1',         'Cleveland WR1',             'Wide Receiver','CLEWR1', 7, 6.0),
  ('40000000-0000-0000-0008-000000000003','30000000-0000-0000-0000-000000000008','RB1',         'Cleveland RB1',             'Running Back', 'CLERB1', 7, 5.5),
  ('40000000-0000-0000-0008-000000000004','30000000-0000-0000-0000-000000000008','Edge Rusher', 'Cleveland Edge Rusher',     'Defensive End','CLEER1', 7, 6.0),
  ('40000000-0000-0000-0008-000000000005','30000000-0000-0000-0000-000000000008','LB1',         'Cleveland LB1',             'Linebacker',   'CLELB1', 6, 5.5)
on conflict do nothing;

-- ── Denver (team 10, role group 0010) ────────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0010-000000000001','30000000-0000-0000-0000-000000000010','QB1',         'Denver QB1',                'Quarterback',  'DENQB1', 7, 5.5),
  ('40000000-0000-0000-0010-000000000002','30000000-0000-0000-0000-000000000010','WR1',         'Denver WR1',                'Wide Receiver','DENWR1', 6, 5.5),
  ('40000000-0000-0000-0010-000000000003','30000000-0000-0000-0000-000000000010','RB1',         'Denver RB1',                'Running Back', 'DENRB1', 5, 5.5),
  ('40000000-0000-0000-0010-000000000004','30000000-0000-0000-0000-000000000010','Edge Rusher', 'Denver Edge Rusher',        'Defensive End','DENER1', 7, 5.5),
  ('40000000-0000-0000-0010-000000000005','30000000-0000-0000-0000-000000000010','LB1',         'Denver LB1',                'Linebacker',   'DENLB1', 6, 5.5)
on conflict do nothing;

-- ── Green Bay (team 12, role group 0012) ─────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0012-000000000001','30000000-0000-0000-0000-000000000012','QB1',         'Green Bay QB1',             'Quarterback',  'GBQB1',  9, 4.0),
  ('40000000-0000-0000-0012-000000000002','30000000-0000-0000-0000-000000000012','WR1',         'Green Bay WR1',             'Wide Receiver','GBWR1',  8, 4.5),
  ('40000000-0000-0000-0012-000000000003','30000000-0000-0000-0000-000000000012','RB1',         'Green Bay RB1',             'Running Back', 'GBRB1',  6, 4.5),
  ('40000000-0000-0000-0012-000000000004','30000000-0000-0000-0000-000000000012','Edge Rusher', 'Green Bay Edge Rusher',     'Defensive End','GBER1',  8, 4.5),
  ('40000000-0000-0000-0012-000000000005','30000000-0000-0000-0000-000000000012','LB1',         'Green Bay LB1',             'Linebacker',   'GBLB1',  6, 4.5)
on conflict do nothing;

-- ── Houston (team 13, role group 0013) ───────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0013-000000000001','30000000-0000-0000-0000-000000000013','QB1',         'Houston QB1',               'Quarterback',  'HOUQB1', 9, 5.0),
  ('40000000-0000-0000-0013-000000000002','30000000-0000-0000-0000-000000000013','WR1',         'Houston WR1',               'Wide Receiver','HOUWR1', 7, 5.5),
  ('40000000-0000-0000-0013-000000000003','30000000-0000-0000-0000-000000000013','RB1',         'Houston RB1',               'Running Back', 'HOURB1', 6, 5.5),
  ('40000000-0000-0000-0013-000000000004','30000000-0000-0000-0000-000000000013','Edge Rusher', 'Houston Edge Rusher',       'Defensive End','HOUER1', 7, 5.5),
  ('40000000-0000-0000-0013-000000000005','30000000-0000-0000-0000-000000000013','LB1',         'Houston LB1',               'Linebacker',   'HOULB1', 6, 5.5)
on conflict do nothing;

-- ── Indianapolis (team 14, role group 0014) ──────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0014-000000000001','30000000-0000-0000-0000-000000000014','QB1',         'Indianapolis QB1',          'Quarterback',  'INDQB1', 7, 5.0),
  ('40000000-0000-0000-0014-000000000002','30000000-0000-0000-0000-000000000014','WR1',         'Indianapolis WR1',          'Wide Receiver','INDWR1', 6, 5.5),
  ('40000000-0000-0000-0014-000000000003','30000000-0000-0000-0000-000000000014','RB1',         'Indianapolis RB1',          'Running Back', 'INDRB1', 7, 5.0),
  ('40000000-0000-0000-0014-000000000004','30000000-0000-0000-0000-000000000014','Edge Rusher', 'Indianapolis Edge Rusher',  'Defensive End','INDER1', 6, 5.5),
  ('40000000-0000-0000-0014-000000000005','30000000-0000-0000-0000-000000000014','LB1',         'Indianapolis LB1',          'Linebacker',   'INDLB1', 6, 5.5)
on conflict do nothing;

-- ── Jacksonville (team 15, role group 0015) ──────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0015-000000000001','30000000-0000-0000-0000-000000000015','QB1',         'Jacksonville QB1',          'Quarterback',  'JAXQB1', 6, 5.5),
  ('40000000-0000-0000-0015-000000000002','30000000-0000-0000-0000-000000000015','WR1',         'Jacksonville WR1',          'Wide Receiver','JAXWR1', 6, 6.0),
  ('40000000-0000-0000-0015-000000000003','30000000-0000-0000-0000-000000000015','RB1',         'Jacksonville RB1',          'Running Back', 'JAXRB1', 5, 6.0),
  ('40000000-0000-0000-0015-000000000004','30000000-0000-0000-0000-000000000015','Edge Rusher', 'Jacksonville Edge Rusher',  'Defensive End','JAXER1', 6, 6.0),
  ('40000000-0000-0000-0015-000000000005','30000000-0000-0000-0000-000000000015','LB1',         'Jacksonville LB1',          'Linebacker',   'JAXLB1', 5, 6.0)
on conflict do nothing;

-- ── Los Angeles A (team 18, role group 0018) ─────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0018-000000000001','30000000-0000-0000-0000-000000000018','QB1',         'Los Angeles A QB1',         'Quarterback',  'LAAQB1', 8, 4.5),
  ('40000000-0000-0000-0018-000000000002','30000000-0000-0000-0000-000000000018','WR1',         'Los Angeles A WR1',         'Wide Receiver','LAAWR1', 7, 5.0),
  ('40000000-0000-0000-0018-000000000003','30000000-0000-0000-0000-000000000018','RB1',         'Los Angeles A RB1',         'Running Back', 'LAARB1', 6, 5.5),
  ('40000000-0000-0000-0018-000000000004','30000000-0000-0000-0000-000000000018','Edge Rusher', 'Los Angeles A Edge Rusher', 'Defensive End','LAAER1', 7, 5.0),
  ('40000000-0000-0000-0018-000000000005','30000000-0000-0000-0000-000000000018','LB1',         'Los Angeles A LB1',         'Linebacker',   'LAALB1', 6, 5.0)
on conflict do nothing;

-- ── Los Angeles B (team 19, role group 0019) ─────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0019-000000000001','30000000-0000-0000-0000-000000000019','QB1',         'Los Angeles B QB1',         'Quarterback',  'LABQB1', 7, 5.5),
  ('40000000-0000-0000-0019-000000000002','30000000-0000-0000-0000-000000000019','WR1',         'Los Angeles B WR1',         'Wide Receiver','LABWR1', 6, 5.5),
  ('40000000-0000-0000-0019-000000000003','30000000-0000-0000-0000-000000000019','RB1',         'Los Angeles B RB1',         'Running Back', 'LABRB1', 6, 5.5),
  ('40000000-0000-0000-0019-000000000004','30000000-0000-0000-0000-000000000019','Edge Rusher', 'Los Angeles B Edge Rusher', 'Defensive End','LABER1', 7, 6.0),
  ('40000000-0000-0000-0019-000000000005','30000000-0000-0000-0000-000000000019','LB1',         'Los Angeles B LB1',         'Linebacker',   'LABLB1', 5, 5.5)
on conflict do nothing;

-- ── Miami (team 20, role group 0020) ─────────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0020-000000000001','30000000-0000-0000-0000-000000000020','QB1',         'Miami QB1',                 'Quarterback',  'MIAQB1', 8, 4.5),
  ('40000000-0000-0000-0020-000000000002','30000000-0000-0000-0000-000000000020','WR1',         'Miami WR1',                 'Wide Receiver','MIAWR1', 7, 5.0),
  ('40000000-0000-0000-0020-000000000003','30000000-0000-0000-0000-000000000020','RB1',         'Miami RB1',                 'Running Back', 'MIARB1', 6, 5.5),
  ('40000000-0000-0000-0020-000000000004','30000000-0000-0000-0000-000000000020','Edge Rusher', 'Miami Edge Rusher',         'Defensive End','MIAER1', 7, 5.5),
  ('40000000-0000-0000-0020-000000000005','30000000-0000-0000-0000-000000000020','LB1',         'Miami LB1',                 'Linebacker',   'MIALB1', 6, 5.5)
on conflict do nothing;

-- ── Minnesota (team 21, role group 0021) ─────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0021-000000000001','30000000-0000-0000-0000-000000000021','QB1',         'Minnesota QB1',             'Quarterback',  'MINQB1', 8, 4.5),
  ('40000000-0000-0000-0021-000000000002','30000000-0000-0000-0000-000000000021','WR1',         'Minnesota WR1',             'Wide Receiver','MINWR1', 8, 5.0),
  ('40000000-0000-0000-0021-000000000003','30000000-0000-0000-0000-000000000021','RB1',         'Minnesota RB1',             'Running Back', 'MINRB1', 6, 5.0),
  ('40000000-0000-0000-0021-000000000004','30000000-0000-0000-0000-000000000021','Edge Rusher', 'Minnesota Edge Rusher',     'Defensive End','MINER1', 7, 5.5),
  ('40000000-0000-0000-0021-000000000005','30000000-0000-0000-0000-000000000021','LB1',         'Minnesota LB1',             'Linebacker',   'MINLB1', 6, 5.0)
on conflict do nothing;

-- ── New England (team 22, role group 0022) ───────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0022-000000000001','30000000-0000-0000-0000-000000000022','QB1',         'New England QB1',           'Quarterback',  'NEQB1',  7, 4.5),
  ('40000000-0000-0000-0022-000000000002','30000000-0000-0000-0000-000000000022','WR1',         'New England WR1',           'Wide Receiver','NEWR1',  6, 5.0),
  ('40000000-0000-0000-0022-000000000003','30000000-0000-0000-0000-000000000022','RB1',         'New England RB1',           'Running Back', 'NERB1',  5, 5.0),
  ('40000000-0000-0000-0022-000000000004','30000000-0000-0000-0000-000000000022','Edge Rusher', 'New England Edge Rusher',   'Defensive End','NEER1',  6, 5.0),
  ('40000000-0000-0000-0022-000000000005','30000000-0000-0000-0000-000000000022','LB1',         'New England LB1',           'Linebacker',   'NELB1',  6, 4.5)
on conflict do nothing;

-- ── New Orleans (team 23, role group 0023) ───────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0023-000000000001','30000000-0000-0000-0000-000000000023','QB1',         'New Orleans QB1',           'Quarterback',  'NOQB1',  7, 4.5),
  ('40000000-0000-0000-0023-000000000002','30000000-0000-0000-0000-000000000023','WR1',         'New Orleans WR1',           'Wide Receiver','NOWR1',  6, 5.0),
  ('40000000-0000-0000-0023-000000000003','30000000-0000-0000-0000-000000000023','RB1',         'New Orleans RB1',           'Running Back', 'NORB1',  6, 5.0),
  ('40000000-0000-0000-0023-000000000004','30000000-0000-0000-0000-000000000023','Edge Rusher', 'New Orleans Edge Rusher',   'Defensive End','NOER1',  6, 5.0),
  ('40000000-0000-0000-0023-000000000005','30000000-0000-0000-0000-000000000023','LB1',         'New Orleans LB1',           'Linebacker',   'NOLB1',  5, 5.0)
on conflict do nothing;

-- ── New York A (team 24, role group 0024) ────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0024-000000000001','30000000-0000-0000-0000-000000000024','QB1',         'New York A QB1',            'Quarterback',  'NYAQB1', 7, 5.0),
  ('40000000-0000-0000-0024-000000000002','30000000-0000-0000-0000-000000000024','WR1',         'New York A WR1',            'Wide Receiver','NYAWR1', 6, 5.5),
  ('40000000-0000-0000-0024-000000000003','30000000-0000-0000-0000-000000000024','RB1',         'New York A RB1',            'Running Back', 'NYARB1', 5, 5.5),
  ('40000000-0000-0000-0024-000000000004','30000000-0000-0000-0000-000000000024','Edge Rusher', 'New York A Edge Rusher',    'Defensive End','NYAER1', 6, 5.5),
  ('40000000-0000-0000-0024-000000000005','30000000-0000-0000-0000-000000000024','LB1',         'New York A LB1',            'Linebacker',   'NYALB1', 5, 5.5)
on conflict do nothing;

-- ── New York B (team 25, role group 0025) ────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0025-000000000001','30000000-0000-0000-0000-000000000025','QB1',         'New York B QB1',            'Quarterback',  'NYBQB1', 6, 5.5),
  ('40000000-0000-0000-0025-000000000002','30000000-0000-0000-0000-000000000025','WR1',         'New York B WR1',            'Wide Receiver','NYBWR1', 5, 6.0),
  ('40000000-0000-0000-0025-000000000003','30000000-0000-0000-0000-000000000025','RB1',         'New York B RB1',            'Running Back', 'NYBRB1', 5, 6.0),
  ('40000000-0000-0000-0025-000000000004','30000000-0000-0000-0000-000000000025','Edge Rusher', 'New York B Edge Rusher',    'Defensive End','NYBER1', 6, 6.0),
  ('40000000-0000-0000-0025-000000000005','30000000-0000-0000-0000-000000000025','LB1',         'New York B LB1',            'Linebacker',   'NYBLB1', 5, 6.0)
on conflict do nothing;

-- ── Pittsburgh (team 27, role group 0027) ────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0027-000000000001','30000000-0000-0000-0000-000000000027','QB1',         'Pittsburgh QB1',            'Quarterback',  'PITQB1', 8, 4.0),
  ('40000000-0000-0000-0027-000000000002','30000000-0000-0000-0000-000000000027','WR1',         'Pittsburgh WR1',            'Wide Receiver','PITWR1', 7, 4.5),
  ('40000000-0000-0000-0027-000000000003','30000000-0000-0000-0000-000000000027','RB1',         'Pittsburgh RB1',            'Running Back', 'PITRB1', 6, 4.5),
  ('40000000-0000-0000-0027-000000000004','30000000-0000-0000-0000-000000000027','Edge Rusher', 'Pittsburgh Edge Rusher',    'Defensive End','PITER1', 8, 4.5),
  ('40000000-0000-0000-0027-000000000005','30000000-0000-0000-0000-000000000027','LB1',         'Pittsburgh LB1',            'Linebacker',   'PITLB1', 7, 4.5)
on conflict do nothing;

-- ── Seattle (team 29, role group 0029) ───────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0029-000000000001','30000000-0000-0000-0000-000000000029','QB1',         'Seattle QB1',               'Quarterback',  'SEAQB1', 8, 4.0),
  ('40000000-0000-0000-0029-000000000002','30000000-0000-0000-0000-000000000029','WR1',         'Seattle WR1',               'Wide Receiver','SEAWR1', 7, 4.5),
  ('40000000-0000-0000-0029-000000000003','30000000-0000-0000-0000-000000000029','RB1',         'Seattle RB1',               'Running Back', 'SEARB1', 6, 5.0),
  ('40000000-0000-0000-0029-000000000004','30000000-0000-0000-0000-000000000029','Edge Rusher', 'Seattle Edge Rusher',       'Defensive End','SEAER1', 7, 5.0),
  ('40000000-0000-0000-0029-000000000005','30000000-0000-0000-0000-000000000029','LB1',         'Seattle LB1',               'Linebacker',   'SEALB1', 6, 4.5)
on conflict do nothing;

-- ── Tampa Bay (team 30, role group 0030) ─────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0030-000000000001','30000000-0000-0000-0000-000000000030','QB1',         'Tampa Bay QB1',             'Quarterback',  'TBQB1',  7, 4.5),
  ('40000000-0000-0000-0030-000000000002','30000000-0000-0000-0000-000000000030','WR1',         'Tampa Bay WR1',             'Wide Receiver','TBWR1',  7, 5.0),
  ('40000000-0000-0000-0030-000000000003','30000000-0000-0000-0000-000000000030','RB1',         'Tampa Bay RB1',             'Running Back', 'TBRB1',  5, 5.0),
  ('40000000-0000-0000-0030-000000000004','30000000-0000-0000-0000-000000000030','Edge Rusher', 'Tampa Bay Edge Rusher',     'Defensive End','TBER1',  6, 5.0),
  ('40000000-0000-0000-0030-000000000005','30000000-0000-0000-0000-000000000030','LB1',         'Tampa Bay LB1',             'Linebacker',   'TBLB1',  6, 5.0)
on conflict do nothing;

-- ── Tennessee (team 31, role group 0031) ─────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0031-000000000001','30000000-0000-0000-0000-000000000031','QB1',         'Tennessee QB1',             'Quarterback',  'TENQB1', 7, 4.5),
  ('40000000-0000-0000-0031-000000000002','30000000-0000-0000-0000-000000000031','WR1',         'Tennessee WR1',             'Wide Receiver','TENWR1', 6, 5.0),
  ('40000000-0000-0000-0031-000000000003','30000000-0000-0000-0000-000000000031','RB1',         'Tennessee RB1',             'Running Back', 'TENRB1', 6, 5.0),
  ('40000000-0000-0000-0031-000000000004','30000000-0000-0000-0000-000000000031','Edge Rusher', 'Tennessee Edge Rusher',     'Defensive End','TENER1', 7, 5.0),
  ('40000000-0000-0000-0031-000000000005','30000000-0000-0000-0000-000000000031','LB1',         'Tennessee LB1',             'Linebacker',   'TENLB1', 6, 5.0)
on conflict do nothing;

-- ── Washington (team 32, role group 0032) ────────────────────
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0032-000000000001','30000000-0000-0000-0000-000000000032','QB1',         'Washington QB1',            'Quarterback',  'WASQB1', 7, 5.0),
  ('40000000-0000-0000-0032-000000000002','30000000-0000-0000-0000-000000000032','WR1',         'Washington WR1',            'Wide Receiver','WASWR1', 6, 5.5),
  ('40000000-0000-0000-0032-000000000003','30000000-0000-0000-0000-000000000032','RB1',         'Washington RB1',            'Running Back', 'WASRB1', 5, 5.5),
  ('40000000-0000-0000-0032-000000000004','30000000-0000-0000-0000-000000000032','Edge Rusher', 'Washington Edge Rusher',    'Defensive End','WASER1', 6, 5.5),
  ('40000000-0000-0000-0032-000000000005','30000000-0000-0000-0000-000000000032','LB1',         'Washington LB1',            'Linebacker',   'WASLB1', 5, 5.5)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- COACH ROLES (global archetypes + 3 featured-team coaches)
-- ─────────────────────────────────────────────────────────────
insert into public.coach_roles
  (id, team_id, public_name, coach_archetype, risk_baseline)
values
  ('50000000-0000-0000-0000-000000000001', null,                                   'Offensive Mastermind Coach Stock', 'offensive', 4.5),
  ('50000000-0000-0000-0000-000000000002', null,                                   'Defensive Architect Coach Stock',  'defensive', 4.5),
  ('50000000-0000-0000-0000-000000000003', null,                                   'Hot Seat Coach Stock',             'hot_seat',  8.0),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000016', 'Kansas City OC Stock',             'offensive', 4.0),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000026', 'Philadelphia OC Stock',            'offensive', 4.0),
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003', 'Baltimore DC Stock',               'defensive', 4.0)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- TEAM STOCK ASSETS — 32 total (one per Pro Football team)
-- Asset UUID pattern: 60000000-0000-{team_pos:04d}-0004-000000000001
-- Symbol pattern: {prefix}FT  e.g. KCFT, PHIFT, LAAFT, NYAFT
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0001-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',
   'AZFT','Arizona Football Team Stock','Pro Football Team · Arizona',
   'Tracks the simulated market performance of the Arizona football franchise. Rebuilding phase with developing roster depth and long-term upside potential.',
   'Team stocks bundle franchise performance — wins, roster moves, and fan sentiment. They move more slowly than player coins but compound across a full simulated season.',
   4.5,'neutral',145.00,-0.4,'active','["pro-football","team-stock","arizona"]'::jsonb),

  ('60000000-0000-0002-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002',
   'ATLFT','Atlanta Football Team Stock','Pro Football Team · Atlanta',
   'Tracks the simulated market performance of the Atlanta football franchise. Volatile roster construction cycle with boom-or-bust season potential.',
   'Volatile team stocks can move sharply in either direction around big moments. Position sizing matters more with high-risk franchises.',
   5.0,'neutral',175.00,-0.7,'active','["pro-football","team-stock","atlanta"]'::jsonb),

  ('60000000-0000-0003-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003',
   'BALFT','Baltimore Football Team Stock','Pro Football Team · Baltimore',
   'Tracks the simulated market performance of the Baltimore football franchise. Elite two-way roster in a sustained championship-contending window.',
   'Championship-window franchises offer lower volatility and more reliable upside. Their team stocks anchor well-balanced portfolios.',
   3.5,'bullish',410.00,1.5,'active','["pro-football","team-stock","baltimore"]'::jsonb),

  ('60000000-0000-0004-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004',
   'BUFFT','Buffalo Football Team Stock','Pro Football Team · Buffalo',
   'Tracks the simulated market performance of the Buffalo football franchise. Deep roster with consistent playoff narrative driving sustained demand.',
   'Franchises with entrenched fan narrative often trade at a premium. Consistent playoff appearances keep team stocks elevated.',
   4.0,'bullish',370.00,1.2,'active','["pro-football","team-stock","buffalo"]'::jsonb),

  ('60000000-0000-0005-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005',
   'CARFT','Carolina Football Team Stock','Pro Football Team · Carolina',
   'Tracks the simulated market performance of the Carolina football franchise. Full rebuild underway — high risk, speculative upside.',
   'Rebuilding franchises carry higher volatility. Early-stage upside is real but so is the downside — size positions carefully.',
   5.5,'bearish',118.00,-3.1,'active','["pro-football","team-stock","carolina"]'::jsonb),

  ('60000000-0000-0006-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006',
   'CHIFT','Chicago Football Team Stock','Pro Football Team · Chicago',
   'Tracks the simulated market performance of the Chicago football franchise. Roster overhaul in progress with young-core optimism driving early momentum.',
   'Young-core rebuilds can generate speculative upside early. Watch for roster moves and draft results to confirm the narrative.',
   4.5,'neutral',138.00,1.2,'active','["pro-football","team-stock","chicago"]'::jsonb),

  ('60000000-0000-0007-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007',
   'CINFT','Cincinnati Football Team Stock','Pro Football Team · Cincinnati',
   'Tracks the simulated market performance of the Cincinnati football franchise. Proven offensive core with playoff momentum and rising market sentiment.',
   'Offensive-led franchises with a reliable QB anchor tend to sustain team stock growth through full simulated seasons.',
   5.0,'bullish',240.00,1.4,'active','["pro-football","team-stock","cincinnati"]'::jsonb),

  ('60000000-0000-0008-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008',
   'CLEFT','Cleveland Football Team Stock','Pro Football Team · Cleveland',
   'Tracks the simulated market performance of the Cleveland football franchise. Competitive roster with inconsistent results creating volatile pricing windows.',
   'Inconsistency creates both risk and opportunity. Volatile team stocks can be timed around narrative shifts.',
   5.5,'neutral',165.00,-0.8,'active','["pro-football","team-stock","cleveland"]'::jsonb),

  ('60000000-0000-0009-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009',
   'DALFT','Dallas Football Team Stock','Pro Football Team · Dallas',
   'Tracks the simulated market performance of the Dallas football franchise. High-brand franchise with strong market sentiment even in mixed performance years.',
   'Brand premium is real in simulated markets. High-profile franchises trade at elevated prices even when on-field results are mixed.',
   3.5,'neutral',355.00,-0.3,'active','["pro-football","team-stock","dallas"]'::jsonb),

  ('60000000-0000-0010-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010',
   'DENFT','Denver Football Team Stock','Pro Football Team · Denver',
   'Tracks the simulated market performance of the Denver football franchise. Post-dynasty transition period with uncertain QB narrative weighing on sentiment.',
   'Franchise transitions around key positions create pricing uncertainty. QB1 narrative changes often move team stocks more than game results.',
   5.0,'bearish',150.00,-2.4,'active','["pro-football","team-stock","denver"]'::jsonb),

  ('60000000-0000-0011-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011',
   'DETFT','Detroit Football Team Stock','Pro Football Team · Detroit',
   'Tracks the simulated market performance of the Detroit football franchise. Rising contender with an elite offensive core generating strong market momentum.',
   'Ascending franchises in their first contention window often outperform the market. Early positioning in rising teams is a key simulated strategy.',
   4.0,'bullish',380.00,2.4,'active','["pro-football","team-stock","detroit"]'::jsonb),

  ('60000000-0000-0012-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012',
   'GBFT','Green Bay Football Team Stock','Pro Football Team · Green Bay',
   'Tracks the simulated market performance of the Green Bay football franchise. Storied franchise with deep roots and a consistent competitive baseline.',
   'Storied franchises tend to trade at lower volatility than average. Their established narrative creates pricing stability.',
   3.5,'neutral',330.00,0.4,'active','["pro-football","team-stock","green-bay"]'::jsonb),

  ('60000000-0000-0013-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013',
   'HOUFT','Houston Football Team Stock','Pro Football Team · Houston',
   'Tracks the simulated market performance of the Houston football franchise. Young roster in an accelerating growth phase with strong recent results.',
   'Growth-phase franchises can outperform during their ascent window. Rising sentiment compounds quickly when backed by actual results.',
   5.0,'bullish',250.00,3.2,'active','["pro-football","team-stock","houston"]'::jsonb),

  ('60000000-0000-0014-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014',
   'INDFT','Indianapolis Football Team Stock','Pro Football Team · Indianapolis',
   'Tracks the simulated market performance of the Indianapolis football franchise. Solid roster with balanced risk — competitive but not yet elite.',
   'Balanced-risk team stocks are useful anchors in a diversified portfolio. They move with the broader pro football market without extreme swings.',
   4.5,'neutral',215.00,0.5,'active','["pro-football","team-stock","indianapolis"]'::jsonb),

  ('60000000-0000-0015-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015',
   'JAXFT','Jacksonville Football Team Stock','Pro Football Team · Jacksonville',
   'Tracks the simulated market performance of the Jacksonville football franchise. Developing roster with speculative upside in a longer rebuild cycle.',
   'Long-cycle rebuilds reward patient positioning. Early entry carries risk, but franchise inflection points can deliver outsized returns.',
   5.5,'neutral',125.00,-1.4,'active','["pro-football","team-stock","jacksonville"]'::jsonb),

  ('60000000-0000-0016-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016',
   'KCFT','Kansas City Football Team Stock','Pro Football Team · Kansas City',
   'Tracks the simulated market performance of the Kansas City football franchise. Multi-year championship window with dominant market narrative and broad fan base.',
   'Dominant franchises sustain premium pricing across full seasons. Lower volatility comes with the trade-off of already-elevated entry price.',
   3.0,'bullish',480.00,2.1,'active','["pro-football","team-stock","kansas-city"]'::jsonb),

  ('60000000-0000-0017-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017',
   'LVFT','Las Vegas Football Team Stock','Pro Football Team · Las Vegas',
   'Tracks the simulated market performance of the Las Vegas football franchise. Volatile market with mixed roster results and high-narrative surrounding the franchise.',
   'High-narrative franchises attract sentiment-driven pricing. Price swings around storylines can exceed actual performance changes.',
   5.0,'neutral',190.00,-1.2,'active','["pro-football","team-stock","las-vegas"]'::jsonb),

  ('60000000-0000-0018-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018',
   'LAAFT','Los Angeles Football Team A Stock','Pro Football Team A · Los Angeles',
   'Tracks the simulated market performance of the Los Angeles A football franchise. Large-market team with strong brand premium and competitive roster.',
   'Large-market franchises carry a built-in brand premium. Even in mixed seasons, market size keeps sentiment elevated.',
   4.5,'neutral',305.00,0.7,'active','["pro-football","team-stock","los-angeles-a"]'::jsonb),

  ('60000000-0000-0019-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019',
   'LABFT','Los Angeles Football Team B Stock','Pro Football Team B · Los Angeles',
   'Tracks the simulated market performance of the Los Angeles B football franchise. Shared market with volatile results — inconsistent performance narrative.',
   'Shared-market franchises compete for fan sentiment. When one rises, the other sometimes dips — an interesting correlation to track.',
   5.5,'neutral',195.00,0.8,'active','["pro-football","team-stock","los-angeles-b"]'::jsonb),

  ('60000000-0000-0020-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020',
   'MIAFT','Miami Football Team Stock','Pro Football Team · Miami',
   'Tracks the simulated market performance of the Miami football franchise. Rising contender with offensive firepower and growing playoff narrative.',
   'Franchises riding offensive momentum can sustain extended team stock rallies. Watch for defensive gaps that could deflate the narrative.',
   4.5,'bullish',255.00,1.1,'active','["pro-football","team-stock","miami"]'::jsonb),

  ('60000000-0000-0021-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021',
   'MINFT','Minnesota Football Team Stock','Pro Football Team · Minnesota',
   'Tracks the simulated market performance of the Minnesota football franchise. Consistent contender with strong skill-position depth and stable playoff positioning.',
   'Consistent contenders generate steady team stock appreciation. Lower-drama franchises are often undervalued relative to their actual win rates.',
   4.5,'bullish',275.00,1.6,'active','["pro-football","team-stock","minnesota"]'::jsonb),

  ('60000000-0000-0022-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022',
   'NEFT','New England Football Team Stock','Pro Football Team · New England',
   'Tracks the simulated market performance of the New England football franchise. Transitioning from dynasty-era to competitive rebuild — elevated floor, uncertain ceiling.',
   'Post-dynasty franchises often trade at a legacy premium. The floor stays high but the ceiling is uncertain until new leadership proves itself.',
   4.0,'neutral',225.00,-1.8,'active','["pro-football","team-stock","new-england"]'::jsonb),

  ('60000000-0000-0023-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023',
   'NOFT','New Orleans Football Team Stock','Pro Football Team · New Orleans',
   'Tracks the simulated market performance of the New Orleans football franchise. Veteran-led roster navigating a competitive window with declining offensive narrative.',
   'Declining-narrative franchises can be trading opportunities when sentiment overshoots the actual roster quality.',
   4.5,'bearish',160.00,-1.5,'active','["pro-football","team-stock","new-orleans"]'::jsonb),

  ('60000000-0000-0024-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024',
   'NYAFT','New York Football Team A Stock','Pro Football Team A · New York',
   'Tracks the simulated market performance of the New York A football franchise. Large-market franchise in a reset year with speculative upside.',
   'Large-market reset franchises can recover sharply on a single narrative shift. They rarely trade to true bottom-of-market prices.',
   5.0,'bearish',155.00,-1.9,'active','["pro-football","team-stock","new-york-a"]'::jsonb),

  ('60000000-0000-0025-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025',
   'NYBFT','New York Football Team B Stock','Pro Football Team B · New York',
   'Tracks the simulated market performance of the New York B football franchise. Shared market with high volatility — rapid narrative swings in both directions.',
   'High-volatility team stocks require more active management. Larger position sizes carry more risk when sentiment can shift quickly.',
   5.5,'bearish',130.00,-2.8,'active','["pro-football","team-stock","new-york-b"]'::jsonb),

  ('60000000-0000-0026-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026',
   'PHIFT','Philadelphia Football Team Stock','Pro Football Team · Philadelphia',
   'Tracks the simulated market performance of the Philadelphia football franchise. Elite two-way roster in a championship-contending window with dominant market narrative.',
   'Elite two-way franchises combine offensive and defensive narrative to sustain broad market support. Their stocks rarely see deep sell-offs.',
   3.5,'bullish',420.00,1.8,'active','["pro-football","team-stock","philadelphia"]'::jsonb),

  ('60000000-0000-0027-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027',
   'PITFT','Pittsburgh Football Team Stock','Pro Football Team · Pittsburgh',
   'Tracks the simulated market performance of the Pittsburgh football franchise. Storied franchise with consistent competitive baseline and deep defensive identity.',
   'Defensively-anchored franchises often hold value in down years. Their lower-volatility profile suits conservative portfolio strategies.',
   3.5,'neutral',290.00,-0.2,'active','["pro-football","team-stock","pittsburgh"]'::jsonb),

  ('60000000-0000-0028-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028',
   'SFFT','San Francisco Football Team Stock','Pro Football Team · San Francisco',
   'Tracks the simulated market performance of the San Francisco football franchise. Deep roster in a sustained championship window with elite positional talent.',
   'Roster-deep franchises sustain team stock value even through key injuries. Depth is an underrated pricing factor in simulated markets.',
   3.5,'bullish',395.00,0.9,'active','["pro-football","team-stock","san-francisco"]'::jsonb),

  ('60000000-0000-0029-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029',
   'SEAFT','Seattle Football Team Stock','Pro Football Team · Seattle',
   'Tracks the simulated market performance of the Seattle football franchise. Competitive roster with a balanced identity and steady mid-market narrative.',
   'Mid-market competitive franchises offer lower risk than rebuilders without the premium of elite contenders. Good portfolio anchors.',
   4.0,'neutral',245.00,-0.6,'active','["pro-football","team-stock","seattle"]'::jsonb),

  ('60000000-0000-0030-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030',
   'TBFT','Tampa Bay Football Team Stock','Pro Football Team · Tampa Bay',
   'Tracks the simulated market performance of the Tampa Bay football franchise. Post-dynasty transition with declining market sentiment and roster uncertainty.',
   'Post-dynasty franchises can trade at persistent discounts until a new core identity emerges. Watch for roster signals.',
   4.5,'bearish',170.00,-2.1,'active','["pro-football","team-stock","tampa-bay"]'::jsonb),

  ('60000000-0000-0031-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031',
   'TENFT','Tennessee Football Team Stock','Pro Football Team · Tennessee',
   'Tracks the simulated market performance of the Tennessee football franchise. Consistent mid-tier franchise with stable roster and steady market positioning.',
   'Consistent mid-tier franchises rarely deliver surprise rallies but also avoid deep sell-offs. A reliable holding in mixed market conditions.',
   4.5,'neutral',195.00,-0.5,'active','["pro-football","team-stock","tennessee"]'::jsonb),

  ('60000000-0000-0032-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032',
   'WASFT','Washington Football Team Stock','Pro Football Team · Washington',
   'Tracks the simulated market performance of the Washington football franchise. Roster rebuild with early optimism — new-era narrative beginning to gain traction.',
   'Early-rebuild narratives can generate speculative buying before results confirm the story. Entry risk is higher but so is upside.',
   5.0,'neutral',140.00,0.8,'active','["pro-football","team-stock","washington"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Sport Indexes (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, symbol, public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0000-0001-000000000001',
   'sport_index', '10000000-0000-0000-0000-000000000001',
   'PFPI', 'Pro Football Power Index',
   'Broad pro football market index',
   'Tracks the combined simulated performance of all active pro football team and player assets. Broadly diversified.',
   'Index assets spread risk across many teams and players. When one asset drops, others can offset it — this is diversification.',
   3.0, 'bullish', 1580.00, 1.4, 'active',
   '["pro-football","index","diversification"]'::jsonb),

  ('60000000-0000-0000-0001-000000000002',
   'sport_index', '10000000-0000-0000-0000-000000000002',
   'PBSI', 'Pro Basketball Stars Index',
   'Broad pro basketball player index',
   'Tracks top-tier pro basketball player coin assets. High-visibility stars, moderate diversification.',
   'Player coin indexes concentrate on individual star performance. More upside than a team index, more risk too.',
   4.0, 'neutral', 940.50, -0.8, 'active',
   '["pro-basketball","index","player-coins"]'::jsonb),

  ('60000000-0000-0000-0001-000000000003',
   'sport_index', '10000000-0000-0000-0000-000000000006',
   'MMACI', 'MMA Chaos Index',
   'Tracks MMA volatility assets',
   'Bundles high-volatility MMA-themed assets. Expect larger swings in both directions.',
   'High-volatility indexes can deliver big gains — or big losses. Position sizing matters more in volatile sectors.',
   7.0, 'volatile', 420.25, 3.2, 'active',
   '["mma","index","volatile","chaos"]'::jsonb),

  ('60000000-0000-0000-0001-000000000004',
   'sport_index', null,
   'FF100', 'Fanfolio 100',
   'The flagship all-sports index',
   'The Fanfolio 100 tracks the top 100 simulated sports assets across all categories. The broadest market barometer available.',
   'A broad index like this moves more slowly than individual assets. It is a benchmark — if your portfolio beats FF100, you are outperforming the simulated market.',
   2.5, 'bullish', 1842.50, 1.8, 'active',
   '["all-sports","index","flagship","diversification"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Futures (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, symbol, public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0000-0002-000000000001',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFMVP', 'Pro Football MVP Future',
   'Season MVP award future',
   'Settles when the simulated MVP award is decided at season end. Prices move with changing performance narratives.',
   'Futures are priced on probability, not results. As one player dominates the stats race, this future reprices upward.',
   6.0, 'bullish', 245.00, 4.2, 'active',
   '["pro-football","future","award","mvp"]'::jsonb),

  ('60000000-0000-0000-0002-000000000002',
   'season_future', '10000000-0000-0000-0000-000000000001',
   'PFCHAMP', 'Pro Football Championship Future',
   'Season championship future',
   'Tracks the simulated probability of the league championship outcome. Reprices significantly as playoff positioning clarifies.',
   'Championship futures are the most sensitive to team momentum. A win streak can double this asset — a loss can halve it.',
   7.0, 'neutral', 318.00, -1.1, 'active',
   '["pro-football","future","championship"]'::jsonb),

  ('60000000-0000-0000-0002-000000000003',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFCOTY', 'Pro Football Coach of the Year Future',
   'Coach of the Year award future',
   'Tracks the simulated Coach of the Year award race. Coach buzz and team performance both move this asset.',
   'Award futures narrow as the season progresses. When the race becomes a two-horse contest, volatility compresses and prices rise.',
   5.5, 'neutral', 182.00, 0.5, 'active',
   '["pro-football","future","award","coach"]'::jsonb),

  ('60000000-0000-0000-0002-000000000004',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFOROTY', 'Pro Football Offensive Rookie Future',
   'Offensive Rookie of the Year future',
   'Tracks the simulated OROTY award. Rookie breakout performances can move this asset dramatically.',
   'Rookie futures carry extra uncertainty — any breakout game can reprice the whole race.',
   6.5, 'bullish', 156.00, 3.8, 'active',
   '["pro-football","future","award","rookie"]'::jsonb),

  ('60000000-0000-0000-0002-000000000005',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFCPOY', 'Pro Football Comeback Future',
   'Comeback Player of the Year future',
   'Tracks the simulated Comeback Player award. Emotional narrative drives this asset as much as performance.',
   'Comeback narratives blend real performance with behavioral finance. Emotional buying often outpaces statistical gains.',
   6.0, 'neutral', 128.00, 1.2, 'active',
   '["pro-football","future","award","comeback"]'::jsonb),

  ('60000000-0000-0000-0002-000000000006',
   'award_future', '10000000-0000-0000-0000-000000000006',
   'MMACHAMP', 'MMA Championship Future',
   'MMA title fight outcome future',
   'Settles on the outcome of the simulated MMA championship event. High volatility asset — fight results are binary.',
   'Binary outcome futures either pay off fully or collapse on resolution. The risk is high, but so is the potential reward.',
   8.0, 'volatile', 88.50, 6.4, 'active',
   '["mma","future","championship","volatile"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Meme Coins (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, symbol, public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0000-0003-000000000001',
   'meme_coin', '10000000-0000-0000-0000-000000000001',
   'CHOKE', 'ChokeCoin',
   'The late-collapse meme',
   'Spikes when a top seed suffers a shocking early-round collapse. Pure sentiment — no fundamental anchor.',
   'Meme coins run on narrative and social energy. They can spike 50% on excitement and fall 60% when it fades.',
   9.0, 'volatile', 14.20, -8.4, 'active',
   '["meme","pro-football","high-risk","collapse"]'::jsonb),

  ('60000000-0000-0000-0003-000000000002',
   'meme_coin', null,
   'DRAMA', 'DramaCoin',
   'Controversy and conflict meme',
   'Surges on viral press conference moments, locker room controversy, or trade drama. Falls when news cycle moves on.',
   'Social-signal assets price in the current narrative cycle. When drama fades, so does the price.',
   9.0, 'volatile', 22.80, 11.2, 'active',
   '["meme","all-sports","high-risk","drama"]'::jsonb),

  ('60000000-0000-0000-0003-000000000003',
   'meme_coin', null,
   'UPSET', 'UpsetCoin',
   'The underdog victory meme',
   'Spikes whenever a heavy underdog wins. Captures the fan excitement of an unexpected result.',
   'Underdog events are unpredictable by definition. This asset has a short lifespan after each surprise win.',
   9.5, 'volatile', 9.60, 4.8, 'active',
   '["meme","all-sports","high-risk","upset"]'::jsonb),

  ('60000000-0000-0000-0003-000000000004',
   'meme_coin', '10000000-0000-0000-0000-000000000001',
   '4QC', 'FourthQuarterCoin',
   'Late-game drama meme',
   'Surges on walk-off plays, last-second field goals, and fourth-quarter comeback wins. Hype-driven.',
   'Excitement-driven assets spike fast and fade fast. Timing matters more than fundamentals.',
   8.5, 'volatile', 31.40, 7.3, 'active',
   '["meme","pro-football","high-risk","comeback"]'::jsonb),

  ('60000000-0000-0000-0003-000000000005',
   'meme_coin', '10000000-0000-0000-0000-000000000006',
   'KO', 'KnockoutCoin',
   'The finish meme for MMA',
   'Spikes on spectacular KO finishes in MMA events. Tied to the excitement metric, not win/loss records.',
   'Event-driven meme coins can double on a single result. They can also collapse in hours if the next event disappoints.',
   9.5, 'volatile', 7.80, -12.1, 'active',
   '["meme","mma","high-risk","knockout"]'::jsonb),

  ('60000000-0000-0000-0003-000000000006',
   'meme_coin', '10000000-0000-0000-0000-000000000001',
   'CMBC', 'ComebackCoin',
   'The turnaround narrative meme',
   'Tracks comeback-style market narratives — teams or players reversing from a long slump.',
   'Recovery narratives move in stages. Early believers are rewarded most; late buyers often buy after the move.',
   8.0, 'bullish', 48.60, 5.9, 'active',
   '["meme","pro-football","comeback","narrative"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- PLAYER COIN ASSETS — 160 total (32 teams × 5 roles each)
-- Asset UUID pattern: 60000000-0000-{team_pos:04d}-0005-00000000000{role:1}
-- Symbol matches the asset_symbol field in generic_player_roles.
-- player_role_id links each coin to its source role row.
-- ─────────────────────────────────────────────────────────────

-- ── Kansas City player coins (team 16) ───────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0016-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000001',
   'KCQB1','Kansas City QB1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the simulated market performance of the Kansas City quarterback role. Franchise anchor driving the team''s dominant market narrative.',
   'QB1 coins are the most narrative-sensitive player coins. A single outstanding game can move this coin sharply.',
   3.5,'bullish',168.00,3.2,'active','["pro-football","player-coin","qb1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000002',
   'KCTF1','Kansas City TE1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City tight end role. High-impact pass-catching role correlated closely with the QB1 coin.',
   'Tight end coins shadow QB1 performance — when the QB is efficient, TE production rises with it.',
   5.0,'bullish',105.60,1.8,'active','["pro-football","player-coin","te1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000003',
   'KCWR1','Kansas City WR1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City top receiver role. Explosive skill-position coin reacting to target volume and big-play moments.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply. So can a slump.',
   5.5,'bullish',96.00,1.5,'active','["pro-football","player-coin","wr1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000004',
   'KCRB1','Kansas City RB1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City lead running back role. Usage-driven coin reacting to carry share and goal-line opportunities.',
   'Running back coins carry position risk — high usage often means higher injury exposure. Size positions accordingly.',
   5.0,'neutral',76.80,0.8,'active','["pro-football","player-coin","rb1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000005',
   'KCER1','Kansas City Edge Rusher Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City edge rusher role. Defensive playmaker coin spiking on pressure and turnover events.',
   'Edge rusher coins generate upside around sack and turnover events. Defensive coins can surprise on strong game-film narratives.',
   5.5,'bullish',91.20,2.4,'active','["pro-football","player-coin","edge","kansas-city"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Baltimore player coins (team 03) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0003-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000001',
   'BALQB1','Baltimore QB1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore quarterback role. Dual-threat franchise anchor generating unique market narratives around both passing and rushing.',
   'QB1 coins are the franchise cornerstone. When the QB narrative dominates, everything from team stock to skill-position coins follows.',
   3.5,'bullish',143.50,2.1,'active','["pro-football","player-coin","qb1","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000002',
   'BALWR1','Baltimore WR1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore top receiver role. Explosive downfield threat generating big-play upside.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply. So can a slump.',
   5.0,'bullish',90.20,1.8,'active','["pro-football","player-coin","wr1","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000003',
   'BALER1','Baltimore Edge Rusher Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore edge rusher role. Elite pass rush unit generates consistent defensive narrative.',
   'Defensive playmakers drive turnovers that shift game momentum. Edge coins spike on sack-and-turnover-heavy performances.',
   5.0,'bullish',77.90,1.4,'active','["pro-football","player-coin","edge","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000004',
   'BALLB1','Baltimore LB1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore linebacker role. Defensive anchor in a unit with strong turnover narrative.',
   'Linebacker coins represent team defense broadly. They tend to be lower volatility than skill-position coins.',
   4.5,'bullish',53.30,1.2,'active','["pro-football","player-coin","lb1","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000005',
   'BALRB1','Baltimore RB1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore lead running back role. High-volume rushing role in a run-heavy offensive system.',
   'Running back coins carry position risk — high usage often means higher injury exposure. Size positions accordingly.',
   5.5,'neutral',65.60,0.5,'active','["pro-football","player-coin","rb1","baltimore"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Detroit player coins (team 11) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0011-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000001',
   'DETQB1','Detroit QB1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit quarterback role. Rising-contender franchise anchor generating strong upward narrative momentum.',
   'QB1 coins on ascending franchises can outperform the team stock. Early-window contenders often have undervalued QB1 coins.',
   4.0,'bullish',133.00,3.6,'active','["pro-football","player-coin","qb1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000002',
   'DETWR1','Detroit WR1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit top receiver role. Elite skill position with high target volume in a pass-first offense.',
   'High-target-share receivers generate reliable fantasy-style narrative. Their coins tend to move steadily in strong offensive systems.',
   4.5,'bullish',83.60,2.8,'active','["pro-football","player-coin","wr1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000003',
   'DETRB1','Detroit RB1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit lead running back role. High-usage role in a balanced offensive system.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   5.0,'neutral',60.80,1.1,'active','["pro-football","player-coin","rb1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000004',
   'DETTE1','Detroit TE1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit tight end role. Dynamic receiving threat adding depth to an already strong offensive narrative.',
   'Tight end coins shadow QB1 performance — when the QB is hot, TE targets and production usually follow.',
   5.0,'bullish',83.60,2.5,'active','["pro-football","player-coin","te1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000005',
   'DETER1','Detroit Edge Rusher Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit edge rusher role. Defensive disruptor generating pressure events in a young contending unit.',
   'Edge rusher coins spike on sack and turnover events. Strong pass-rush performances can move these coins quickly.',
   5.0,'bullish',72.20,2.0,'active','["pro-football","player-coin","edge","detroit"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Dallas player coins (team 09) ────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0009-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000001',
   'DALQB1','Dallas QB1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas quarterback role. High-brand franchise QB carrying elevated narrative weight even in average seasons.',
   'Brand-franchise QB1 coins trade at a premium to their pure performance level. Sentiment compounds with market size.',
   4.5,'neutral',124.25,-0.5,'active','["pro-football","player-coin","qb1","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000002',
   'DALER1','Dallas Edge Rusher Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas top edge rusher role. Elite pass rusher generating consistent defensive momentum.',
   'Defensive playmakers drive turnovers that shift game momentum. Edge coins spike on pressure-heavy performances.',
   5.0,'neutral',67.45,0.8,'active','["pro-football","player-coin","edge","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000003',
   'DALWR1','Dallas WR1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas top receiver role. High-profile skill position with strong brand amplification.',
   'Brand-market skill-position coins carry narrative premium. Watch for sentiment spikes around highlight moments.',
   5.0,'neutral',78.10,-0.3,'active','["pro-football","player-coin","wr1","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000004',
   'DALRB1','Dallas RB1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas lead running back role. Usage-sensitive role in a pass-heavy offensive system.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   5.5,'neutral',56.80,-0.8,'active','["pro-football","player-coin","rb1","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000005',
   'DALCB1','Dallas CB1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas top cornerback role. Defensive cover coin reacting to matchup results and turnover events.',
   'Cornerback coins are event-driven — a pick-six or shutdown performance can spike them fast. So can getting burned.',
   5.5,'neutral',46.15,-1.1,'active','["pro-football","player-coin","cb1","dallas"]'::jsonb)
on conflict (symbol) do nothing;

-- ── San Francisco player coins (team 28) ─────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0028-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000001',
   'SFQB1','San Francisco QB1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco quarterback role. System-elevated franchise anchor in a run-heavy, scheme-diverse offense.',
   'System QBs can outperform raw stats — their coins benefit from team scheme narrative as much as individual play.',
   3.5,'bullish',138.25,1.4,'active','["pro-football","player-coin","qb1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000002',
   'SFWR1','San Francisco WR1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco top receiver role. Deep-threat playmaker in a multi-faceted offensive scheme.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply.',
   4.5,'bullish',86.90,1.1,'active','["pro-football","player-coin","wr1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000003',
   'SFRB1','San Francisco RB1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco lead running back role. Featured role in a run-diverse offensive scheme.',
   'RB coins in run-heavy offenses carry above-average upside when scheme execution is strong.',
   5.5,'neutral',63.20,0.6,'active','["pro-football","player-coin","rb1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000004',
   'SFTE1','San Francisco TE1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco tight end role. Featured receiving role in a tight-end-friendly scheme.',
   'TE coins in target-rich systems can sustain steady price growth when the offense is clicking.',
   5.5,'bullish',86.90,0.9,'active','["pro-football","player-coin","te1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000005',
   'SFDL1','San Francisco DL1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco defensive line role. Disruptive interior presence anchoring a strong defensive unit.',
   'Interior defensive coins react to run-stopping performances and QB pressure events — less flashy but steady.',
   4.5,'bullish',59.25,0.7,'active','["pro-football","player-coin","dl1","san-francisco"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Buffalo player coins (team 04) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0004-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000001',
   'BUFQB1','Buffalo QB1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo quarterback role. Elite franchise QB with consistent playoff narrative driving premium valuation.',
   'Elite QB1 coins sustain premium pricing through full seasons. Their narrative rarely dips below franchise expectations.',
   3.5,'bullish',129.50,1.8,'active','["pro-football","player-coin","qb1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000002',
   'BUFWR1','Buffalo WR1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo top receiver role. High-volume target in an aggressive passing offense.',
   'High-target receivers in pass-first offenses generate steady coin momentum in strong offensive stretches.',
   4.5,'bullish',81.40,1.5,'active','["pro-football","player-coin","wr1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000003',
   'BUFTE1','Buffalo TE1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo tight end role. Red-zone featured role with reliable target volume near the goal line.',
   'TE coins with red-zone usage tend to generate touchdown-event spikes. Short-yardage TDs move these coins.',
   5.0,'bullish',81.40,0.9,'active','["pro-football","player-coin","te1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000004',
   'BUFRB1','Buffalo RB1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo lead running back role. Complementary role in a pass-heavy system.',
   'RBs in pass-heavy systems carry lower floor but spike on breakout rushing performances.',
   5.5,'neutral',59.20,0.4,'active','["pro-football","player-coin","rb1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000005',
   'BUFCB1','Buffalo CB1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo top cornerback role. Defensive cover coin in a strong secondary unit.',
   'Cornerback coins react to matchup results and turnover events. Strong coverage games can spike them fast.',
   5.5,'neutral',48.10,-0.2,'active','["pro-football","player-coin","cb1","buffalo"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Philadelphia player coins (team 26) ──────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0026-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000001',
   'PHIQB1','Philadelphia QB1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia quarterback role. Championship-window franchise anchor with elite two-way team support.',
   'QB1 coins on elite two-way franchises carry the lowest narrative risk of any player coin. Strong floor, strong ceiling.',
   3.5,'bullish',147.00,2.7,'active','["pro-football","player-coin","qb1","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000002',
   'PHIWR1','Philadelphia WR1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia top receiver role. High-volume target in a dynamic offensive scheme.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply.',
   4.5,'bullish',92.40,1.8,'active','["pro-football","player-coin","wr1","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000003',
   'PHIER1','Philadelphia Edge Rusher Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia edge rusher role. Elite pass rusher in a dominant defensive front.',
   'Edge rusher coins spike on sack and turnover events. Strong pass-rush units can generate sustained coin momentum.',
   4.5,'bullish',79.80,1.5,'active','["pro-football","player-coin","edge","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000004',
   'PHIRB1','Philadelphia RB1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia lead running back role. Physical running role with strong red-zone usage.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   5.0,'bullish',67.20,0.9,'active','["pro-football","player-coin","rb1","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000005',
   'PHITE1','Philadelphia TE1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia tight end role. Versatile receiving threat adding depth to a multi-faceted offense.',
   'TE coins in target-rich systems can sustain steady price growth when the offense is clicking.',
   5.5,'bullish',92.40,1.2,'active','["pro-football","player-coin","te1","philadelphia"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Las Vegas player coins (team 17) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0017-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000001',
   'LVQB1','Las Vegas QB1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas quarterback role. High-narrative franchise QB with volatile market sentiment.',
   'QB1 coins in high-narrative markets move sharply on story beats. Drama can drive prices as much as performance.',
   5.0,'neutral',66.50,-1.8,'active','["pro-football","player-coin","qb1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000002',
   'LVRB1','Las Vegas RB1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas lead running back role. Featured back in a volatile offensive system.',
   'Running back coins carry position risk. High usage in inconsistent offenses amplifies volatility.',
   6.0,'neutral',30.40,-2.4,'active','["pro-football","player-coin","rb1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000003',
   'LVWR1','Las Vegas WR1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas top receiver role. High-upside skill position in a boom-or-bust offensive system.',
   'Volatile offensive systems create boom-or-bust player coin pricing. Wide swings are common.',
   5.5,'neutral',41.80,-1.2,'active','["pro-football","player-coin","wr1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000004',
   'LVTE1','Las Vegas TE1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas tight end role. Red-zone featured role in a volatile passing system.',
   'TE coins with red-zone usage generate touchdown-event spikes. Volatile systems amplify both up and down moves.',
   5.5,'neutral',41.80,-0.8,'active','["pro-football","player-coin","te1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000005',
   'LVER1','Las Vegas Edge Rusher Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas edge rusher role. Defensive pass rusher in a high-narrative defensive unit.',
   'Edge rusher coins spike on sack and turnover events regardless of team record.',
   6.0,'neutral',36.10,-1.5,'active','["pro-football","player-coin","edge","las-vegas"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Arizona player coins (team 01) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0001-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000001',
   'AZQB1','Arizona QB1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona quarterback role. Developing franchise QB with speculative upside in a rebuilding system.',
   'Rebuilding-team QB1 coins carry more risk but greater upside when the narrative inflects positively.',
   5.5,'neutral',50.75,-0.6,'active','["pro-football","player-coin","qb1","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000002',
   'AZWR1','Arizona WR1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona top receiver role. Skill-position talent in a developing offensive system.',
   'WR1 coins on rebuilding teams can sustain value through strong individual performance even when team results lag.',
   6.0,'neutral',31.90,-1.2,'active','["pro-football","player-coin","wr1","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000003',
   'AZRB1','Arizona RB1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona lead running back role. Usage-dependent role in an evolving offensive scheme.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   6.0,'neutral',23.20,-0.8,'active','["pro-football","player-coin","rb1","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000004',
   'AZER1','Arizona Edge Rusher Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona edge rusher role. Defensive impact player in a developing defensive unit.',
   'Edge rusher coins spike on sack and turnover events regardless of team record.',
   6.5,'neutral',27.55,0.4,'active','["pro-football","player-coin","edge","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000005',
   'AZLB1','Arizona LB1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona linebacker role. Defensive anchor in a rebuilding defensive unit.',
   'Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',
   6.0,'neutral',18.85,-0.3,'active','["pro-football","player-coin","lb1","arizona"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Atlanta player coins (team 02) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0002-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000001',
   'ATLQB1','Atlanta QB1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta quarterback role. Volatile franchise QB with boom-or-bust season potential.','Boom-or-bust QB1 coins can outperform in big narrative moments but need active monitoring.',5.5,'neutral',61.25,-1.0,'active','["pro-football","player-coin","qb1","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000002',
   'ATLWR1','Atlanta WR1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta top receiver role. Explosive playmaker in a pass-heavy scheme.','High-upside receivers generate big-play narrative spikes. Volatility cuts both ways.',6.0,'neutral',38.50,1.4,'active','["pro-football","player-coin","wr1","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000003',
   'ATLRB1','Atlanta RB1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta lead running back role. Feature back in a developing offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',28.00,-0.5,'active','["pro-football","player-coin","rb1","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000004',
   'ATLER1','Atlanta Edge Rusher Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta edge rusher role. Pass-rush disruptor in a developing defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.5,'neutral',33.25,0.8,'active','["pro-football","player-coin","edge","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000005',
   'ATLLB1','Atlanta LB1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta linebacker role. Defensive anchor in a rebuilding unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',22.75,-0.3,'active','["pro-football","player-coin","lb1","atlanta"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Carolina player coins (team 05) ──────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0005-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000001',
   'CARQB1','Carolina QB1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina quarterback role. Developing QB in a full rebuild with long-term upside.','Rebuilding-team QB1 coins carry more risk but can deliver outsized returns on narrative inflection.',6.5,'bearish',41.30,-4.2,'active','["pro-football","player-coin","qb1","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000002',
   'CARWR1','Carolina WR1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina top receiver role. Developing skill position in a limited offensive system.','WR1 coins on rebuild teams can sustain value through strong individual play even when the team struggles.',6.5,'bearish',25.96,-2.8,'active','["pro-football","player-coin","wr1","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000003',
   'CARRB1','Carolina RB1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina lead running back role. High-usage role in a ground-heavy rebuild scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',6.5,'neutral',18.88,-1.5,'active','["pro-football","player-coin","rb1","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000004',
   'CARER1','Carolina Edge Rusher Coin','Pro Football Player Coin · Carolina','Tracks the Carolina edge rusher role. Pass-rush standout in an otherwise developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',7.0,'neutral',22.42,1.1,'active','["pro-football","player-coin","edge","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000005',
   'CARLB1','Carolina LB1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.5,'neutral',15.34,-0.5,'active','["pro-football","player-coin","lb1","carolina"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Chicago player coins (team 06) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0006-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000001',
   'CHIQB1','Chicago QB1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago quarterback role. Young franchise QB with developing talent in a roster overhaul.','Young QB1 coins carry rebuild risk but can spike sharply on breakthrough performances.',5.5,'neutral',48.30,1.8,'active','["pro-football","player-coin","qb1","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000002',
   'CHIWR1','Chicago WR1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago top receiver role. Promising skill position in a developing passing offense.','WR1 coins on young offenses can generate strong upside when scheme and QB development click.',6.0,'neutral',30.36,2.1,'active','["pro-football","player-coin","wr1","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000003',
   'CHIRB1','Chicago RB1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago lead running back role. Feature back with consistent carry volume.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',22.08,0.4,'active','["pro-football","player-coin","rb1","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000004',
   'CHIER1','Chicago Edge Rusher Coin','Pro Football Player Coin · Chicago','Tracks the Chicago edge rusher role. Defensive disruptor generating pressure in a young defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',26.22,0.9,'active','["pro-football","player-coin","edge","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000005',
   'CHILB1','Chicago LB1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',17.94,0.2,'active','["pro-football","player-coin","lb1","chicago"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Cincinnati player coins (team 07) ────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0007-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000001',
   'CINQB1','Cincinnati QB1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati quarterback role. Elite franchise QB with proven playoff narrative and rising team stock.','Elite QB1 coins with playoff track records sustain premium valuations through full simulated seasons.',5.0,'bullish',84.00,2.1,'active','["pro-football","player-coin","qb1","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000002',
   'CINWR1','Cincinnati WR1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati top receiver role. Dynamic playmaker in a pass-first offensive system.','High-upside WR1 coins in strong passing offenses can lead the market in strong stretches.',5.5,'bullish',52.80,2.8,'active','["pro-football","player-coin","wr1","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000003',
   'CINRB1','Cincinnati RB1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati lead running back role. Complementary role in a pass-dominant system.','RBs in pass-heavy systems carry lower floor but spike on breakout rushing performances.',6.0,'neutral',38.40,0.6,'active','["pro-football","player-coin","rb1","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000004',
   'CINER1','Cincinnati Edge Rusher Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati edge rusher role. Defensive pass rusher in a developing defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',45.60,0.9,'active','["pro-football","player-coin","edge","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000005',
   'CINLB1','Cincinnati LB1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati linebacker role. Defensive anchor supporting a competitive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',31.20,0.4,'active','["pro-football","player-coin","lb1","cincinnati"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Cleveland player coins (team 08) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0008-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000001',
   'CLEQB1','Cleveland QB1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland quarterback role. Volatile franchise QB with inconsistent performance narrative.','Inconsistent QB1 coins swing widely around game results. Higher risk, but dip entry can reward.',6.0,'neutral',57.75,-1.2,'active','["pro-football","player-coin","qb1","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000002',
   'CLEWR1','Cleveland WR1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland top receiver role. Physical playmaker reliant on QB consistency.','WR1 coins tied to volatile QBs carry extra uncertainty — the receiver''s ceiling depends on QB narrative.',6.5,'neutral',36.30,-0.8,'active','["pro-football","player-coin","wr1","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000003',
   'CLERB1','Cleveland RB1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland lead running back role. Featured back in a ground-heavy offensive scheme.','High-usage RBs in run-first offenses can sustain coin value even when the passing game struggles.',6.0,'neutral',26.40,0.4,'active','["pro-football","player-coin","rb1","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000004',
   'CLEER1','Cleveland Edge Rusher Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland edge rusher role. Pass-rush disruptor in an otherwise inconsistent roster.','Edge rusher coins can sustain individual value even when team stocks underperform.',6.5,'neutral',31.35,0.7,'active','["pro-football","player-coin","edge","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000005',
   'CLELB1','Cleveland LB1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',21.45,-0.2,'active','["pro-football","player-coin","lb1","cleveland"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Denver player coins (team 10) ────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0010-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000001',
   'DENQB1','Denver QB1 Coin','Pro Football Player Coin · Denver','Tracks the Denver quarterback role. QB in a transitional phase with uncertain long-term narrative.','Post-dynasty QB1 coins carry narrative uncertainty. The market is watching for confirmation of identity.',6.0,'bearish',52.50,-3.6,'active','["pro-football","player-coin","qb1","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000002',
   'DENWR1','Denver WR1 Coin','Pro Football Player Coin · Denver','Tracks the Denver top receiver role. Skill-position talent in a transitional offensive system.','WR1 coins can hold value on individual talent even when system productivity dips.',6.0,'neutral',33.00,-1.4,'active','["pro-football","player-coin","wr1","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000003',
   'DENRB1','Denver RB1 Coin','Pro Football Player Coin · Denver','Tracks the Denver lead running back role. Featured back in a transitional offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',24.00,-0.8,'active','["pro-football","player-coin","rb1","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000004',
   'DENER1','Denver Edge Rusher Coin','Pro Football Player Coin · Denver','Tracks the Denver edge rusher role. Pass-rush presence in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',28.50,0.6,'active','["pro-football","player-coin","edge","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000005',
   'DENLB1','Denver LB1 Coin','Pro Football Player Coin · Denver','Tracks the Denver linebacker role. Defensive anchor in a transitional unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',19.50,-0.4,'active','["pro-football","player-coin","lb1","denver"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Green Bay player coins (team 12) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0012-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000001',
   'GBQB1','Green Bay QB1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay quarterback role. New-era franchise anchor in a storied QB lineage.','Storied franchise QB1 coins carry legacy premium even during transition periods.',4.5,'neutral',115.50,0.6,'active','["pro-football","player-coin","qb1","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000002',
   'GBWR1','Green Bay WR1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay top receiver role. Reliable skill position in a structured passing system.','Reliable high-target receivers in structured systems generate steady coin momentum.',5.0,'neutral',72.60,0.4,'active','["pro-football","player-coin","wr1","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000003',
   'GBRB1','Green Bay RB1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay lead running back role. Efficient role in a balanced offensive scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',5.0,'neutral',52.80,0.2,'active','["pro-football","player-coin","rb1","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000004',
   'GBER1','Green Bay Edge Rusher Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay edge rusher role. Pass-rush standout in a disciplined defensive system.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.0,'neutral',62.70,0.8,'active','["pro-football","player-coin","edge","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000005',
   'GBLB1','Green Bay LB1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay linebacker role. Defensive anchor in a structured, disciplined unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.0,'neutral',42.90,0.1,'active','["pro-football","player-coin","lb1","green-bay"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Houston player coins (team 13) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0013-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000001',
   'HOUQB1','Houston QB1 Coin','Pro Football Player Coin · Houston','Tracks the Houston quarterback role. Rising franchise QB generating strong momentum in an ascending window.','Ascending QB1 coins in growth-phase franchises can compound quickly when wins follow narrative.',5.5,'bullish',87.50,4.8,'active','["pro-football","player-coin","qb1","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000002',
   'HOUWR1','Houston WR1 Coin','Pro Football Player Coin · Houston','Tracks the Houston top receiver role. Dynamic playmaker in a rising passing offense.','High-upside receivers in ascending offenses often outperform market expectations.',6.0,'bullish',55.00,3.1,'active','["pro-football","player-coin","wr1","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000003',
   'HOURB1','Houston RB1 Coin','Pro Football Player Coin · Houston','Tracks the Houston lead running back role. Featured back contributing in a rising offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',40.00,1.4,'active','["pro-football","player-coin","rb1","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000004',
   'HOUER1','Houston Edge Rusher Coin','Pro Football Player Coin · Houston','Tracks the Houston edge rusher role. Pass-rush disruptor in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',47.50,1.8,'active','["pro-football","player-coin","edge","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000005',
   'HOULB1','Houston LB1 Coin','Pro Football Player Coin · Houston','Tracks the Houston linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',32.50,0.8,'active','["pro-football","player-coin","lb1","houston"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Indianapolis player coins (team 14) ──────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0014-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000001',
   'INDQB1','Indianapolis QB1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis quarterback role. Developing franchise QB in a competitive but not elite roster.','Mid-tier franchise QB1 coins tend to trade steadily without dramatic swings.',5.5,'neutral',75.25,0.8,'active','["pro-football","player-coin","qb1","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000002',
   'INDWR1','Indianapolis WR1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis top receiver role. Reliable skill position in a structured offensive system.','Reliable receivers in structured systems generate steady coin momentum.',6.0,'neutral',47.30,0.5,'active','["pro-football","player-coin","wr1","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000003',
   'INDRB1','Indianapolis RB1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis lead running back role. High-volume feature back in a run-balanced scheme.','High-usage RBs in balanced offenses can sustain coin value across full simulated seasons.',5.5,'neutral',34.40,0.3,'active','["pro-football","player-coin","rb1","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000004',
   'INDER1','Indianapolis Edge Rusher Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',40.85,0.6,'active','["pro-football","player-coin","edge","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000005',
   'INDLB1','Indianapolis LB1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis linebacker role. Defensive anchor in a competitive defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',27.95,0.2,'active','["pro-football","player-coin","lb1","indianapolis"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Jacksonville player coins (team 15) ──────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0015-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000001',
   'JAXQB1','Jacksonville QB1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville quarterback role. Developing QB in a longer rebuild cycle.','Long-rebuild QB1 coins carry sustained downside risk until the roster inflection arrives.',6.0,'neutral',43.75,-2.1,'active','["pro-football","player-coin","qb1","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000002',
   'JAXWR1','Jacksonville WR1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville top receiver role. Developing skill position in a limited offensive system.','WR1 coins can hold individual upside even in weak offensive systems.',6.5,'neutral',27.50,-1.2,'active','["pro-football","player-coin","wr1","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000003',
   'JAXRB1','Jacksonville RB1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville lead running back role. High-usage back in a ground-heavy offense.','High-usage RBs in run-first offenses can sustain coin value even when passing is limited.',6.5,'neutral',20.00,-0.6,'active','["pro-football","player-coin","rb1","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000004',
   'JAXER1','Jacksonville Edge Rusher Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville edge rusher role. Pass-rush standout in a developing defensive unit.','Edge rusher coins can sustain individual value even when team stocks underperform.',6.5,'neutral',23.75,0.9,'active','["pro-football","player-coin","edge","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000005',
   'JAXLB1','Jacksonville LB1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.5,'neutral',16.25,-0.4,'active','["pro-football","player-coin","lb1","jacksonville"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Los Angeles A player coins (team 18) ─────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0018-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000001',
   'LAAQB1','Los Angeles A QB1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A quarterback role. Large-market franchise QB with brand amplification.','Large-market QB1 coins carry brand premium. Sentiment moves more quickly in high-visibility markets.',5.0,'neutral',106.75,1.1,'active','["pro-football","player-coin","qb1","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000002',
   'LAAWR1','Los Angeles A WR1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A top receiver role. High-profile skill position in a large-market offense.','Brand-market WR1 coins carry narrative premium — highlight plays amplify faster.',5.5,'neutral',67.10,0.8,'active','["pro-football","player-coin","wr1","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000003',
   'LAARB1','Los Angeles A RB1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A lead running back role. Feature back in a versatile offensive scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',48.80,0.4,'active','["pro-football","player-coin","rb1","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000004',
   'LAAER1','Los Angeles A Edge Rusher Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',57.95,0.6,'active','["pro-football","player-coin","edge","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000005',
   'LAALB1','Los Angeles A LB1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A linebacker role. Defensive anchor in a competitive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',39.65,0.3,'active','["pro-football","player-coin","lb1","los-angeles-a"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Los Angeles B player coins (team 19) ─────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0019-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000001',
   'LABQB1','Los Angeles B QB1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B quarterback role. High-narrative QB in a volatile shared market.','Shared-market QB1 coins can see sentiment shift quickly when the competing franchise momentum changes.',6.0,'neutral',68.25,1.2,'active','["pro-football","player-coin","qb1","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000002',
   'LABWR1','Los Angeles B WR1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B top receiver role. Skill-position talent in a volatile offensive system.','Volatile system WR1 coins can spike sharply on big games but lack steady baseline support.',6.0,'neutral',42.90,0.8,'active','["pro-football","player-coin","wr1","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000003',
   'LABRB1','Los Angeles B RB1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B lead running back role. Featured back in a pass-first offense.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',31.20,0.2,'active','["pro-football","player-coin","rb1","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000004',
   'LABER1','Los Angeles B Edge Rusher Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B edge rusher role. Defensive pass rusher in a developing unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.5,'neutral',37.05,0.5,'active','["pro-football","player-coin","edge","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000005',
   'LABLB1','Los Angeles B LB1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B linebacker role. Defensive anchor in a developing defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',25.35,0.1,'active','["pro-football","player-coin","lb1","los-angeles-b"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Miami player coins (team 20) ─────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0020-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000001',
   'MIAQB1','Miami QB1 Coin','Pro Football Player Coin · Miami','Tracks the Miami quarterback role. Rising franchise QB fueling a growing contender narrative.','Ascending QB1 coins in rising-contender franchises can compound quickly when wins follow.',5.0,'bullish',89.25,1.7,'active','["pro-football","player-coin","qb1","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000002',
   'MIAWR1','Miami WR1 Coin','Pro Football Player Coin · Miami','Tracks the Miami top receiver role. Speed-threat playmaker in an explosive offensive system.','Explosive offense WR1 coins generate big-play spikes and sustain momentum in strong stretches.',5.5,'bullish',56.10,1.4,'active','["pro-football","player-coin","wr1","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000003',
   'MIARB1','Miami RB1 Coin','Pro Football Player Coin · Miami','Tracks the Miami lead running back role. Complementary role in a pass-first, speed-based offense.','RBs in speed offenses carry lower floor but spike on scatback-style breakout performances.',6.0,'neutral',40.80,0.6,'active','["pro-football","player-coin","rb1","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000004',
   'MIAER1','Miami Edge Rusher Coin','Pro Football Player Coin · Miami','Tracks the Miami edge rusher role. Pass-rush presence in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',48.45,0.8,'active','["pro-football","player-coin","edge","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000005',
   'MIALB1','Miami LB1 Coin','Pro Football Player Coin · Miami','Tracks the Miami linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',33.15,0.3,'active','["pro-football","player-coin","lb1","miami"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Minnesota player coins (team 21) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0021-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000001',
   'MINQB1','Minnesota QB1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota quarterback role. Consistent franchise QB supporting steady playoff narrative.','Consistent QB1 coins in steady franchises trade with lower drama and lower volatility.',5.0,'bullish',96.25,2.4,'active','["pro-football","player-coin","qb1","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000002',
   'MINWR1','Minnesota WR1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota top receiver role. Reliable skill position in a consistent offensive system.','Consistent system WR1 coins sustain steady momentum through full simulated seasons.',5.5,'bullish',60.50,1.8,'active','["pro-football","player-coin","wr1","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000003',
   'MINRB1','Minnesota RB1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota lead running back role. Feature back in a run-balanced offensive scheme.','High-usage RBs in balanced offenses can sustain coin value across full simulated seasons.',5.5,'neutral',44.00,0.8,'active','["pro-football","player-coin","rb1","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000004',
   'MINER1','Minnesota Edge Rusher Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',52.25,1.0,'active','["pro-football","player-coin","edge","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000005',
   'MINLB1','Minnesota LB1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota linebacker role. Defensive anchor in a competitive defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',35.75,0.4,'active','["pro-football","player-coin","lb1","minnesota"]'::jsonb)
on conflict (symbol) do nothing;

-- ── New England player coins (team 22) ───────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0022-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000001',
   'NEQB1','New England QB1 Coin','Pro Football Player Coin · New England','Tracks the New England quarterback role. New-era QB establishing identity in a post-dynasty system.','Post-dynasty QB1 coins trade at uncertain valuations until the new era proves itself.',5.0,'neutral',78.75,-2.7,'active','["pro-football","player-coin","qb1","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000002',
   'NEWR1','New England WR1 Coin','Pro Football Player Coin · New England','Tracks the New England top receiver role. Developing skill position in a system transition.','WR1 coins in transitional offenses carry higher uncertainty until system identity stabilizes.',5.5,'neutral',49.50,-1.4,'active','["pro-football","player-coin","wr1","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000003',
   'NERB1','New England RB1 Coin','Pro Football Player Coin · New England','Tracks the New England lead running back role. Feature back in a system historically favoring the run game.','RBs in run-tradition systems can sustain value through system transitions when ground identity holds.',5.5,'neutral',36.00,-0.8,'active','["pro-football","player-coin","rb1","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000004',
   'NEER1','New England Edge Rusher Coin','Pro Football Player Coin · New England','Tracks the New England edge rusher role. Defensive presence in a scheme-heavy defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',42.75,-0.6,'active','["pro-football","player-coin","edge","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000005',
   'NELB1','New England LB1 Coin','Pro Football Player Coin · New England','Tracks the New England linebacker role. Defensive anchor in a structured, experienced unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.0,'neutral',29.25,-0.4,'active','["pro-football","player-coin","lb1","new-england"]'::jsonb)
on conflict (symbol) do nothing;

-- ── New Orleans player coins (team 23) ───────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0023-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023','40000000-0000-0000-0023-000000000001',
   'NOQB1','New Orleans QB1 Coin','Pro Football Player Coin · New Orleans','Tracks the New Orleans quarterback role. Veteran-system QB navigating a declining narrative window.','Declining-narrative QB1 coins can be sentiment opportunities when the market overprices decline.',5.0,'bearish',56.00,-2.3,'active','["pro-football","player-coin","qb1","new-orleans"]'::jsonb),
  ('60000000-0000-0023-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023','40000000-0000-0000-0023-000000000002',
   'NOWR1','New Orleans WR1 Coin','Pro Football Player Coin · New Orleans','Tracks the New Orleans top receiver role. Reliable skill position in an evolving offensive system.','WR1 coins can sustain value on individual talent during system transitions.',5.5,'neutral',35.20,-1.1,'active','["pro-football","player-coin","wr1","new-orleans"]'::jsonb),
  ('60000000-0000-0023-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023','40000000-0000-0000-0023-000000000003',
   'NORB1','New Orleans RB1 Coin','Pro Football Player Coin · New Orleans','Tracks the New Orleans lead running back role. Feature back in a run-heavy system.','RBs in run-first offenses can sustain value even when the passing game struggles.',5.5,'neutral',25.60,-0.6,'active','["pro-football","player-coin","rb1","new-orleans"]'::jsonb),
  ('60000000-0000-0023-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023','40000000-0000-0000-0023-000000000004',
   'NOER1','New Orleans Edge Rusher Coin','Pro Football Player Coin · New Orleans','Tracks the New Orleans edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',30.40,0.5,'active','["pro-football","player-coin","edge","new-orleans"]'::jsonb),
  ('60000000-0000-0023-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023','40000000-0000-0000-0023-000000000005',
   'NOLB1','New Orleans LB1 Coin','Pro Football Player Coin · New Orleans','Tracks the New Orleans linebacker role. Defensive anchor in an experienced defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',20.80,-0.2,'active','["pro-football","player-coin","lb1","new-orleans"]'::jsonb)
on conflict (symbol) do nothing;

-- ── New York A player coins (team 24) ────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0024-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024','40000000-0000-0000-0024-000000000001',
   'NYAQB1','New York A QB1 Coin','Pro Football Player Coin · New York A','Tracks the New York A quarterback role. Franchise QB navigating a roster reset in a large market.','Large-market QB1 coins carry brand floor even during down cycles.',5.5,'bearish',54.25,-2.9,'active','["pro-football","player-coin","qb1","new-york-a"]'::jsonb),
  ('60000000-0000-0024-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024','40000000-0000-0000-0024-000000000002',
   'NYAWR1','New York A WR1 Coin','Pro Football Player Coin · New York A','Tracks the New York A top receiver role. Skill-position talent in a reset offensive system.','WR1 coins can sustain individual value during roster resets on known talent.',6.0,'neutral',34.10,-1.4,'active','["pro-football","player-coin","wr1","new-york-a"]'::jsonb),
  ('60000000-0000-0024-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024','40000000-0000-0000-0024-000000000003',
   'NYARB1','New York A RB1 Coin','Pro Football Player Coin · New York A','Tracks the New York A lead running back role. Featured back in a developing offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',24.80,-0.8,'active','["pro-football","player-coin","rb1","new-york-a"]'::jsonb),
  ('60000000-0000-0024-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024','40000000-0000-0000-0024-000000000004',
   'NYAER1','New York A Edge Rusher Coin','Pro Football Player Coin · New York A','Tracks the New York A edge rusher role. Defensive pass rusher in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',29.45,0.6,'active','["pro-football","player-coin","edge","new-york-a"]'::jsonb),
  ('60000000-0000-0024-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024','40000000-0000-0000-0024-000000000005',
   'NYALB1','New York A LB1 Coin','Pro Football Player Coin · New York A','Tracks the New York A linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',20.15,-0.3,'active','["pro-football","player-coin","lb1","new-york-a"]'::jsonb)
on conflict (symbol) do nothing;

-- ── New York B player coins (team 25) ────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0025-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025','40000000-0000-0000-0025-000000000001',
   'NYBQB1','New York B QB1 Coin','Pro Football Player Coin · New York B','Tracks the New York B quarterback role. Rebuild-phase QB in a large market with speculative upside.','Large-market rebuild QB1 coins rarely hit true bottom — brand floor sustains some pricing.',6.0,'bearish',45.50,-4.2,'active','["pro-football","player-coin","qb1","new-york-b"]'::jsonb),
  ('60000000-0000-0025-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025','40000000-0000-0000-0025-000000000002',
   'NYBWR1','New York B WR1 Coin','Pro Football Player Coin · New York B','Tracks the New York B top receiver role. Developing skill position in a limited offensive system.','WR1 coins can sustain individual value through strong personal performances even in weak offenses.',6.5,'neutral',28.60,-2.1,'active','["pro-football","player-coin","wr1","new-york-b"]'::jsonb),
  ('60000000-0000-0025-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025','40000000-0000-0000-0025-000000000003',
   'NYBRB1','New York B RB1 Coin','Pro Football Player Coin · New York B','Tracks the New York B lead running back role. High-usage back in a run-heavy rebuild scheme.','High-usage RBs in run-first offenses can sustain value even when the passing game is limited.',6.5,'neutral',20.80,-1.2,'active','["pro-football","player-coin","rb1","new-york-b"]'::jsonb),
  ('60000000-0000-0025-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025','40000000-0000-0000-0025-000000000004',
   'NYBER1','New York B Edge Rusher Coin','Pro Football Player Coin · New York B','Tracks the New York B edge rusher role. Defensive standout in an otherwise developing roster.','Edge rusher coins can sustain individual value even when team stocks underperform.',6.5,'neutral',24.70,0.8,'active','["pro-football","player-coin","edge","new-york-b"]'::jsonb),
  ('60000000-0000-0025-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025','40000000-0000-0000-0025-000000000005',
   'NYBLB1','New York B LB1 Coin','Pro Football Player Coin · New York B','Tracks the New York B linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.5,'neutral',16.90,-0.5,'active','["pro-football","player-coin","lb1","new-york-b"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Pittsburgh player coins (team 27) ────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0027-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027','40000000-0000-0000-0027-000000000001',
   'PITQB1','Pittsburgh QB1 Coin','Pro Football Player Coin · Pittsburgh','Tracks the Pittsburgh quarterback role. Storied franchise QB sustaining legacy-brand value.','Legacy-brand QB1 coins benefit from historical narrative. The franchise identity carries pricing support.',4.5,'neutral',101.50,-0.3,'active','["pro-football","player-coin","qb1","pittsburgh"]'::jsonb),
  ('60000000-0000-0027-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027','40000000-0000-0000-0027-000000000002',
   'PITWR1','Pittsburgh WR1 Coin','Pro Football Player Coin · Pittsburgh','Tracks the Pittsburgh top receiver role. Dynamic playmaker in a spread-heavy offensive system.','WR1 coins in spread offenses with high target volume generate consistent momentum.',5.0,'neutral',63.80,-0.2,'active','["pro-football","player-coin","wr1","pittsburgh"]'::jsonb),
  ('60000000-0000-0027-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027','40000000-0000-0000-0027-000000000003',
   'PITRB1','Pittsburgh RB1 Coin','Pro Football Player Coin · Pittsburgh','Tracks the Pittsburgh lead running back role. Complementary role in a pass-dominant system.','Running back coins carry position risk — high usage often means higher injury exposure.',5.0,'neutral',46.40,-0.4,'active','["pro-football","player-coin","rb1","pittsburgh"]'::jsonb),
  ('60000000-0000-0027-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027','40000000-0000-0000-0027-000000000004',
   'PITER1','Pittsburgh Edge Rusher Coin','Pro Football Player Coin · Pittsburgh','Tracks the Pittsburgh edge rusher role. Defensive identity pass rusher in a historically strong unit.','Storied defensive franchises sustain edge rusher coin premiums through strong unit narratives.',4.5,'neutral',55.10,0.2,'active','["pro-football","player-coin","edge","pittsburgh"]'::jsonb),
  ('60000000-0000-0027-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027','40000000-0000-0000-0027-000000000005',
   'PITLB1','Pittsburgh LB1 Coin','Pro Football Player Coin · Pittsburgh','Tracks the Pittsburgh linebacker role. Defensive cornerstone in a historically strong linebacker tradition.','Legacy linebacker coins in storied franchises carry historical narrative premium.',4.5,'neutral',37.70,0.1,'active','["pro-football","player-coin","lb1","pittsburgh"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Seattle player coins (team 29) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0029-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029','40000000-0000-0000-0029-000000000001',
   'SEAQB1','Seattle QB1 Coin','Pro Football Player Coin · Seattle','Tracks the Seattle quarterback role. Competitive franchise QB sustaining playoff-level narrative.','Competitive franchise QB1 coins offer steady floor with moderate upside — solid portfolio anchors.',4.5,'neutral',85.75,-0.9,'active','["pro-football","player-coin","qb1","seattle"]'::jsonb),
  ('60000000-0000-0029-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029','40000000-0000-0000-0029-000000000002',
   'SEAWR1','Seattle WR1 Coin','Pro Football Player Coin · Seattle','Tracks the Seattle top receiver role. Reliable skill position in a balanced offensive system.','Balanced-system WR1 coins sustain steady momentum in strong offensive stretches.',5.0,'neutral',53.90,-0.6,'active','["pro-football","player-coin","wr1","seattle"]'::jsonb),
  ('60000000-0000-0029-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029','40000000-0000-0000-0029-000000000003',
   'SEARB1','Seattle RB1 Coin','Pro Football Player Coin · Seattle','Tracks the Seattle lead running back role. High-volume back in a balanced running scheme.','High-usage RBs in balanced offenses can sustain coin value across full simulated seasons.',5.5,'neutral',39.20,-0.4,'active','["pro-football","player-coin","rb1","seattle"]'::jsonb),
  ('60000000-0000-0029-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029','40000000-0000-0000-0029-000000000004',
   'SEAER1','Seattle Edge Rusher Coin','Pro Football Player Coin · Seattle','Tracks the Seattle edge rusher role. Pass-rush presence in a historically strong defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',46.55,0.4,'active','["pro-football","player-coin","edge","seattle"]'::jsonb),
  ('60000000-0000-0029-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029','40000000-0000-0000-0029-000000000005',
   'SEALB1','Seattle LB1 Coin','Pro Football Player Coin · Seattle','Tracks the Seattle linebacker role. Defensive anchor in a competitive defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.0,'neutral',31.85,0.2,'active','["pro-football","player-coin","lb1","seattle"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Tampa Bay player coins (team 30) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0030-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030','40000000-0000-0000-0030-000000000001',
   'TBQB1','Tampa Bay QB1 Coin','Pro Football Player Coin · Tampa Bay','Tracks the Tampa Bay quarterback role. Post-dynasty QB navigating a roster transition.','Post-dynasty QB1 coins carry uncertain valuations during system identity changes.',5.0,'bearish',59.50,-3.2,'active','["pro-football","player-coin","qb1","tampa-bay"]'::jsonb),
  ('60000000-0000-0030-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030','40000000-0000-0000-0030-000000000002',
   'TBWR1','Tampa Bay WR1 Coin','Pro Football Player Coin · Tampa Bay','Tracks the Tampa Bay top receiver role. Proven skill position in a transitioning offensive system.','WR1 coins can sustain individual talent premium during system transitions.',5.5,'neutral',37.40,-1.8,'active','["pro-football","player-coin","wr1","tampa-bay"]'::jsonb),
  ('60000000-0000-0030-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030','40000000-0000-0000-0030-000000000003',
   'TBRB1','Tampa Bay RB1 Coin','Pro Football Player Coin · Tampa Bay','Tracks the Tampa Bay lead running back role. Featured back in an evolving offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',5.5,'neutral',27.20,-1.0,'active','["pro-football","player-coin","rb1","tampa-bay"]'::jsonb),
  ('60000000-0000-0030-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030','40000000-0000-0000-0030-000000000004',
   'TBER1','Tampa Bay Edge Rusher Coin','Pro Football Player Coin · Tampa Bay','Tracks the Tampa Bay edge rusher role. Pass-rush presence in a transitioning defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',32.30,0.4,'active','["pro-football","player-coin","edge","tampa-bay"]'::jsonb),
  ('60000000-0000-0030-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030','40000000-0000-0000-0030-000000000005',
   'TBLB1','Tampa Bay LB1 Coin','Pro Football Player Coin · Tampa Bay','Tracks the Tampa Bay linebacker role. Defensive anchor in a transitioning unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',22.10,-0.3,'active','["pro-football","player-coin","lb1","tampa-bay"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Tennessee player coins (team 31) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0031-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031','40000000-0000-0000-0031-000000000001',
   'TENQB1','Tennessee QB1 Coin','Pro Football Player Coin · Tennessee','Tracks the Tennessee quarterback role. Consistent mid-tier QB sustaining steady competitive narrative.','Steady mid-tier QB1 coins trade with low drama — reliable but modest ceiling.',5.0,'neutral',68.25,-0.8,'active','["pro-football","player-coin","qb1","tennessee"]'::jsonb),
  ('60000000-0000-0031-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031','40000000-0000-0000-0031-000000000002',
   'TENWR1','Tennessee WR1 Coin','Pro Football Player Coin · Tennessee','Tracks the Tennessee top receiver role. Reliable skill position in a balanced offensive system.','Reliable receivers in balanced systems generate steady coin momentum through full seasons.',5.5,'neutral',42.90,-0.5,'active','["pro-football","player-coin","wr1","tennessee"]'::jsonb),
  ('60000000-0000-0031-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031','40000000-0000-0000-0031-000000000003',
   'TENRB1','Tennessee RB1 Coin','Pro Football Player Coin · Tennessee','Tracks the Tennessee lead running back role. High-volume feature back in a run-identity offense.','High-usage RBs in run-first systems can sustain value across full simulated seasons.',5.5,'neutral',31.20,-0.4,'active','["pro-football","player-coin","rb1","tennessee"]'::jsonb),
  ('60000000-0000-0031-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031','40000000-0000-0000-0031-000000000004',
   'TENER1','Tennessee Edge Rusher Coin','Pro Football Player Coin · Tennessee','Tracks the Tennessee edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',37.05,0.3,'active','["pro-football","player-coin","edge","tennessee"]'::jsonb),
  ('60000000-0000-0031-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031','40000000-0000-0000-0031-000000000005',
   'TENLB1','Tennessee LB1 Coin','Pro Football Player Coin · Tennessee','Tracks the Tennessee linebacker role. Defensive anchor in a competitive defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',25.35,0.1,'active','["pro-football","player-coin","lb1","tennessee"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Washington player coins (team 32) ────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0032-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032','40000000-0000-0000-0032-000000000001',
   'WASQB1','Washington QB1 Coin','Pro Football Player Coin · Washington','Tracks the Washington quarterback role. New-era franchise QB generating early-rebuild optimism.','New-era QB1 coins carry speculative upside. Early entry is riskier but inflection rewards are higher.',5.5,'neutral',49.00,1.2,'active','["pro-football","player-coin","qb1","washington"]'::jsonb),
  ('60000000-0000-0032-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032','40000000-0000-0000-0032-000000000002',
   'WASWR1','Washington WR1 Coin','Pro Football Player Coin · Washington','Tracks the Washington top receiver role. Developing skill position in a rebuilding offense.','WR1 coins on rebuilds can sustain through individual talent even when system productivity is limited.',6.0,'neutral',30.80,0.8,'active','["pro-football","player-coin","wr1","washington"]'::jsonb),
  ('60000000-0000-0032-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032','40000000-0000-0000-0032-000000000003',
   'WASRB1','Washington RB1 Coin','Pro Football Player Coin · Washington','Tracks the Washington lead running back role. Feature back in a developing scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',22.40,0.4,'active','["pro-football","player-coin","rb1","washington"]'::jsonb),
  ('60000000-0000-0032-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032','40000000-0000-0000-0032-000000000004',
   'WASER1','Washington Edge Rusher Coin','Pro Football Player Coin · Washington','Tracks the Washington edge rusher role. Pass-rush standout in a developing defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',26.60,0.7,'active','["pro-football","player-coin","edge","washington"]'::jsonb),
  ('60000000-0000-0032-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032','40000000-0000-0000-0032-000000000005',
   'WASLB1','Washington LB1 Coin','Pro Football Player Coin · Washington','Tracks the Washington linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',18.20,0.2,'active','["pro-football","player-coin","lb1","washington"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- FUTURES MARKET DEFINITIONS (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.futures_markets
  (id, asset_id, future_type, public_name, settlement_rule, status)
values
  ('70000000-0000-0001-0001-000000000001',
   '60000000-0000-0000-0002-000000000001',
   'award', 'Pro Football MVP Future',
   'Settles at season end based on simulated cumulative performance score. Highest scorer wins.',
   'open'),
  ('70000000-0000-0001-0001-000000000002',
   '60000000-0000-0000-0002-000000000002',
   'championship', 'Pro Football Championship Future',
   'Settles when the simulated championship game result is recorded.',
   'open'),
  ('70000000-0000-0001-0001-000000000003',
   '60000000-0000-0000-0002-000000000003',
   'coach_momentum', 'Pro Football Coach of the Year Future',
   'Settles at season end based on simulated coach performance composite.',
   'open'),
  ('70000000-0000-0001-0001-000000000004',
   '60000000-0000-0000-0002-000000000004',
   'award', 'Pro Football Offensive Rookie Future',
   'Settles at season end based on simulated rookie performance metrics.',
   'open'),
  ('70000000-0000-0001-0001-000000000005',
   '60000000-0000-0000-0002-000000000005',
   'comeback', 'Pro Football Comeback Future',
   'Settles at season end based on simulated comeback narrative score.',
   'open'),
  ('70000000-0000-0001-0001-000000000006',
   '60000000-0000-0000-0002-000000000006',
   'championship', 'MMA Championship Future',
   'Settles on simulated championship fight result. Binary outcome.',
   'open')
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- INITIAL PRICE HISTORY
-- Seed prices for all seeded assets.
-- Note: this table is append-only with no unique constraint on
-- (asset_id, source_type). Re-running the seed adds duplicate
-- seed rows, which is harmless since prices are append-only.
-- ─────────────────────────────────────────────────────────────

-- Indexes and futures seed prices (unchanged from v1)
insert into public.asset_price_history
  (asset_id, price, change_percent, reason, source_type)
values
  ('60000000-0000-0000-0001-000000000001', 1580.00,  1.4, 'Seed price — Pro Football Power Index',          'seed'),
  ('60000000-0000-0000-0001-000000000002',  940.50, -0.8, 'Seed price — Pro Basketball Stars Index',        'seed'),
  ('60000000-0000-0000-0001-000000000003',  420.25,  3.2, 'Seed price — MMA Chaos Index',                   'seed'),
  ('60000000-0000-0000-0001-000000000004', 1842.50,  1.8, 'Seed price — Fanfolio 100',                      'seed'),
  ('60000000-0000-0000-0002-000000000001',  245.00,  4.2, 'Seed price — Pro Football MVP Future',           'seed'),
  ('60000000-0000-0000-0002-000000000002',  318.00, -1.1, 'Seed price — Pro Football Championship Future',  'seed'),
  ('60000000-0000-0000-0002-000000000003',  182.00,  0.5, 'Seed price — COTY Future',                       'seed'),
  ('60000000-0000-0000-0002-000000000004',  156.00,  3.8, 'Seed price — OROTY Future',                      'seed'),
  ('60000000-0000-0000-0002-000000000005',  128.00,  1.2, 'Seed price — Comeback Future',                   'seed'),
  ('60000000-0000-0000-0002-000000000006',   88.50,  6.4, 'Seed price — MMA Championship Future',           'seed'),
  ('60000000-0000-0000-0003-000000000001',   14.20, -8.4, 'Seed price — ChokeCoin',                         'seed'),
  ('60000000-0000-0000-0003-000000000002',   22.80, 11.2, 'Seed price — DramaCoin',                         'seed'),
  ('60000000-0000-0000-0003-000000000003',    9.60,  4.8, 'Seed price — UpsetCoin',                         'seed'),
  ('60000000-0000-0000-0003-000000000004',   31.40,  7.3, 'Seed price — FourthQuarterCoin',                 'seed'),
  ('60000000-0000-0000-0003-000000000005',    7.80,-12.1, 'Seed price — KnockoutCoin',                      'seed'),
  ('60000000-0000-0000-0003-000000000006',   48.60,  5.9, 'Seed price — ComebackCoin',                      'seed');

-- Team Stock seed prices (32 rows)
insert into public.asset_price_history
  (asset_id, price, change_percent, reason, source_type)
values
  ('60000000-0000-0001-0004-000000000001',  145.00, -0.4, 'Seed price — Arizona Football Team Stock',             'seed'),
  ('60000000-0000-0002-0004-000000000001',  175.00, -0.7, 'Seed price — Atlanta Football Team Stock',             'seed'),
  ('60000000-0000-0003-0004-000000000001',  410.00,  1.5, 'Seed price — Baltimore Football Team Stock',           'seed'),
  ('60000000-0000-0004-0004-000000000001',  370.00,  1.2, 'Seed price — Buffalo Football Team Stock',             'seed'),
  ('60000000-0000-0005-0004-000000000001',  118.00, -3.1, 'Seed price — Carolina Football Team Stock',            'seed'),
  ('60000000-0000-0006-0004-000000000001',  138.00,  1.2, 'Seed price — Chicago Football Team Stock',             'seed'),
  ('60000000-0000-0007-0004-000000000001',  240.00,  1.4, 'Seed price — Cincinnati Football Team Stock',          'seed'),
  ('60000000-0000-0008-0004-000000000001',  165.00, -0.8, 'Seed price — Cleveland Football Team Stock',           'seed'),
  ('60000000-0000-0009-0004-000000000001',  355.00, -0.3, 'Seed price — Dallas Football Team Stock',              'seed'),
  ('60000000-0000-0010-0004-000000000001',  150.00, -2.4, 'Seed price — Denver Football Team Stock',              'seed'),
  ('60000000-0000-0011-0004-000000000001',  380.00,  2.4, 'Seed price — Detroit Football Team Stock',             'seed'),
  ('60000000-0000-0012-0004-000000000001',  330.00,  0.4, 'Seed price — Green Bay Football Team Stock',           'seed'),
  ('60000000-0000-0013-0004-000000000001',  250.00,  3.2, 'Seed price — Houston Football Team Stock',             'seed'),
  ('60000000-0000-0014-0004-000000000001',  215.00,  0.5, 'Seed price — Indianapolis Football Team Stock',        'seed'),
  ('60000000-0000-0015-0004-000000000001',  125.00, -1.4, 'Seed price — Jacksonville Football Team Stock',        'seed'),
  ('60000000-0000-0016-0004-000000000001',  480.00,  2.1, 'Seed price — Kansas City Football Team Stock',         'seed'),
  ('60000000-0000-0017-0004-000000000001',  190.00, -1.2, 'Seed price — Las Vegas Football Team Stock',           'seed'),
  ('60000000-0000-0018-0004-000000000001',  305.00,  0.7, 'Seed price — Los Angeles A Football Team Stock',       'seed'),
  ('60000000-0000-0019-0004-000000000001',  195.00,  0.8, 'Seed price — Los Angeles B Football Team Stock',       'seed'),
  ('60000000-0000-0020-0004-000000000001',  255.00,  1.1, 'Seed price — Miami Football Team Stock',               'seed'),
  ('60000000-0000-0021-0004-000000000001',  275.00,  1.6, 'Seed price — Minnesota Football Team Stock',           'seed'),
  ('60000000-0000-0022-0004-000000000001',  225.00, -1.8, 'Seed price — New England Football Team Stock',         'seed'),
  ('60000000-0000-0023-0004-000000000001',  160.00, -1.5, 'Seed price — New Orleans Football Team Stock',         'seed'),
  ('60000000-0000-0024-0004-000000000001',  155.00, -1.9, 'Seed price — New York A Football Team Stock',          'seed'),
  ('60000000-0000-0025-0004-000000000001',  130.00, -2.8, 'Seed price — New York B Football Team Stock',          'seed'),
  ('60000000-0000-0026-0004-000000000001',  420.00,  1.8, 'Seed price — Philadelphia Football Team Stock',        'seed'),
  ('60000000-0000-0027-0004-000000000001',  290.00, -0.2, 'Seed price — Pittsburgh Football Team Stock',          'seed'),
  ('60000000-0000-0028-0004-000000000001',  395.00,  0.9, 'Seed price — San Francisco Football Team Stock',       'seed'),
  ('60000000-0000-0029-0004-000000000001',  245.00, -0.6, 'Seed price — Seattle Football Team Stock',             'seed'),
  ('60000000-0000-0030-0004-000000000001',  170.00, -2.1, 'Seed price — Tampa Bay Football Team Stock',           'seed'),
  ('60000000-0000-0031-0004-000000000001',  195.00, -0.5, 'Seed price — Tennessee Football Team Stock',           'seed'),
  ('60000000-0000-0032-0004-000000000001',  140.00,  0.8, 'Seed price — Washington Football Team Stock',          'seed');

-- Player Coin seed prices (160 rows — 32 teams × 5 roles each)
insert into public.asset_price_history
  (asset_id, price, change_percent, reason, source_type)
values
  -- Kansas City
  ('60000000-0000-0016-0005-000000000001', 168.00,  3.2, 'Seed price — Kansas City QB1 Coin',           'seed'),
  ('60000000-0000-0016-0005-000000000002', 105.60,  1.8, 'Seed price — Kansas City TE1 Coin',           'seed'),
  ('60000000-0000-0016-0005-000000000003',  96.00,  1.5, 'Seed price — Kansas City WR1 Coin',           'seed'),
  ('60000000-0000-0016-0005-000000000004',  76.80,  0.8, 'Seed price — Kansas City RB1 Coin',           'seed'),
  ('60000000-0000-0016-0005-000000000005',  91.20,  2.4, 'Seed price — Kansas City Edge Rusher Coin',   'seed'),
  -- Baltimore
  ('60000000-0000-0003-0005-000000000001', 143.50,  2.1, 'Seed price — Baltimore QB1 Coin',             'seed'),
  ('60000000-0000-0003-0005-000000000002',  90.20,  1.8, 'Seed price — Baltimore WR1 Coin',             'seed'),
  ('60000000-0000-0003-0005-000000000003',  77.90,  1.4, 'Seed price — Baltimore Edge Rusher Coin',     'seed'),
  ('60000000-0000-0003-0005-000000000004',  53.30,  1.2, 'Seed price — Baltimore LB1 Coin',             'seed'),
  ('60000000-0000-0003-0005-000000000005',  65.60,  0.5, 'Seed price — Baltimore RB1 Coin',             'seed'),
  -- Detroit
  ('60000000-0000-0011-0005-000000000001', 133.00,  3.6, 'Seed price — Detroit QB1 Coin',               'seed'),
  ('60000000-0000-0011-0005-000000000002',  83.60,  2.8, 'Seed price — Detroit WR1 Coin',               'seed'),
  ('60000000-0000-0011-0005-000000000003',  60.80,  1.1, 'Seed price — Detroit RB1 Coin',               'seed'),
  ('60000000-0000-0011-0005-000000000004',  83.60,  2.5, 'Seed price — Detroit TE1 Coin',               'seed'),
  ('60000000-0000-0011-0005-000000000005',  72.20,  2.0, 'Seed price — Detroit Edge Rusher Coin',       'seed'),
  -- Dallas
  ('60000000-0000-0009-0005-000000000001', 124.25, -0.5, 'Seed price — Dallas QB1 Coin',                'seed'),
  ('60000000-0000-0009-0005-000000000002',  67.45,  0.8, 'Seed price — Dallas Edge Rusher Coin',        'seed'),
  ('60000000-0000-0009-0005-000000000003',  78.10, -0.3, 'Seed price — Dallas WR1 Coin',                'seed'),
  ('60000000-0000-0009-0005-000000000004',  56.80, -0.8, 'Seed price — Dallas RB1 Coin',                'seed'),
  ('60000000-0000-0009-0005-000000000005',  46.15, -1.1, 'Seed price — Dallas CB1 Coin',                'seed'),
  -- San Francisco
  ('60000000-0000-0028-0005-000000000001', 138.25,  1.4, 'Seed price — San Francisco QB1 Coin',         'seed'),
  ('60000000-0000-0028-0005-000000000002',  86.90,  1.1, 'Seed price — San Francisco WR1 Coin',         'seed'),
  ('60000000-0000-0028-0005-000000000003',  63.20,  0.6, 'Seed price — San Francisco RB1 Coin',         'seed'),
  ('60000000-0000-0028-0005-000000000004',  86.90,  0.9, 'Seed price — San Francisco TE1 Coin',         'seed'),
  ('60000000-0000-0028-0005-000000000005',  59.25,  0.7, 'Seed price — San Francisco DL1 Coin',         'seed'),
  -- Buffalo
  ('60000000-0000-0004-0005-000000000001', 129.50,  1.8, 'Seed price — Buffalo QB1 Coin',               'seed'),
  ('60000000-0000-0004-0005-000000000002',  81.40,  1.5, 'Seed price — Buffalo WR1 Coin',               'seed'),
  ('60000000-0000-0004-0005-000000000003',  81.40,  0.9, 'Seed price — Buffalo TE1 Coin',               'seed'),
  ('60000000-0000-0004-0005-000000000004',  59.20,  0.4, 'Seed price — Buffalo RB1 Coin',               'seed'),
  ('60000000-0000-0004-0005-000000000005',  48.10, -0.2, 'Seed price — Buffalo CB1 Coin',               'seed'),
  -- Philadelphia
  ('60000000-0000-0026-0005-000000000001', 147.00,  2.7, 'Seed price — Philadelphia QB1 Coin',          'seed'),
  ('60000000-0000-0026-0005-000000000002',  92.40,  1.8, 'Seed price — Philadelphia WR1 Coin',          'seed'),
  ('60000000-0000-0026-0005-000000000003',  79.80,  1.5, 'Seed price — Philadelphia Edge Rusher Coin',  'seed'),
  ('60000000-0000-0026-0005-000000000004',  67.20,  0.9, 'Seed price — Philadelphia RB1 Coin',          'seed'),
  ('60000000-0000-0026-0005-000000000005',  92.40,  1.2, 'Seed price — Philadelphia TE1 Coin',          'seed'),
  -- Las Vegas
  ('60000000-0000-0017-0005-000000000001',  66.50, -1.8, 'Seed price — Las Vegas QB1 Coin',             'seed'),
  ('60000000-0000-0017-0005-000000000002',  30.40, -2.4, 'Seed price — Las Vegas RB1 Coin',             'seed'),
  ('60000000-0000-0017-0005-000000000003',  41.80, -1.2, 'Seed price — Las Vegas WR1 Coin',             'seed'),
  ('60000000-0000-0017-0005-000000000004',  41.80, -0.8, 'Seed price — Las Vegas TE1 Coin',             'seed'),
  ('60000000-0000-0017-0005-000000000005',  36.10, -1.5, 'Seed price — Las Vegas Edge Rusher Coin',     'seed'),
  -- Arizona
  ('60000000-0000-0001-0005-000000000001',  50.75, -0.6, 'Seed price — Arizona QB1 Coin',               'seed'),
  ('60000000-0000-0001-0005-000000000002',  31.90, -1.2, 'Seed price — Arizona WR1 Coin',               'seed'),
  ('60000000-0000-0001-0005-000000000003',  23.20, -0.8, 'Seed price — Arizona RB1 Coin',               'seed'),
  ('60000000-0000-0001-0005-000000000004',  27.55,  0.4, 'Seed price — Arizona Edge Rusher Coin',       'seed'),
  ('60000000-0000-0001-0005-000000000005',  18.85, -0.3, 'Seed price — Arizona LB1 Coin',               'seed'),
  -- Atlanta
  ('60000000-0000-0002-0005-000000000001',  61.25, -1.0, 'Seed price — Atlanta QB1 Coin',               'seed'),
  ('60000000-0000-0002-0005-000000000002',  38.50,  1.4, 'Seed price — Atlanta WR1 Coin',               'seed'),
  ('60000000-0000-0002-0005-000000000003',  28.00, -0.5, 'Seed price — Atlanta RB1 Coin',               'seed'),
  ('60000000-0000-0002-0005-000000000004',  33.25,  0.8, 'Seed price — Atlanta Edge Rusher Coin',       'seed'),
  ('60000000-0000-0002-0005-000000000005',  22.75, -0.3, 'Seed price — Atlanta LB1 Coin',               'seed'),
  -- Carolina
  ('60000000-0000-0005-0005-000000000001',  41.30, -4.2, 'Seed price — Carolina QB1 Coin',              'seed'),
  ('60000000-0000-0005-0005-000000000002',  25.96, -2.8, 'Seed price — Carolina WR1 Coin',              'seed'),
  ('60000000-0000-0005-0005-000000000003',  18.88, -1.5, 'Seed price — Carolina RB1 Coin',              'seed'),
  ('60000000-0000-0005-0005-000000000004',  22.42,  1.1, 'Seed price — Carolina Edge Rusher Coin',      'seed'),
  ('60000000-0000-0005-0005-000000000005',  15.34, -0.5, 'Seed price — Carolina LB1 Coin',              'seed'),
  -- Chicago
  ('60000000-0000-0006-0005-000000000001',  48.30,  1.8, 'Seed price — Chicago QB1 Coin',               'seed'),
  ('60000000-0000-0006-0005-000000000002',  30.36,  2.1, 'Seed price — Chicago WR1 Coin',               'seed'),
  ('60000000-0000-0006-0005-000000000003',  22.08,  0.4, 'Seed price — Chicago RB1 Coin',               'seed'),
  ('60000000-0000-0006-0005-000000000004',  26.22,  0.9, 'Seed price — Chicago Edge Rusher Coin',       'seed'),
  ('60000000-0000-0006-0005-000000000005',  17.94,  0.2, 'Seed price — Chicago LB1 Coin',               'seed'),
  -- Cincinnati
  ('60000000-0000-0007-0005-000000000001',  84.00,  2.1, 'Seed price — Cincinnati QB1 Coin',            'seed'),
  ('60000000-0000-0007-0005-000000000002',  52.80,  2.8, 'Seed price — Cincinnati WR1 Coin',            'seed'),
  ('60000000-0000-0007-0005-000000000003',  38.40,  0.6, 'Seed price — Cincinnati RB1 Coin',            'seed'),
  ('60000000-0000-0007-0005-000000000004',  45.60,  0.9, 'Seed price — Cincinnati Edge Rusher Coin',    'seed'),
  ('60000000-0000-0007-0005-000000000005',  31.20,  0.4, 'Seed price — Cincinnati LB1 Coin',            'seed'),
  -- Cleveland
  ('60000000-0000-0008-0005-000000000001',  57.75, -1.2, 'Seed price — Cleveland QB1 Coin',             'seed'),
  ('60000000-0000-0008-0005-000000000002',  36.30, -0.8, 'Seed price — Cleveland WR1 Coin',             'seed'),
  ('60000000-0000-0008-0005-000000000003',  26.40,  0.4, 'Seed price — Cleveland RB1 Coin',             'seed'),
  ('60000000-0000-0008-0005-000000000004',  31.35,  0.7, 'Seed price — Cleveland Edge Rusher Coin',     'seed'),
  ('60000000-0000-0008-0005-000000000005',  21.45, -0.2, 'Seed price — Cleveland LB1 Coin',             'seed'),
  -- Denver
  ('60000000-0000-0010-0005-000000000001',  52.50, -3.6, 'Seed price — Denver QB1 Coin',                'seed'),
  ('60000000-0000-0010-0005-000000000002',  33.00, -1.4, 'Seed price — Denver WR1 Coin',                'seed'),
  ('60000000-0000-0010-0005-000000000003',  24.00, -0.8, 'Seed price — Denver RB1 Coin',                'seed'),
  ('60000000-0000-0010-0005-000000000004',  28.50,  0.6, 'Seed price — Denver Edge Rusher Coin',        'seed'),
  ('60000000-0000-0010-0005-000000000005',  19.50, -0.4, 'Seed price — Denver LB1 Coin',                'seed'),
  -- Green Bay
  ('60000000-0000-0012-0005-000000000001', 115.50,  0.6, 'Seed price — Green Bay QB1 Coin',             'seed'),
  ('60000000-0000-0012-0005-000000000002',  72.60,  0.4, 'Seed price — Green Bay WR1 Coin',             'seed'),
  ('60000000-0000-0012-0005-000000000003',  52.80,  0.2, 'Seed price — Green Bay RB1 Coin',             'seed'),
  ('60000000-0000-0012-0005-000000000004',  62.70,  0.8, 'Seed price — Green Bay Edge Rusher Coin',     'seed'),
  ('60000000-0000-0012-0005-000000000005',  42.90,  0.1, 'Seed price — Green Bay LB1 Coin',             'seed'),
  -- Houston
  ('60000000-0000-0013-0005-000000000001',  87.50,  4.8, 'Seed price — Houston QB1 Coin',               'seed'),
  ('60000000-0000-0013-0005-000000000002',  55.00,  3.1, 'Seed price — Houston WR1 Coin',               'seed'),
  ('60000000-0000-0013-0005-000000000003',  40.00,  1.4, 'Seed price — Houston RB1 Coin',               'seed'),
  ('60000000-0000-0013-0005-000000000004',  47.50,  1.8, 'Seed price — Houston Edge Rusher Coin',       'seed'),
  ('60000000-0000-0013-0005-000000000005',  32.50,  0.8, 'Seed price — Houston LB1 Coin',               'seed'),
  -- Indianapolis
  ('60000000-0000-0014-0005-000000000001',  75.25,  0.8, 'Seed price — Indianapolis QB1 Coin',          'seed'),
  ('60000000-0000-0014-0005-000000000002',  47.30,  0.5, 'Seed price — Indianapolis WR1 Coin',          'seed'),
  ('60000000-0000-0014-0005-000000000003',  34.40,  0.3, 'Seed price — Indianapolis RB1 Coin',          'seed'),
  ('60000000-0000-0014-0005-000000000004',  40.85,  0.6, 'Seed price — Indianapolis Edge Rusher Coin',  'seed'),
  ('60000000-0000-0014-0005-000000000005',  27.95,  0.2, 'Seed price — Indianapolis LB1 Coin',          'seed'),
  -- Jacksonville
  ('60000000-0000-0015-0005-000000000001',  43.75, -2.1, 'Seed price — Jacksonville QB1 Coin',          'seed'),
  ('60000000-0000-0015-0005-000000000002',  27.50, -1.2, 'Seed price — Jacksonville WR1 Coin',          'seed'),
  ('60000000-0000-0015-0005-000000000003',  20.00, -0.6, 'Seed price — Jacksonville RB1 Coin',          'seed'),
  ('60000000-0000-0015-0005-000000000004',  23.75,  0.9, 'Seed price — Jacksonville Edge Rusher Coin',  'seed'),
  ('60000000-0000-0015-0005-000000000005',  16.25, -0.4, 'Seed price — Jacksonville LB1 Coin',          'seed'),
  -- Los Angeles A
  ('60000000-0000-0018-0005-000000000001', 106.75,  1.1, 'Seed price — Los Angeles A QB1 Coin',         'seed'),
  ('60000000-0000-0018-0005-000000000002',  67.10,  0.8, 'Seed price — Los Angeles A WR1 Coin',         'seed'),
  ('60000000-0000-0018-0005-000000000003',  48.80,  0.4, 'Seed price — Los Angeles A RB1 Coin',         'seed'),
  ('60000000-0000-0018-0005-000000000004',  57.95,  0.6, 'Seed price — Los Angeles A Edge Rusher Coin', 'seed'),
  ('60000000-0000-0018-0005-000000000005',  39.65,  0.3, 'Seed price — Los Angeles A LB1 Coin',         'seed'),
  -- Los Angeles B
  ('60000000-0000-0019-0005-000000000001',  68.25,  1.2, 'Seed price — Los Angeles B QB1 Coin',         'seed'),
  ('60000000-0000-0019-0005-000000000002',  42.90,  0.8, 'Seed price — Los Angeles B WR1 Coin',         'seed'),
  ('60000000-0000-0019-0005-000000000003',  31.20,  0.2, 'Seed price — Los Angeles B RB1 Coin',         'seed'),
  ('60000000-0000-0019-0005-000000000004',  37.05,  0.5, 'Seed price — Los Angeles B Edge Rusher Coin', 'seed'),
  ('60000000-0000-0019-0005-000000000005',  25.35,  0.1, 'Seed price — Los Angeles B LB1 Coin',         'seed'),
  -- Miami
  ('60000000-0000-0020-0005-000000000001',  89.25,  1.7, 'Seed price — Miami QB1 Coin',                 'seed'),
  ('60000000-0000-0020-0005-000000000002',  56.10,  1.4, 'Seed price — Miami WR1 Coin',                 'seed'),
  ('60000000-0000-0020-0005-000000000003',  40.80,  0.6, 'Seed price — Miami RB1 Coin',                 'seed'),
  ('60000000-0000-0020-0005-000000000004',  48.45,  0.8, 'Seed price — Miami Edge Rusher Coin',         'seed'),
  ('60000000-0000-0020-0005-000000000005',  33.15,  0.3, 'Seed price — Miami LB1 Coin',                 'seed'),
  -- Minnesota
  ('60000000-0000-0021-0005-000000000001',  96.25,  2.4, 'Seed price — Minnesota QB1 Coin',             'seed'),
  ('60000000-0000-0021-0005-000000000002',  60.50,  1.8, 'Seed price — Minnesota WR1 Coin',             'seed'),
  ('60000000-0000-0021-0005-000000000003',  44.00,  0.8, 'Seed price — Minnesota RB1 Coin',             'seed'),
  ('60000000-0000-0021-0005-000000000004',  52.25,  1.0, 'Seed price — Minnesota Edge Rusher Coin',     'seed'),
  ('60000000-0000-0021-0005-000000000005',  35.75,  0.4, 'Seed price — Minnesota LB1 Coin',             'seed'),
  -- New England
  ('60000000-0000-0022-0005-000000000001',  78.75, -2.7, 'Seed price — New England QB1 Coin',           'seed'),
  ('60000000-0000-0022-0005-000000000002',  49.50, -1.4, 'Seed price — New England WR1 Coin',           'seed'),
  ('60000000-0000-0022-0005-000000000003',  36.00, -0.8, 'Seed price — New England RB1 Coin',           'seed'),
  ('60000000-0000-0022-0005-000000000004',  42.75, -0.6, 'Seed price — New England Edge Rusher Coin',   'seed'),
  ('60000000-0000-0022-0005-000000000005',  29.25, -0.4, 'Seed price — New England LB1 Coin',           'seed'),
  -- New Orleans
  ('60000000-0000-0023-0005-000000000001',  56.00, -2.3, 'Seed price — New Orleans QB1 Coin',           'seed'),
  ('60000000-0000-0023-0005-000000000002',  35.20, -1.1, 'Seed price — New Orleans WR1 Coin',           'seed'),
  ('60000000-0000-0023-0005-000000000003',  25.60, -0.6, 'Seed price — New Orleans RB1 Coin',           'seed'),
  ('60000000-0000-0023-0005-000000000004',  30.40,  0.5, 'Seed price — New Orleans Edge Rusher Coin',   'seed'),
  ('60000000-0000-0023-0005-000000000005',  20.80, -0.2, 'Seed price — New Orleans LB1 Coin',           'seed'),
  -- New York A
  ('60000000-0000-0024-0005-000000000001',  54.25, -2.9, 'Seed price — New York A QB1 Coin',            'seed'),
  ('60000000-0000-0024-0005-000000000002',  34.10, -1.4, 'Seed price — New York A WR1 Coin',            'seed'),
  ('60000000-0000-0024-0005-000000000003',  24.80, -0.8, 'Seed price — New York A RB1 Coin',            'seed'),
  ('60000000-0000-0024-0005-000000000004',  29.45,  0.6, 'Seed price — New York A Edge Rusher Coin',    'seed'),
  ('60000000-0000-0024-0005-000000000005',  20.15, -0.3, 'Seed price — New York A LB1 Coin',            'seed'),
  -- New York B
  ('60000000-0000-0025-0005-000000000001',  45.50, -4.2, 'Seed price — New York B QB1 Coin',            'seed'),
  ('60000000-0000-0025-0005-000000000002',  28.60, -2.1, 'Seed price — New York B WR1 Coin',            'seed'),
  ('60000000-0000-0025-0005-000000000003',  20.80, -1.2, 'Seed price — New York B RB1 Coin',            'seed'),
  ('60000000-0000-0025-0005-000000000004',  24.70,  0.8, 'Seed price — New York B Edge Rusher Coin',    'seed'),
  ('60000000-0000-0025-0005-000000000005',  16.90, -0.5, 'Seed price — New York B LB1 Coin',            'seed'),
  -- Pittsburgh
  ('60000000-0000-0027-0005-000000000001', 101.50, -0.3, 'Seed price — Pittsburgh QB1 Coin',            'seed'),
  ('60000000-0000-0027-0005-000000000002',  63.80, -0.2, 'Seed price — Pittsburgh WR1 Coin',            'seed'),
  ('60000000-0000-0027-0005-000000000003',  46.40, -0.4, 'Seed price — Pittsburgh RB1 Coin',            'seed'),
  ('60000000-0000-0027-0005-000000000004',  55.10,  0.2, 'Seed price — Pittsburgh Edge Rusher Coin',    'seed'),
  ('60000000-0000-0027-0005-000000000005',  37.70,  0.1, 'Seed price — Pittsburgh LB1 Coin',            'seed'),
  -- Seattle
  ('60000000-0000-0029-0005-000000000001',  85.75, -0.9, 'Seed price — Seattle QB1 Coin',               'seed'),
  ('60000000-0000-0029-0005-000000000002',  53.90, -0.6, 'Seed price — Seattle WR1 Coin',               'seed'),
  ('60000000-0000-0029-0005-000000000003',  39.20, -0.4, 'Seed price — Seattle RB1 Coin',               'seed'),
  ('60000000-0000-0029-0005-000000000004',  46.55,  0.4, 'Seed price — Seattle Edge Rusher Coin',       'seed'),
  ('60000000-0000-0029-0005-000000000005',  31.85,  0.2, 'Seed price — Seattle LB1 Coin',               'seed'),
  -- Tampa Bay
  ('60000000-0000-0030-0005-000000000001',  59.50, -3.2, 'Seed price — Tampa Bay QB1 Coin',             'seed'),
  ('60000000-0000-0030-0005-000000000002',  37.40, -1.8, 'Seed price — Tampa Bay WR1 Coin',             'seed'),
  ('60000000-0000-0030-0005-000000000003',  27.20, -1.0, 'Seed price — Tampa Bay RB1 Coin',             'seed'),
  ('60000000-0000-0030-0005-000000000004',  32.30,  0.4, 'Seed price — Tampa Bay Edge Rusher Coin',     'seed'),
  ('60000000-0000-0030-0005-000000000005',  22.10, -0.3, 'Seed price — Tampa Bay LB1 Coin',             'seed'),
  -- Tennessee
  ('60000000-0000-0031-0005-000000000001',  68.25, -0.8, 'Seed price — Tennessee QB1 Coin',             'seed'),
  ('60000000-0000-0031-0005-000000000002',  42.90, -0.5, 'Seed price — Tennessee WR1 Coin',             'seed'),
  ('60000000-0000-0031-0005-000000000003',  31.20, -0.4, 'Seed price — Tennessee RB1 Coin',             'seed'),
  ('60000000-0000-0031-0005-000000000004',  37.05,  0.3, 'Seed price — Tennessee Edge Rusher Coin',     'seed'),
  ('60000000-0000-0031-0005-000000000005',  25.35,  0.1, 'Seed price — Tennessee LB1 Coin',             'seed'),
  -- Washington
  ('60000000-0000-0032-0005-000000000001',  49.00,  1.2, 'Seed price — Washington QB1 Coin',            'seed'),
  ('60000000-0000-0032-0005-000000000002',  30.80,  0.8, 'Seed price — Washington WR1 Coin',            'seed'),
  ('60000000-0000-0032-0005-000000000003',  22.40,  0.4, 'Seed price — Washington RB1 Coin',            'seed'),
  ('60000000-0000-0032-0005-000000000004',  26.60,  0.7, 'Seed price — Washington Edge Rusher Coin',    'seed'),
  ('60000000-0000-0032-0005-000000000005',  18.20,  0.2, 'Seed price — Washington LB1 Coin',            'seed');
