-- ============================================================
-- 103f — Seed: Sport Index, Futures, and Meme Coin Assets
-- Contains: 4 sport index assets
--           6 futures assets
--           6 meme coin assets
-- Note: no coach_stock assets in seed v1 (coach_roles seeded
--       in 102e but no tradeable coach_stock assets yet).
-- Depends on: 103a (assets table must exist)
-- Idempotent: INSERT ... ON CONFLICT (symbol) DO NOTHING
-- ============================================================

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Sport Indexes (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, symbol, public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0000-0001-000000000001',
   'sport_index', '10000000-0000-0000-0000-000000000001',
   'PFPI', 'Pro Football Power Index',
   'Broad pro football market index',
   'Tracks the combined simulated performance of all active pro football team and player assets. Broadly diversified.',
   'Index assets spread risk across many teams and players. When one asset drops, others can offset it — this is diversification.',
   3.0, 'bullish', 1580.00, 1.4, 'active',
   '["pro-football","index","diversification"]'::jsonb),

  ('60000000-0000-0000-0001-000000000002',
   'sport_index', '10000000-0000-0000-0000-000000000002',
   'PBSI', 'Pro Basketball Stars Index',
   'Broad pro basketball player index',
   'Tracks top-tier pro basketball player coin assets. High-visibility stars, moderate diversification.',
   'Player coin indexes concentrate on individual star performance. More upside than a team index, more risk too.',
   4.0, 'neutral', 940.50, -0.8, 'active',
   '["pro-basketball","index","player-coins"]'::jsonb),

  ('60000000-0000-0000-0001-000000000003',
   'sport_index', '10000000-0000-0000-0000-000000000006',
   'MMACI', 'MMA Chaos Index',
   'Tracks MMA volatility assets',
   'Bundles high-volatility MMA-themed assets. Expect larger swings in both directions.',
   'High-volatility indexes can deliver big gains — or big losses. Position sizing matters more in volatile sectors.',
   7.0, 'volatile', 420.25, 3.2, 'active',
   '["mma","index","volatile","chaos"]'::jsonb),

  ('60000000-0000-0000-0001-000000000004',
   'sport_index', null,
   'FF100', 'Fanfolio 100',
   'The flagship all-sports index',
   'The Fanfolio 100 tracks the top 100 simulated sports assets across all categories. The broadest market barometer available.',
   'A broad index like this moves more slowly than individual assets. It is a benchmark — if your portfolio beats FF100, you are outperforming the simulated market.',
   2.5, 'bullish', 1842.50, 1.8, 'active',
   '["all-sports","index","flagship","diversification"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Futures (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, symbol, public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0000-0002-000000000001',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFMVP', 'Pro Football MVP Future',
   'Season MVP award future',
   'Settles when the simulated MVP award is decided at season end. Prices move with changing performance narratives.',
   'Futures are priced on probability, not results. As one player dominates the stats race, this future reprices upward.',
   6.0, 'bullish', 245.00, 4.2, 'active',
   '["pro-football","future","award","mvp"]'::jsonb),

  ('60000000-0000-0000-0002-000000000002',
   'season_future', '10000000-0000-0000-0000-000000000001',
   'PFCHAMP', 'Pro Football Championship Future',
   'Season championship future',
   'Tracks the simulated probability of the league championship outcome. Reprices significantly as playoff positioning clarifies.',
   'Championship futures are the most sensitive to team momentum. A win streak can double this asset — a loss can halve it.',
   7.0, 'neutral', 318.00, -1.1, 'active',
   '["pro-football","future","championship"]'::jsonb),

  ('60000000-0000-0000-0002-000000000003',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFCOTY', 'Pro Football Coach of the Year Future',
   'Coach of the Year award future',
   'Tracks the simulated Coach of the Year award race. Coach buzz and team performance both move this asset.',
   'Award futures narrow as the season progresses. When the race becomes a two-horse contest, volatility compresses and prices rise.',
   5.5, 'neutral', 182.00, 0.5, 'active',
   '["pro-football","future","award","coach"]'::jsonb),

  ('60000000-0000-0000-0002-000000000004',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFOROTY', 'Pro Football Offensive Rookie Future',
   'Offensive Rookie of the Year future',
   'Tracks the simulated OROTY award. Rookie breakout performances can move this asset dramatically.',
   'Rookie futures carry extra uncertainty — any breakout game can reprice the whole race.',
   6.5, 'bullish', 156.00, 3.8, 'active',
   '["pro-football","future","award","rookie"]'::jsonb),

  ('60000000-0000-0000-0002-000000000005',
   'award_future', '10000000-0000-0000-0000-000000000001',
   'PFCPOY', 'Pro Football Comeback Future',
   'Comeback Player of the Year future',
   'Tracks the simulated Comeback Player award. Emotional narrative drives this asset as much as performance.',
   'Comeback narratives blend real performance with behavioral finance. Emotional buying often outpaces statistical gains.',
   6.0, 'neutral', 128.00, 1.2, 'active',
   '["pro-football","future","award","comeback"]'::jsonb),

  ('60000000-0000-0000-0002-000000000006',
   'award_future', '10000000-0000-0000-0000-000000000006',
   'MMACHAMP', 'MMA Championship Future',
   'MMA title fight outcome future',
   'Settles on the outcome of the simulated MMA championship event. High volatility asset — fight results are binary.',
   'Binary outcome futures either pay off fully or collapse on resolution. The risk is high, but so is the potential reward.',
   8.0, 'volatile', 88.50, 6.4, 'active',
   '["mma","future","championship","volatile"]'::jsonb)
