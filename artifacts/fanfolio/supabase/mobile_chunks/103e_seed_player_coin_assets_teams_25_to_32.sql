-- ============================================================
-- 103e — Seed: Player Coin Assets, Teams 25-32
-- Teams: New Orleans, New York A, New York B, Pittsburgh,
--        Seattle, Tampa Bay, Tennessee, Washington
-- 40 player coins (8 teams × 5 roles each)
-- Depends on: 102d, 103a
-- Idempotent: INSERT ... ON CONFLICT (symbol) DO NOTHING
-- ============================================================

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
