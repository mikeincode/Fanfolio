-- ============================================================
-- 103c — Seed: Player Coin Assets, Teams 9-16
-- Teams: Arizona, Atlanta, Carolina, Chicago,
--        Cincinnati, Cleveland, Denver, Green Bay
-- 40 player coins (8 teams × 5 roles each)
-- Depends on: 102b, 103a
-- Idempotent: INSERT ... ON CONFLICT (symbol) DO NOTHING
-- ============================================================

-- ── Arizona player coins (team 01) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0001-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000001',
   'AZQB1','Arizona QB1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona quarterback role. Developing franchise QB with speculative upside in a rebuilding system.',
   'Rebuilding-team QB1 coins carry more risk but greater upside when the narrative inflects positively.',
   5.5,'neutral',50.75,-0.6,'active','["pro-football","player-coin","qb1","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000002',
   'AZWR1','Arizona WR1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona top receiver role. Skill-position talent in a developing offensive system.',
   'WR1 coins on rebuilding teams can sustain value through strong individual performance even when team results lag.',
   6.0,'neutral',31.90,-1.2,'active','["pro-football","player-coin","wr1","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000003',
   'AZRB1','Arizona RB1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona lead running back role. Usage-dependent role in an evolving offensive scheme.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   6.0,'neutral',23.20,-0.8,'active','["pro-football","player-coin","rb1","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000004',
   'AZER1','Arizona Edge Rusher Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona edge rusher role. Defensive impact player in a developing defensive unit.',
   'Edge rusher coins spike on sack and turnover events regardless of team record.',
   6.5,'neutral',27.55,0.4,'active','["pro-football","player-coin","edge","arizona"]'::jsonb),
  ('60000000-0000-0001-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001','40000000-0000-0000-0099-000000000005',
   'AZLB1','Arizona LB1 Coin','Pro Football Player Coin · Arizona',
   'Tracks the Arizona linebacker role. Defensive anchor in a rebuilding defensive unit.',
   'Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',
   6.0,'neutral',18.85,-0.3,'active','["pro-football","player-coin","lb1","arizona"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Atlanta player coins (team 02) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0002-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000001',
   'ATLQB1','Atlanta QB1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta quarterback role. Volatile franchise QB with boom-or-bust season potential.','Boom-or-bust QB1 coins can outperform in big narrative moments but need active monitoring.',5.5,'neutral',61.25,-1.0,'active','["pro-football","player-coin","qb1","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000002',
   'ATLWR1','Atlanta WR1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta top receiver role. Explosive playmaker in a pass-heavy scheme.','High-upside receivers generate big-play narrative spikes. Volatility cuts both ways.',6.0,'neutral',38.50,1.4,'active','["pro-football","player-coin","wr1","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000003',
   'ATLRB1','Atlanta RB1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta lead running back role. Feature back in a developing offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',28.00,-0.5,'active','["pro-football","player-coin","rb1","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000004',
   'ATLER1','Atlanta Edge Rusher Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta edge rusher role. Pass-rush disruptor in a developing defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.5,'neutral',33.25,0.8,'active','["pro-football","player-coin","edge","atlanta"]'::jsonb),
  ('60000000-0000-0002-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002','40000000-0000-0000-0002-000000000005',
   'ATLLB1','Atlanta LB1 Coin','Pro Football Player Coin · Atlanta','Tracks the Atlanta linebacker role. Defensive anchor in a rebuilding unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',22.75,-0.3,'active','["pro-football","player-coin","lb1","atlanta"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Carolina player coins (team 05) ──────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0005-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000001',
   'CARQB1','Carolina QB1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina quarterback role. Developing QB in a full rebuild with long-term upside.','Rebuilding-team QB1 coins carry more risk but can deliver outsized returns on narrative inflection.',6.5,'bearish',41.30,-4.2,'active','["pro-football","player-coin","qb1","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000002',
   'CARWR1','Carolina WR1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina top receiver role. Developing skill position in a limited offensive system.','WR1 coins on rebuild teams can sustain value through strong individual play even when the team struggles.',6.5,'bearish',25.96,-2.8,'active','["pro-football","player-coin","wr1","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000003',
   'CARRB1','Carolina RB1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina lead running back role. High-usage role in a ground-heavy rebuild scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',6.5,'neutral',18.88,-1.5,'active','["pro-football","player-coin","rb1","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000004',
   'CARER1','Carolina Edge Rusher Coin','Pro Football Player Coin · Carolina','Tracks the Carolina edge rusher role. Pass-rush standout in an otherwise developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',7.0,'neutral',22.42,1.1,'active','["pro-football","player-coin","edge","carolina"]'::jsonb),
  ('60000000-0000-0005-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005','40000000-0000-0000-0005-000000000005',
   'CARLB1','Carolina LB1 Coin','Pro Football Player Coin · Carolina','Tracks the Carolina linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.5,'neutral',15.34,-0.5,'active','["pro-football","player-coin","lb1","carolina"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Chicago player coins (team 06) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0006-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000001',
   'CHIQB1','Chicago QB1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago quarterback role. Young franchise QB with developing talent in a roster overhaul.','Young QB1 coins carry rebuild risk but can spike sharply on breakthrough performances.',5.5,'neutral',48.30,1.8,'active','["pro-football","player-coin","qb1","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000002',
   'CHIWR1','Chicago WR1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago top receiver role. Promising skill position in a developing passing offense.','WR1 coins on young offenses can generate strong upside when scheme and QB development click.',6.0,'neutral',30.36,2.1,'active','["pro-football","player-coin","wr1","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000003',
   'CHIRB1','Chicago RB1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago lead running back role. Feature back with consistent carry volume.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',22.08,0.4,'active','["pro-football","player-coin","rb1","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000004',
   'CHIER1','Chicago Edge Rusher Coin','Pro Football Player Coin · Chicago','Tracks the Chicago edge rusher role. Defensive disruptor generating pressure in a young defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',26.22,0.9,'active','["pro-football","player-coin","edge","chicago"]'::jsonb),
  ('60000000-0000-0006-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006','40000000-0000-0000-0006-000000000005',
   'CHILB1','Chicago LB1 Coin','Pro Football Player Coin · Chicago','Tracks the Chicago linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',17.94,0.2,'active','["pro-football","player-coin","lb1","chicago"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Cincinnati player coins (team 07) ────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0007-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000001',
   'CINQB1','Cincinnati QB1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati quarterback role. Elite franchise QB with proven playoff narrative and rising team stock.','Elite QB1 coins with playoff track records sustain premium valuations through full simulated seasons.',5.0,'bullish',84.00,2.1,'active','["pro-football","player-coin","qb1","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000002',
   'CINWR1','Cincinnati WR1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati top receiver role. Dynamic playmaker in a pass-first offensive system.','High-upside WR1 coins in strong passing offenses can lead the market in strong stretches.',5.5,'bullish',52.80,2.8,'active','["pro-football","player-coin","wr1","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000003',
   'CINRB1','Cincinnati RB1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati lead running back role. Complementary role in a pass-dominant system.','RBs in pass-heavy systems carry lower floor but spike on breakout rushing performances.',6.0,'neutral',38.40,0.6,'active','["pro-football","player-coin","rb1","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000004',
   'CINER1','Cincinnati Edge Rusher Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati edge rusher role. Defensive pass rusher in a developing defensive front.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',45.60,0.9,'active','["pro-football","player-coin","edge","cincinnati"]'::jsonb),
  ('60000000-0000-0007-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007','40000000-0000-0000-0007-000000000005',
   'CINLB1','Cincinnati LB1 Coin','Pro Football Player Coin · Cincinnati','Tracks the Cincinnati linebacker role. Defensive anchor supporting a competitive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',31.20,0.4,'active','["pro-football","player-coin","lb1","cincinnati"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Cleveland player coins (team 08) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0008-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000001',
   'CLEQB1','Cleveland QB1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland quarterback role. Volatile franchise QB with inconsistent performance narrative.','Inconsistent QB1 coins swing widely around game results. Higher risk, but dip entry can reward.',6.0,'neutral',57.75,-1.2,'active','["pro-football","player-coin","qb1","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000002',
   'CLEWR1','Cleveland WR1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland top receiver role. Physical playmaker reliant on QB consistency.','WR1 coins tied to volatile QBs carry extra uncertainty — the receiver''s ceiling depends on QB narrative.',6.5,'neutral',36.30,-0.8,'active','["pro-football","player-coin","wr1","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000003',
   'CLERB1','Cleveland RB1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland lead running back role. Featured back in a ground-heavy offensive scheme.','High-usage RBs in run-first offenses can sustain coin value even when the passing game struggles.',6.0,'neutral',26.40,0.4,'active','["pro-football","player-coin","rb1","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000004',
   'CLEER1','Cleveland Edge Rusher Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland edge rusher role. Pass-rush disruptor in an otherwise inconsistent roster.','Edge rusher coins can sustain individual value even when team stocks underperform.',6.5,'neutral',31.35,0.7,'active','["pro-football","player-coin","edge","cleveland"]'::jsonb),
  ('60000000-0000-0008-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008','40000000-0000-0000-0008-000000000005',
   'CLELB1','Cleveland LB1 Coin','Pro Football Player Coin · Cleveland','Tracks the Cleveland linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',21.45,-0.2,'active','["pro-football","player-coin","lb1","cleveland"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Denver player coins (team 10) ────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0010-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000001',
   'DENQB1','Denver QB1 Coin','Pro Football Player Coin · Denver','Tracks the Denver quarterback role. QB in a transitional phase with uncertain long-term narrative.','Post-dynasty QB1 coins carry narrative uncertainty. The market is watching for confirmation of identity.',6.0,'bearish',52.50,-3.6,'active','["pro-football","player-coin","qb1","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000002',
   'DENWR1','Denver WR1 Coin','Pro Football Player Coin · Denver','Tracks the Denver top receiver role. Skill-position talent in a transitional offensive system.','WR1 coins can hold value on individual talent even when system productivity dips.',6.0,'neutral',33.00,-1.4,'active','["pro-football","player-coin","wr1","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000003',
   'DENRB1','Denver RB1 Coin','Pro Football Player Coin · Denver','Tracks the Denver lead running back role. Featured back in a transitional offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',24.00,-0.8,'active','["pro-football","player-coin","rb1","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000004',
   'DENER1','Denver Edge Rusher Coin','Pro Football Player Coin · Denver','Tracks the Denver edge rusher role. Pass-rush presence in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',28.50,0.6,'active','["pro-football","player-coin","edge","denver"]'::jsonb),
  ('60000000-0000-0010-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010','40000000-0000-0000-0010-000000000005',
   'DENLB1','Denver LB1 Coin','Pro Football Player Coin · Denver','Tracks the Denver linebacker role. Defensive anchor in a transitional unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',19.50,-0.4,'active','["pro-football","player-coin","lb1","denver"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Green Bay player coins (team 12) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0012-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000001',
   'GBQB1','Green Bay QB1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay quarterback role. New-era franchise anchor in a storied QB lineage.','Storied franchise QB1 coins carry legacy premium even during transition periods.',4.5,'neutral',115.50,0.6,'active','["pro-football","player-coin","qb1","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000002',
   'GBWR1','Green Bay WR1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay top receiver role. Reliable skill position in a structured passing system.','Reliable high-target receivers in structured systems generate steady coin momentum.',5.0,'neutral',72.60,0.4,'active','["pro-football","player-coin","wr1","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000003',
   'GBRB1','Green Bay RB1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay lead running back role. Efficient role in a balanced offensive scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',5.0,'neutral',52.80,0.2,'active','["pro-football","player-coin","rb1","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000004',
   'GBER1','Green Bay Edge Rusher Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay edge rusher role. Pass-rush standout in a disciplined defensive system.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.0,'neutral',62.70,0.8,'active','["pro-football","player-coin","edge","green-bay"]'::jsonb),
  ('60000000-0000-0012-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012','40000000-0000-0000-0012-000000000005',
   'GBLB1','Green Bay LB1 Coin','Pro Football Player Coin · Green Bay','Tracks the Green Bay linebacker role. Defensive anchor in a structured, disciplined unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.0,'neutral',42.90,0.1,'active','["pro-football","player-coin","lb1","green-bay"]'::jsonb)
on conflict (symbol) do nothing;
