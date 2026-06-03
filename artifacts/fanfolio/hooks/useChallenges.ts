import { useMemo } from "react";
import { useGame } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { ALL_ASSETS } from "@/data/assetUniverse";
import {
  CHALLENGES,
  ACHIEVEMENTS,
  LEVELS,
  ChallengeDefinition,
  AchievementDefinition,
} from "@/data/challenges";

export interface ChallengeWithProgress extends ChallengeDefinition {
  current: number;
  isComplete: boolean;
  isClaimed: boolean;
}

export interface AchievementWithStatus extends AchievementDefinition {
  unlocked: boolean;
}

export interface XPInfo {
  totalXP: number;
  level: number;
  levelTitle: string;
  levelXPStart: number;
  levelXPEnd: number;
  progressInLevel: number;
  isMaxLevel: boolean;
}

export function useChallenges() {
  const game = useGame();
  const liveAssets = useLiveAssets();

  const challengesWithProgress = useMemo((): ChallengeWithProgress[] => {
    const buyTx = game.transactions.filter(t => t.type === "buy");
    const sellTx = game.transactions.filter(t => t.type === "sell");

    const holdingSports = new Set(
      game.holdings
        .map(h => ALL_ASSETS.find(a => a.id === h.assetId)?.sport)
        .filter((s): s is string => Boolean(s))
    );

    let avgRisk = 10;
    if (game.holdings.length >= 2) {
      const portfolioValue = game.holdings.reduce((s, h) => {
        const asset = liveAssets.find(a => a.id === h.assetId);
        return s + (asset ? asset.price * h.quantity : 0);
      }, 0);
      if (portfolioValue > 0) {
        avgRisk = game.holdings.reduce((s, h) => {
          const asset = liveAssets.find(a => a.id === h.assetId);
          const val = asset ? asset.price * h.quantity : 0;
          return s + (asset ? asset.riskScore * (val / portfolioValue) : 0);
        }, 0);
      }
    }

    const indexBuyCount = buyTx.filter(
      t => ALL_ASSETS.find(a => a.id === t.assetId)?.type === "Sport Index"
    ).length;

    function getProgress(c: ChallengeDefinition): number {
      switch (c.id) {
        case "claim_daily":       return game.lastDailyClaim ? 1 : 0;
        case "buy_first":         return Math.min(1, buyTx.length);
        case "add_watchlist":     return Math.min(1, game.watchlist.length);
        case "open_scanner":      return game.challengeFlags.includes("open_scanner") ? 1 : 0;
        case "view_journal":      return game.challengeFlags.includes("view_journal") ? 1 : 0;
        case "own_3_assets":      return Math.min(3, game.holdings.length);
        case "three_sports":      return Math.min(3, holdingSports.size);
        case "buy_index":         return Math.min(1, indexBuyCount);
        case "low_avg_risk":      return (game.holdings.length >= 2 && avgRisk < 6) ? 1 : 0;
        case "own_5_assets":      return Math.min(5, game.holdings.length);
        case "simulate_3_events": return Math.min(3, game.appliedEvents.length);
        case "use_coach":         return game.appliedEvents.length > 0 ? 1 : 0;
        case "learn_3_lessons":   return Math.min(3, game.lessonsOpened);
        case "sell_first":        return Math.min(1, sellTx.length);
        case "view_dip_watch":    return game.challengeFlags.includes("view_dip_watch") ? 1 : 0;
        case "view_momentum":     return game.challengeFlags.includes("view_momentum") ? 1 : 0;
        case "watch_3_assets":    return Math.min(3, game.watchlist.length);
        default:                  return 0;
      }
    }

    return CHALLENGES.map(c => {
      const current = getProgress(c);
      return {
        ...c,
        current,
        isComplete: current >= c.total,
        isClaimed: game.claimedChallenges.includes(c.id),
      };
    });
  }, [game, liveAssets]);

  const achievementsWithStatus = useMemo((): AchievementWithStatus[] => {
    const gettingStartedDone = challengesWithProgress
      .filter(c => c.category === "Getting Started")
      .every(c => c.isClaimed);

    const memeBuyAssetIds = new Set(
      game.transactions
        .filter(t => t.type === "buy" && ALL_ASSETS.find(a => a.id === t.assetId)?.type === "Meme Coin")
        .map(t => t.assetId)
    );

    function isUnlocked(a: AchievementDefinition): boolean {
      if (a.id === "meme_coin_maniac") return memeBuyAssetIds.size >= 3;
      if (a.id === "fanfolio_rookie") return gettingStartedDone;
      const linkedChallenge = challengesWithProgress.find(c => c.achievementId === a.id);
      return linkedChallenge ? linkedChallenge.isClaimed : false;
    }

    return ACHIEVEMENTS.map(a => ({ ...a, unlocked: isUnlocked(a) }));
  }, [challengesWithProgress, game.transactions]);

  const xpInfo = useMemo((): XPInfo => {
    const totalXP = game.xp;
    let levelIdx = 0;
    for (let i = LEVELS.length - 1; i >= 0; i--) {
      if (totalXP >= LEVELS[i].xpRequired) { levelIdx = i; break; }
    }
    const isMaxLevel = levelIdx === LEVELS.length - 1;
    const levelXPStart = LEVELS[levelIdx].xpRequired;
    const levelXPEnd = isMaxLevel ? levelXPStart + 1 : LEVELS[levelIdx + 1].xpRequired;
    const progressInLevel = isMaxLevel
      ? 1
      : (totalXP - levelXPStart) / (levelXPEnd - levelXPStart);

    return {
      totalXP,
      level: LEVELS[levelIdx].level,
      levelTitle: LEVELS[levelIdx].title,
      levelXPStart,
      levelXPEnd,
      progressInLevel: Math.min(1, Math.max(0, progressInLevel)),
      isMaxLevel,
    };
  }, [game.xp]);

  const nextChallenge = useMemo((): ChallengeWithProgress | null => {
    const claimable = challengesWithProgress.find(c => c.isComplete && !c.isClaimed);
    if (claimable) return claimable;
    const inProgress = challengesWithProgress.find(c => !c.isComplete && !c.isClaimed && c.current > 0);
    if (inProgress) return inProgress;
    return challengesWithProgress.find(c => !c.isComplete && !c.isClaimed) ?? null;
  }, [challengesWithProgress]);

  const claimedCount = challengesWithProgress.filter(c => c.isClaimed).length;
  const unlockedAchievementCount = achievementsWithStatus.filter(a => a.unlocked).length;

  return {
    challengesWithProgress,
    achievementsWithStatus,
    xpInfo,
    nextChallenge,
    claimedCount,
    unlockedAchievementCount,
  };
}
