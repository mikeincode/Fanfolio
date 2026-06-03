/**
 * assetUniverse.ts
 *
 * Expanded asset universe that builds on the core mock assets.
 * All data is simulated and educational — no real money, no gambling,
 * no sportsbook odds. LuckyCoin has no cash value.
 *
 * To scale later: replace the static arrays here with a real sports API
 * adapter that converts live team/player stats into simulated price inputs.
 * User portfolios remain fully separate in user_game_state (Supabase/AsyncStorage).
 */

import { Asset, MOCK_ASSETS } from "@/data/mockAssets";

function generateChart(basePrice: number, trend: number, volatility: number): number[] {
  const points: number[] = [];
  let current = basePrice * 0.9;
  for (let i = 0; i < 20; i++) {
    current = current + trend + (Math.random() - 0.5) * volatility;
    if (current < 0.1) current = 0.1;
    points.push(Math.round(current * 100) / 100);
  }
  return points;
}

// ── NFL Team Stocks ────────────────────────────────────────────

const NFL_TEAM_STOCKS: Asset[] = [
  {
    id: "lions-stock",
    name: "Detroit Lions Stock",
    symbol: "DETL",
    type: "Team Stock",
    sport: "Football",
    league: "NFL",
    price: 212.60,
    previousPrice: 197.30,
    dailyChangePercent: 7.76,
    riskScore: 4,
    description: "Simulated stock for a surging NFL franchise enjoying one of its strongest runs in decades. Strong offense, rising fan engagement, and momentum on their side.",
    marketLesson: "Rising franchises can outperform expectations. Early momentum is often priced in — buy early or pay a premium later.",
    whyItMoved: "A dominant offensive performance and rising playoff probability drove fan engagement scores up, pulling this stock higher.",
    chartData: generateChart(212, 3.5, 14),
    bullish: true,
    tags: ["NFL", "team-stock", "momentum", "rising"],
    educationalNote: "Team stocks reflect the simulated market confidence in a franchise's season trajectory — not actual equity.",
  },
  {
    id: "niners-stock",
    name: "San Francisco 49ers Stock",
    symbol: "SF49",
    type: "Team Stock",
    sport: "Football",
    league: "NFL",
    price: 238.90,
    previousPrice: 244.00,
    dailyChangePercent: -2.09,
    riskScore: 3,
    description: "Simulated stock for a perennial contender with a deep roster and elite coaching staff. Reliable but susceptible to injury risk.",
    marketLesson: "Even strong franchises dip when key players are questionable. Injury news can move team stocks more than the score does.",
    whyItMoved: "Injury report listed a key offensive player as limited in practice, creating short-term selling pressure.",
    chartData: generateChart(239, -1, 10),
    bullish: false,
    tags: ["NFL", "team-stock", "contender", "blue-chip"],
  },
  {
    id: "ravens-stock",
    name: "Baltimore Ravens Stock",
    symbol: "BALT",
    type: "Team Stock",
    sport: "Football",
    league: "NFL",
    price: 226.40,
    previousPrice: 218.00,
    dailyChangePercent: 3.85,
    riskScore: 3,
    description: "Simulated stock for a quarterback-driven franchise with a historically strong defense. Balanced risk profile with upside in playoff scenarios.",
    marketLesson: "A franchise built around a mobile quarterback adds a dimension of unpredictability. Star players raise the ceiling — and the risk.",
    whyItMoved: "Outstanding quarterback efficiency metrics this week drove bullish sentiment across the market.",
    chartData: generateChart(226, 2, 11),
    bullish: true,
    tags: ["NFL", "team-stock", "QB-driven"],
  },
  {
    id: "cowboys-stock",
    name: "Dallas Cowboys Stock",
    symbol: "DALC",
    type: "Team Stock",
    sport: "Football",
    league: "NFL",
    price: 185.20,
    previousPrice: 192.00,
    dailyChangePercent: -3.54,
    riskScore: 5,
    description: "Simulated stock for one of sports' most recognized brands. High media attention creates volatility beyond pure performance metrics.",
    marketLesson: "Brand-driven assets can trade at a premium or discount versus pure performance. Media narrative influences price just like fundamentals.",
    whyItMoved: "Post-loss media cycle amplified negative sentiment, pushing the stock lower despite solid underlying stats.",
    chartData: generateChart(185, -1.5, 16),
    bullish: false,
    tags: ["NFL", "team-stock", "high-media", "brand"],
  },
];

// ── NFL Player Coins ────────────────────────────────────────────

