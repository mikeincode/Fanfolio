-- ============================================================
-- 104 — Seed: Futures Market Definitions
-- Depends on: 103
-- Idempotent: INSERT ... ON CONFLICT DO NOTHING
--
-- Note: index_definitions, index_members, market_pulses, and
-- market_pulse_impacts are NOT seeded in v1.
-- Those tables start empty and are populated by the app at runtime.
-- ============================================================

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
