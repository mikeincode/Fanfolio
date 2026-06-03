export type EventCategory =
  | "Upset"
  | "Breakout"
  | "Chaos"
  | "Defense"
  | "Comeback"
  | "Bubble"
  | "Rally"
  | "Stability"
  | "Knockout"
  | "Championship"
  | "Coach"
  | "Futures";

export interface MarketEventImpact {
  assetId: string;
  symbol: string;
  impactPercent: number;
}

export interface MarketEvent {
  id: string;
  title: string;
  sport: string;
  category: EventCategory;
  summary: string;
  impacts: MarketEventImpact[];
  marketLesson: string;
  emoji: string;
}

export const MARKET_EVENTS: MarketEvent[] = [
  // ── Original events ─────────────────────────────────────────────────────────
  {
    id: "mma-weigh-in-chaos",
    title: "MMA Weigh-In Chaos",
    sport: "MMA",
    category: "Chaos",
    emoji: "⚖️",
    summary:
      "Multiple fighters missed weight before a major card, sending MissedWeightCoin surging and the MMA Chaos Index sharply higher. Drama-driven assets spiked as fans reacted.",
    impacts: [
      { assetId: "missed-weight-coin", symbol: "MWC", impactPercent: 28 },
      { assetId: "mma-chaos-index", symbol: "MCI", impactPercent: 9 },
      { assetId: "drama-coin", symbol: "DRAMA", impactPercent: 12 },
      { assetId: "mma-champ-future", symbol: "MMAF", impactPercent: -6 },
    ],
    marketLesson:
      "Event-driven volatility: high-risk assets can move fast when unexpected news hits. This is why you diversify — one wild event shouldn't ruin your whole portfolio.",
  },
  {
    id: "massive-upset-weekend",
    title: "Massive Upset Weekend",
    sport: "All Sports",
    category: "Upset",
    emoji: "🔥",
    summary:
      "Three massive upsets across football and basketball sent underdog assets soaring. Heavily favored teams lost, triggering a wave of ChokeCoin buying and an Underdog Index surge.",
    impacts: [
      { assetId: "upset-coin", symbol: "UPSET", impactPercent: 45 },
      { assetId: "choke-coin", symbol: "CHOKE", impactPercent: 38 },
      { assetId: "comeback-coin", symbol: "CMBC", impactPercent: 22 },
      { assetId: "underdog-index", symbol: "UDI", impactPercent: 18 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: -3 },
      { assetId: "chiefs-stock", symbol: "KCC", impactPercent: -5 },
    ],
    marketLesson:
      "Upsets are like surprise earnings reports. Prices move fast when expectations are wrong. This is why high-risk assets carry a premium — they reward correctly predicting the unexpected.",
  },
  {
    id: "star-player-breakout",
    title: "LeBron 40-Point Triple-Double",
    sport: "Basketball",
    category: "Breakout",
    emoji: "🏀",
    summary:
      "A transcendent performance — 40 points, 14 rebounds, 11 assists — drove the crowd wild and sent LeBron Coin and the Basketball Stars Index surging.",
    impacts: [
      { assetId: "lebron-coin", symbol: "LBJ", impactPercent: 15 },
      { assetId: "basketball-stars-index", symbol: "BSI", impactPercent: 8 },
      { assetId: "clutch-coin", symbol: "CLUTCH", impactPercent: 12 },
      { assetId: "lakers-stock", symbol: "LAL", impactPercent: 9 },
    ],
    marketLesson:
      "Star assets move more than the market on breakout days. A single great performance can drive a player coin up significantly — but it can also reverse if the next game is poor.",
  },
  {
    id: "defense-dominant-weekend",
    title: "Defense-Dominant Weekend",
    sport: "Football",
    category: "Defense",
    emoji: "🛡️",
    summary:
      "A low-scoring weekend across football drove defensive assets higher while offensive-focused player coins dipped. The Defense Index outperformed all football assets.",
    impacts: [
      { assetId: "defense-index", symbol: "DEX", impactPercent: 12 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 5 },
      { assetId: "chiefs-stock", symbol: "KCC", impactPercent: 8 },
      { assetId: "mahomes-coin", symbol: "PMC", impactPercent: -4 },
      { assetId: "super-bowl-future", symbol: "CHAMP", impactPercent: -7 },
    ],
    marketLesson:
      "Not all assets in a sector move together. Defensive and offensive assets within football behave differently. Sector diversification matters even within one sport.",
  },
  {
    id: "comeback-wins-everywhere",
    title: "Comeback Wins Everywhere",
    sport: "All Sports",
    category: "Comeback",
    emoji: "⚡",
    summary:
      "Four consecutive games ended in dramatic second-half comebacks across different sports. ComebackCoin tripled its weekly gains in a single evening session.",
    impacts: [
      { assetId: "comeback-coin", symbol: "CMBC", impactPercent: 35 },
      { assetId: "clutch-coin", symbol: "CLUTCH", impactPercent: 20 },
      { assetId: "underdog-index", symbol: "UDI", impactPercent: 22 },
      { assetId: "basketball-stars-index", symbol: "BSI", impactPercent: 5 },
      { assetId: "fanfolio-100", symbol: "FF100", impactPercent: 3 },
    ],
    marketLesson:
      "Even in markets, assets can recover from a deep deficit if the underlying value is real. Selling at the bottom of a temporary dip — buying the comeback — is how long-term portfolio builders think.",
  },
  {
    id: "hype-bubble-cooling",
    title: "Hype Bubble Cools Off",
    sport: "All Sports",
    category: "Bubble",
    emoji: "🫧",
    summary:
      "A quiet weekend with no major drama or upsets caused most meme coins to retrace sharply. Traders who bought the hype at the top are now holding losses.",
    impacts: [
      { assetId: "missed-weight-coin", symbol: "MWC", impactPercent: -25 },
      { assetId: "drama-coin", symbol: "DRAMA", impactPercent: -18 },
      { assetId: "choke-coin", symbol: "CHOKE", impactPercent: -22 },
      { assetId: "upset-coin", symbol: "UPSET", impactPercent: -20 },
      { assetId: "meme-market-index", symbol: "MMI", impactPercent: -14 },
      { assetId: "fanfolio-100", symbol: "FF100", impactPercent: 2 },
    ],
    marketLesson:
      "Hype bubbles deflate fast when there is nothing fueling them. Speculative assets driven by excitement — not real performance — are the first to fall in calm markets. Cash was king this week.",
  },
  {
    id: "meme-coin-rally",
    title: "Meme Coin Mania",
    sport: "All Sports",
    category: "Rally",
    emoji: "🚀",
    summary:
      "A wave of viral social posts about Fanfolio meme coins caused a coordinated rally. ChokeCoin, DramaCoin, and UpsetCoin all surged as new traders piled in.",
    impacts: [
      { assetId: "meme-market-index", symbol: "MMI", impactPercent: 28 },
      { assetId: "choke-coin", symbol: "CHOKE", impactPercent: 40 },
      { assetId: "drama-coin", symbol: "DRAMA", impactPercent: 30 },
      { assetId: "upset-coin", symbol: "UPSET", impactPercent: 25 },
      { assetId: "comeback-coin", symbol: "CMBC", impactPercent: 18 },
    ],
    marketLesson:
      "Coordinated buying — not real events — drove this rally. When the hype fades, these assets are the first to crash. Meme assets teach the most important lesson: timing the exit matters more than timing the entry.",
  },
  {
    id: "index-stability-during-chaos",
    title: "Indexes Hold Steady Amid Chaos",
    sport: "All Sports",
    category: "Stability",
    emoji: "⚖️",
    summary:
      "While meme coins swung wildly in both directions, the Fanfolio 100 and Football Power Index barely moved. Their broad diversification absorbed the volatility.",
    impacts: [
      { assetId: "fanfolio-100", symbol: "FF100", impactPercent: 2 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 1 },
      { assetId: "basketball-stars-index", symbol: "BSI", impactPercent: 1.5 },
      { assetId: "knockout-coin", symbol: "KO", impactPercent: 35 },
      { assetId: "meme-market-index", symbol: "MMI", impactPercent: -18 },
    ],
    marketLesson:
      "Indexes move less than individual assets because diversification absorbs shocks. Even when one component surges or crashes, the index barely flinches. This is why indexes form the foundation of most smart portfolios.",
  },
  {
    id: "first-round-knockout-spree",
    title: "First-Round Knockout Spree",
    sport: "MMA",
    category: "Knockout",
    emoji: "👊",
    summary:
      "Three of four main card fights ended in first-round knockouts, an extremely rare event. KnockoutCoin spiked to a weekly high and MMA Chaos Index surged as fans rushed to buy.",
    impacts: [
      { assetId: "knockout-coin", symbol: "KO", impactPercent: 42 },
      { assetId: "mma-chaos-index", symbol: "MCI", impactPercent: 18 },
      { assetId: "mma-champ-future", symbol: "MMAF", impactPercent: 15 },
      { assetId: "submission-coin", symbol: "SUB", impactPercent: -8 },
      { assetId: "drama-coin", symbol: "DRAMA", impactPercent: 10 },
    ],
    marketLesson:
      "Sector-specific events create winners and losers within the same sport. KO spiked while SUB dropped — same sector, opposite moves. This is why comparing assets within a sector matters.",
  },
  {
    id: "championship-favorite-emerges",
    title: "Championship Favorite Emerges",
    sport: "Football",
    category: "Championship",
    emoji: "🏆",
    summary:
      "A dominant late-season performance established a clear championship favorite. Futures assets tied to the projected winner surged while alternative contenders dropped.",
    impacts: [
      { assetId: "super-bowl-future", symbol: "CHAMP", impactPercent: 25 },
      { assetId: "chiefs-stock", symbol: "KCC", impactPercent: 12 },
      { assetId: "mahomes-coin", symbol: "PMC", impactPercent: 8 },
      { assetId: "rookie-future", symbol: "RKF1", impactPercent: -10 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 4 },
    ],
    marketLesson:
      "Futures assets respond strongly when uncertainty resolves. Clarity about future outcomes reduces risk, which drives price discovery. Buying futures before clarity is high-risk — holding through clarity is often rewarded.",
  },

  // ── New events — NFL Team Stocks ────────────────────────────────────────────
  {
    id: "lions-championship-surge",
    title: "Lions Championship Run Gains Steam",
    sport: "Football",
    category: "Championship",
    emoji: "🦁",
    summary:
      "The Lions posted their fifth straight dominant performance, driving the franchise's market confidence to a season high. The NFL Power Index moved modestly higher as football sentiment improved broadly.",
    impacts: [
      { assetId: "lions-stock", symbol: "DETL", impactPercent: 16 },
      { assetId: "super-bowl-future", symbol: "CHAMP", impactPercent: 12 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2.5 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 2 },
    ],
    marketLesson:
      "A single franchise's hot run can lift the entire sector index, but the index moves far less. This is diversification at work — broad exposure smooths individual spikes.",
  },
  {
    id: "ravens-defense-shutdown",
    title: "Ravens Defense Shuts Out the League",
    sport: "Football",
    category: "Defense",
    emoji: "🛡️",
    summary:
      "The Ravens' historic defensive performance held their opponent to zero points in the first half. Defensive-linked assets surged while offensive player coins for the opposing team dropped sharply.",
    impacts: [
      { assetId: "ravens-stock", symbol: "BALT", impactPercent: 11 },
      { assetId: "defensive-coach-stock", symbol: "DCSC", impactPercent: 13 },
      { assetId: "defense-index", symbol: "DEX", impactPercent: 4.5 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
      { assetId: "mahomes-coin", symbol: "PMC", impactPercent: -5 },
    ],
    marketLesson:
      "Defensive outperformance is a reminder that football markets have two sides. Owning only offensive player coins leaves you exposed when the defensive narrative takes over.",
  },
  {
    id: "cowboys-media-surge",
    title: "Cowboys Media Cycle Ignites Rally",
    sport: "Football",
    category: "Rally",
    emoji: "⭐",
    summary:
      "High-profile national coverage of the Cowboys' recent performances sparked a buying surge. Brand-driven stocks respond to media attention even when underlying stats are mixed.",
    impacts: [
      { assetId: "cowboys-stock", symbol: "DALC", impactPercent: 10 },
      { assetId: "parsons-coin", symbol: "MPC", impactPercent: 7 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 1.5 },
      { assetId: "choke-coin", symbol: "CHOKE", impactPercent: -4 },
    ],
    marketLesson:
      "High-media assets can rally on coverage alone. Brand value and performance value are different drivers — understanding both is how experienced traders separate signal from noise.",
  },
  {
    id: "niners-injury-scare",
    title: "49ers Key Player Injury Scare",
    sport: "Football",
    category: "Chaos",
    emoji: "🚑",
    summary:
      "A practice injury report listed a key offensive starter as limited, triggering quick selling pressure on the 49ers stock. Index assets absorbed the shock and held their value.",
    impacts: [
      { assetId: "niners-stock", symbol: "SF49", impactPercent: -14 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: -2 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: -1 },
      { assetId: "defense-index", symbol: "DEX", impactPercent: 1.5 },
    ],
    marketLesson:
      "Injury news hits individual team stocks hard but barely dents broad indexes. This is a real-world principle: indexes absorb individual shocks because they hold many positions at once.",
  },

  // ── New events — NFL Player Coins ───────────────────────────────────────────
  {
    id: "kelce-milestone-game",
    title: "Kelce Breaks All-Time Reception Record",
    sport: "Football",
    category: "Breakout",
    emoji: "🏈",
    summary:
      "A record-breaking reception total put TKC holders in celebration mode. The correlated Chiefs stock also moved higher, demonstrating how player coins and team stocks can move together.",
    impacts: [
      { assetId: "kelce-coin", symbol: "TKC", impactPercent: 16 },
      { assetId: "chiefs-stock", symbol: "KCC", impactPercent: 7 },
      { assetId: "mahomes-coin", symbol: "PMC", impactPercent: 5 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
    ],
    marketLesson:
      "Some player coins are correlated with their team stock. When both move at once, portfolios with overlapping exposure amplify the gain — or the loss. Know your correlations.",
  },
  {
    id: "parsons-four-sack-game",
    title: "Parsons Dominant Four-Sack Performance",
    sport: "Football",
    category: "Breakout",
    emoji: "💥",
    summary:
      "A four-sack performance pushed Micah Parsons Coin to a monthly high. Defensive stocks moved across the board as the narrative shifted to defense dominating the league.",
    impacts: [
      { assetId: "parsons-coin", symbol: "MPC", impactPercent: 14 },
      { assetId: "cowboys-stock", symbol: "DALC", impactPercent: 5 },
      { assetId: "defensive-coach-stock", symbol: "DCSC", impactPercent: 9 },
      { assetId: "defense-index", symbol: "DEX", impactPercent: 3.5 },
    ],
    marketLesson:
      "Defensive stars can spike their team stocks and sector indexes in the same event. Understanding how one performance ripples across related assets is a core portfolio analysis skill.",
  },
  {
    id: "jefferson-200-yard-game",
    title: "Jefferson Posts 200-Yard Receiving Game",
    sport: "Football",
    category: "Breakout",
    emoji: "🎯",
    summary:
      "A 200-yard, two-touchdown performance sent Justin Jefferson Coin to a season high. The rookie futures index also lifted as the league-wide receiver narrative drove broad optimism.",
    impacts: [
      { assetId: "jefferson-coin", symbol: "JJC", impactPercent: 18 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
      { assetId: "rookie-futures-index", symbol: "RFIDX", impactPercent: 4 },
    ],
    marketLesson:
      "Elite receivers often hold value better than other skill positions. When an already-premium asset breaks out, the index it belongs to gets a smaller lift — diversification again.",
  },
  {
    id: "hurts-triple-threat-game",
    title: "Hurts Dual-Threat Explosion",
    sport: "Football",
    category: "Breakout",
    emoji: "⚡",
    summary:
      "Three rushing touchdowns and 280 passing yards in a single game drove Jalen Hurts Coin to a weekly high. Offensive-linked assets benefited as the dual-threat narrative dominated headlines.",
    impacts: [
      { assetId: "hurts-coin", symbol: "JHRT", impactPercent: 14 },
      { assetId: "offensive-coach-stock", symbol: "OCSC", impactPercent: 8 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 1.5 },
    ],
    marketLesson:
      "Players who impact the game in multiple ways create correlated upside in their coaching staff's stock. When the whole offensive system fires, related assets move together.",
  },
  {
    id: "kelce-injury-alert",
    title: "Kelce Injury Alert Shocks the Market",
    sport: "Football",
    category: "Chaos",
    emoji: "🚑",
    summary:
      "A mid-game exit for Travis Kelce triggered an immediate sell-off in TKC and a secondary drop in Chiefs Stock. The NFL Power Index felt a smaller ripple as broad diversification limited the damage.",
    impacts: [
      { assetId: "kelce-coin", symbol: "TKC", impactPercent: -20 },
      { assetId: "chiefs-stock", symbol: "KCC", impactPercent: -9 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: -2.5 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: -1.5 },
    ],
    marketLesson:
      "Player coin holders are exposed to injury risk in a way that index holders are not. This is the individual-asset premium — higher potential gains, higher single-event risk.",
  },

  // ── New events — Coach Stocks ────────────────────────────────────────────────
  {
    id: "coach-of-year-buzz",
    title: "Coach of the Year Buzz Builds",
    sport: "Football",
    category: "Coach",
    emoji: "📋",
    summary:
      "Analyst rankings put a dominant first-year head coach at the top of simulated Coach of the Year models. Coaching-linked assets surged as the narrative gained momentum across the league.",
    impacts: [
      { assetId: "coty-future", symbol: "COTY", impactPercent: 22 },
      { assetId: "offensive-coach-stock", symbol: "OCSC", impactPercent: 16 },
      { assetId: "defensive-coach-stock", symbol: "DCSC", impactPercent: 11 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 2 },
    ],
    marketLesson:
      "Coach stocks in Fanfolio are simulated — they are not real equity or salary contracts. They track coaching performance narratives. When the story is strong, the price rises. When the story changes, it can reverse quickly.",
  },
  {
    id: "locker-room-chaos",
    title: "Locker Room Chaos Hits Franchise",
    sport: "Football",
    category: "Coach",
    emoji: "🌪️",
    summary:
      "Reports of internal friction between coaching staff and players triggered a sharp selloff in both the team stock and the offensive coordinator's simulated stock. The index absorbed the shock with a small dip.",
    impacts: [
      { assetId: "lions-stock", symbol: "DETL", impactPercent: -13 },
      { assetId: "offensive-coach-stock", symbol: "OCSC", impactPercent: -17 },
      { assetId: "coty-future", symbol: "COTY", impactPercent: -11 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: -3 },
    ],
    marketLesson:
      "Coach stocks can be volatile because they depend heavily on sentiment and narrative. A coaching controversy can move a team stock more than a bad game. This is why no single coach stock should dominate your simulated portfolio.",
  },
  {
    id: "dual-coach-rivalry",
    title: "Offensive vs. Defensive Coach Showdown",
    sport: "Football",
    category: "Coach",
    emoji: "🤝",
    summary:
      "A high-profile game pitting the league's top offensive unit against its best defense generated a dual coach rally. Both coordinator stocks rose on the shared spotlight. Coach of the Year futures moved in tandem.",
    impacts: [
      { assetId: "offensive-coach-stock", symbol: "OCSC", impactPercent: 12 },
      { assetId: "defensive-coach-stock", symbol: "DCSC", impactPercent: 14 },
      { assetId: "coty-future", symbol: "COTY", impactPercent: 10 },
      { assetId: "defense-index", symbol: "DEX", impactPercent: 3.5 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
    ],
    marketLesson:
      "Coach stocks are a unique Fanfolio asset type — simulated, not real equity. They teach that markets price in coaching quality as a factor in team success. Owning both offensive and defensive coach stocks is a way to diversify within the coaching narrative.",
  },

  // ── New events — Futures ─────────────────────────────────────────────────────
  {
    id: "rookie-award-race-heats-up",
    title: "Rookie Award Race Heats Up",
    sport: "Football",
    category: "Futures",
    emoji: "🌟",
    summary:
      "Three strong performances in one week tightened the simulated Offensive Rookie of the Year race significantly. The Rookie Futures Index surged as the whole basket re-rated upward.",
    impacts: [
      { assetId: "oroty-future", symbol: "OROTY", impactPercent: 20 },
      { assetId: "hurts-coin", symbol: "JHRT", impactPercent: 8 },
      { assetId: "rookie-futures-index", symbol: "RFIDX", impactPercent: 14 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
    ],
    marketLesson:
      "Fanfolio futures track simulated season storylines — they are not sportsbook odds, bets, or real-money prediction markets. When the leading candidate performs well, the future's price rises because simulated expectations change. This is how expectation-based markets work.",
  },
  {
    id: "comeback-player-arc-emerges",
    title: "Comeback Player Arc Takes Over the League",
    sport: "Football",
    category: "Futures",
    emoji: "🔄",
    summary:
      "A player returning from a season-ending injury posted the best performance of the year, sending the Comeback Player Future to a season high. The emotional narrative drove ComebackCoin higher in parallel.",
    impacts: [
      { assetId: "comeback-future", symbol: "CMPBK", impactPercent: 24 },
      { assetId: "comeback-coin", symbol: "CMBC", impactPercent: 16 },
      { assetId: "underdog-index", symbol: "UDI", impactPercent: 6 },
      { assetId: "fanfolio-100", symbol: "FF100", impactPercent: 2 },
    ],
    marketLesson:
      "Futures assets in Fanfolio move on narrative momentum — the story matters as much as the stats. Comeback Player futures show how emotional markets price in human storylines. Settlement is simulated and educational — no real money is involved.",
  },
  {
    id: "ravens-championship-momentum",
    title: "Ravens Championship Momentum Builds",
    sport: "Football",
    category: "Championship",
    emoji: "🏆",
    summary:
      "Back-to-back dominant victories pushed the Ravens into the top spot in simulated championship probability models. All related assets moved together: team stock, defensive coach stock, and championship futures.",
    impacts: [
      { assetId: "ravens-stock", symbol: "BALT", impactPercent: 10 },
      { assetId: "super-bowl-future", symbol: "CHAMP", impactPercent: 14 },
      { assetId: "defense-index", symbol: "DEX", impactPercent: 5 },
      { assetId: "defensive-coach-stock", symbol: "DCSC", impactPercent: 8 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 3 },
    ],
    marketLesson:
      "Championship futures respond strongly to late-season dominance. When a team builds momentum, it lifts multiple related assets at once. Tracking how these move together teaches you about correlated risk in a portfolio.",
  },
  {
    id: "futures-convergence",
    title: "All Award Futures Gain Clarity",
    sport: "Football",
    category: "Futures",
    emoji: "📅",
    summary:
      "As the simulated season enters its final stretch, all three major award futures gained clarity. When uncertainty narrows, prices tend to rise — the risk premium compresses and value buyers step in.",
    impacts: [
      { assetId: "comeback-future", symbol: "CMPBK", impactPercent: 18 },
      { assetId: "oroty-future", symbol: "OROTY", impactPercent: 12 },
      { assetId: "coty-future", symbol: "COTY", impactPercent: 15 },
      { assetId: "rookie-futures-index", symbol: "RFIDX", impactPercent: 10 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 2 },
    ],
    marketLesson:
      "Fanfolio futures track simulated season outcomes — not real-money bets or sportsbook odds. As the simulated season narrows and expectations converge, futures prices move toward their likely settlement value. This is how real expectation-based markets behave at deadline.",
  },

  // ── New events — Meme Coins ──────────────────────────────────────────────────
  {
    id: "fourth-quarter-coin-mania",
    title: "4th Quarter Coin Explodes on Walk-Off Moment",
    sport: "Football",
    category: "Rally",
    emoji: "🎉",
    summary:
      "A game-winning touchdown with four seconds remaining sent 4QC holders into a buying frenzy. ComebackCoin and ClutchCoin followed as the walk-off narrative swept the market.",
    impacts: [
      { assetId: "fourth-quarter-coin", symbol: "4QC", impactPercent: 48 },
      { assetId: "comeback-coin", symbol: "CMBC", impactPercent: 20 },
      { assetId: "clutch-coin", symbol: "CLUTCH", impactPercent: 14 },
      { assetId: "fanfolio-100", symbol: "FF100", impactPercent: -1 },
    ],
    marketLesson:
      "Meme coin spikes happen fast and end fast. The best traders know that a 48% single-day spike often precedes a sharp correction. The move is usually over before most people act on it.",
  },
  {
    id: "red-zone-efficiency-spike",
    title: "Red Zone Scoring Explosion Week",
    sport: "Football",
    category: "Rally",
    emoji: "🟥",
    summary:
      "Unusually high scoring efficiency inside the red zone this week sent the Red Zone Coin and 4th Quarter Coin surging. High-scoring narratives drove football meme coins higher across the board.",
    impacts: [
      { assetId: "red-zone-coin", symbol: "RZC", impactPercent: 38 },
      { assetId: "fourth-quarter-coin", symbol: "4QC", impactPercent: 15 },
      { assetId: "meme-market-index", symbol: "MMI", impactPercent: 9 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 1 },
    ],
    marketLesson:
      "Football meme coins can rally together when a shared theme dominates. But notice the index barely moved — broad diversification is almost immune to these hype cycles.",
  },
  {
    id: "football-meme-bubble-reset",
    title: "Football Meme Bubble Resets Hard",
    sport: "Football",
    category: "Bubble",
    emoji: "🫧",
    summary:
      "After a week of high-energy football meme coin rallies, a quiet, low-scoring weekend with no drama deflated the hype. 4QC and RZC gave back most of their gains in two days.",
    impacts: [
      { assetId: "fourth-quarter-coin", symbol: "4QC", impactPercent: -28 },
      { assetId: "red-zone-coin", symbol: "RZC", impactPercent: -24 },
      { assetId: "drama-coin", symbol: "DRAMA", impactPercent: -15 },
      { assetId: "meme-market-index", symbol: "MMI", impactPercent: -16 },
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 1.5 },
    ],
    marketLesson:
      "Hype-driven assets give back gains even faster than they earned them. A meme coin that went up 38% in one week can lose 28% the following week on nothing but silence. Exiting hype is harder than entering it.",
  },

  // ── New events — Indexes ─────────────────────────────────────────────────────
  {
    id: "index-rotation-rally",
    title: "Diversification Rally — Indexes Lead",
    sport: "All Sports",
    category: "Stability",
    emoji: "📊",
    summary:
      "A broad rotation out of high-risk meme coins into NFL and football index assets drove a steady, sustained rally in index prices. Meme coins weakened as capital moved toward fundamentals.",
    impacts: [
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 9 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 6 },
      { assetId: "rookie-futures-index", symbol: "RFIDX", impactPercent: 7 },
      { assetId: "fanfolio-100", symbol: "FF100", impactPercent: 4 },
      { assetId: "choke-coin", symbol: "CHOKE", impactPercent: -10 },
    ],
    marketLesson:
      "Index rotation happens when traders move capital from high-risk assets into more stable baskets. This teaches a core portfolio principle: in uncertain markets, indexes often absorb the capital that flees individual high-risk positions.",
  },
  {
    id: "nfl-index-broad-rally",
    title: "NFL Power Index Posts Strong Week",
    sport: "Football",
    category: "Stability",
    emoji: "📈",
    summary:
      "A weekend of competitive, high-quality football across the NFL drove broad bullish sentiment. The NFL Power Index moved steadily higher while individual stocks showed mixed results.",
    impacts: [
      { assetId: "nfl-power-index", symbol: "NFLPI", impactPercent: 8 },
      { assetId: "football-power-index", symbol: "FPI", impactPercent: 5 },
      { assetId: "lions-stock", symbol: "DETL", impactPercent: 6 },
      { assetId: "ravens-stock", symbol: "BALT", impactPercent: 4 },
      { assetId: "cowboys-stock", symbol: "DALC", impactPercent: -2 },
    ],
    marketLesson:
      "Even within a broad index rally, individual stocks diverge. An index gains while some components drop. This is why owning the index alongside selective individual positions gives you balanced exposure.",
  },
];

export function getEventById(id: string): MarketEvent | undefined {
  return MARKET_EVENTS.find(e => e.id === id);
}

export function getRandomEvent(excludeId?: string): MarketEvent {
  const pool = excludeId ? MARKET_EVENTS.filter(e => e.id !== excludeId) : MARKET_EVENTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
