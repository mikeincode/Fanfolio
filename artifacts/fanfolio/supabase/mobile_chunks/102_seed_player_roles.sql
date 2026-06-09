-- ============================================================
-- 102 — Seed: Player Roles and Coach Roles
-- Depends on: 101
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

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
