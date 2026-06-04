export const CHALLENGE_CATEGORIES = [
  "Getting Started",
  "Portfolio Building",
  "Market Learning",
  "Scanner & Watchlist",
] as const;

export type ChallengeCategory = typeof CHALLENGE_CATEGORIES[number];

export interface ChallengeDefinition {
  id: string;
  category: ChallengeCategory;
  title: string;
  description: string;
  tip: string;
  icon: string;
  xpReward: number;
  lcReward: number;
  achievementId?: string;
  total: number;
}

export interface AchievementDefinition {
  id: string;
  title: string;
  description: string;
  emoji: string;
}

export interface LevelDef {
  level: number;
  title: string;
  xpRequired: number;
}

export const LEVELS: LevelDef[] = [
  { level: 1, title: "Rookie Trader",     xpRequired: 0    },
  { level: 2, title: "Bench Analyst",     xpRequired: 300  },
  { level: 3, title: "Market Scout",      xpRequired: 700  },
  { level: 4, title: "Portfolio Captain", xpRequired: 1300 },
  { level: 5, title: "Index Pro",         xpRequired: 2200 },
  { level: 6, title: "Fanfolio Shark",    xpRequired: 3500 },
  { level: 7, title: "Market MVP",        xpRequired: 5000 },
];

export const CHALLENGES: ChallengeDefinition[] = [
  // ── Rookie Playbook Milestone ──────────────────────────────
  {
    id: "rookie_playbook_complete",
    category: "Getting Started",
    title: "Rookie Playbook Complete",
    description: "Finish all 7 steps in the Rookie Playbook.",
    tip: "You claimed LuckyCoin, scouted the market, made your first trade, reacted to a Market Pulse, reviewed your portfolio, checked performance history, and opened a lesson. That's a real foundation.",
    icon: "award",
    xpReward: 150,
    lcReward: 250,
    total: 1,
    achievementId: "rookie_graduate",
  },
  // ── Getting Started ────────────────────────────────────────
  {
    id: "claim_daily",
    category: "Getting Started",
    title: "First LuckyCoin",
    description: "Claim your daily LuckyCoin for the first time.",
    tip: "Daily claims are your base income — like a player's salary before any bonuses.",
    icon: "gift",
    xpReward: 100, lcReward: 0, total: 1,
  },
  {
    id: "buy_first",
    category: "Getting Started",
    title: "First Trade",
    description: "Buy your first asset.",
    tip: "Every investor starts with a first buy. You're now a simulated market participant.",
    icon: "shopping-bag",
    xpReward: 150, lcReward: 150, total: 1,
    achievementId: "first_trade",
  },
  {
    id: "add_watchlist",
    category: "Getting Started",
    title: "Scout an Asset",
    description: "Add your first asset to your Watchlist.",
    tip: "Scouting before buying is a real research habit. Watching means tracking without spending yet.",
    icon: "bookmark",
    xpReward: 100, lcReward: 0, total: 1,
    achievementId: "watchlist_scout",
  },
  {
    id: "open_scanner",
    category: "Getting Started",
    title: "Fire Up the Scanner",
    description: "Open the Market Scanner.",
    tip: "Real traders use scanners to find assets that fit a strategy. You just did the same.",
    icon: "filter",
    xpReward: 100, lcReward: 0, total: 1,
    achievementId: "scanner_scout",
  },
  {
    id: "view_journal",
    category: "Getting Started",
    title: "Check Your Journal",
    description: "Open the Trading Journal.",
    tip: "Reviewing your trades is how traders improve. You opened the feedback loop.",
    icon: "book",
    xpReward: 100, lcReward: 0, total: 1,
    achievementId: "journal_reviewer",
  },
  // ── Portfolio Building ─────────────────────────────────────
  {
    id: "own_3_assets",
    category: "Portfolio Building",
    title: "Triple Holding",
    description: "Own 3 different assets at the same time.",
    tip: "Holding multiple assets reduces the risk that one bad event wipes you out.",
    icon: "briefcase",
    xpReward: 200, lcReward: 200, total: 3,
  },
  {
    id: "three_sports",
    category: "Portfolio Building",
    title: "Multi-Sport Fan",
    description: "Own assets from 3 different sports.",
    tip: "Owning assets from multiple sports is like building a balanced roster — no single league can sink your whole portfolio.",
    icon: "globe",
    xpReward: 250, lcReward: 250, total: 3,
    achievementId: "diversified_fan",
  },
  {
    id: "buy_index",
    category: "Portfolio Building",
    title: "Index Investor",
    description: "Buy a Sport Index asset.",
    tip: "Indexes bundle many assets together. One buy gives you exposure to a whole sport — lower risk, steadier ride.",
    icon: "layers",
    xpReward: 200, lcReward: 200, total: 1,
    achievementId: "index_investor",
  },
  {
    id: "low_avg_risk",
    category: "Portfolio Building",
    title: "Risk Manager",
    description: "Keep your portfolio average risk under 6 while holding at least 2 assets.",
    tip: "Managing risk means not going all-in on high-volatility picks. Real portfolio managers balance risk scores across positions.",
    icon: "shield",
    xpReward: 300, lcReward: 300, total: 1,
    achievementId: "risk_manager",
  },
  {
    id: "own_5_assets",
    category: "Portfolio Building",
    title: "Full Roster",
    description: "Build a portfolio with at least 5 assets.",
    tip: "A 5-asset portfolio shows real diversification thinking. You're building like a fund manager.",
    icon: "users",
    xpReward: 350, lcReward: 350, total: 5,
  },
  // ── Market Learning ────────────────────────────────────────
  {
    id: "simulate_3_events",
    category: "Market Learning",
    title: "Market Analyst",
    description: "Review 3 Market Pulses.",
    tip: "Market Pulses teach you how news moves prices. Three reviews means you're building pattern recognition.",
    icon: "zap",
    xpReward: 250, lcReward: 0, total: 3,
    achievementId: "market_event_analyst",
  },
  {
    id: "use_coach",
    category: "Market Learning",
    title: "Coach's Corner",
    description: "Trigger the Market Decision Coach by reviewing your first Market Pulse.",
    tip: "The coach appears after an event and explains what to do next — like an analyst briefing.",
    icon: "message-circle",
    xpReward: 150, lcReward: 0, total: 1,
  },
  {
    id: "learn_3_lessons",
    category: "Market Learning",
    title: "Student of the Game",
    description: "Open 3 lessons in the Learn tab.",
    tip: "Traders who understand why prices move make better decisions. Each lesson builds your market instincts.",
    icon: "book-open",
    xpReward: 200, lcReward: 0, total: 3,
  },
  {
    id: "sell_first",
    category: "Market Learning",
    title: "First Exit",
    description: "Sell an asset for the first time.",
    tip: "Selling is how you realize gains or cut losses. Most beginners only buy — exits are where the real learning happens.",
    icon: "arrow-up-right",
    xpReward: 200, lcReward: 0, total: 1,
  },
  // ── Scanner & Watchlist ────────────────────────────────────
  {
    id: "view_dip_watch",
    category: "Scanner & Watchlist",
    title: "Dip Hunter",
    description: "View the Dip Watch preset in the Scanner.",
    tip: "Buying dips means catching assets after a drop, hoping for a bounce. It carries real risk — dips can keep dipping.",
    icon: "trending-down",
    xpReward: 150, lcReward: 0, total: 1,
  },
  {
    id: "view_momentum",
    category: "Scanner & Watchlist",
    title: "Momentum Follower",
    description: "View the Momentum Leaders preset in the Scanner.",
    tip: "Momentum trading means riding strong trends. Trending assets can keep going — or suddenly reverse.",
    icon: "trending-up",
    xpReward: 150, lcReward: 0, total: 1,
  },
  {
    id: "watch_3_assets",
    category: "Scanner & Watchlist",
    title: "Active Scout",
    description: "Add 3 assets to your Watchlist.",
    tip: "Tracking assets before buying is a research habit. Real analysts maintain watchlists to stay ready.",
    icon: "star",
    xpReward: 200, lcReward: 0, total: 3,
  },
];