on conflict (symbol) do nothing;

-- ─────────────────────────────────────────────────────────────
-- ASSETS — Meme Coins (unchanged from v1)
-- ─────────────────────────────────────────────────────────────
insert into public.assets
  (id, asset_type, sport_id, symbol, public_name, subtitle, description, educational_note,
   risk_score, sentiment, current_price, daily_change_percent, status, tags)
values
  ('60000000-0000-0000-0003-000000000001',
   'meme_coin', '10000000-0000-0000-0000-000000000001',
   'CHOKE', 'ChokeCoin',
   'The late-collapse meme',
   'Spikes when a top seed suffers a shocking early-round collapse. Pure sentiment — no fundamental anchor.',
   'Meme coins run on narrative and social energy. They can spike 50% on excitement and fall 60% when it fades.',
   9.0, 'volatile', 14.20, -8.4, 'active',
   '["meme","pro-football","high-risk","collapse"]'::jsonb),

  ('60000000-0000-0000-0003-000000000002',
   'meme_coin', null,
   'DRAMA', 'DramaCoin',
   'Controversy and conflict meme',
   'Surges on viral press conference moments, locker room controversy, or trade drama. Falls when news cycle moves on.',
   'Social-signal assets price in the current narrative cycle. When drama fades, so does the price.',
   9.0, 'volatile', 22.80, 11.2, 'active',
   '["meme","all-sports","high-risk","drama"]'::jsonb),

  ('60000000-0000-0000-0003-000000000003',
   'meme_coin', null,
   'UPSET', 'UpsetCoin',
   'The underdog victory meme',
   'Spikes whenever a heavy underdog wins. Captures the fan excitement of an unexpected result.',
   'Underdog events are unpredictable by definition. This asset has a short lifespan after each surprise win.',
   9.5, 'volatile', 9.60, 4.8, 'active',
   '["meme","all-sports","high-risk","upset"]'::jsonb),

  ('60000000-0000-0000-0003-000000000004',
   'meme_coin', '10000000-0000-0000-0000-000000000001',
   '4QC', 'FourthQuarterCoin',
   'Late-game drama meme',
   'Surges on walk-off plays, last-second field goals, and fourth-quarter comeback wins. Hype-driven.',
   'Excitement-driven assets spike fast and fade fast. Timing matters more than fundamentals.',
   8.5, 'volatile', 31.40, 7.3, 'active',
   '["meme","pro-football","high-risk","comeback"]'::jsonb),

  ('60000000-0000-0000-0003-000000000005',
   'meme_coin', '10000000-0000-0000-0000-000000000006',
   'KO', 'KnockoutCoin',
   'The finish meme for MMA',
   'Spikes on spectacular KO finishes in MMA events. Tied to the excitement metric, not win/loss records.',
   'Event-driven meme coins can double on a single result. They can also collapse in hours if the next event disappoints.',
   9.5, 'volatile', 7.80, -12.1, 'active',
   '["meme","mma","high-risk","knockout"]'::jsonb),

  ('60000000-0000-0000-0003-000000000006',
   'meme_coin', '10000000-0000-0000-0000-000000000001',
   'CMBC', 'ComebackCoin',
   'The turnaround narrative meme',
   'Tracks comeback-style market narratives — teams or players reversing from a long slump.',
   'Recovery narratives move in stages. Early believers are rewarded most; late buyers often buy after the move.',
   8.0, 'bullish', 48.60, 5.9, 'active',
   '["meme","pro-football","comeback","narrative"]'::jsonb)
on conflict (symbol) do nothing;
