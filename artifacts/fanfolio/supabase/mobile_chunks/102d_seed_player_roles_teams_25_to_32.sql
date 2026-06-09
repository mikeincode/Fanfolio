-- ============================================================
-- 102d — Seed: Player Roles, Teams 25-32
-- Teams: New Orleans, New York A, New York B, Pittsburgh,
--        Seattle, Tampa Bay, Tennessee, Washington
-- 40 player roles (8 teams × 5 roles each)
-- Depends on: 101
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

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
