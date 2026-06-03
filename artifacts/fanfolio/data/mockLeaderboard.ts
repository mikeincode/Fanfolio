// ─── Types ────────────────────────────────────────────────────────────────────

export type LeaderboardCategory =
  | "Overall"
  | "Weekly"
  | "Diversified"
  | "Index"
  | "Meme"
  | "Scanner"
  | "Low Risk"
  | "XP"
  | "Active"
  | "Comeback";

export interface RivalStats {
  totalValue: number;
  xp: number;
  weeklyChangePct: number;
  avgRisk: number;
  diversificationScore: number;
  indexExposurePct: number;
  memeExposurePct: number;
  tradeCount: number;
  badgesCount: number;
  scannerScore: number;
  comebackScore: number;
  lowRiskScore: number;
}

export interface RivalTrader {
  id: string;
  name: string;
  initials: string;
  traderIdentity: string;
  identityEmoji: string;
  favoriteAssetType: string;
  strategyDesc: string;
  marketLesson: string;
  stats: RivalStats;
}

export interface LeaderboardEntry {
  rank: number;
  rival: RivalTrader | null;
  isUser: boolean;
  displayName: string;
  categoryScore: number;
  displayStat: string;
  displaySecondary: string;
  weeklyChangePct: number;
  badgesCount: number;
  xp: number;
}

export interface CategoryDef {
  id: LeaderboardCategory;
  label: string;
  shortLabel: string;
  icon: string;
  educationTitle: string;
  educationCopy: string;
  statKey: keyof RivalStats;
  formatStat: (v: number, entry?: RivalTrader | null) => string;
  secondaryStatKey: keyof RivalStats;
  formatSecondary: (v: number) => string;
}

// ─── Rival Traders ────────────────────────────────────────────────────────────

