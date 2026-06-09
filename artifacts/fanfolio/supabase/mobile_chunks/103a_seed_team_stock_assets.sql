-- ============================================================
-- 103a — Seed: Team Stock Assets (32 rows)
-- One team stock per Pro Football franchise.
-- Depends on: 102a-102e (teams must exist)
-- Idempotent: INSERT ... ON CONFLICT (symbol) DO NOTHING
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- TEAM STOCK ASSETS — 32 total (one per Pro Football team)
-- Asset UUID pattern: 60000000-0000-{team_pos:04d}-0004-000000000001
-- Symbol pattern: {prefix}FT  e.g. KCFT, PHIFT, LAAFT, NYAFT
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, league_id, team_id, symbol,
   public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0001-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000001',
   'AZFT','Arizona Football Team Stock','Pro Football Team · Arizona',
   'Tracks the simulated market performance of the Arizona football franchise. Rebuilding phase with developing roster depth and long-term upside potential.',
   'Team stocks bundle franchise performance — wins, roster moves, and fan sentiment. They move more slowly than player coins but compound across a full simulated season.',
   4.5,'neutral',145.00,-0.4,'active','["pro-football","team-stock","arizona"]'::jsonb),

  ('60000000-0000-0002-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000002',
   'ATLFT','Atlanta Football Team Stock','Pro Football Team · Atlanta',
   'Tracks the simulated market performance of the Atlanta football franchise. Volatile roster construction cycle with boom-or-bust season potential.',
   'Volatile team stocks can move sharply in either direction around big moments. Position sizing matters more with high-risk franchises.',
   5.0,'neutral',175.00,-0.7,'active','["pro-football","team-stock","atlanta"]'::jsonb),

  ('60000000-0000-0003-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000003',
   'BALFT','Baltimore Football Team Stock','Pro Football Team · Baltimore',
   'Tracks the simulated market performance of the Baltimore football franchise. Elite two-way roster in a sustained championship-contending window.',
   'Championship-window franchises offer lower volatility and more reliable upside. Their team stocks anchor well-balanced portfolios.',
   3.5,'bullish',410.00,1.5,'active','["pro-football","team-stock","baltimore"]'::jsonb),

  ('60000000-0000-0004-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000004',
   'BUFFT','Buffalo Football Team Stock','Pro Football Team · Buffalo',
   'Tracks the simulated market performance of the Buffalo football franchise. Deep roster with consistent playoff narrative driving sustained demand.',
   'Franchises with entrenched fan narrative often trade at a premium. Consistent playoff appearances keep team stocks elevated.',
   4.0,'bullish',370.00,1.2,'active','["pro-football","team-stock","buffalo"]'::jsonb),

  ('60000000-0000-0005-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000005',
   'CARFT','Carolina Football Team Stock','Pro Football Team · Carolina',
   'Tracks the simulated market performance of the Carolina football franchise. Full rebuild underway — high risk, speculative upside.',
   'Rebuilding franchises carry higher volatility. Early-stage upside is real but so is the downside — size positions carefully.',
   5.5,'bearish',118.00,-3.1,'active','["pro-football","team-stock","carolina"]'::jsonb),

  ('60000000-0000-0006-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000006',
   'CHIFT','Chicago Football Team Stock','Pro Football Team · Chicago',
   'Tracks the simulated market performance of the Chicago football franchise. Roster overhaul in progress with young-core optimism driving early momentum.',
   'Young-core rebuilds can generate speculative upside early. Watch for roster moves and draft results to confirm the narrative.',
   4.5,'neutral',138.00,1.2,'active','["pro-football","team-stock","chicago"]'::jsonb),

  ('60000000-0000-0007-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000007',
   'CINFT','Cincinnati Football Team Stock','Pro Football Team · Cincinnati',
   'Tracks the simulated market performance of the Cincinnati football franchise. Proven offensive core with playoff momentum and rising market sentiment.',
   'Offensive-led franchises with a reliable QB anchor tend to sustain team stock growth through full simulated seasons.',
   5.0,'bullish',240.00,1.4,'active','["pro-football","team-stock","cincinnati"]'::jsonb),

  ('60000000-0000-0008-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000008',
   'CLEFT','Cleveland Football Team Stock','Pro Football Team · Cleveland',
   'Tracks the simulated market performance of the Cleveland football franchise. Competitive roster with inconsistent results creating volatile pricing windows.',
   'Inconsistency creates both risk and opportunity. Volatile team stocks can be timed around narrative shifts.',
   5.5,'neutral',165.00,-0.8,'active','["pro-football","team-stock","cleveland"]'::jsonb),

  ('60000000-0000-0009-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000009',
   'DALFT','Dallas Football Team Stock','Pro Football Team · Dallas',
   'Tracks the simulated market performance of the Dallas football franchise. High-brand franchise with strong market sentiment even in mixed performance years.',
   'Brand premium is real in simulated markets. High-profile franchises trade at elevated prices even when on-field results are mixed.',
   3.5,'neutral',355.00,-0.3,'active','["pro-football","team-stock","dallas"]'::jsonb),

  ('60000000-0000-0010-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000010',
   'DENFT','Denver Football Team Stock','Pro Football Team · Denver',
   'Tracks the simulated market performance of the Denver football franchise. Post-dynasty transition period with uncertain QB narrative weighing on sentiment.',
   'Franchise transitions around key positions create pricing uncertainty. QB1 narrative changes often move team stocks more than game results.',
   5.0,'bearish',150.00,-2.4,'active','["pro-football","team-stock","denver"]'::jsonb),

  ('60000000-0000-0011-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000011',
   'DETFT','Detroit Football Team Stock','Pro Football Team · Detroit',
   'Tracks the simulated market performance of the Detroit football franchise. Rising contender with an elite offensive core generating strong market momentum.',
   'Ascending franchises in their first contention window often outperform the market. Early positioning in rising teams is a key simulated strategy.',
   4.0,'bullish',380.00,2.4,'active','["pro-football","team-stock","detroit"]'::jsonb),

  ('60000000-0000-0012-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000012',
   'GBFT','Green Bay Football Team Stock','Pro Football Team · Green Bay',
   'Tracks the simulated market performance of the Green Bay football franchise. Storied franchise with deep roots and a consistent competitive baseline.',
   'Storied franchises tend to trade at lower volatility than average. Their established narrative creates pricing stability.',
   3.5,'neutral',330.00,0.4,'active','["pro-football","team-stock","green-bay"]'::jsonb),

  ('60000000-0000-0013-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000013',
   'HOUFT','Houston Football Team Stock','Pro Football Team · Houston',
   'Tracks the simulated market performance of the Houston football franchise. Young roster in an accelerating growth phase with strong recent results.',
   'Growth-phase franchises can outperform during their ascent window. Rising sentiment compounds quickly when backed by actual results.',
   5.0,'bullish',250.00,3.2,'active','["pro-football","team-stock","houston"]'::jsonb),

  ('60000000-0000-0014-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000014',
   'INDFT','Indianapolis Football Team Stock','Pro Football Team · Indianapolis',
   'Tracks the simulated market performance of the Indianapolis football franchise. Solid roster with balanced risk — competitive but not yet elite.',
   'Balanced-risk team stocks are useful anchors in a diversified portfolio. They move with the broader pro football market without extreme swings.',
   4.5,'neutral',215.00,0.5,'active','["pro-football","team-stock","indianapolis"]'::jsonb),

  ('60000000-0000-0015-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000015',
   'JAXFT','Jacksonville Football Team Stock','Pro Football Team · Jacksonville',
   'Tracks the simulated market performance of the Jacksonville football franchise. Developing roster with speculative upside in a longer rebuild cycle.',
   'Long-cycle rebuilds reward patient positioning. Early entry carries risk, but franchise inflection points can deliver outsized returns.',
   5.5,'neutral',125.00,-1.4,'active','["pro-football","team-stock","jacksonville"]'::jsonb),

  ('60000000-0000-0016-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000016',
   'KCFT','Kansas City Football Team Stock','Pro Football Team · Kansas City',
   'Tracks the simulated market performance of the Kansas City football franchise. Multi-year championship window with dominant market narrative and broad fan base.',
   'Dominant franchises sustain premium pricing across full seasons. Lower volatility comes with the trade-off of already-elevated entry price.',
   3.0,'bullish',480.00,2.1,'active','["pro-football","team-stock","kansas-city"]'::jsonb),

  ('60000000-0000-0017-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000017',
   'LVFT','Las Vegas Football Team Stock','Pro Football Team · Las Vegas',
   'Tracks the simulated market performance of the Las Vegas football franchise. Volatile market with mixed roster results and high-narrative surrounding the franchise.',
   'High-narrative franchises attract sentiment-driven pricing. Price swings around storylines can exceed actual performance changes.',
   5.0,'neutral',190.00,-1.2,'active','["pro-football","team-stock","las-vegas"]'::jsonb),

  ('60000000-0000-0018-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000018',
   'LAAFT','Los Angeles Football Team A Stock','Pro Football Team A · Los Angeles',
   'Tracks the simulated market performance of the Los Angeles A football franchise. Large-market team with strong brand premium and competitive roster.',
   'Large-market franchises carry a built-in brand premium. Even in mixed seasons, market size keeps sentiment elevated.',
   4.5,'neutral',305.00,0.7,'active','["pro-football","team-stock","los-angeles-a"]'::jsonb),

  ('60000000-0000-0019-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000019',
   'LABFT','Los Angeles Football Team B Stock','Pro Football Team B · Los Angeles',
   'Tracks the simulated market performance of the Los Angeles B football franchise. Shared market with volatile results — inconsistent performance narrative.',
   'Shared-market franchises compete for fan sentiment. When one rises, the other sometimes dips — an interesting correlation to track.',
   5.5,'neutral',195.00,0.8,'active','["pro-football","team-stock","los-angeles-b"]'::jsonb),

  ('60000000-0000-0020-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000020',
   'MIAFT','Miami Football Team Stock','Pro Football Team · Miami',
   'Tracks the simulated market performance of the Miami football franchise. Rising contender with offensive firepower and growing playoff narrative.',
   'Franchises riding offensive momentum can sustain extended team stock rallies. Watch for defensive gaps that could deflate the narrative.',
   4.5,'bullish',255.00,1.1,'active','["pro-football","team-stock","miami"]'::jsonb),

  ('60000000-0000-0021-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000021',
   'MINFT','Minnesota Football Team Stock','Pro Football Team · Minnesota',
   'Tracks the simulated market performance of the Minnesota football franchise. Consistent contender with strong skill-position depth and stable playoff positioning.',
   'Consistent contenders generate steady team stock appreciation. Lower-drama franchises are often undervalued relative to their actual win rates.',
   4.5,'bullish',275.00,1.6,'active','["pro-football","team-stock","minnesota"]'::jsonb),

  ('60000000-0000-0022-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000022',
   'NEFT','New England Football Team Stock','Pro Football Team · New England',
   'Tracks the simulated market performance of the New England football franchise. Transitioning from dynasty-era to competitive rebuild — elevated floor, uncertain ceiling.',
   'Post-dynasty franchises often trade at a legacy premium. The floor stays high but the ceiling is uncertain until new leadership proves itself.',
   4.0,'neutral',225.00,-1.8,'active','["pro-football","team-stock","new-england"]'::jsonb),

  ('60000000-0000-0023-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000023',
   'NOFT','New Orleans Football Team Stock','Pro Football Team · New Orleans',
   'Tracks the simulated market performance of the New Orleans football franchise. Veteran-led roster navigating a competitive window with declining offensive narrative.',
   'Declining-narrative franchises can be trading opportunities when sentiment overshoots the actual roster quality.',
   4.5,'bearish',160.00,-1.5,'active','["pro-football","team-stock","new-orleans"]'::jsonb),

  ('60000000-0000-0024-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000024',
   'NYAFT','New York Football Team A Stock','Pro Football Team A · New York',
   'Tracks the simulated market performance of the New York A football franchise. Large-market franchise in a reset year with speculative upside.',
   'Large-market reset franchises can recover sharply on a single narrative shift. They rarely trade to true bottom-of-market prices.',
   5.0,'bearish',155.00,-1.9,'active','["pro-football","team-stock","new-york-a"]'::jsonb),

  ('60000000-0000-0025-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000025',
   'NYBFT','New York Football Team B Stock','Pro Football Team B · New York',
   'Tracks the simulated market performance of the New York B football franchise. Shared market with high volatility — rapid narrative swings in both directions.',
   'High-volatility team stocks require more active management. Larger position sizes carry more risk when sentiment can shift quickly.',
   5.5,'bearish',130.00,-2.8,'active','["pro-football","team-stock","new-york-b"]'::jsonb),

  ('60000000-0000-0026-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000026',
   'PHIFT','Philadelphia Football Team Stock','Pro Football Team · Philadelphia',
   'Tracks the simulated market performance of the Philadelphia football franchise. Elite two-way roster in a championship-contending window with dominant market narrative.',
   'Elite two-way franchises combine offensive and defensive narrative to sustain broad market support. Their stocks rarely see deep sell-offs.',
   3.5,'bullish',420.00,1.8,'active','["pro-football","team-stock","philadelphia"]'::jsonb),

  ('60000000-0000-0027-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000027',
   'PITFT','Pittsburgh Football Team Stock','Pro Football Team · Pittsburgh',
   'Tracks the simulated market performance of the Pittsburgh football franchise. Storied franchise with consistent competitive baseline and deep defensive identity.',
   'Defensively-anchored franchises often hold value in down years. Their lower-volatility profile suits conservative portfolio strategies.',
   3.5,'neutral',290.00,-0.2,'active','["pro-football","team-stock","pittsburgh"]'::jsonb),

  ('60000000-0000-0028-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000028',
   'SFFT','San Francisco Football Team Stock','Pro Football Team · San Francisco',
   'Tracks the simulated market performance of the San Francisco football franchise. Deep roster in a sustained championship window with elite positional talent.',
   'Roster-deep franchises sustain team stock value even through key injuries. Depth is an underrated pricing factor in simulated markets.',
   3.5,'bullish',395.00,0.9,'active','["pro-football","team-stock","san-francisco"]'::jsonb),

  ('60000000-0000-0029-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000029',
   'SEAFT','Seattle Football Team Stock','Pro Football Team · Seattle',
   'Tracks the simulated market performance of the Seattle football franchise. Competitive roster with a balanced identity and steady mid-market narrative.',
   'Mid-market competitive franchises offer lower risk than rebuilders without the premium of elite contenders. Good portfolio anchors.',
   4.0,'neutral',245.00,-0.6,'active','["pro-football","team-stock","seattle"]'::jsonb),

  ('60000000-0000-0030-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000030',
   'TBFT','Tampa Bay Football Team Stock','Pro Football Team · Tampa Bay',
   'Tracks the simulated market performance of the Tampa Bay football franchise. Post-dynasty transition with declining market sentiment and roster uncertainty.',
   'Post-dynasty franchises can trade at persistent discounts until a new core identity emerges. Watch for roster signals.',
   4.5,'bearish',170.00,-2.1,'active','["pro-football","team-stock","tampa-bay"]'::jsonb),

  ('60000000-0000-0031-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000031',
   'TENFT','Tennessee Football Team Stock','Pro Football Team · Tennessee',
   'Tracks the simulated market performance of the Tennessee football franchise. Consistent mid-tier franchise with stable roster and steady market positioning.',
   'Consistent mid-tier franchises rarely deliver surprise rallies but also avoid deep sell-offs. A reliable holding in mixed market conditions.',
   4.5,'neutral',195.00,-0.5,'active','["pro-football","team-stock","tennessee"]'::jsonb),

  ('60000000-0000-0032-0004-000000000001','team_stock','10000000-0000-0000-0000-000000000001','20000000-0000-0000-0000-000000000001','30000000-0000-0000-0000-000000000032',
   'WASFT','Washington Football Team Stock','Pro Football Team · Washington',
   'Tracks the simulated market performance of the Washington football franchise. Roster rebuild with early optimism — new-era narrative beginning to gain traction.',
   'Early-rebuild narratives can generate speculative buying before results confirm the story. Entry risk is higher but so is upside.',
   5.0,'neutral',140.00,0.8,'active','["pro-football","team-stock","washington"]'::jsonb)
on conflict (symbol) do nothing;
