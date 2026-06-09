-- ============================================================
-- 102b — Seed: Player Roles, Teams 9-16
-- Teams: Arizona, Atlanta, Carolina, Chicago,
--        Cincinnati, Cleveland, Denver, Green Bay
-- 40 player roles (8 teams × 5 roles each)
-- Depends on: 101
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

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
