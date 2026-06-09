-- ============================================================
-- 103d — Seed: Player Coin Assets, Teams 17-24
-- Teams: Houston, Indianapolis, Jacksonville, Los Angeles A,
--        Los Angeles B, Miami, Minnesota, New England
-- 40 player coins (8 teams × 5 roles each)
-- Depends on: 102c, 103a
-- Idempotent: INSERT ... ON CONFLICT (symbol) DO NOTHING
-- ============================================================

-- ── Houston player coins (team 13) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0013-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000001',
   'HOUQB1','Houston QB1 Coin','Pro Football Player Coin · Houston','Tracks the Houston quarterback role. Rising franchise QB generating strong momentum in an ascending window.','Ascending QB1 coins in growth-phase franchises can compound quickly when wins follow narrative.',5.5,'bullish',87.50,4.8,'active','["pro-football","player-coin","qb1","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000002',
   'HOUWR1','Houston WR1 Coin','Pro Football Player Coin · Houston','Tracks the Houston top receiver role. Dynamic playmaker in a rising passing offense.','High-upside receivers in ascending offenses often outperform market expectations.',6.0,'bullish',55.00,3.1,'active','["pro-football","player-coin","wr1","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000003',
   'HOURB1','Houston RB1 Coin','Pro Football Player Coin · Houston','Tracks the Houston lead running back role. Featured back contributing in a rising offensive system.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',40.00,1.4,'active','["pro-football","player-coin","rb1","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000004',
   'HOUER1','Houston Edge Rusher Coin','Pro Football Player Coin · Houston','Tracks the Houston edge rusher role. Pass-rush disruptor in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',47.50,1.8,'active','["pro-football","player-coin","edge","houston"]'::jsonb),
  ('60000000-0000-0013-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013','40000000-0000-0000-0013-000000000005',
   'HOULB1','Houston LB1 Coin','Pro Football Player Coin · Houston','Tracks the Houston linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',32.50,0.8,'active','["pro-football","player-coin","lb1","houston"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Indianapolis player coins (team 14) ──────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0014-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000001',
   'INDQB1','Indianapolis QB1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis quarterback role. Developing franchise QB in a competitive but not elite roster.','Mid-tier franchise QB1 coins tend to trade steadily without dramatic swings.',5.5,'neutral',75.25,0.8,'active','["pro-football","player-coin","qb1","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000002',
   'INDWR1','Indianapolis WR1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis top receiver role. Reliable skill position in a structured offensive system.','Reliable receivers in structured systems generate steady coin momentum.',6.0,'neutral',47.30,0.5,'active','["pro-football","player-coin","wr1","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000003',
   'INDRB1','Indianapolis RB1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis lead running back role. High-volume feature back in a run-balanced scheme.','High-usage RBs in balanced offenses can sustain coin value across full simulated seasons.',5.5,'neutral',34.40,0.3,'active','["pro-football","player-coin","rb1","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000004',
   'INDER1','Indianapolis Edge Rusher Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',40.85,0.6,'active','["pro-football","player-coin","edge","indianapolis"]'::jsonb),
  ('60000000-0000-0014-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014','40000000-0000-0000-0014-000000000005',
   'INDLB1','Indianapolis LB1 Coin','Pro Football Player Coin · Indianapolis','Tracks the Indianapolis linebacker role. Defensive anchor in a competitive defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',27.95,0.2,'active','["pro-football","player-coin","lb1","indianapolis"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Jacksonville player coins (team 15) ──────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0015-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000001',
   'JAXQB1','Jacksonville QB1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville quarterback role. Developing QB in a longer rebuild cycle.','Long-rebuild QB1 coins carry sustained downside risk until the roster inflection arrives.',6.0,'neutral',43.75,-2.1,'active','["pro-football","player-coin","qb1","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000002',
   'JAXWR1','Jacksonville WR1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville top receiver role. Developing skill position in a limited offensive system.','WR1 coins can hold individual upside even in weak offensive systems.',6.5,'neutral',27.50,-1.2,'active','["pro-football","player-coin","wr1","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000003',
   'JAXRB1','Jacksonville RB1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville lead running back role. High-usage back in a ground-heavy offense.','High-usage RBs in run-first offenses can sustain coin value even when passing is limited.',6.5,'neutral',20.00,-0.6,'active','["pro-football","player-coin","rb1","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000004',
   'JAXER1','Jacksonville Edge Rusher Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville edge rusher role. Pass-rush standout in a developing defensive unit.','Edge rusher coins can sustain individual value even when team stocks underperform.',6.5,'neutral',23.75,0.9,'active','["pro-football","player-coin","edge","jacksonville"]'::jsonb),
  ('60000000-0000-0015-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015','40000000-0000-0000-0015-000000000005',
   'JAXLB1','Jacksonville LB1 Coin','Pro Football Player Coin · Jacksonville','Tracks the Jacksonville linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.5,'neutral',16.25,-0.4,'active','["pro-football","player-coin","lb1","jacksonville"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Los Angeles A player coins (team 18) ─────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0018-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000001',
   'LAAQB1','Los Angeles A QB1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A quarterback role. Large-market franchise QB with brand amplification.','Large-market QB1 coins carry brand premium. Sentiment moves more quickly in high-visibility markets.',5.0,'neutral',106.75,1.1,'active','["pro-football","player-coin","qb1","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000002',
   'LAAWR1','Los Angeles A WR1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A top receiver role. High-profile skill position in a large-market offense.','Brand-market WR1 coins carry narrative premium — highlight plays amplify faster.',5.5,'neutral',67.10,0.8,'active','["pro-football","player-coin","wr1","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000003',
   'LAARB1','Los Angeles A RB1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A lead running back role. Feature back in a versatile offensive scheme.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',48.80,0.4,'active','["pro-football","player-coin","rb1","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000004',
   'LAAER1','Los Angeles A Edge Rusher Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',57.95,0.6,'active','["pro-football","player-coin","edge","los-angeles-a"]'::jsonb),
  ('60000000-0000-0018-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018','40000000-0000-0000-0018-000000000005',
   'LAALB1','Los Angeles A LB1 Coin','Pro Football Player Coin · Los Angeles A','Tracks the Los Angeles A linebacker role. Defensive anchor in a competitive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',39.65,0.3,'active','["pro-football","player-coin","lb1","los-angeles-a"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Los Angeles B player coins (team 19) ─────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0019-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000001',
   'LABQB1','Los Angeles B QB1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B quarterback role. High-narrative QB in a volatile shared market.','Shared-market QB1 coins can see sentiment shift quickly when the competing franchise momentum changes.',6.0,'neutral',68.25,1.2,'active','["pro-football","player-coin","qb1","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000002',
   'LABWR1','Los Angeles B WR1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B top receiver role. Skill-position talent in a volatile offensive system.','Volatile system WR1 coins can spike sharply on big games but lack steady baseline support.',6.0,'neutral',42.90,0.8,'active','["pro-football","player-coin","wr1","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000003',
   'LABRB1','Los Angeles B RB1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B lead running back role. Featured back in a pass-first offense.','Running back coins carry position risk — high usage often means higher injury exposure.',6.0,'neutral',31.20,0.2,'active','["pro-football","player-coin","rb1","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000004',
   'LABER1','Los Angeles B Edge Rusher Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B edge rusher role. Defensive pass rusher in a developing unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.5,'neutral',37.05,0.5,'active','["pro-football","player-coin","edge","los-angeles-b"]'::jsonb),
  ('60000000-0000-0019-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019','40000000-0000-0000-0019-000000000005',
   'LABLB1','Los Angeles B LB1 Coin','Pro Football Player Coin · Los Angeles B','Tracks the Los Angeles B linebacker role. Defensive anchor in a developing defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',25.35,0.1,'active','["pro-football","player-coin","lb1","los-angeles-b"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Miami player coins (team 20) ─────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0020-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000001',
   'MIAQB1','Miami QB1 Coin','Pro Football Player Coin · Miami','Tracks the Miami quarterback role. Rising franchise QB fueling a growing contender narrative.','Ascending QB1 coins in rising-contender franchises can compound quickly when wins follow.',5.0,'bullish',89.25,1.7,'active','["pro-football","player-coin","qb1","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000002',
   'MIAWR1','Miami WR1 Coin','Pro Football Player Coin · Miami','Tracks the Miami top receiver role. Speed-threat playmaker in an explosive offensive system.','Explosive offense WR1 coins generate big-play spikes and sustain momentum in strong stretches.',5.5,'bullish',56.10,1.4,'active','["pro-football","player-coin","wr1","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000003',
   'MIARB1','Miami RB1 Coin','Pro Football Player Coin · Miami','Tracks the Miami lead running back role. Complementary role in a pass-first, speed-based offense.','RBs in speed offenses carry lower floor but spike on scatback-style breakout performances.',6.0,'neutral',40.80,0.6,'active','["pro-football","player-coin","rb1","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000004',
   'MIAER1','Miami Edge Rusher Coin','Pro Football Player Coin · Miami','Tracks the Miami edge rusher role. Pass-rush presence in a developing defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',48.45,0.8,'active','["pro-football","player-coin","edge","miami"]'::jsonb),
  ('60000000-0000-0020-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020','40000000-0000-0000-0020-000000000005',
   'MIALB1','Miami LB1 Coin','Pro Football Player Coin · Miami','Tracks the Miami linebacker role. Defensive anchor in a developing unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',6.0,'neutral',33.15,0.3,'active','["pro-football","player-coin","lb1","miami"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Minnesota player coins (team 21) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0021-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000001',
   'MINQB1','Minnesota QB1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota quarterback role. Consistent franchise QB supporting steady playoff narrative.','Consistent QB1 coins in steady franchises trade with lower drama and lower volatility.',5.0,'bullish',96.25,2.4,'active','["pro-football","player-coin","qb1","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000002',
   'MINWR1','Minnesota WR1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota top receiver role. Reliable skill position in a consistent offensive system.','Consistent system WR1 coins sustain steady momentum through full simulated seasons.',5.5,'bullish',60.50,1.8,'active','["pro-football","player-coin","wr1","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000003',
   'MINRB1','Minnesota RB1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota lead running back role. Feature back in a run-balanced offensive scheme.','High-usage RBs in balanced offenses can sustain coin value across full simulated seasons.',5.5,'neutral',44.00,0.8,'active','["pro-football","player-coin","rb1","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000004',
   'MINER1','Minnesota Edge Rusher Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota edge rusher role. Pass-rush presence in a competitive defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',6.0,'neutral',52.25,1.0,'active','["pro-football","player-coin","edge","minnesota"]'::jsonb),
  ('60000000-0000-0021-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021','40000000-0000-0000-0021-000000000005',
   'MINLB1','Minnesota LB1 Coin','Pro Football Player Coin · Minnesota','Tracks the Minnesota linebacker role. Defensive anchor in a competitive defensive unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.5,'neutral',35.75,0.4,'active','["pro-football","player-coin","lb1","minnesota"]'::jsonb)
on conflict (symbol) do nothing;

-- ── New England player coins (team 22) ───────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0022-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000001',
   'NEQB1','New England QB1 Coin','Pro Football Player Coin · New England','Tracks the New England quarterback role. New-era QB establishing identity in a post-dynasty system.','Post-dynasty QB1 coins trade at uncertain valuations until the new era proves itself.',5.0,'neutral',78.75,-2.7,'active','["pro-football","player-coin","qb1","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000002',
   'NEWR1','New England WR1 Coin','Pro Football Player Coin · New England','Tracks the New England top receiver role. Developing skill position in a system transition.','WR1 coins in transitional offenses carry higher uncertainty until system identity stabilizes.',5.5,'neutral',49.50,-1.4,'active','["pro-football","player-coin","wr1","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000003',
   'NERB1','New England RB1 Coin','Pro Football Player Coin · New England','Tracks the New England lead running back role. Feature back in a system historically favoring the run game.','RBs in run-tradition systems can sustain value through system transitions when ground identity holds.',5.5,'neutral',36.00,-0.8,'active','["pro-football","player-coin","rb1","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000004',
   'NEER1','New England Edge Rusher Coin','Pro Football Player Coin · New England','Tracks the New England edge rusher role. Defensive presence in a scheme-heavy defensive unit.','Edge rusher coins spike on sack and turnover events regardless of team record.',5.5,'neutral',42.75,-0.6,'active','["pro-football","player-coin","edge","new-england"]'::jsonb),
  ('60000000-0000-0022-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022','40000000-0000-0000-0022-000000000005',
   'NELB1','New England LB1 Coin','Pro Football Player Coin · New England','Tracks the New England linebacker role. Defensive anchor in a structured, experienced unit.','Linebacker coins represent team defense broadly. Lower volatility than skill-position coins.',5.0,'neutral',29.25,-0.4,'active','["pro-football","player-coin","lb1","new-england"]'::jsonb)
on conflict (symbol) do nothing;
