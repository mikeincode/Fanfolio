-- ============================================================
-- Fanfolio Market Seed v1
-- ============================================================
-- Run AFTER fanfolio_market_schema.sql.
-- Idempotent: uses INSERT ... ON CONFLICT DO NOTHING.
--
-- Seed coverage:
--   - 7 sports
--   - 7 leagues
--   - 30 generic Pro Football teams
--   - 40 player role assets (8 featured teams × 5 roles each)
--   - 6 coach role assets
--   - 4 sport index assets
--   - 6 futures assets
--   - 6 meme coin assets
--   - initial prices for all seeded assets
--
-- SAFETY: All names are generic Fanfolio names only.
-- No real team names, player names, coach names, or official marks.
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
-- 30 GENERIC PRO FOOTBALL TEAMS
-- City names only — no mascots, no official marks.
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
  ('30000000-0000-0000-0000-000000000031','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Tennessee',     'Tennessee Football Team',      'TEN Football', 'TEN',  '#4B92DB', 5.0),
  ('30000000-0000-0000-0000-000000000032','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','Washington',    'Washington Football Team',     'WAS Football', 'WAS',  '#5A1414', 5.0)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- PLAYER ROLES — 8 featured teams, 5 roles each (40 total)
-- ─────────────────────────────────────────────────────────────

-- Kansas City (16)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0001-000000000001','30000000-0000-0000-0000-000000000016','QB1',          'Kansas City QB1',           'Quarterback',  'KCQB1',  10, 4.0),
  ('40000000-0000-0000-0001-000000000002','30000000-0000-0000-0000-000000000016','TE1',          'Kansas City TE1',           'Tight End',    'KCTF1',  8,  5.0),
  ('40000000-0000-0000-0001-000000000003','30000000-0000-0000-0000-000000000016','WR1',          'Kansas City WR1',           'Wide Receiver','KCWR1',  7,  5.5),
  ('40000000-0000-0000-0001-000000000004','30000000-0000-0000-0000-000000000016','RB1',          'Kansas City RB1',           'Running Back', 'KCRB1',  6,  5.0),
  ('40000000-0000-0000-0001-000000000005','30000000-0000-0000-0000-000000000016','Edge Rusher',  'Kansas City Edge Rusher',   'Defensive End','KCER1',  7,  5.5)
on conflict do nothing;

-- Baltimore (3)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0003-000000000001','30000000-0000-0000-0000-000000000003','QB1',          'Baltimore QB1',             'Quarterback',  'BALQB1', 10, 4.0),
  ('40000000-0000-0000-0003-000000000002','30000000-0000-0000-0000-000000000003','WR1',          'Baltimore WR1',             'Wide Receiver','BALWR1', 7,  5.5),
  ('40000000-0000-0000-0003-000000000003','30000000-0000-0000-0000-000000000003','Edge Rusher',  'Baltimore Edge Rusher',     'Defensive End','BALER1', 8,  5.0),
  ('40000000-0000-0000-0003-000000000004','30000000-0000-0000-0000-000000000003','LB1',          'Baltimore LB1',             'Linebacker',   'BALLB1', 7,  5.0),
  ('40000000-0000-0000-0003-000000000005','30000000-0000-0000-0000-000000000003','RB1',          'Baltimore RB1',             'Running Back', 'BALRB1', 6,  5.5)
on conflict do nothing;

-- Detroit (11)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0011-000000000001','30000000-0000-0000-0000-000000000011','QB1',          'Detroit QB1',               'Quarterback',  'DETQB1', 9,  4.5),
  ('40000000-0000-0000-0011-000000000002','30000000-0000-0000-0000-000000000011','WR1',          'Detroit WR1',               'Wide Receiver','DETWR1', 9,  5.0),
  ('40000000-0000-0000-0011-000000000003','30000000-0000-0000-0000-000000000011','RB1',          'Detroit RB1',               'Running Back', 'DETRB1', 7,  5.5),
  ('40000000-0000-0000-0011-000000000004','30000000-0000-0000-0000-000000000011','TE1',          'Detroit TE1',               'Tight End',    'DETTE1', 6,  5.5),
  ('40000000-0000-0000-0011-000000000005','30000000-0000-0000-0000-000000000011','Edge Rusher',  'Detroit Edge Rusher',       'Defensive End','DETER1', 7,  5.5)
