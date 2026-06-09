-- ============================================================
-- 102e — Seed: Coach Roles (6 rows)
-- 3 global archetypes + 3 featured-team coaches
-- Depends on: 101
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
-- ============================================================

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