export const RIVAL_TRADERS: RivalTrader[] = [
  {
    id: "market_mvp",
    name: "MarketMVP",
    initials: "MM",
    traderIdentity: "Diversified Captain",
    identityEmoji: "🌐",
    favoriteAssetType: "Sport Index",
    strategyDesc: "Balances indexes, player coins, and futures across every sport. No big bets on one idea — steady growth across the whole market.",
    marketLesson: "MarketMVP teaches that consistent balance across asset types can outperform single-sector focus over time.",
    stats: {
      totalValue: 248500, xp: 5200, weeklyChangePct: 7.9,
      avgRisk: 5.2, diversificationScore: 88, indexExposurePct: 35,
      memeExposurePct: 15, tradeCount: 84, badgesCount: 9,
      scannerScore: 72, comebackScore: 65, lowRiskScore: 71.8,
    },
  },
  {
    id: "index_king",
    name: "IndexKing",
    initials: "IK",
    traderIdentity: "Index Builder",
    identityEmoji: "📊",
    favoriteAssetType: "Sport Index",
    strategyDesc: "All indexes, all the time. Avoids individual player coins and meme assets entirely. Slow and steady across the board.",
    marketLesson: "IndexKing teaches that steady portfolios can compete without chasing every spike. Boring wins long races.",
    stats: {
      totalValue: 212300, xp: 4800, weeklyChangePct: 7.1,
      avgRisk: 2.8, diversificationScore: 92, indexExposurePct: 75,
      memeExposurePct: 0, tradeCount: 45, badgesCount: 8,
      scannerScore: 60, comebackScore: 55, lowRiskScore: 100.2,
    },
  },
  {
    id: "chaos_trader",
    name: "ChaosTrader",
    initials: "CT",
    traderIdentity: "Meme Hunter",
    identityEmoji: "🎭",
    favoriteAssetType: "Meme Coin",
    strategyDesc: "Lives for hype cycles. Loads up on meme coins before big events and tries to exit before they crash. High risk, high reward.",
    marketLesson: "ChaosTrader teaches that meme assets can create huge short-term simulated gains — but timing and exits are everything.",
    stats: {
      totalValue: 134200, xp: 3100, weeklyChangePct: 20.1,
      avgRisk: 9.5, diversificationScore: 25, indexExposurePct: 0,
      memeExposurePct: 90, tradeCount: 120, badgesCount: 5,
      scannerScore: 40, comebackScore: 80, lowRiskScore: 11.5,
    },
  },
  {
    id: "dip_buyer",
    name: "DipBuyer",
    initials: "DB",
    traderIdentity: "Dip Buyer",
    identityEmoji: "📉",
    favoriteAssetType: "Team Stock",
    strategyDesc: "Waits for assets to drop, then loads up. Uses the scanner daily and maintains a deep watchlist before committing.",
    marketLesson: "DipBuyer teaches that patience and watching before buying builds better entry habits than chasing the market up.",
    stats: {
      totalValue: 120500, xp: 3400, weeklyChangePct: 7.3,
      avgRisk: 5.0, diversificationScore: 72, indexExposurePct: 25,
      memeExposurePct: 10, tradeCount: 65, badgesCount: 7,
      scannerScore: 68, comebackScore: 75, lowRiskScore: 66.6,
    },
  },
  {
    id: "clutch_bull",
    name: "ClutchBull",
    initials: "CB",
    traderIdentity: "Momentum Trader",
    identityEmoji: "🚀",
    favoriteAssetType: "Player Coin",
    strategyDesc: "Rides momentum. Buys what is trending up in basketball and football, takes profits fast, and rotates into the next mover.",
    marketLesson: "ClutchBull teaches that momentum can be profitable — but exiting before the reversal is the hardest part.",
    stats: {
      totalValue: 155800, xp: 4100, weeklyChangePct: 6.7,
      avgRisk: 7.0, diversificationScore: 60, indexExposurePct: 10,
      memeExposurePct: 30, tradeCount: 90, badgesCount: 7,
      scannerScore: 55, comebackScore: 68, lowRiskScore: 44.0,
    },
  },
  {
    id: "rookie_rocket",
    name: "RookieRocket",
    initials: "RR",
    traderIdentity: "Rookie Learner",
    identityEmoji: "🎯",
    favoriteAssetType: "Meme Coin",
    strategyDesc: "Started recently and is still learning. Takes some big swings early but is slowly building better habits through challenges.",
    marketLesson: "RookieRocket teaches that starting bold and learning fast is a valid path — as long as the lessons stick.",
    stats: {
      totalValue: 84300, xp: 1800, weeklyChangePct: 12.5,
      avgRisk: 7.5, diversificationScore: 40, indexExposurePct: 5,
      memeExposurePct: 45, tradeCount: 28, badgesCount: 3,
      scannerScore: 45, comebackScore: 82, lowRiskScore: 33.0,
    },
  },
  {
    id: "defense_fund",
    name: "DefenseFund",
    initials: "DF",
    traderIdentity: "Low-Risk Leader",
    identityEmoji: "🛡️",
    favoriteAssetType: "Sport Index",
    strategyDesc: "Holds only the most stable indexes and team stocks. Never touches meme coins. Grows slowly but never blows up.",
    marketLesson: "DefenseFund teaches that capital preservation is a valid strategy — protecting what you have is often underrated.",
    stats: {
      totalValue: 168000, xp: 3900, weeklyChangePct: 3.2,
      avgRisk: 2.2, diversificationScore: 85, indexExposurePct: 60,
      memeExposurePct: 0, tradeCount: 30, badgesCount: 8,
      scannerScore: 55, comebackScore: 45, lowRiskScore: 99.9,
    },
  },
  {
    id: "scanner_queen",
    name: "ScannerQueen",
    initials: "SQ",
    traderIdentity: "Scanner Scout",
    identityEmoji: "🔍",
    favoriteAssetType: "Player Coin",
    strategyDesc: "Opens the scanner every session. Watches assets for days before buying. Has one of the largest watchlists in the game.",
    marketLesson: "ScannerQueen teaches that research before action is the most overlooked habit in market simulation.",
    stats: {
      totalValue: 142700, xp: 4200, weeklyChangePct: 9.4,
      avgRisk: 6.0, diversificationScore: 70, indexExposurePct: 20,
      memeExposurePct: 20, tradeCount: 95, badgesCount: 8,
      scannerScore: 95, comebackScore: 70, lowRiskScore: 57.0,
    },
  },
  {
    id: "diamond_fan",
    name: "DiamondFan",
    initials: "DF",
    traderIdentity: "Long-Term Holder",
    identityEmoji: "🏛️",
    favoriteAssetType: "Team Stock",
    strategyDesc: "Buys team stocks and futures and almost never sells. Ignores short-term noise. Portfolio grows slowly through patience.",
    marketLesson: "DiamondFan teaches that holding well-researched positions through volatility is harder — and often more rewarding — than constant trading.",
    stats: {
      totalValue: 189700, xp: 4600, weeklyChangePct: 6.3,
      avgRisk: 4.0, diversificationScore: 78, indexExposurePct: 30,
      memeExposurePct: 5, tradeCount: 22, badgesCount: 9,
      scannerScore: 40, comebackScore: 58, lowRiskScore: 77.4,
    },
  },
  {
    id: "volatility_vince",
    name: "VolatilityVince",
    initials: "VV",
    traderIdentity: "High-Risk Playmaker",
    identityEmoji: "⚡",
    favoriteAssetType: "Meme Coin",
    strategyDesc: "Maximum risk, maximum chaos. Full meme coin and futures exposure. Either posts huge weekly gains or massive drops.",
    marketLesson: "VolatilityVince teaches what happens when risk appetite outpaces risk management. The swings are real lessons.",
    stats: {
      totalValue: 108900, xp: 2800, weeklyChangePct: 15.8,
      avgRisk: 9.2, diversificationScore: 20, indexExposurePct: 0,
      memeExposurePct: 75, tradeCount: 140, badgesCount: 4,
      scannerScore: 38, comebackScore: 85, lowRiskScore: 12.4,
    },
  },
];