on conflict do nothing;

-- Dallas (9)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0009-000000000001','30000000-0000-0000-0000-000000000009','QB1',          'Dallas QB1',                'Quarterback',  'DALQB1', 8,  5.0),
  ('40000000-0000-0000-0009-000000000002','30000000-0000-0000-0000-000000000009','Edge Rusher',  'Dallas Edge Rusher',        'Defensive End','DALER1', 10, 5.5),
  ('40000000-0000-0000-0009-000000000003','30000000-0000-0000-0000-000000000009','WR1',          'Dallas WR1',                'Wide Receiver','DALWR1', 8,  5.5),
  ('40000000-0000-0000-0009-000000000004','30000000-0000-0000-0000-000000000009','RB1',          'Dallas RB1',                'Running Back', 'DALRB1', 6,  5.5),
  ('40000000-0000-0000-0009-000000000005','30000000-0000-0000-0000-000000000009','CB1',          'Dallas CB1',                'Cornerback',   'DALCB1', 6,  6.0)
on conflict do nothing;

-- San Francisco (28)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0028-000000000001','30000000-0000-0000-0000-000000000028','QB1',          'San Francisco QB1',         'Quarterback',  'SFQB1',  9,  4.5),
  ('40000000-0000-0000-0028-000000000002','30000000-0000-0000-0000-000000000028','WR1',          'San Francisco WR1',         'Wide Receiver','SFWR1',  8,  5.5),
  ('40000000-0000-0000-0028-000000000003','30000000-0000-0000-0000-000000000028','RB1',          'San Francisco RB1',         'Running Back', 'SFRB1',  8,  5.5),
  ('40000000-0000-0000-0028-000000000004','30000000-0000-0000-0000-000000000028','TE1',          'San Francisco TE1',         'Tight End',    'SFTE1',  6,  5.5),
  ('40000000-0000-0000-0028-000000000005','30000000-0000-0000-0000-000000000028','DL1',          'San Francisco DL1',         'Defensive Line','SFDL1', 7,  5.0)
on conflict do nothing;

-- Buffalo (4)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0004-000000000001','30000000-0000-0000-0000-000000000004','QB1',          'Buffalo QB1',               'Quarterback',  'BUFQB1', 10, 4.0),
  ('40000000-0000-0000-0004-000000000002','30000000-0000-0000-0000-000000000004','WR1',          'Buffalo WR1',               'Wide Receiver','BUFWR1', 8,  5.0),
  ('40000000-0000-0000-0004-000000000003','30000000-0000-0000-0000-000000000004','TE1',          'Buffalo TE1',               'Tight End',    'BUFTE1', 7,  5.5),
  ('40000000-0000-0000-0004-000000000004','30000000-0000-0000-0000-000000000004','RB1',          'Buffalo RB1',               'Running Back', 'BUFRB1', 6,  5.5),
  ('40000000-0000-0000-0004-000000000005','30000000-0000-0000-0000-000000000004','CB1',          'Buffalo CB1',               'Cornerback',   'BUFCB1', 6,  6.0)
on conflict do nothing;

-- Philadelphia (26)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0026-000000000001','30000000-0000-0000-0000-000000000026','QB1',          'Philadelphia QB1',          'Quarterback',  'PHIQB1', 10, 4.0),
  ('40000000-0000-0000-0026-000000000002','30000000-0000-0000-0000-000000000026','WR1',          'Philadelphia WR1',          'Wide Receiver','PHIWR1', 8,  5.0),
  ('40000000-0000-0000-0026-000000000003','30000000-0000-0000-0000-000000000026','Edge Rusher',  'Philadelphia Edge Rusher',  'Defensive End','PHIER1', 8,  5.5),
  ('40000000-0000-0000-0026-000000000004','30000000-0000-0000-0000-000000000026','RB1',          'Philadelphia RB1',          'Running Back', 'PHIRB1', 6,  5.5),
  ('40000000-0000-0000-0026-000000000005','30000000-0000-0000-0000-000000000026','TE1',          'Philadelphia TE1',          'Tight End',    'PHITE1', 7,  5.5)
on conflict do nothing;

-- Las Vegas (17)
insert into public.generic_player_roles
  (id, team_id, public_role, public_name, position_group, asset_symbol, importance_score, risk_baseline)
