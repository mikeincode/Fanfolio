export type LeaderboardFilter = "Overall" | "Weekly" | "Football" | "Basketball" | "MMA" | "Meme Coins" | "Index Masters";

export interface LeaderboardEntry {
  rank: number;
  username: string;
  portfolioValue: number;
  weeklyChange: number;
  weeklyChangePercent: number;
  specialties: string[];
  isCurrentUser?: boolean;
}

const LEADERBOARD_DATA: Record<LeaderboardFilter, LeaderboardEntry[]> = {
  Overall: [
    { rank: 1, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 2, username: "IndexKing", portfolioValue: 212300, weeklyChange: 14100, weeklyChangePercent: 7.1, specialties: ["Sport Indexes", "Futures"] },
    { rank: 3, username: "DiamondFan", portfolioValue: 189700, weeklyChange: 11300, weeklyChangePercent: 6.3, specialties: ["Team Stocks", "Futures"] },
    { rank: 4, username: "ClutchBull", portfolioValue: 155800, weeklyChange: 9800, weeklyChangePercent: 6.7, specialties: ["Basketball", "Meme Coins"] },
    { rank: 5, username: "ChaosTrader", portfolioValue: 134200, weeklyChange: 22400, weeklyChangePercent: 20.1, specialties: ["Meme Coins", "MMA"] },
    { rank: 6, username: "DipBuyer", portfolioValue: 120500, weeklyChange: 8200, weeklyChangePercent: 7.3, specialties: ["Team Stocks", "Indexes"] },
    { rank: 7, username: "RookieTrader", portfolioValue: 84300, weeklyChange: -3100, weeklyChangePercent: -3.5, specialties: ["Player Coins"] },
    { rank: 8, username: "BearMarketBob", portfolioValue: 62100, weeklyChange: -5800, weeklyChangePercent: -8.6, specialties: ["Futures"] },
    { rank: 247, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
  Weekly: [
    { rank: 1, username: "ChaosTrader", portfolioValue: 134200, weeklyChange: 22400, weeklyChangePercent: 20.1, specialties: ["Meme Coins", "MMA"] },
    { rank: 2, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 3, username: "IndexKing", portfolioValue: 212300, weeklyChange: 14100, weeklyChangePercent: 7.1, specialties: ["Sport Indexes", "Futures"] },
    { rank: 4, username: "DipBuyer", portfolioValue: 120500, weeklyChange: 8200, weeklyChangePercent: 7.3, specialties: ["Team Stocks", "Indexes"] },
    { rank: 5, username: "ClutchBull", portfolioValue: 155800, weeklyChange: 9800, weeklyChangePercent: 6.7, specialties: ["Basketball", "Meme Coins"] },
    { rank: 6, username: "DiamondFan", portfolioValue: 189700, weeklyChange: 11300, weeklyChangePercent: 6.3, specialties: ["Team Stocks", "Futures"] },
    { rank: 7, username: "RookieTrader", portfolioValue: 84300, weeklyChange: -3100, weeklyChangePercent: -3.5, specialties: ["Player Coins"] },
    { rank: 8, username: "BearMarketBob", portfolioValue: 62100, weeklyChange: -5800, weeklyChangePercent: -8.6, specialties: ["Futures"] },
    { rank: 156, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
  Football: [
    { rank: 1, username: "DiamondFan", portfolioValue: 189700, weeklyChange: 11300, weeklyChangePercent: 6.3, specialties: ["Team Stocks", "Futures"] },
    { rank: 2, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 3, username: "DipBuyer", portfolioValue: 120500, weeklyChange: 8200, weeklyChangePercent: 7.3, specialties: ["Team Stocks", "Indexes"] },
    { rank: 4, username: "IndexKing", portfolioValue: 212300, weeklyChange: 14100, weeklyChangePercent: 7.1, specialties: ["Sport Indexes", "Futures"] },
    { rank: 5, username: "BearMarketBob", portfolioValue: 62100, weeklyChange: -5800, weeklyChangePercent: -8.6, specialties: ["Futures"] },
    { rank: 89, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
  Basketball: [
    { rank: 1, username: "ClutchBull", portfolioValue: 155800, weeklyChange: 9800, weeklyChangePercent: 6.7, specialties: ["Basketball", "Meme Coins"] },
    { rank: 2, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 3, username: "DiamondFan", portfolioValue: 189700, weeklyChange: 11300, weeklyChangePercent: 6.3, specialties: ["Team Stocks", "Futures"] },
    { rank: 4, username: "RookieTrader", portfolioValue: 84300, weeklyChange: -3100, weeklyChangePercent: -3.5, specialties: ["Player Coins"] },
    { rank: 5, username: "IndexKing", portfolioValue: 212300, weeklyChange: 14100, weeklyChangePercent: 7.1, specialties: ["Sport Indexes", "Futures"] },
    { rank: 112, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
  MMA: [
    { rank: 1, username: "ChaosTrader", portfolioValue: 134200, weeklyChange: 22400, weeklyChangePercent: 20.1, specialties: ["Meme Coins", "MMA"] },
    { rank: 2, username: "IndexKing", portfolioValue: 212300, weeklyChange: 14100, weeklyChangePercent: 7.1, specialties: ["Sport Indexes", "Futures"] },
    { rank: 3, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 4, username: "ClutchBull", portfolioValue: 155800, weeklyChange: 9800, weeklyChangePercent: 6.7, specialties: ["Basketball", "Meme Coins"] },
    { rank: 5, username: "RookieTrader", portfolioValue: 84300, weeklyChange: -3100, weeklyChangePercent: -3.5, specialties: ["Player Coins"] },
    { rank: 201, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
  "Meme Coins": [
    { rank: 1, username: "ChaosTrader", portfolioValue: 134200, weeklyChange: 22400, weeklyChangePercent: 20.1, specialties: ["Meme Coins", "MMA"] },
    { rank: 2, username: "ClutchBull", portfolioValue: 155800, weeklyChange: 9800, weeklyChangePercent: 6.7, specialties: ["Basketball", "Meme Coins"] },
    { rank: 3, username: "DipBuyer", portfolioValue: 120500, weeklyChange: 8200, weeklyChangePercent: 7.3, specialties: ["Team Stocks", "Indexes"] },
    { rank: 4, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 5, username: "BearMarketBob", portfolioValue: 62100, weeklyChange: -5800, weeklyChangePercent: -8.6, specialties: ["Futures"] },
    { rank: 322, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
  "Index Masters": [
    { rank: 1, username: "IndexKing", portfolioValue: 212300, weeklyChange: 14100, weeklyChangePercent: 7.1, specialties: ["Sport Indexes", "Futures"] },
    { rank: 2, username: "MarketMVP", portfolioValue: 248500, weeklyChange: 18200, weeklyChangePercent: 7.9, specialties: ["Indexes", "Player Coins"] },
    { rank: 3, username: "DipBuyer", portfolioValue: 120500, weeklyChange: 8200, weeklyChangePercent: 7.3, specialties: ["Team Stocks", "Indexes"] },
    { rank: 4, username: "DiamondFan", portfolioValue: 189700, weeklyChange: 11300, weeklyChangePercent: 6.3, specialties: ["Team Stocks", "Futures"] },
    { rank: 5, username: "ClutchBull", portfolioValue: 155800, weeklyChange: 9800, weeklyChangePercent: 6.7, specialties: ["Basketball", "Meme Coins"] },
    { rank: 178, username: "You", portfolioValue: 10000, weeklyChange: 0, weeklyChangePercent: 0, specialties: ["New Trader"], isCurrentUser: true },
  ],
};

export function getLeaderboard(filter: LeaderboardFilter): LeaderboardEntry[] {
  return LEADERBOARD_DATA[filter] ?? LEADERBOARD_DATA.Overall;
}

export const LEADERBOARD_FILTERS: LeaderboardFilter[] = [
  "Overall", "Weekly", "Football", "Basketball", "MMA", "Meme Coins", "Index Masters"
];
