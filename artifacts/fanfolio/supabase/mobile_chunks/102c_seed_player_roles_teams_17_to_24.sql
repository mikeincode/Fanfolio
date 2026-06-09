-- ============================================================
-- 102c — Seed: Player Roles, Teams 17-24
-- Teams: Houston, Indianapolis, Jacksonville, Los Angeles A,
--        Los Angeles B, Miami, Minnesota, New England
-- 40 player roles (8 teams × 5 roles each)
-- Depends on: 101
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

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
