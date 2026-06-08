/**
 * entitySanitizer.ts
 *
 * Entity mapping and text sanitization foundation for the Fanfolio Market Pulse pipeline.
 *
 * PURPOSE:
 * This module provides the infrastructure to privately map real-world sports entities
 * (teams, players, coaches) to their generic Fanfolio-safe public names. This allows
 * a future real-data pipeline to ingest sports news/API data and sanitize it before
 * creating Market Pulses — without exposing real player/team names in user-facing content.
 *
 * WHAT IS IN THIS FILE NOW:
 * - Type definitions for entity mapping
 * - Demo/placeholder aliases only (no real names)
 * - sanitizeStoryText() function ready for real alias lists
 *
 * WHAT IS NOT HERE YET:
 * - Real player/team names (added privately in a future server-side pass)
 * - Live API integration
 * - AI inference layer
 *
 * See docs/ENTITY_MAPPING_PIPELINE.md for the full architecture explanation.
 *
 * No real money, no gambling, no sportsbook odds.
 * LuckyCoin has no cash value.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type EntityType =
  | "team"
  | "player_role"
  | "coach_role"
  | "future"
  | "index";

export interface EntityAlias {
  /** The private alias string to match in source text (never shown to users) */
  privateAlias: string;
  /** Higher = matched first. Longer/more-specific phrases should have higher priority. */
  matchPriority: number;
}

export interface FanfolioEntity {
  /** The public Fanfolio-safe display name shown in all user-facing content */
  publicName: string;
  /** Asset ID in assetUniverse.ts, if this entity maps to a specific asset */
  assetId?: string;
  /** Team asset ID (used when this entity is a player/coach role) */
  teamAssetId?: string;
  /** Role label (e.g. "QB1", "WR1", "EDGE") */
  role?: string;
  sport: string;
  league: string;
  entityType: EntityType;
  /**
   * 0.0–1.0: confidence that a single alias match uniquely identifies this entity.
   * Lower = more disambiguation context needed before acting on the match.
   */
  confidenceWeight: number;
}

export interface EntityMapEntry {
  entity: FanfolioEntity;
  aliases: EntityAlias[];
}

