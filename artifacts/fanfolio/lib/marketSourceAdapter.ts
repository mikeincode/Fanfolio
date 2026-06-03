/**
 * marketSourceAdapter.ts
 *
 * Pure adapter function — converts a MarketSourceStory into a
 * Fanfolio-compatible MarketEvent. No side effects, no API calls.
 *
 * Architecture:
 *   MarketSourceStory  →  generateMarketEventFromStory()  →  MarketEvent
 *
 * This layer is the integration boundary. When real sports APIs are
 * connected later, only the data feed (marketSources.ts) needs to change.
 * This adapter stays unchanged — it maps any MarketSourceStory shape
 * to a MarketEvent compatible with the existing event system.
 *
 * Impact rules enforced here:
 *   • Meme coins     — highest volatility (full range)
 *   • Futures        — high volatility
 *   • Player coins   — moderate-high
 *   • Coach stocks   — moderate
 *   • Team stocks    — moderate-low
 *   • Sport indexes  — lowest volatility (always dampened)
 *   • Secondary assets always move less than the primary asset
 *   • Index rotation: indexes gain, meme coins lose
 *
 * No gambling, no betting, no sportsbook odds.
 * LuckyCoin has no cash value.
 */

import type { MarketEvent, EventCategory, MarketEventImpact } from "@/data/mockMarketEvents";
import type { MarketSourceStory, SourceStoryType } from "@/data/marketSources";
import { getRandomSourceStory } from "@/data/marketSources";
import { getAllAssetById } from "@/data/assetUniverse";

// ─────────────────────────────────────────────────────────────────────────────
// Story type → EventCategory
// ─────────────────────────────────────────────────────────────────────────────

function storyTypeToCategory(storyType: SourceStoryType): EventCategory {
  switch (storyType) {
    case "injury":               return "Chaos";
    case "breakout_performance": return "Breakout";
    case "team_momentum":        return "Championship";
    case "coach_buzz":           return "Coach";
    case "coach_controversy":    return "Coach";
    case "award_race":           return "Futures";
    case "championship_momentum":return "Championship";
    case "meme_hype":            return "Rally";
    case "index_rotation":       return "Stability";
    case "trade_rumor":          return "Chaos";
    case "confirmed_trade":      return "Breakout";
    case "general_news":         return "Rally";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Emoji by story type
// ─────────────────────────────────────────────────────────────────────────────

function storyTypeToEmoji(storyType: SourceStoryType): string {
  switch (storyType) {
    case "injury":               return "🚑";
    case "breakout_performance": return "⚡";
    case "team_momentum":        return "📈";
    case "coach_buzz":           return "📋";
    case "coach_controversy":    return "🌪️";
    case "award_race":           return "🏅";
    case "championship_momentum":return "🏆";
    case "meme_hype":            return "🚀";
    case "index_rotation":       return "📊";
    case "trade_rumor":          return "🔄";
    case "confirmed_trade":      return "✅";
    case "general_news":         return "📰";
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Volatility multiplier by asset type
// Indexes always move the least — individual assets move the most.
// ─────────────────────────────────────────────────────────────────────────────

function getVolatilityByAssetType(assetType: string): number {
  switch (assetType) {
    case "Meme Coin":   return 1.00;
    case "Future":      return 0.85;
    case "Player Coin": return 0.75;
    case "Coach Stock": return 0.70;
    case "Team Stock":  return 0.55;
    case "Sport Index": return 0.22;
    default:            return 0.50;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Base impact magnitude and direction by story type
// Primary asset always moves more than secondary assets (secondary × 0.45).
// ─────────────────────────────────────────────────────────────────────────────

function getBaseImpact(storyType: SourceStoryType, isPrimary: boolean): number {
  const primaryMagnitudes: Record<SourceStoryType, number> = {
    injury:               -22,
    breakout_performance:  18,
    team_momentum:         14,
    coach_buzz:            16,
    coach_controversy:    -16,
    award_race:            22,
    championship_momentum: 16,
    meme_hype:             36,
    index_rotation:         9,
    trade_rumor:          -14,
    confirmed_trade:       20,
    general_news:           9,
  };
  const base = primaryMagnitudes[storyType];
  return isPrimary ? base : base * 0.45;
}

// ─────────────────────────────────────────────────────────────────────────────
// Direction override for index rotation:
// Indexes gain; meme coins lose. All other types keep the base sign.
// ─────────────────────────────────────────────────────────────────────────────

function getDirectionSign(storyType: SourceStoryType, assetType: string, baseSign: number): number {
  if (storyType === "index_rotation") {
    if (assetType === "Sport Index") return +1;
    if (assetType === "Meme Coin")   return -1;
  }
  return baseSign;
}

// ─────────────────────────────────────────────────────────────────────────────
// Core adapter — pure function, no side effects
// ─────────────────────────────────────────────────────────────────────────────

export function generateMarketEventFromStory(story: MarketSourceStory): MarketEvent {
  const category = storyTypeToCategory(story.storyType);
  const emoji    = storyTypeToEmoji(story.storyType);

  const primaryBaseImpact = getBaseImpact(story.storyType, true);
  const baseSign = Math.sign(primaryBaseImpact);

  const impacts: MarketEventImpact[] = [];

  story.relatedAssetIds.forEach((assetId, index) => {
    const asset = getAllAssetById(assetId);
    if (!asset) return;

    const isPrimary     = index === 0;
    const rawBase       = getBaseImpact(story.storyType, isPrimary);
    const volatility    = getVolatilityByAssetType(asset.type);
    const dirSign       = getDirectionSign(story.storyType, asset.type, baseSign);

    // ±20% random variation so each generated event is slightly different
    const variation     = 0.80 + Math.random() * 0.40;
    const rawImpact     = Math.abs(rawBase) * volatility * variation * dirSign;
    const impactPercent = Math.round(rawImpact * 10) / 10;

    if (impactPercent !== 0) {
      impacts.push({ assetId, symbol: asset.symbol, impactPercent });
    }
  });

  // Safety: always have at least one impact entry
  if (impacts.length === 0 && story.relatedAssetIds.length > 0) {
    const fallback = getAllAssetById(story.relatedAssetIds[0]);
    if (fallback) {
      impacts.push({
        assetId: fallback.id,
        symbol: fallback.symbol,
        impactPercent: Math.round(primaryBaseImpact * 0.6 * 10) / 10,
      });
    }
  }

  return {
    id:           `src-gen-${story.id.slice(4)}-${Date.now().toString(36)}`,
    title:        story.title.replace(/^\[SIMULATED\]\s*/i, "").trim(),
    sport:        story.sport,
    category,
    emoji,
    summary:      story.summary.replace(/^Simulated[^:]*:\s*/i, ""),
    marketLesson: story.educationalAngle,
    impacts,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Convenience wrapper — picks a random story and generates an event
// Used by prepareDailyPulse and the dev-reset demo section.
// ─────────────────────────────────────────────────────────────────────────────

export function generateRandomSourceEvent(excludeStoryId?: string): MarketEvent | null {
  const story = getRandomSourceStory(excludeStoryId);
  if (!story) return null;
  return generateMarketEventFromStory(story);
}
