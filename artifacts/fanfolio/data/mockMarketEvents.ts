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
  | "Championship";

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
];

export function getEventById(id: string): MarketEvent | undefined {
  return MARKET_EVENTS.find(e => e.id === id);
}

export function getRandomEvent(excludeId?: string): MarketEvent {
  const pool = excludeId ? MARKET_EVENTS.filter(e => e.id !== excludeId) : MARKET_EVENTS;
  return pool[Math.floor(Math.random() * pool.length)];
}