// ─── Category Definitions ─────────────────────────────────────────────────────

export const CATEGORIES: CategoryDef[] = [
  {
    id: "Overall",
    label: "Overall",
    shortLabel: "Overall",
    icon: "award",
    educationTitle: "Overall Portfolio Value",
    educationCopy: "Total value is the scoreboard, but it does not tell the whole story. A large portfolio built on meme coins carries far more risk than one built on indexes. Risk and diversification matter too.",
    statKey: "totalValue",
    formatStat: v => `${(v / 1000).toFixed(0)}K LC`,
    secondaryStatKey: "weeklyChangePct",
    formatSecondary: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}% this week`,
  },
  {
    id: "Weekly",
    label: "Weekly Movers",
    shortLabel: "Weekly",
    icon: "trending-up",
    educationTitle: "Weekly Performance",
    educationCopy: "Short-term performance can be misleading. A big weekly gain from a meme coin spike may disappear next week. Consistent small gains often beat one lucky spike.",
    statKey: "weeklyChangePct",
    formatStat: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}%`,
    secondaryStatKey: "totalValue",
    formatSecondary: v => `${(v / 1000).toFixed(0)}K LC total`,
  },
  {
    id: "Diversified",
    label: "Best Diversified",
    shortLabel: "Diversified",
    icon: "pie-chart",
    educationTitle: "Best Diversified",
    educationCopy: "Diversification means spreading exposure across sports and asset types. It can reduce the impact of one bad market event on your whole portfolio. No single loss can sink a diversified roster.",
    statKey: "diversificationScore",
    formatStat: v => `${Math.round(v)} score`,
    secondaryStatKey: "avgRisk",
    formatSecondary: v => `${v.toFixed(1)} avg risk`,
  },
  {
    id: "Index",
    label: "Index Masters",
    shortLabel: "Index",
    icon: "layers",
    educationTitle: "Index Masters",
    educationCopy: "Index investors use baskets of assets to spread risk across an entire sport or sector. One bad game does not sink an index the way it sinks a single player coin.",
    statKey: "indexExposurePct",
    formatStat: v => `${Math.round(v)}% index`,
    secondaryStatKey: "diversificationScore",
    formatSecondary: v => `div. ${Math.round(v)}`,
  },
  {
    id: "Meme",
    label: "Meme Maniacs",
    shortLabel: "Meme",
    icon: "zap",
    educationTitle: "Meme Coin Maniacs",
    educationCopy: "Meme assets can move fast. High rankings here usually come with higher risk scores. These traders understand the volatility — they just are not afraid of it.",
    statKey: "memeExposurePct",
    formatStat: v => `${Math.round(v)}% meme`,
    secondaryStatKey: "weeklyChangePct",
    formatSecondary: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}% week`,
  },
  {
    id: "Scanner",
    label: "Scanner Scouts",
    shortLabel: "Scanner",
    icon: "filter",
    educationTitle: "Scanner Scouts",
    educationCopy: "Scanner Scouts research before trading. They use filters and watchlists to find setups before committing LuckyCoin. Studying the market before acting is a real professional habit.",
    statKey: "scannerScore",
    formatStat: v => `${Math.round(v)} pts`,
    secondaryStatKey: "tradeCount",
    formatSecondary: v => `${v} trades`,
  },
  {
    id: "Low Risk",
    label: "Low Risk Leaders",
    shortLabel: "Low Risk",
    icon: "shield",
    educationTitle: "Low Risk Leaders",
    educationCopy: "Low-risk leaders focus on steadier assets and indexes. They may grow slower than high-risk traders during hot streaks, but they also protect their portfolio when markets turn volatile.",
    statKey: "lowRiskScore",
    formatStat: v => `${Math.round(v)} score`,
    secondaryStatKey: "avgRisk",
    formatSecondary: v => `${v.toFixed(1)}/10 risk`,
  },
  {
    id: "XP",
    label: "XP Leaders",
    shortLabel: "XP",
    icon: "star",
    educationTitle: "XP Leaders",
    educationCopy: "XP rewards learning actions — not just portfolio value. Opening the scanner, completing challenges, viewing the journal, and learning lessons all build XP. This category rewards engagement, not just results.",
    statKey: "xp",
    formatStat: v => `${v.toLocaleString()} XP`,
    secondaryStatKey: "badgesCount",
    formatSecondary: v => `${v} badges`,
  },
  {
    id: "Active",
    label: "Active Traders",
    shortLabel: "Active",
    icon: "repeat",
    educationTitle: "Active Traders",
    educationCopy: "Active traders learn through reps. More trades mean more decisions, more mistakes, and more pattern recognition. Reviewing the journal is essential — otherwise the reps don't become lessons.",
    statKey: "tradeCount",
    formatStat: v => `${v} trades`,
    secondaryStatKey: "xp",
    formatSecondary: v => `${v.toLocaleString()} XP`,
  },
  {
    id: "Comeback",
    label: "Comeback Traders",
    shortLabel: "Comeback",
    icon: "refresh-cw",
    educationTitle: "Comeback Traders",
    educationCopy: "Comeback Traders have recovered from big simulated losses. In real markets, drawdown recovery is one of the most important skills — staying calm and systematic when a portfolio drops.",
    statKey: "comebackScore",
    formatStat: v => `${Math.round(v)} score`,
    secondaryStatKey: "weeklyChangePct",
    formatSecondary: v => `${v >= 0 ? "+" : ""}${v.toFixed(1)}% week`,
  },
];

export const CATEGORY_IDS = CATEGORIES.map(c => c.id);

// ─── User Stats Calculation ───────────────────────────────────────────────────

export interface UserLeaderboardStats {
  totalValue: number;
  xp: number;
  weeklyChangePct: number;
  avgRisk: number;
  diversificationScore: number;
  indexExposurePct: number;
  memeExposurePct: number;
  tradeCount: number;
  badgesCount: number;
  scannerScore: number;
  comebackScore: number;
  lowRiskScore: number;
}

export function buildLeaderboard(
  category: LeaderboardCategory,
  username: string,
  userStats: UserLeaderboardStats,
): LeaderboardEntry[] {
  const catDef = CATEGORIES.find(c => c.id === category)!;
  const statKey = catDef.statKey;
  const secondaryKey = catDef.secondaryStatKey;

  const userCatScore: number = (userStats as any)[statKey] ?? 0;
  const userSecondaryScore: number = (userStats as any)[secondaryKey] ?? 0;

  // Build rival entries
  const rivalEntries: { rival: RivalTrader; score: number }[] = RIVAL_TRADERS.map(r => ({
    rival: r,
    score: r.stats[statKey],
  }));

  // Sort descending
  rivalEntries.sort((a, b) => b.score - a.score);

  // Find user insertion index
  const userRivalIndex = rivalEntries.findIndex(r => r.score < userCatScore);
  const insertIdx = userRivalIndex === -1 ? rivalEntries.length : userRivalIndex;

  // Build final sorted list (rivals + user)
  const allEntries: Array<{ rival: RivalTrader | null; score: number; isUser: boolean }> = [
    ...rivalEntries.slice(0, insertIdx).map(r => ({ rival: r.rival, score: r.score, isUser: false })),
    { rival: null, score: userCatScore, isUser: true },
    ...rivalEntries.slice(insertIdx).map(r => ({ rival: r.rival, score: r.score, isUser: false })),
  ];

  return allEntries.map((e, i): LeaderboardEntry => ({
    rank: i + 1,
    rival: e.rival,
    isUser: e.isUser,
    displayName: e.isUser ? username : e.rival!.name,
    categoryScore: e.score,
    displayStat: catDef.formatStat(e.score, e.rival),
    displaySecondary: e.isUser
      ? catDef.formatSecondary(userSecondaryScore)
      : catDef.formatSecondary(e.rival!.stats[secondaryKey]),
    weeklyChangePct: e.isUser ? userStats.weeklyChangePct : e.rival!.stats.weeklyChangePct,
    badgesCount: e.isUser ? userStats.badgesCount : e.rival!.stats.badgesCount,
    xp: e.isUser ? userStats.xp : e.rival!.stats.xp,
  }));
}

export function getUserRankAcrossCategories(username: string, userStats: UserLeaderboardStats): {
  category: LeaderboardCategory;
  rank: number;
}[] {
  return CATEGORIES.map(cat => {
    const entries = buildLeaderboard(cat.id, username, userStats);
    const userEntry = entries.find(e => e.isUser);
    return { category: cat.id, rank: userEntry?.rank ?? 99 };
  });
}

export function getBestCategory(username: string, userStats: UserLeaderboardStats): LeaderboardCategory {
  const ranks = getUserRankAcrossCategories(username, userStats);
  const best = ranks.reduce((a, b) => (a.rank <= b.rank ? a : b));
  return best.category;
}

// ─── Legacy exports (for backward compat) ────────────────────────────────────

export type LeaderboardFilter = LeaderboardCategory;
export const LEADERBOARD_FILTERS: LeaderboardFilter[] = CATEGORY_IDS;

export function getLeaderboard(filter: LeaderboardFilter): Array<{ rank: number; username: string; portfolioValue: number; weeklyChange: number; weeklyChangePercent: number; specialties: string[]; isCurrentUser?: boolean }> {
  const entries = buildLeaderboard(filter, "You", {
    totalValue: 10000, xp: 0, weeklyChangePct: 0, avgRisk: 5,
    diversificationScore: 0, indexExposurePct: 0, memeExposurePct: 0,
    tradeCount: 0, badgesCount: 0, scannerScore: 0, comebackScore: 30, lowRiskScore: 40,
  });
  return entries.map(e => ({
    rank: e.rank,
    username: e.displayName,
    portfolioValue: e.categoryScore > 10000 ? e.categoryScore : (e.rival?.stats.totalValue ?? 10000),
    weeklyChange: 0,
    weeklyChangePercent: e.weeklyChangePct,
    specialties: e.rival ? [e.rival.traderIdentity] : ["New Trader"],
    isCurrentUser: e.isUser,
  }));
}