values
  ('40000000-0000-0000-0017-000000000001','30000000-0000-0000-0000-000000000017','QB1',          'Las Vegas QB1',             'Quarterback',  'LVQB1',  8,  5.0),
  ('40000000-0000-0000-0017-000000000002','30000000-0000-0000-0000-000000000017','RB1',          'Las Vegas RB1',             'Running Back', 'LVRB1',  8,  5.5),
  ('40000000-0000-0000-0017-000000000003','30000000-0000-0000-0000-000000000017','WR1',          'Las Vegas WR1',             'Wide Receiver','LVWR1',  7,  5.5),
  ('40000000-0000-0000-0017-000000000004','30000000-0000-0000-0000-000000000017','TE1',          'Las Vegas TE1',             'Tight End',    'LVTE1',  6,  5.5),
  ('40000000-0000-0000-0017-000000000005','30000000-0000-0000-0000-000000000017','Edge Rusher',  'Las Vegas Edge Rusher',     'Defensive End','LVER1',  7,  6.0)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- COACH ROLES
-- ─────────────────────────────────────────────────────────────
insert into public.coach_roles
  (id, team_id, public_name, coach_archetype, risk_baseline)
values
  ('50000000-0000-0000-0000-000000000001', null,                                         'Offensive Mastermind Coach Stock', 'offensive',   4.5),
  ('50000000-0000-0000-0000-000000000002', null,                                         'Defensive Architect Coach Stock',  'defensive',   4.5),
  ('50000000-0000-0000-0000-000000000003', null,                                         'Hot Seat Coach Stock',             'hot_seat',    8.0),
  ('50000000-0000-0000-0000-000000000004', '30000000-0000-0000-0000-000000000016',       'Kansas City OC Stock',             'offensive',   4.0),
  ('50000000-0000-0000-0000-000000000005', '30000000-0000-0000-0000-000000000026',       'Philadelphia OC Stock',            'offensive',   4.0),
  ('50000000-0000-0000-0000-000000000006', '30000000-0000-0000-0000-000000000003',       'Baltimore DC Stock',               'defensive',   4.0)
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Sport Indexes
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
-- ASSETS — Futures
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
   'championship', '10000000-0000-0000-0000-000000000001',
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
   'comeback', '10000000-0000-0000-0000-000000000001',
   'PFCMPBK', 'Pro Football Comeback Future',
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
-- ASSETS — Meme Coins
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
-- FUTURES MARKET DEFINITIONS
-- ─────────────────────────────────────────────────────────────
insert into public.futures_markets
  (id, asset_id, future_type, public_name, settlement_rule, status)
values
  ('70000000-0000-0000-0001-000000000001',
   '60000000-0000-0000-0002-000000000001',
   'award', 'Pro Football MVP Future',
   'Settles at season end based on simulated cumulative performance score. Highest scorer wins.',
   'open'),
  ('70000000-0000-0000-0001-000000000002',
   '60000000-0000-0000-0002-000000000002',
   'championship', 'Pro Football Championship Future',
   'Settles when the simulated championship game result is recorded.',
   'open'),
  ('70000000-0000-0000-0001-000000000003',
   '60000000-0000-0000-0002-000000000003',
   'coach_momentum', 'Pro Football Coach of the Year Future',
   'Settles at season end based on simulated coach performance composite.',
   'open'),
  ('70000000-0000-0000-0001-000000000004',
   '60000000-0000-0000-0002-000000000004',
   'award', 'Pro Football Offensive Rookie Future',
   'Settles at season end based on simulated rookie performance metrics.',
   'open'),
  ('70000000-0000-0000-0001-000000000005',
   '60000000-0000-0000-0002-000000000005',
   'comeback', 'Pro Football Comeback Future',
   'Settles at season end based on simulated comeback narrative score.',
   'open'),
  ('70000000-0000-0000-0001-000000000006',
   '60000000-0000-0000-0002-000000000006',
   'championship', 'MMA Championship Future',
   'Settles on simulated championship fight result. Binary outcome.',
   'open')
on conflict do nothing;

-- ─────────────────────────────────────────────────────────────
-- INITIAL PRICE HISTORY — seed prices for index + futures
-- ─────────────────────────────────────────────────────────────
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