export const ACHIEVEMENTS: AchievementDefinition[] = [
  { id: "first_trade",          title: "First Trade",           description: "Made your first simulated buy.",                  emoji: "🏆" },
  { id: "watchlist_scout",      title: "Watchlist Scout",       description: "Scouted your first asset on the Watchlist.",      emoji: "👁️" },
  { id: "index_investor",       title: "Index Investor",        description: "Bought your first Sport Index.",                  emoji: "📊" },
  { id: "meme_coin_maniac",     title: "Meme Coin Maniac",      description: "Bought 3 different Meme Coin assets.",            emoji: "🎭" },
  { id: "diversified_fan",      title: "Diversified Fan",       description: "Owned assets from 3 different sports.",           emoji: "🌐" },
  { id: "scanner_scout",        title: "Scanner Scout",         description: "Used the Market Scanner to find assets.",         emoji: "🔍" },
  { id: "journal_reviewer",     title: "Journal Reviewer",      description: "Opened the Trading Journal.",                     emoji: "📖" },
  { id: "risk_manager",         title: "Risk Manager",          description: "Maintained a portfolio average risk under 6.",    emoji: "🛡️" },
  { id: "market_event_analyst", title: "Market Event Analyst",  description: "Reviewed 3 Market Pulses.",                       emoji: "⚡" },
  { id: "fanfolio_rookie",      title: "Fanfolio Rookie",       description: "Completed all 6 Getting Started challenges.",     emoji: "🎯" },
  { id: "rookie_graduate",      title: "Rookie Graduate",       description: "Completed all 7 steps of the Rookie Playbook.",    emoji: "🎓" },
];