export interface SanitizedStoryResult {
  /** The source text with all matched aliases replaced by their public Fanfolio names */
  sanitizedText: string;
  /** Entities that were found and replaced (de-duplicated) */
  matchedEntities: FanfolioEntity[];
  /** Source text fragments containing no recognized aliases — may need human review */
  unmatchedFragments?: string[];
  /** Non-fatal warnings from the sanitizer (e.g. regex build errors) */
  warnings?: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Demo Entity Map — fictional aliases only, no real names
//
// INTENT: Demonstrates the mapping structure and sanitizer behavior.
// In production, this map would be populated from a private server-side
// registry that stores the real-world name → Fanfolio alias mapping.
// The app only ever sees and stores the publicName strings.
// ─────────────────────────────────────────────────────────────────────────────

export const DEMO_ENTITY_MAP: EntityMapEntry[] = [

  // ── Pro Football Teams ────────────────────────────────────────────────────

  {
    entity: {
      publicName: "Kansas City Football Team",
      assetId: "kcft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.90,
    },
    aliases: [
      { privateAlias: "example kansas city club", matchPriority: 120 },
      { privateAlias: "kc football squad", matchPriority: 100 },
      { privateAlias: "heartland football team", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Las Vegas Football Team",
      assetId: "lvft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.90,
    },
    aliases: [
      { privateAlias: "example las vegas club", matchPriority: 120 },
      { privateAlias: "desert football squad", matchPriority: 100 },
      { privateAlias: "nevada football team", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Detroit Football Team",
      assetId: "detft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.90,
    },
    aliases: [
      { privateAlias: "example detroit club", matchPriority: 120 },
      { privateAlias: "motor city squad", matchPriority: 100 },
      { privateAlias: "great lakes football team", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Dallas Football Team",
      assetId: "dalft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.88,
    },
    aliases: [
      { privateAlias: "example dallas club", matchPriority: 120 },
      { privateAlias: "lone star squad", matchPriority: 100 },
      { privateAlias: "texas football brand", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "San Francisco Football Team",
      assetId: "sfft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.88,
    },
    aliases: [
      { privateAlias: "example san francisco club", matchPriority: 120 },
      { privateAlias: "bay area football team", matchPriority: 100 },
      { privateAlias: "west coast system squad", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Baltimore Football Team",
      assetId: "balft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.90,
    },
    aliases: [
      { privateAlias: "example baltimore club", matchPriority: 120 },
      { privateAlias: "chesapeake football squad", matchPriority: 100 },
      { privateAlias: "mid-atlantic run game team", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Buffalo Football Team",
      assetId: "bufft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.90,
    },
    aliases: [
      { privateAlias: "example buffalo club", matchPriority: 120 },
      { privateAlias: "great lakes passing squad", matchPriority: 100 },
      { privateAlias: "snow belt football team", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Miami Football Team",
      assetId: "miaft-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "team",
      confidenceWeight: 0.88,
    },
    aliases: [
      { privateAlias: "example miami club", matchPriority: 120 },
      { privateAlias: "sunshine football squad", matchPriority: 100 },
      { privateAlias: "warm weather passing team", matchPriority: 90 },
    ],
  },

  // ── Player Roles ─────────────────────────────────────────────────────────

  {
    entity: {
      publicName: "Kansas City QB1",
      assetId: "kc-qb1-coin",
      teamAssetId: "kcft-stock",
      role: "QB1",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.85,
    },
    aliases: [
      { privateAlias: "example star quarterback", matchPriority: 130 },
      { privateAlias: "kc starting quarterback", matchPriority: 120 },
      { privateAlias: "example mobile signal caller", matchPriority: 110 },
      { privateAlias: "heartland qb one", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Kansas City TE1",
      assetId: "kc-te1-coin",
      teamAssetId: "kcft-stock",
      role: "TE1",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.85,
    },
    aliases: [
      { privateAlias: "example veteran tight end", matchPriority: 130 },
      { privateAlias: "kc primary tight end", matchPriority: 120 },
      { privateAlias: "heartland te one", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Las Vegas RB1",
      assetId: "lv-rb1-coin",
      teamAssetId: "lvft-stock",
      role: "RB1",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.80,
    },
    aliases: [
      { privateAlias: "example breakout running back", matchPriority: 130 },
      { privateAlias: "lv feature back", matchPriority: 120 },
      { privateAlias: "desert rb one", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Las Vegas Edge Rusher",
      assetId: "lv-edge-coin",
      teamAssetId: "lvft-stock",
      role: "EDGE",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.80,
    },
    aliases: [
      { privateAlias: "example pass rush specialist", matchPriority: 130 },
      { privateAlias: "lv edge rusher", matchPriority: 120 },
      { privateAlias: "desert defensive end", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Detroit WR1",
      assetId: "det-wr1-coin",
      teamAssetId: "detft-stock",
      role: "WR1",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.82,
    },
    aliases: [
      { privateAlias: "example elite wide receiver", matchPriority: 130 },
      { privateAlias: "detroit number one receiver", matchPriority: 120 },
      { privateAlias: "motor city wr one", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Baltimore QB1",
      assetId: "bal-qb1-coin",
      teamAssetId: "balft-stock",
      role: "QB1",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.85,
    },
    aliases: [
      { privateAlias: "example dual threat qb", matchPriority: 130 },
      { privateAlias: "baltimore mobile quarterback", matchPriority: 120 },
      { privateAlias: "chesapeake scrambler", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Buffalo QB1",
      assetId: "buf-qb1-coin",
      teamAssetId: "bufft-stock",
      role: "QB1",
      sport: "Football",
      league: "Pro Football",
      entityType: "player_role",
      confidenceWeight: 0.85,
    },
    aliases: [
      { privateAlias: "example big arm quarterback", matchPriority: 130 },
      { privateAlias: "buffalo franchise qb", matchPriority: 120 },
      { privateAlias: "snow belt signal caller", matchPriority: 100 },
    ],
  },

  // ── Coach Roles ──────────────────────────────────────────────────────────

  {
    entity: {
      publicName: "Offensive Mastermind Coach",
      assetId: "pf-off-coach-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "coach_role",
      confidenceWeight: 0.75,
    },
    aliases: [
      { privateAlias: "example offensive coordinator genius", matchPriority: 130 },
      { privateAlias: "creative play caller", matchPriority: 110 },
      { privateAlias: "example oc mastermind", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Defensive Architect Coach",
      assetId: "pf-def-arch-stock",
      sport: "Football",
      league: "Pro Football",
      entityType: "coach_role",
      confidenceWeight: 0.75,
    },
    aliases: [
      { privateAlias: "example defensive coordinator", matchPriority: 130 },
      { privateAlias: "defensive scheme architect", matchPriority: 110 },
      { privateAlias: "example dc blitz master", matchPriority: 100 },
    ],
  },

  // ── Futures ──────────────────────────────────────────────────────────────

  {
    entity: {
      publicName: "Pro Football MVP Future",
      assetId: "pf-mvp-future",
      sport: "Football",
      league: "Pro Football",
      entityType: "future",
      confidenceWeight: 0.70,
    },
    aliases: [
      { privateAlias: "example mvp race leader", matchPriority: 130 },
      { privateAlias: "most valuable player race", matchPriority: 120 },
      { privateAlias: "pro football mvp conversation", matchPriority: 100 },
    ],
  },

  {
    entity: {
      publicName: "Championship Momentum Future",
      assetId: "pf-champ-momentum-future",
      sport: "Football",
      league: "Pro Football",
      entityType: "future",
      confidenceWeight: 0.72,
    },
    aliases: [
      { privateAlias: "example championship race", matchPriority: 130 },
      { privateAlias: "title contender momentum", matchPriority: 110 },
      { privateAlias: "playoff probability surge", matchPriority: 100 },
    ],
  },

  // ── Indexes ──────────────────────────────────────────────────────────────

  {
    entity: {
      publicName: "Pro Football Power Index",
      assetId: "pf-power-index",
      sport: "Football",
      league: "Pro Football",
      entityType: "index",
      confidenceWeight: 0.80,
    },
    aliases: [
      { privateAlias: "broad football market", matchPriority: 110 },
      { privateAlias: "football market index", matchPriority: 100 },
      { privateAlias: "pro football power basket", matchPriority: 90 },
    ],
  },

  {
    entity: {
      publicName: "Defensive Edge Index",
      assetId: "pf-def-edge-index",
      sport: "Football",
      league: "Pro Football",
      entityType: "index",
      confidenceWeight: 0.78,
    },
    aliases: [
      { privateAlias: "defensive edge basket", matchPriority: 110 },
      { privateAlias: "pass rush index", matchPriority: 100 },
      { privateAlias: "football defense sector", matchPriority: 90 },
    ],
  },

];

// ─────────────────────────────────────────────────────────────────────────────
// Sanitizer
// ─────────────────────────────────────────────────────────────────────────────

/**
 * sanitizeStoryText
 *
 * Replaces entity aliases in source text with their public Fanfolio names.
 *
 * Rules:
 * - Longer/higher-priority aliases are matched first
 * - Case-insensitive matching throughout
 * - Uses word-boundary anchors where the alias starts/ends with a word character
 * - Tracks each matched entity (de-duplicated by assetId + publicName)
 * - Returns non-fatal warnings for regex build failures
 *
 * @param text       Raw source text to sanitize (e.g. a sports headline or summary)
 * @param entityMap  Array of EntityMapEntry — defaults to DEMO_ENTITY_MAP
 * @returns          SanitizedStoryResult
 */
export function sanitizeStoryText(
  text: string,
  entityMap: EntityMapEntry[] = DEMO_ENTITY_MAP,
): SanitizedStoryResult {
  const matchedEntities: FanfolioEntity[] = [];
  const warnings: string[] = [];

  // Build a flat list of alias → entity pairings
  const flatAliases: Array<{
    alias: string;
    priority: number;
    entity: FanfolioEntity;
  }> = [];

  for (const entry of entityMap) {
    for (const aliasObj of entry.aliases) {
      flatAliases.push({
        alias: aliasObj.privateAlias,
        priority: aliasObj.matchPriority,
        entity: entry.entity,
      });
    }
  }

  // Sort: higher priority first; within same priority, longer alias first
  flatAliases.sort((a, b) => {
    if (b.priority !== a.priority) return b.priority - a.priority;
    return b.alias.length - a.alias.length;
  });

  let sanitized = text;

  for (const { alias, entity } of flatAliases) {
    // Escape special regex characters in the alias
    const escaped = alias.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

    // Use \b word-boundary anchors where alias starts/ends with a word character
    const wb0 = /^\w/.test(alias) ? "\\b" : "";
    const wb1 = /\w$/.test(alias) ? "\\b" : "";
    const pattern = `${wb0}${escaped}${wb1}`;

    try {
      const regex = new RegExp(pattern, "gi");

      if (regex.test(sanitized)) {
        regex.lastIndex = 0; // reset after test()
        sanitized = sanitized.replace(regex, entity.publicName);

        // Track matched entity — avoid duplicates
        const alreadyTracked = matchedEntities.some(
          e => e.assetId === entity.assetId && e.publicName === entity.publicName,
        );
        if (!alreadyTracked) {
          matchedEntities.push(entity);
        }
      }
    } catch {
      warnings.push(`Regex build failed for alias: "${alias}"`);
    }
  }

  return {
    sanitizedText: sanitized,
    matchedEntities,
    warnings: warnings.length > 0 ? warnings : undefined,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Pipeline Flow Reference
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Describes the intended future pipeline that connects real sports data to Market Pulses.
 * None of these steps are wired to live APIs yet — this is the architecture guide.
 *
 *   STEP 1: Raw headline / story text
 *           (from a sports news API, stats feed, or editorial source)
 *
 *   STEP 2: sanitizeStoryText(rawText, entityMap)
 *           → sanitizedText: safe for user display
 *           → matchedEntities[]: the Fanfolio assets involved
 *           (this file — lib/entitySanitizer.ts)
 *
 *   STEP 3: Build a MarketSourceStory
 *           story.relatedAssetIds = matchedEntities.map(e => e.assetId)
 *           story.title  = sanitizedText (headline)
 *           story.summary = sanitizedText (body)
 *           story.storyType = inferred from keywords or AI classification
 *           (data/marketSources.ts types)
 *
 *   STEP 4: generateMarketEventFromStory(story)
 *           → MarketEvent with impacts computed by volatility rules
 *           (lib/marketSourceAdapter.ts — no changes needed)
 *
 *   STEP 5: Market Pulse delivered to user
 *           prepareDailyPulse() in GameContext stores the event
 *           User reviews it via the Market Pulse card on Home
 *
 * AI is OPTIONAL and can enhance STEP 2 (disambiguation) or STEP 3 (storyType
 * classification). The rules-based sanitizer alone does most of the work.
 *
 * Full articles are NEVER republished. Fanfolio generates short original
 * Market Pulse summaries from the sanitized entity data.
 */
export const PIPELINE_FLOW_DESCRIPTION = `
[STEP 1] Raw Sports Story/Headline (external API)
  ↓
[STEP 2] sanitizeStoryText()          ← lib/entitySanitizer.ts
         → sanitizedText + matchedEntities[]
  ↓
[STEP 3] MarketSourceStory builder    ← data/marketSources.ts types
         relatedAssetIds = matchedEntities[].assetId
  ↓
[STEP 4] generateMarketEventFromStory ← lib/marketSourceAdapter.ts
         → MarketEvent with computed impacts
  ↓
[STEP 5] Market Pulse delivered       ← GameContext / prepareDailyPulse
         User reviews on Home screen
` as const;
