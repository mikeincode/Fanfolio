-- ============================================================
-- 105 — Seed: Initial Price History
-- Depends on: 103
-- NOTE: asset_price_history has NO unique constraint on
-- (asset_id, source_type). Re-running this chunk adds duplicate
-- seed rows, which is harmless (prices are append-only).
-- To avoid duplicates, only run this chunk once.
-- ============================================================

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
