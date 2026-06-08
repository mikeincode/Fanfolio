export interface Lesson {
  id: string;
  title: string;
  subtitle: string;
  icon: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  readTime: number;
  concept: string;
  sportsAngle: string;
  keyTakeaways: string[];
  relatedAssetTypes: string[];
}

export const LESSONS: Lesson[] = [
  {
    id: "what-is-a-stock",
    title: "What Is a Stock?",
    subtitle: "Ownership slices of something valuable",
    icon: "bar-chart-2",
    difficulty: "Beginner",
    readTime: 2,
    concept: "A stock is a small ownership share in a company. When you buy a stock, you own a tiny piece of that company. If the company does well, your share becomes more valuable. If it struggles, your share loses value.\n\nIn Fanfolio, Team Stocks work the same way. You buy a small simulated share of a team's market value. When the team wins, the stock rises. When they lose, it dips.",
    sportsAngle: "Think of a Team Stock like owning one seat in a stadium. If the team sells out every game and wins the championship, that seat is worth more than when they were losing. You own a piece of the excitement.",
    keyTakeaways: [
      "A stock represents partial ownership of something valuable",
      "Stock prices reflect how the market values that asset",
      "Good performance usually drives prices up",
      "Bad performance or news drives prices down",
    ],
    relatedAssetTypes: ["Team Stock", "Player Coin"],
  },
  {
    id: "what-is-a-portfolio",
    title: "What Is a Portfolio?",
    subtitle: "Your collection of all assets",
    icon: "briefcase",
    difficulty: "Beginner",
    readTime: 2,
    concept: "A portfolio is the total collection of assets you own. In Fanfolio, your portfolio includes every asset you have bought with LuckyCoin, plus your remaining balance.\n\nThe goal is not just to own one asset — it is to build a collection that grows over time while surviving the bad days.",
    sportsAngle: "Your portfolio is like a sports roster. A team with only one superstar can get eliminated if that player gets injured. A roster full of capable players at different positions is resilient — someone always steps up.",
    keyTakeaways: [
      "Your portfolio is everything you own plus your cash balance",
      "Portfolio value goes up or down as asset prices change",
      "A good portfolio is more than one asset",
      "Track your profit/loss to see how well your choices are working",
    ],
    relatedAssetTypes: ["Team Stock", "Sport Index", "Player Coin"],
  },
  {
    id: "what-is-diversification",
    title: "What Is Diversification?",
    subtitle: "Don't put all your coins in one asset",
    icon: "grid",
    difficulty: "Beginner",
    readTime: 3,
    concept: "Diversification means spreading your LuckyCoin across different asset types and sports instead of putting everything into one.\n\nIf you spend all your LuckyCoin on one player coin and that player gets injured, your portfolio crashes. If you spread across a player coin, a team stock, and an index, one bad event rarely kills your whole portfolio.",
    sportsAngle: "Think of a fantasy sports lineup. If you start the same player in every slot, one bad game destroys your score. Smart managers spread picks across positions, teams, and matchups so one bust does not ruin everything.",
    keyTakeaways: [
      "Diversification reduces the damage any one bad event can do",
      "Mix asset types: stocks, coins, indexes, futures",
      "Mix sports: football, basketball, MMA",
      "Your diversification score in Fanfolio measures this",
    ],
    relatedAssetTypes: ["Sport Index", "Team Stock", "Player Coin", "Future"],
  },
  {
    id: "what-is-volatility",
    title: "What Is Volatility?",
    subtitle: "How wildly prices move up and down",
    icon: "activity",
    difficulty: "Beginner",
    readTime: 2,
    concept: "Volatility describes how much an asset's price swings. A highly volatile asset can gain 30% in one day and lose 25% the next. A low-volatility asset barely moves — steady and predictable.\n\nFanfolio's Risk Score (1-10) is your guide. Score of 2 means calm. Score of 10 means pure chaos.",
    sportsAngle: "MMA is the most volatile sport. One punch can flip the result. Compare that to a slow, grinding defensive football game where scores are predictable. Meme Coins in Fanfolio work like MMA — explosive, unpredictable.",
    keyTakeaways: [
      "High volatility means bigger gains and bigger losses",
      "Low volatility means steadier, smaller moves",
      "Risk Score 1-10 shows volatility in Fanfolio",
      "Meme Coins and MMA assets have the highest volatility",
    ],
    relatedAssetTypes: ["Meme Coin", "Sport Index"],
  },
  {
    id: "what-does-bullish-mean",
    title: "What Does Bullish Mean?",
    subtitle: "Expecting prices to go up",
    icon: "trending-up",
    difficulty: "Beginner",
    readTime: 2,
    concept: "Bullish means you believe an asset's price will rise. Bullish traders buy assets expecting to sell them later at a higher price. A bullish market is one where prices generally keep going up.\n\nIn Fanfolio, you will see Bullish and Bearish tags on asset cards. Bullish assets are in an uptrend based on recent price movement.",
    sportsAngle: "A bullish team is on a hot streak — they are winning, healthy, and momentum is on their side. Everyone wants tickets, merchandise is selling, and the franchise value rises. That is the same energy as a bullish asset.",
    keyTakeaways: [
      "Bullish = expecting prices to rise",
      "Bulls buy now to sell higher later",
      "Upward trend = bullish signal",
      "Do not chase bullish assets after a big run — you may buy at the top",
    ],
    relatedAssetTypes: ["Team Stock", "Player Coin", "Sport Index"],
  },
  {
    id: "what-does-bearish-mean",
    title: "What Does Bearish Mean?",
    subtitle: "Expecting prices to fall",
    icon: "trending-down",
    difficulty: "Beginner",
    readTime: 2,
    concept: "Bearish means you believe an asset's price will fall. Bearish traders sell assets to avoid further losses. A bearish market — also called a bear market — is one where prices are falling broadly.\n\nSeeing red on your Fanfolio portfolio does not always mean sell. Sometimes bearish runs are temporary.",
    sportsAngle: "A bearish team has injuries piling up, a losing streak, and the coach just got fired. Everyone sells their tickets. The team stock price drops. But smart traders know: this might be the best time to buy if the team can recover.",
    keyTakeaways: [
      "Bearish = expecting prices to fall",
      "Bears sell assets to avoid losses",
      "A bearish run can be temporary",
      "Buying during bearish periods is called buying the dip",
    ],
    relatedAssetTypes: ["Team Stock", "Player Coin", "Sport Index"],
  },
  {
    id: "buying-the-dip",
    title: "What Is Buying the Dip?",
    subtitle: "Buying when prices fall, not when they spike",
    icon: "arrow-down-circle",
    difficulty: "Intermediate",
    readTime: 3,
    concept: "Buying the dip means purchasing an asset after its price has dropped, expecting it to recover. If you believe an asset's drop is temporary — not a sign of permanent collapse — buying low gives you a chance to profit when it bounces back.\n\nIn Fanfolio, assets with solid fundamentals that drop on bad weeks are prime dip candidates.",
    sportsAngle: "A superstar player has two bad games and their coin drops 15%. But their career average is elite and it was just a slump. Buying their coin during that bad run — if you believe in them — is buying the dip. Same logic as fantasy sports: buy low on a player you trust.",
    keyTakeaways: [
      "Buying the dip means purchasing during a price drop",
      "Only works if the drop is temporary, not fundamental",
      "Strong assets often recover from short-term dips",
      "Check the Risk Score before dipping into volatile assets",
    ],
    relatedAssetTypes: ["Team Stock", "Player Coin", "Sport Index"],
  },
  {
    id: "what-is-an-index",
    title: "What Is an Index?",
    subtitle: "A basket of assets in one purchase",
    icon: "layers",
    difficulty: "Beginner",
    readTime: 2,
    concept: "An index tracks the combined performance of a group of assets. Instead of picking one team or player, you buy a slice of many at once. If the group overall performs well, the index rises.\n\nFanfolio's Sport Indexes — like the Football Power Index or Fanfolio 100 — let you invest in an entire sport without choosing individual assets.",
    sportsAngle: "A sport index is like owning a piece of the entire league — not just one team. If pro football has a great season overall, the Football Power Index rises even if your favorite team struggles. You win with the league, not just one franchise.",
    keyTakeaways: [
      "An index tracks a group of assets together",
      "Lower risk than picking individual assets",
      "You do not need to predict which one wins",
      "Great as a base for any Fanfolio portfolio",
    ],
    relatedAssetTypes: ["Sport Index"],
  },
  {
    id: "what-is-a-hype-bubble",
    title: "What Is a Hype Bubble?",
    subtitle: "When prices rise faster than reality",
    icon: "zap",
    difficulty: "Intermediate",
    readTime: 3,
    concept: "A hype bubble happens when an asset's price rises far beyond its real value — driven by excitement, social media, and FOMO (fear of missing out). Eventually the hype fades, buyers disappear, and the price crashes back down.\n\nFanfolio's Meme Coins are designed to show you how hype bubbles work. ChokeCoin, DramaCoin, UpsetCoin — they all follow this pattern.",
    sportsAngle: "Imagine a player goes viral after one incredible play. Immediately everyone is buying their coin. The price goes up 50% in an hour. But when the next game is average, everyone sells. The coin crashes. That is a hype bubble — real excitement, but disconnected from consistent performance.",
    keyTakeaways: [
      "Hype bubbles are driven by excitement, not fundamentals",
      "They can rise very fast — and crash just as fast",
      "Meme Coins in Fanfolio simulate this perfectly",
      "Buying late in a hype cycle usually means buying at the top",
    ],
    relatedAssetTypes: ["Meme Coin"],
  },
];