const NFL_PLAYER_COINS: Asset[] = [
  {
    id: "hurts-coin",
    name: "Jalen Hurts Coin",
    symbol: "JHRT",
    type: "Player Coin",
    sport: "Football",
    league: "NFL",
    team: "Philadelphia Eagles",
    position: "QB",
    price: 742.80,
    previousPrice: 718.00,
    dailyChangePercent: 3.45,
    riskScore: 4,
    description: "Simulated player coin for a dual-threat quarterback at the peak of his prime. Rushing upside adds a layer of performance that pure pocket passers lack.",
    marketLesson: "Players who impact the game in multiple ways create diversified upside. A rushing QB can score even when the passing game struggles.",
    whyItMoved: "Three rushing touchdowns in a single game drove JHRT to a weekly high.",
    chartData: generateChart(742, 2.5, 20),
    bullish: true,
    tags: ["NFL", "QB", "dual-threat"],
  },
  {
    id: "kelce-coin",
    name: "Travis Kelce Coin",
    symbol: "TKC",
    type: "Player Coin",
    sport: "Football",
    league: "NFL",
    team: "Kansas City Chiefs",
    position: "TE",
    price: 618.50,
    previousPrice: 631.00,
    dailyChangePercent: -1.98,
    riskScore: 4,
    description: "Simulated coin for the most celebrated tight end in NFL history. Correlated with the Chiefs franchise stock — when the team wins, this coin tends to rise.",
    marketLesson: "Some player coins are correlated with team performance. Understanding that correlation helps you manage overlapping risk in your portfolio.",
    whyItMoved: "Light usage in the red zone this week reduced his impact score, applying modest downward pressure.",
    chartData: generateChart(618, -1, 12),
    bullish: false,
    tags: ["NFL", "TE", "blue-chip"],
    relatedAssetIds: ["chiefs-stock"],
  },
  {
    id: "parsons-coin",
    name: "Micah Parsons Coin",
    symbol: "MPC",
    type: "Player Coin",
    sport: "Football",
    league: "NFL",
    team: "Dallas Cowboys",
    position: "LB",
    price: 534.20,
    previousPrice: 510.00,
    dailyChangePercent: 4.75,
    riskScore: 5,
    description: "Simulated coin for a dominant pass rusher whose value climbs with sack totals and disruption metrics. Defensive stars have higher variance than QBs.",
    marketLesson: "Defensive player coins can spike dramatically on big performance nights but also dip in low-action games. High ceiling, higher variance.",
    whyItMoved: "A four-sack game set a personal record and sent PARSONS holders celebrating.",
    chartData: generateChart(534, 2, 22),
    bullish: true,
    tags: ["NFL", "EDGE", "defensive"],
    relatedAssetIds: ["cowboys-stock"],
  },
  {
    id: "jefferson-coin",
    name: "Justin Jefferson Coin",
    symbol: "JJC",
    type: "Player Coin",
    sport: "Football",
    league: "NFL",
    team: "Minnesota Vikings",
    position: "WR",
    price: 486.70,
    previousPrice: 475.00,
    dailyChangePercent: 2.46,
    riskScore: 5,
    description: "Simulated coin for a generational wide receiver with elite route-running and catch radius. One of the most consistent performers in the WR market.",
    marketLesson: "Elite receivers often hold value better than other skill positions because their production is less dependent on play-calling.",
    whyItMoved: "A 180-yard receiving game with two touchdowns validated the market's bullish sentiment.",
    chartData: generateChart(487, 1.8, 16),
    bullish: true,
    tags: ["NFL", "WR", "consistent"],
  },
];

// ── Coach Stocks ────────────────────────────────────────────────

const COACH_STOCKS: Asset[] = [
  {
    id: "offensive-coach-stock",
    name: "Offensive Mastermind Stock",
    symbol: "OCSC",
    type: "Coach Stock",
    sport: "Football",
    league: "NFL",
    price: 155.30,
    previousPrice: 148.00,
    dailyChangePercent: 4.93,
    riskScore: 5,
    description: "Simulated coach stock tied to the performance of a top offensive coordinator known for creative play design. Tracks season scoring trends and game-plan efficiency.",
    marketLesson: "Coaches drive systems — when a great offensive mind thrives, the whole team's player coins can rise in correlation. Coaching quality is a hidden market factor.",
    whyItMoved: "Back-to-back 40+ point games by the coached unit validated the market's confidence in this offense's sustainability.",
    chartData: generateChart(155, 2, 14),
    bullish: true,
    tags: ["coach", "NFL", "offense"],
    educationalNote: "Coach stocks in Fanfolio are simulated. They track a coaching staff's performance narrative — not real equity or salaries.",
  },
  {
    id: "defensive-coach-stock",
    name: "Defensive Mastermind Stock",
    symbol: "DCSC",
    type: "Coach Stock",
    sport: "Football",
    league: "NFL",
    price: 131.80,
    previousPrice: 138.00,
    dailyChangePercent: -4.49,
    riskScore: 5,
    description: "Simulated coach stock for a defensive coordinator whose blitz packages and coverage schemes dominate analytics dashboards. Drops when the offense goes pass-heavy.",
    marketLesson: "Even great defenders lose value when the narrative shifts. Markets respond to storytelling, not just performance — a key trading lesson.",
    whyItMoved: "Opposing quarterbacks found soft spots in zone coverage this week, prompting analysts to downgrade the defensive unit's efficiency score.",
    chartData: generateChart(132, -1.5, 13),
    bullish: false,
    tags: ["coach", "NFL", "defense"],
    educationalNote: "Coach stocks in Fanfolio are simulated. They track a coaching staff's performance narrative — not real equity or salaries.",
  },
];

