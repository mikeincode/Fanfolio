-- ============================================================
-- 103b — Seed: Player Coin Assets, Teams 1-8 (Featured)
-- Teams: Kansas City, Baltimore, Detroit, Dallas,
--        San Francisco, Buffalo, Philadelphia, Las Vegas
-- 40 player coins (8 teams × 5 roles each)
-- Depends on: 102a, 103a
-- Idempotent: INSERT ... ON CONFLICT (symbol) DO NOTHING
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- PLAYER COIN ASSETS — 160 total (32 teams × 5 roles each)
-- Asset UUID pattern: 60000000-0000-{team_pos:04d}-0005-00000000000{role:1}
-- Symbol matches the asset_symbol field in generic_player_roles.
-- player_role_id links each coin to its source role row.
-- ─────────────────────────────────────────────────────────────

-- ── Kansas City player coins (team 16) ───────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0016-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000001',
   'KCQB1','Kansas City QB1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the simulated market performance of the Kansas City quarterback role. Franchise anchor driving the team''s dominant market narrative.',
   'QB1 coins are the most narrative-sensitive player coins. A single outstanding game can move this coin sharply.',
   3.5,'bullish',168.00,3.2,'active','["pro-football","player-coin","qb1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000002',
   'KCTF1','Kansas City TE1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City tight end role. High-impact pass-catching role correlated closely with the QB1 coin.',
   'Tight end coins shadow QB1 performance — when the QB is efficient, TE production rises with it.',
   5.0,'bullish',105.60,1.8,'active','["pro-football","player-coin","te1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000003',
   'KCWR1','Kansas City WR1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City top receiver role. Explosive skill-position coin reacting to target volume and big-play moments.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply. So can a slump.',
   5.5,'bullish',96.00,1.5,'active','["pro-football","player-coin","wr1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000004',
   'KCRB1','Kansas City RB1 Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City lead running back role. Usage-driven coin reacting to carry share and goal-line opportunities.',
   'Running back coins carry position risk — high usage often means higher injury exposure. Size positions accordingly.',
   5.0,'neutral',76.80,0.8,'active','["pro-football","player-coin","rb1","kansas-city"]'::jsonb),
  ('60000000-0000-0016-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016','40000000-0000-0000-0001-000000000005',
   'KCER1','Kansas City Edge Rusher Coin','Pro Football Player Coin · Kansas City',
   'Tracks the Kansas City edge rusher role. Defensive playmaker coin spiking on pressure and turnover events.',
   'Edge rusher coins generate upside around sack and turnover events. Defensive coins can surprise on strong game-film narratives.',
   5.5,'bullish',91.20,2.4,'active','["pro-football","player-coin","edge","kansas-city"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Baltimore player coins (team 03) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0003-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000001',
   'BALQB1','Baltimore QB1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore quarterback role. Dual-threat franchise anchor generating unique market narratives around both passing and rushing.',
   'QB1 coins are the franchise cornerstone. When the QB narrative dominates, everything from team stock to skill-position coins follows.',
   3.5,'bullish',143.50,2.1,'active','["pro-football","player-coin","qb1","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000002',
   'BALWR1','Baltimore WR1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore top receiver role. Explosive downfield threat generating big-play upside.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply. So can a slump.',
   5.0,'bullish',90.20,1.8,'active','["pro-football","player-coin","wr1","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000003',
   'BALER1','Baltimore Edge Rusher Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore edge rusher role. Elite pass rush unit generates consistent defensive narrative.',
   'Defensive playmakers drive turnovers that shift game momentum. Edge coins spike on sack-and-turnover-heavy performances.',
   5.0,'bullish',77.90,1.4,'active','["pro-football","player-coin","edge","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000004',
   'BALLB1','Baltimore LB1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore linebacker role. Defensive anchor in a unit with strong turnover narrative.',
   'Linebacker coins represent team defense broadly. They tend to be lower volatility than skill-position coins.',
   4.5,'bullish',53.30,1.2,'active','["pro-football","player-coin","lb1","baltimore"]'::jsonb),
  ('60000000-0000-0003-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003','40000000-0000-0000-0003-000000000005',
   'BALRB1','Baltimore RB1 Coin','Pro Football Player Coin · Baltimore',
   'Tracks the Baltimore lead running back role. High-volume rushing role in a run-heavy offensive system.',
   'Running back coins carry position risk — high usage often means higher injury exposure. Size positions accordingly.',
   5.5,'neutral',65.60,0.5,'active','["pro-football","player-coin","rb1","baltimore"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Detroit player coins (team 11) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0011-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000001',
   'DETQB1','Detroit QB1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit quarterback role. Rising-contender franchise anchor generating strong upward narrative momentum.',
   'QB1 coins on ascending franchises can outperform the team stock. Early-window contenders often have undervalued QB1 coins.',
   4.0,'bullish',133.00,3.6,'active','["pro-football","player-coin","qb1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000002',
   'DETWR1','Detroit WR1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit top receiver role. Elite skill position with high target volume in a pass-first offense.',
   'High-target-share receivers generate reliable fantasy-style narrative. Their coins tend to move steadily in strong offensive systems.',
   4.5,'bullish',83.60,2.8,'active','["pro-football","player-coin","wr1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000003',
   'DETRB1','Detroit RB1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit lead running back role. High-usage role in a balanced offensive system.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   5.0,'neutral',60.80,1.1,'active','["pro-football","player-coin","rb1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000004',
   'DETTE1','Detroit TE1 Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit tight end role. Dynamic receiving threat adding depth to an already strong offensive narrative.',
   'Tight end coins shadow QB1 performance — when the QB is hot, TE targets and production usually follow.',
   5.0,'bullish',83.60,2.5,'active','["pro-football","player-coin","te1","detroit"]'::jsonb),
  ('60000000-0000-0011-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011','40000000-0000-0000-0011-000000000005',
   'DETER1','Detroit Edge Rusher Coin','Pro Football Player Coin · Detroit',
   'Tracks the Detroit edge rusher role. Defensive disruptor generating pressure events in a young contending unit.',
   'Edge rusher coins spike on sack and turnover events. Strong pass-rush performances can move these coins quickly.',
   5.0,'bullish',72.20,2.0,'active','["pro-football","player-coin","edge","detroit"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Dallas player coins (team 09) ────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0009-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000001',
   'DALQB1','Dallas QB1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas quarterback role. High-brand franchise QB carrying elevated narrative weight even in average seasons.',
   'Brand-franchise QB1 coins trade at a premium to their pure performance level. Sentiment compounds with market size.',
   4.5,'neutral',124.25,-0.5,'active','["pro-football","player-coin","qb1","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000002',
   'DALER1','Dallas Edge Rusher Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas top edge rusher role. Elite pass rusher generating consistent defensive momentum.',
   'Defensive playmakers drive turnovers that shift game momentum. Edge coins spike on pressure-heavy performances.',
   5.0,'neutral',67.45,0.8,'active','["pro-football","player-coin","edge","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000003',
   'DALWR1','Dallas WR1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas top receiver role. High-profile skill position with strong brand amplification.',
   'Brand-market skill-position coins carry narrative premium. Watch for sentiment spikes around highlight moments.',
   5.0,'neutral',78.10,-0.3,'active','["pro-football","player-coin","wr1","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000004',
   'DALRB1','Dallas RB1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas lead running back role. Usage-sensitive role in a pass-heavy offensive system.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   5.5,'neutral',56.80,-0.8,'active','["pro-football","player-coin","rb1","dallas"]'::jsonb),
  ('60000000-0000-0009-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009','40000000-0000-0000-0009-000000000005',
   'DALCB1','Dallas CB1 Coin','Pro Football Player Coin · Dallas',
   'Tracks the Dallas top cornerback role. Defensive cover coin reacting to matchup results and turnover events.',
   'Cornerback coins are event-driven — a pick-six or shutdown performance can spike them fast. So can getting burned.',
   5.5,'neutral',46.15,-1.1,'active','["pro-football","player-coin","cb1","dallas"]'::jsonb)
on conflict (symbol) do nothing;

-- ── San Francisco player coins (team 28) ─────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0028-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000001',
   'SFQB1','San Francisco QB1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco quarterback role. System-elevated franchise anchor in a run-heavy, scheme-diverse offense.',
   'System QBs can outperform raw stats — their coins benefit from team scheme narrative as much as individual play.',
   3.5,'bullish',138.25,1.4,'active','["pro-football","player-coin","qb1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000002',
   'SFWR1','San Francisco WR1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco top receiver role. Deep-threat playmaker in a multi-faceted offensive scheme.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply.',
   4.5,'bullish',86.90,1.1,'active','["pro-football","player-coin","wr1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000003',
   'SFRB1','San Francisco RB1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco lead running back role. Featured role in a run-diverse offensive scheme.',
   'RB coins in run-heavy offenses carry above-average upside when scheme execution is strong.',
   5.5,'neutral',63.20,0.6,'active','["pro-football","player-coin","rb1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000004',
   'SFTE1','San Francisco TE1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco tight end role. Featured receiving role in a tight-end-friendly scheme.',
   'TE coins in target-rich systems can sustain steady price growth when the offense is clicking.',
   5.5,'bullish',86.90,0.9,'active','["pro-football","player-coin","te1","san-francisco"]'::jsonb),
  ('60000000-0000-0028-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028','40000000-0000-0000-0028-000000000005',
   'SFDL1','San Francisco DL1 Coin','Pro Football Player Coin · San Francisco',
   'Tracks the San Francisco defensive line role. Disruptive interior presence anchoring a strong defensive unit.',
   'Interior defensive coins react to run-stopping performances and QB pressure events — less flashy but steady.',
   4.5,'bullish',59.25,0.7,'active','["pro-football","player-coin","dl1","san-francisco"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Buffalo player coins (team 04) ───────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0004-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000001',
   'BUFQB1','Buffalo QB1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo quarterback role. Elite franchise QB with consistent playoff narrative driving premium valuation.',
   'Elite QB1 coins sustain premium pricing through full seasons. Their narrative rarely dips below franchise expectations.',
   3.5,'bullish',129.50,1.8,'active','["pro-football","player-coin","qb1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000002',
   'BUFWR1','Buffalo WR1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo top receiver role. High-volume target in an aggressive passing offense.',
   'High-target receivers in pass-first offenses generate steady coin momentum in strong offensive stretches.',
   4.5,'bullish',81.40,1.5,'active','["pro-football","player-coin","wr1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000003',
   'BUFTE1','Buffalo TE1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo tight end role. Red-zone featured role with reliable target volume near the goal line.',
   'TE coins with red-zone usage tend to generate touchdown-event spikes. Short-yardage TDs move these coins.',
   5.0,'bullish',81.40,0.9,'active','["pro-football","player-coin","te1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000004',
   'BUFRB1','Buffalo RB1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo lead running back role. Complementary role in a pass-heavy system.',
   'RBs in pass-heavy systems carry lower floor but spike on breakout rushing performances.',
   5.5,'neutral',59.20,0.4,'active','["pro-football","player-coin","rb1","buffalo"]'::jsonb),
  ('60000000-0000-0004-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004','40000000-0000-0000-0004-000000000005',
   'BUFCB1','Buffalo CB1 Coin','Pro Football Player Coin · Buffalo',
   'Tracks the Buffalo top cornerback role. Defensive cover coin in a strong secondary unit.',
   'Cornerback coins react to matchup results and turnover events. Strong coverage games can spike them fast.',
   5.5,'neutral',48.10,-0.2,'active','["pro-football","player-coin","cb1","buffalo"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Philadelphia player coins (team 26) ──────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0026-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000001',
   'PHIQB1','Philadelphia QB1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia quarterback role. Championship-window franchise anchor with elite two-way team support.',
   'QB1 coins on elite two-way franchises carry the lowest narrative risk of any player coin. Strong floor, strong ceiling.',
   3.5,'bullish',147.00,2.7,'active','["pro-football","player-coin","qb1","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000002',
   'PHIWR1','Philadelphia WR1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia top receiver role. High-volume target in a dynamic offensive scheme.',
   'Skill-position coins are volatile — a single standout game can push a WR1 coin sharply.',
   4.5,'bullish',92.40,1.8,'active','["pro-football","player-coin","wr1","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000003',
   'PHIER1','Philadelphia Edge Rusher Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia edge rusher role. Elite pass rusher in a dominant defensive front.',
   'Edge rusher coins spike on sack and turnover events. Strong pass-rush units can generate sustained coin momentum.',
   4.5,'bullish',79.80,1.5,'active','["pro-football","player-coin","edge","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000004',
   'PHIRB1','Philadelphia RB1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia lead running back role. Physical running role with strong red-zone usage.',
   'Running back coins carry position risk — high usage often means higher injury exposure.',
   5.0,'bullish',67.20,0.9,'active','["pro-football","player-coin","rb1","philadelphia"]'::jsonb),
  ('60000000-0000-0026-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026','40000000-0000-0000-0026-000000000005',
   'PHITE1','Philadelphia TE1 Coin','Pro Football Player Coin · Philadelphia',
   'Tracks the Philadelphia tight end role. Versatile receiving threat adding depth to a multi-faceted offense.',
   'TE coins in target-rich systems can sustain steady price growth when the offense is clicking.',
   5.5,'bullish',92.40,1.2,'active','["pro-football","player-coin","te1","philadelphia"]'::jsonb)
on conflict (symbol) do nothing;

-- ── Las Vegas player coins (team 17) ─────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, player_role_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0017-0005-000000000001','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000001',
   'LVQB1','Las Vegas QB1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas quarterback role. High-narrative franchise QB with volatile market sentiment.',
   'QB1 coins in high-narrative markets move sharply on story beats. Drama can drive prices as much as performance.',
   5.0,'neutral',66.50,-1.8,'active','["pro-football","player-coin","qb1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000002','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000002',
   'LVRB1','Las Vegas RB1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas lead running back role. Featured back in a volatile offensive system.',
   'Running back coins carry position risk. High usage in inconsistent offenses amplifies volatility.',
   6.0,'neutral',30.40,-2.4,'active','["pro-football","player-coin","rb1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000003','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000003',
   'LVWR1','Las Vegas WR1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas top receiver role. High-upside skill position in a boom-or-bust offensive system.',
   'Volatile offensive systems create boom-or-bust player coin pricing. Wide swings are common.',
   5.5,'neutral',41.80,-1.2,'active','["pro-football","player-coin","wr1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000004','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000004',
   'LVTE1','Las Vegas TE1 Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas tight end role. Red-zone featured role in a volatile passing system.',
   'TE coins with red-zone usage generate touchdown-event spikes. Volatile systems amplify both up and down moves.',
   5.5,'neutral',41.80,-0.8,'active','["pro-football","player-coin","te1","las-vegas"]'::jsonb),
  ('60000000-0000-0017-0005-000000000005','player_coin','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017','40000000-0000-0000-0017-000000000005',
   'LVER1','Las Vegas Edge Rusher Coin','Pro Football Player Coin · Las Vegas',
   'Tracks the Las Vegas edge rusher role. Defensive pass rusher in a high-narrative defensive unit.',
   'Edge rusher coins spike on sack and turnover events regardless of team record.',
   6.0,'neutral',36.10,-1.5,'active','["pro-football","player-coin","edge","las-vegas"]'::jsonb)
on conflict (symbol) do nothing;
