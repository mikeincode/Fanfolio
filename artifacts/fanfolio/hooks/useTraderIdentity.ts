import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { MOCK_ASSETS } from "@/data/mockAssets";

export type TraderIdentityId =
  | "rookie_learner"
  | "momentum_trader"
  | "dip_buyer"
  | "index_builder"
  | "meme_hunter"
  | "scanner_scout"
  | "diversified_captain"
  | "high_risk_playmaker"
  | "long_term_holder"
  | "active_trader";

export interface TraderIdentityDef {
  id: TraderIdentityId;
  title: string;
  emoji: string;
  shortDesc: string;
  marketLesson: string;
  strengths: string[];
  risks: string[];
  suggestedMoves: Array<{ label: string; icon: string; route: string }>;
}

export interface StyleBars {
  momentum: number;
  dipBuying: number;
  indexBuilding: number;
  memeTrading: number;
  research: number;
  diversification: number;
  riskAppetite: number;
  activity: number;
}

export interface TraderIdentityResult {
  primary: TraderIdentityDef;
  secondaryTraits: TraderIdentityDef[];
  confidenceLabel: string;
  styleBars: StyleBars;
  scores: Record<TraderIdentityId, number>;
  isLowActivity: boolean;
}

export const TRADER_IDENTITIES: Record<TraderIdentityId, TraderIdentityDef> = {
  rookie_learner: {
    id: "rookie_learner",
    title: "Rookie Learner",
    emoji: "🎯",
    shortDesc: "You are still learning the market. Make a few trades, watch assets, and read lessons to build your identity.",
    marketLesson: "Every great trader started as a rookie. The market rewards those who take the time to learn before they go big.",
    strengths: ["You are starting fresh with no bad habits to unlearn.", "Low pressure — every move is a learning rep."],
    risks: ["Waiting too long to take action can slow your progress.", "The market teaches best through doing, not watching."],
    suggestedMoves: [
      { label: "Open Market", icon: "trending-up", route: "/(tabs)/market" },
      { label: "Open Scanner", icon: "filter", route: "/(tabs)/scanner" },
      { label: "Learn Basics", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  momentum_trader: {
    id: "momentum_trader",
    title: "Momentum Trader",
    emoji: "🚀",
    shortDesc: "You follow assets already moving up. You like energy, trends, and fast-moving plays.",
    marketLesson: "Momentum traders follow assets already moving up. The risk is buying after the easy move already happened.",
    strengths: ["You spot fast-moving assets early.", "You are comfortable acting when the market is moving."],
    risks: ["You may chase moves after they already happened.", "Momentum can reverse quickly — timing matters."],
    suggestedMoves: [
      { label: "Momentum Leaders", icon: "trending-up", route: "/(tabs)/scanner" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Learn Volatility", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  dip_buyer: {
    id: "dip_buyer",
    title: "Dip Buyer",
    emoji: "📉",
    shortDesc: "You look for assets that dropped and might bounce. You see drops as potential discounts.",
    marketLesson: "Dip buyers look for assets that dropped and might recover. The risk is catching a falling knife.",
    strengths: ["You look for value instead of chasing hype.", "You are not afraid to go against short-term momentum."],
    risks: ["Some dips keep dipping with no recovery.", "Timing a bottom is one of the hardest skills in trading."],
    suggestedMoves: [
      { label: "Dip Watch Scanner", icon: "trending-down", route: "/(tabs)/scanner" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Learn: Buying the Dip", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  index_builder: {
    id: "index_builder",
    title: "Index Builder",
    emoji: "📊",
    shortDesc: "You use baskets to spread risk. You prefer steady exposure over high-volatility picks.",
    marketLesson: "Index builders use baskets to spread risk. This teaches real-world diversification strategy.",
    strengths: ["Strong risk management instincts.", "Your portfolio is more protected against single-asset crashes."],
    risks: ["Indexes may move slower than high-risk traders in strong markets.", "You may miss larger moves from individual assets."],
    suggestedMoves: [
      { label: "Browse Indexes", icon: "layers", route: "/(tabs)/market" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Learn Diversification", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  meme_hunter: {
    id: "meme_hunter",
    title: "Meme Hunter",
    emoji: "🎭",
    shortDesc: "You trade hype, chaos, and fast-moving assets. Volatility does not scare you.",
    marketLesson: "Meme hunters trade hype and chaos. These assets can move fast both ways — up and down.",
    strengths: ["You are comfortable with volatility and big swings.", "You understand high-risk, high-reward dynamics."],
    risks: ["Big swings can hurt portfolio stability quickly.", "Hype-driven assets can collapse without warning."],
    suggestedMoves: [
      { label: "Add an Index", icon: "layers", route: "/(tabs)/market" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Learn Volatility", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  scanner_scout: {
    id: "scanner_scout",
    title: "Scanner Scout",
    emoji: "🔍",
    shortDesc: "You research before trading. You use filters and watchlists to find setups before committing.",
    marketLesson: "Scanner Scouts research before trading. They use filters to find setups that fit their strategy.",
    strengths: ["You build research habits before spending LuckyCoin.", "You track assets before buying — like scouting before drafting."],
    risks: ["You can over-scan without taking action.", "Analysis paralysis can mean missing good entry points."],
    suggestedMoves: [
      { label: "Open Scanner", icon: "filter", route: "/(tabs)/scanner" },
      { label: "Add to Watchlist", icon: "bookmark", route: "/(tabs)/market" },
      { label: "View Trading Journal", icon: "book", route: "/journal" },
    ],
  },
  diversified_captain: {
    id: "diversified_captain",
    title: "Diversified Captain",
    emoji: "🌐",
    shortDesc: "You own multiple sports, asset types, and use indexes. Your portfolio is built for balance.",
    marketLesson: "Diversified portfolios spread risk across different ideas, sports, and asset types — like a balanced roster.",
    strengths: ["Balanced roster across sports and asset types.", "Less exposed to single-asset crashes or bad events."],
    risks: ["May avoid bold moves that generate large simulated gains.", "Diversification alone does not guarantee positive returns."],
    suggestedMoves: [
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Open Trading Journal", icon: "book", route: "/journal" },
      { label: "Learn Diversification", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  high_risk_playmaker: {
    id: "high_risk_playmaker",
    title: "High-Risk Playmaker",
    emoji: "⚡",
    shortDesc: "You are not afraid of big swings. Your portfolio carries significant volatility — and potential.",
    marketLesson: "High-risk portfolios can move fast. The goal is knowing how much risk you are carrying at all times.",
    strengths: ["You are not afraid of bold market moves.", "Your portfolio can generate large simulated gains quickly."],
    risks: ["Your portfolio can drop sharply after events or market shifts.", "High risk means high variance — big swings go both directions."],
    suggestedMoves: [
      { label: "Add an Index", icon: "layers", route: "/(tabs)/market" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Learn Risk Management", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
  long_term_holder: {
    id: "long_term_holder",
    title: "Long-Term Holder",
    emoji: "🏛️",
    shortDesc: "You buy and hold. You let your positions develop instead of reacting to every move.",
    marketLesson: "Holding means letting positions develop. The risk is ignoring when the story fundamentally changes.",
    strengths: ["Patient — you do not react emotionally to short-term noise.", "You let your positions develop over time."],
    risks: ["You may hold losing positions longer than you should.", "Ignoring when the story changes can turn a small loss into a large one."],
    suggestedMoves: [
      { label: "View Trading Journal", icon: "book", route: "/journal" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Open Scanner", icon: "filter", route: "/(tabs)/scanner" },
    ],
  },
  active_trader: {
    id: "active_trader",
    title: "Active Trader",
    emoji: "🔄",
    shortDesc: "You make many trades and learn through reps. Reviewing your journal matters to keep improving.",
    marketLesson: "Active traders make many decisions. Reviewing the journal is how they spot patterns and improve.",
    strengths: ["You learn fast through repetition and real decisions.", "You are engaged with the market and not passive."],
    risks: ["You can overtrade and rack up poor decisions under pressure.", "More trades means more chances for costly mistakes."],
    suggestedMoves: [
      { label: "Open Trading Journal", icon: "book", route: "/journal" },
      { label: "View Portfolio Coach", icon: "activity", route: "/portfolio-coach" },
      { label: "Learn Volatility", icon: "book-open", route: "/(tabs)/learn" },
    ],
  },
};

function clamp(v: number, min = 0, max = 100): number {
  return Math.max(min, Math.min(max, v));
}

export function useTraderIdentity(): TraderIdentityResult {
  const game = useGame();
  const liveAssets = useLiveAssets();

  return useMemo(() => {
    const { transactions, holdings, watchlist, challengeFlags } = game;

    const buyTx = transactions.filter(t => t.type === "buy");
    const sellTx = transactions.filter(t => t.type === "sell");
    const totalTx = transactions.length;

    const assetMap = Object.fromEntries(MOCK_ASSETS.map(a => [a.id, a]));
    const liveMap = Object.fromEntries(liveAssets.map(a => [a.id, a]));

    const isLowActivity =
      totalTx < 2 && holdings.length === 0 && watchlist.length < 2;

    const usedScanner = challengeFlags.includes("open_scanner");
    const usedDipWatch = challengeFlags.includes("view_dip_watch");
    const usedMomentum = challengeFlags.includes("view_momentum");
    const viewedJournal = challengeFlags.includes("view_journal");

    const memeHoldings = holdings.filter(h => assetMap[h.assetId]?.type === "Meme Coin");
    const indexHoldings = holdings.filter(h => assetMap[h.assetId]?.type === "Sport Index");
    const futuresHoldings = holdings.filter(h => assetMap[h.assetId]?.type === "Future");

    const memeBuyTx = buyTx.filter(t => assetMap[t.assetId]?.type === "Meme Coin");
    const indexBuyTx = buyTx.filter(t => assetMap[t.assetId]?.type === "Sport Index");

    const holdingSports = new Set(
      holdings.map(h => assetMap[h.assetId]?.sport).filter((s): s is string => Boolean(s))
    );
    const holdingTypes = new Set(
      holdings.map(h => assetMap[h.assetId]?.type).filter((t): t is string => Boolean(t))
    );

    const portfolioValue = holdings.reduce((s, h) => {
      const a = liveMap[h.assetId];
      return s + (a ? a.price * h.quantity : 0);
    }, 0);

    let avgRisk = 5;
    if (holdings.length > 0 && portfolioValue > 0) {
      avgRisk = holdings.reduce((s, h) => {
        const a = liveMap[h.assetId] ?? assetMap[h.assetId];
        const val = liveMap[h.assetId] ? liveMap[h.assetId].price * h.quantity : 0;
        return s + (a ? a.riskScore * (val / portfolioValue) : 0);
      }, 0);
    }

    const memeValue = memeHoldings.reduce((s, h) => {
      const a = liveMap[h.assetId];
      return s + (a ? a.price * h.quantity : 0);
    }, 0);
    const indexValue = indexHoldings.reduce((s, h) => {
      const a = liveMap[h.assetId];
      return s + (a ? a.price * h.quantity : 0);
    }, 0);
    const memePct = portfolioValue > 0 ? (memeValue / portfolioValue) * 100 : 0;
    const indexPct = portfolioValue > 0 ? (indexValue / portfolioValue) * 100 : 0;

    const positiveBuys = buyTx.filter(t => {
      const a = liveMap[t.assetId] ?? assetMap[t.assetId];
      return a && a.dailyChangePercent > 0;
    });
    const negativeBuys = buyTx.filter(t => {
      const a = liveMap[t.assetId] ?? assetMap[t.assetId];
      return a && a.dailyChangePercent < 0;
    });
    const positiveRatio = buyTx.length > 0 ? positiveBuys.length / buyTx.length : 0;
    const negativeRatio = buyTx.length > 0 ? negativeBuys.length / buyTx.length : 0;

    const holdingsDown = holdings.filter(h => {
      const a = liveMap[h.assetId] ?? assetMap[h.assetId];
      return a && a.dailyChangePercent < 0;
    });

    const scores: Record<TraderIdentityId, number> = {
      rookie_learner: 0,
      momentum_trader: 0,
      dip_buyer: 0,
      index_builder: 0,
      meme_hunter: 0,
      scanner_scout: 0,
      diversified_captain: 0,
      high_risk_playmaker: 0,
      long_term_holder: 0,
      active_trader: 0,
    };

    if (!isLowActivity) {
      scores.momentum_trader = clamp(
        (usedMomentum ? 28 : 0) +
        positiveRatio * 35 +
        (avgRisk > 6 ? 10 : 0) +
        (totalTx > 5 ? 10 : totalTx > 2 ? 5 : 0)
      );

      scores.dip_buyer = clamp(
        (usedDipWatch ? 32 : 0) +
        negativeRatio * 38 +
        (holdingsDown.length > 0 ? holdingsDown.length * 8 : 0)
      );

      scores.index_builder = clamp(
        (indexHoldings.length > 0 ? 30 : 0) +
        (indexBuyTx.length > 1 ? 20 : indexBuyTx.length === 1 ? 10 : 0) +
        (avgRisk <= 4 ? 18 : avgRisk <= 5.5 ? 10 : 0) +
        (indexPct > 20 ? 15 : indexPct > 0 ? 8 : 0)
      );

      scores.meme_hunter = clamp(
        (memePct > 60 ? 35 : memePct > 30 ? 22 : memePct > 0 ? 12 : 0) +
        (memeBuyTx.length >= 3 ? 25 : memeBuyTx.length >= 1 ? 14 : 0) +
        (avgRisk > 8 ? 18 : avgRisk > 6.5 ? 10 : 0)
      );

      scores.scanner_scout = clamp(
        (usedScanner ? 30 : 0) +
        (usedDipWatch ? 15 : 0) +
        (usedMomentum ? 15 : 0) +
        (watchlist.length >= 3 ? 22 : watchlist.length >= 1 ? 12 : 0)
      );

      scores.diversified_captain = clamp(
        (holdingSports.size >= 3 ? 28 : holdingSports.size === 2 ? 14 : 0) +
        (holdingTypes.size >= 3 ? 28 : holdingTypes.size === 2 ? 14 : 0) +
        (indexHoldings.length > 0 ? 22 : 0) +
        (avgRisk < 6 && holdings.length >= 2 ? 12 : 0)
      );

      scores.high_risk_playmaker = clamp(
        (avgRisk > 8 ? 32 : avgRisk > 7 ? 20 : avgRisk > 6 ? 10 : 0) +
        (memePct > 40 ? 22 : memePct > 20 ? 12 : 0) +
        (futuresHoldings.length > 0 ? 12 : 0) +
        (indexHoldings.length === 0 && holdings.length > 0 ? 10 : 0)
      );

      scores.long_term_holder = clamp(
        (buyTx.length > sellTx.length ? 25 : 0) +
        (holdings.length >= 3 ? 20 : holdings.length >= 1 ? 10 : 0) +
        (sellTx.length === 0 && buyTx.length > 0 ? 22 : sellTx.length < buyTx.length * 0.3 ? 10 : 0) +
        (buyTx.length > 5 ? 10 : 0)
      );

      scores.active_trader = clamp(
        (totalTx > 10 ? 32 : totalTx > 5 ? 20 : totalTx > 2 ? 10 : 0) +
        (sellTx.length >= 3 ? 28 : sellTx.length >= 1 ? 16 : 0) +
        (viewedJournal ? 22 : 0)
      );
    }

    const topId = (Object.keys(scores) as TraderIdentityId[]).reduce(
      (best, id) => (scores[id] > scores[best] ? id : best),
      "momentum_trader" as TraderIdentityId
    );

    const topScore = scores[topId];
    const primaryId: TraderIdentityId =
      isLowActivity || topScore < 18 ? "rookie_learner" : topId;
    const primary = TRADER_IDENTITIES[primaryId];

    const secondaryTraits: TraderIdentityDef[] = (Object.keys(scores) as TraderIdentityId[])
      .filter(id => id !== primaryId && scores[id] >= 20)
      .sort((a, b) => scores[b] - scores[a])
      .slice(0, 2)
      .map(id => TRADER_IDENTITIES[id]);

    const confidenceLabel =
      topScore >= 70 ? "Strong Match" :
      topScore >= 45 ? "Good Match" :
      topScore >= 25 ? "Emerging Style" : "Early Signs";

    const styleBars: StyleBars = {
      momentum: clamp(Math.round(
        (usedMomentum ? 25 : 0) + positiveRatio * 55 + (totalTx > 3 ? 10 : 0)
      )),
      dipBuying: clamp(Math.round(
        (usedDipWatch ? 30 : 0) + negativeRatio * 55 + (holdingsDown.length > 0 ? 10 : 0)
      )),
      indexBuilding: clamp(Math.round(
        (indexHoldings.length > 0 ? 30 : 0) + indexPct * 0.5 + (avgRisk < 5 ? 15 : 0)
      )),
      memeTrading: clamp(Math.round(
        memePct * 0.6 + (memeBuyTx.length * 7)
      )),
      research: clamp(Math.round(
        (usedScanner ? 30 : 0) +
        (usedDipWatch ? 18 : 0) +
        (usedMomentum ? 18 : 0) +
        (viewedJournal ? 20 : 0) +
        (watchlist.length > 0 ? Math.min(watchlist.length * 5, 15) : 0)
      )),
      diversification: clamp(Math.round(
        (holdingSports.size / 5) * 40 +
        (holdingTypes.size / 5) * 35 +
        (indexPct > 0 ? 20 : 0)
      )),
      riskAppetite: clamp(Math.round(avgRisk * 10)),
      activity: clamp(Math.round(totalTx * 7)),
    };

    return {
      primary,
      secondaryTraits,
      confidenceLabel,
      styleBars,
      scores,
      isLowActivity,
    };
  }, [game, liveAssets]);
}