// ── Futures ─────────────────────────────────────────────────────

const FUTURES_ASSETS: Asset[] = [
  {
    id: "coty-future",
    name: "Coach of the Year Future",
    symbol: "COTY",
    type: "Future",
    sport: "Football",
    league: "NFL",
    price: 118.40,
    previousPrice: 108.00,
    dailyChangePercent: 9.63,
    riskScore: 7,
    futureCategory: "Award",
    settlementRule: "Settles at end of simulated season based on aggregated coaching performance scores.",
    description: "A simulated futures asset that rises when a standout head coach builds a dominant season narrative. Tracks cumulative coaching performance across the season.",
    marketLesson: "Award futures move on narrative momentum — not just stats. The first coach to go on a run usually gets priced in weeks before the award is decided.",
    whyItMoved: "A first-year head coach orchestrated their fourth straight dominant victory, putting them at the top of simulated award probability models.",
    chartData: generateChart(118, 3, 18),
    bullish: true,
    tags: ["future", "award", "NFL"],
    educationalNote: "Fanfolio futures track simulated season outcomes. They are not gambling, sportsbook odds, or real-money prediction markets. LuckyCoin has no cash value. This is for learning how expectation-based markets move.",
  },
  {
    id: "oroty-future",
    name: "Offensive Rookie Future",
    symbol: "OROTY",
    type: "Future",
    sport: "Football",
    league: "NFL",
    price: 92.60,
    previousPrice: 99.00,
    dailyChangePercent: -6.46,
    riskScore: 8,
    futureCategory: "Award",
    settlementRule: "Settles at season end based on composite rookie performance analytics.",
    description: "A simulated futures asset that tracks which offensive rookie is dominating performance metrics. Highly volatile — rookie performance is the hardest thing to predict in sports.",
    marketLesson: "Rookie assets carry maximum uncertainty. The market overreacts in both directions. Patience and position-sizing discipline matter most with high-variance futures.",
    whyItMoved: "The early season leader posted a quiet game, letting a competitor close the gap in cumulative stats and shaking futures holders.",
    chartData: generateChart(92, -2.5, 25),
    bullish: false,
    tags: ["future", "award", "rookie", "NFL"],
    educationalNote: "Fanfolio futures track simulated season outcomes. They are not gambling, sportsbook odds, or real-money prediction markets. LuckyCoin has no cash value. This is for learning how expectation-based markets move.",
  },
  {
    id: "comeback-future",
    name: "Comeback Player Future",
    symbol: "CMPBK",
    type: "Future",
    sport: "Football",
    league: "NFL",
    price: 143.90,
    previousPrice: 135.00,
    dailyChangePercent: 6.59,
    riskScore: 6,
    futureCategory: "Award",
    settlementRule: "Settles at season end; value rises with strong recovery performance from the leading candidate.",
    description: "A simulated futures asset tied to a player's return from adversity. Comeback narratives create strong emotional market momentum — often the most watched futures in Fanfolio.",
    marketLesson: "Comeback stories drive emotional buying. When markets mix emotion and fundamentals, prices can move beyond rational levels — a key behavioral finance lesson.",
    whyItMoved: "The leading comeback candidate posted their best stat line since returning from injury, confirming the market's optimistic thesis.",
    chartData: generateChart(144, 2.5, 16),
    bullish: true,
    tags: ["future", "award", "comeback", "NFL"],
    educationalNote: "Fanfolio futures track simulated season outcomes. They are not gambling, sportsbook odds, or real-money prediction markets. LuckyCoin has no cash value. This is for learning how expectation-based markets move.",
  },
];

// ── New Indexes ─────────────────────────────────────────────────

