-- ============================================================
-- 102a — Seed: Player Roles, Teams 1-8 (Featured)
-- Teams: Kansas City, Baltimore, Detroit, Dallas,
--        San Francisco, Buffalo, Philadelphia, Las Vegas
-- 40 player roles (8 teams × 5 roles each)
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