const NEW_INDEXES: Asset[] = [
  {
    id: "nfl-power-index",
    name: "NFL Power Index",
    symbol: "NFLPI",
    type: "Sport Index",
    sport: "Football",
    league: "NFL",
    price: 1124.50,
    previousPrice: 1108.00,
    dailyChangePercent: 1.49,
    riskScore: 3,
    description: "Tracks the combined simulated performance of all NFL team stocks, weighted by win percentage and fan engagement. A broad thermometer for the football market.",
    marketLesson: "A broad index smooths out the noise of individual games. If one team has a bad week, the index barely blinks. This is diversification in action.",
    whyItMoved: "A strong weekend of competitive games across multiple divisions drove broad bullish sentiment in football assets.",
    chartData: generateChart(1124, 1.5, 12),
    bullish: true,
    tags: ["index", "NFL", "diversified"],
    indexComposition: ["chiefs-stock", "lions-stock", "niners-stock", "ravens-stock", "cowboys-stock"],
    educationalNote: "Indexes track a basket of assets. Owning an index means your simulated portfolio is spread across many assets at once.",
  },
  {
    id: "rookie-futures-index",
    name: "Rookie Futures Index",
    symbol: "RFIDX",
    type: "Sport Index",
    sport: "Football",
    league: "NFL",
    price: 387.20,
    previousPrice: 372.00,
    dailyChangePercent: 4.09,
    riskScore: 7,
    description: "Tracks a basket of NFL rookie player coins and award futures. Higher risk than a team index — rookie performance is the most unpredictable variable in sports markets.",
    marketLesson: "Even within indexes, risk varies by composition. A rookie-heavy index behaves very differently from a veteran team index. Know what is inside the basket.",
    whyItMoved: "Multiple rookies posted breakout performances this week, lifting the entire basket and validating early-season optimism.",
    chartData: generateChart(387, 3, 28),
    bullish: true,
    tags: ["index", "rookies", "NFL", "high-volatility"],
    indexComposition: ["hurts-coin", "jefferson-coin", "oroty-future", "rookie-future"],
    educationalNote: "Indexes track a basket of assets. Owning an index means your simulated portfolio is spread across many assets at once.",
  },
];

// ── Additional Meme Coins ───────────────────────────────────────

const NEW_MEME_COINS: Asset[] = [
  {
    id: "fourth-quarter-coin",
    name: "4th Quarter Coin",
    symbol: "4QC",
    type: "Meme Coin",
    sport: "Football",
    price: 28.40,
    previousPrice: 22.00,
    dailyChangePercent: 29.09,
    riskScore: 9,
    description: "Surges when fourth-quarter comebacks, last-minute field goals, or walk-off plays happen. Pure adrenaline in coin form.",
    marketLesson: "Hype-driven assets spike on events, not fundamentals. The move is often over before most people react. This is the nature of momentum trading.",
    whyItMoved: "A game-winning touchdown with 4 seconds left sent 4QC holders into a frenzy, driving a 30% overnight spike.",
    chartData: generateChart(28, 5, 38),
    bullish: true,
    tags: ["meme", "football", "clutch"],
  },
  {
    id: "red-zone-coin",
    name: "Red Zone Coin",
    symbol: "RZC",
    type: "Meme Coin",
    sport: "Football",
    price: 19.80,
    previousPrice: 24.50,
    dailyChangePercent: -19.18,
    riskScore: 10,
    description: "Moves with scoring efficiency inside the red zone. Spikes during high-scoring weeks, crashes during defensive battles and field goal festivals.",
    marketLesson: "Sector-specific meme coins can collapse just as fast as they rise. A single low-scoring weekend is enough to wipe out a week of gains.",
    whyItMoved: "Three games in a row ended with field goals after red-zone turnovers. Low scoring efficiency cratered demand for RZC.",
    chartData: generateChart(19, -3, 32),
    bullish: false,
    tags: ["meme", "football", "scoring"],
  },
];

// ── Combined Universe ──────────────────────────────────────────

export const UNIVERSE_ASSETS: Asset[] = [
  ...NFL_TEAM_STOCKS,
  ...NFL_PLAYER_COINS,
  ...COACH_STOCKS,
  ...FUTURES_ASSETS,
  ...NEW_INDEXES,
  ...NEW_MEME_COINS,
];

export const ALL_ASSETS: Asset[] = [
  ...MOCK_ASSETS,
  ...UNIVERSE_ASSETS,
];

export function getAllAssetById(id: string): Asset | undefined {
  return ALL_ASSETS.find(a => a.id === id);
}

export function getAllAssetsByType(type: import("@/data/mockAssets").AssetType | "All"): Asset[] {
  if (type === "All") return ALL_ASSETS;
  return ALL_ASSETS.filter(a => a.type === type);
}
