/**
 * databaseMarketTypes.ts
 *
 * TypeScript interfaces matching the Fanfolio market database schema
 * (supabase/fanfolio_market_schema.sql).
 *
 * These types are used by lib/marketRepository.ts to work with
 * Supabase responses. The app's existing Asset shape (from mockAssets.ts)
 * remains unchanged — use mapAssetRowToAppAsset() in marketRepository.ts
 * to convert between the two.
 *
 * No real team names, player names, coach names, or league marks
 * appear in any user-facing field. All public_name values use
 * generic Fanfolio names only.
 */

import type { Asset, AssetType } from "@/data/mockAssets";

// ─────────────────────────────────────────────────────────────────────────────
// Enums matching database CHECK / ENUM constraints
// ─────────────────────────────────────────────────────────────────────────────

export type DbAssetType =
  | "team_stock"
  | "player_coin"
  | "coach_stock"
  | "sport_index"
  | "meme_coin"
  | "award_future"
  | "season_future";

export type DbAssetStatus = "active" | "paused" | "settled" | "retired";

export type DbAssetSentiment = "bullish" | "bearish" | "neutral" | "volatile";

export type DbFutureType =
  | "award"
  | "season"
  | "championship"
  | "comeback"
  | "coach_momentum";

export type DbFutureStatus =
  | "open"
  | "pending_settlement"
  | "settled"
  | "voided";

export type DbWeightingMethod = "equal" | "market_cap" | "manual";

// ─────────────────────────────────────────────────────────────────────────────
// Row interfaces
// ─────────────────────────────────────────────────────────────────────────────

/** public.sports */
export interface SportRow {
  id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

/** public.leagues */
export interface LeagueRow {
  id: string;
  sport_id: string;
  name: string;
  slug: string;
  display_order: number;
  is_active: boolean;
  created_at: string;
}

/**
 * public.generic_teams
 * City names only — no mascots, logos, or official marks.
 * public_name example: "Kansas City Football Team"
 */
export interface GenericTeamRow {
  id: string;
  sport_id: string;
  league_id: string | null;
  city: string;
  public_name: string;      // e.g. "Kansas City Football Team"
  short_name: string;       // e.g. "KC Football"
  symbol_prefix: string;    // e.g. "KC"
  primary_color: string | null;
  secondary_color: string | null;
  risk_baseline: number;
  is_active: boolean;
  created_at: string;
}

/**
 * public.generic_player_roles
 * Positional roles — not real individuals.
 * public_name example: "Kansas City QB1"
 */
export interface GenericPlayerRoleRow {
  id: string;
  team_id: string;
  public_role: string;      // e.g. "QB1", "TE1", "Edge Rusher"
  public_name: string;      // e.g. "Kansas City QB1"
  position_group: string;   // e.g. "Quarterback", "Tight End"
  asset_symbol: string;     // e.g. "KCQB1"
  importance_score: number;
  risk_baseline: number;
  is_active: boolean;
  created_at: string;
}

/**
 * public.coach_roles
 * Generic coaching archetype assets — not real coaches.
 */
export interface CoachRoleRow {
  id: string;
  team_id: string | null;
  public_name: string;      // e.g. "Offensive Mastermind Coach Stock"
  coach_archetype: string;  // e.g. "offensive" | "defensive" | "hot_seat"
  risk_baseline: number;
  is_active: boolean;
  created_at: string;
}

/**
 * public.assets
 * Core tradeable asset row. All public_name values are generic Fanfolio names.
 */
export interface AssetRow {
  id: string;
  asset_type: DbAssetType;
  sport_id: string | null;
  league_id: string | null;
  team_id: string | null;
  player_role_id: string | null;
  coach_role_id: string | null;
  symbol: string;
  public_name: string;
  subtitle: string | null;
  description: string | null;
  educational_note: string | null;
  risk_score: number;
  sentiment: DbAssetSentiment;
  current_price: number;
  daily_change_percent: number;
  status: DbAssetStatus;
  tags: string[];
  metadata: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

/** public.asset_price_history */
export interface AssetPriceHistoryRow {
  id: string;
  asset_id: string;
  price: number;
  change_percent: number;
  reason: string | null;
  source_type: string;
  created_at: string;
}

/** public.index_definitions */
export interface IndexDefinitionRow {
  id: string;
  asset_id: string;
  name: string;
  description: string | null;
  weighting_method: DbWeightingMethod;
  created_at: string;
}

/** public.index_members */
export interface IndexMemberRow {
  id: string;
  index_id: string;
  asset_id: string;
  weight_percent: number;
  created_at: string;
}

/** public.futures_markets */
export interface FuturesMarketRow {
  id: string;
  asset_id: string;
  future_type: DbFutureType;
  public_name: string;
  settlement_rule: string | null;
  status: DbFutureStatus;
  created_at: string;
}

/** public.market_pulses */
export interface MarketPulseRow {
  id: string;
  title: string;
  summary: string | null;
  category: string;
  sport_id: string | null;
  league_id: string | null;
  source_type: string;
  is_generated: boolean;
  educational_lesson: string | null;
  created_at: string;
}

/** public.market_pulse_impacts */
export interface MarketPulseImpactRow {
  id: string;
  market_pulse_id: string;
  asset_id: string;
  impact_percent: number;
  impact_reason: string | null;
  created_at: string;
}

/**
 * public.private_entity_aliases
 *
 * IMPORTANT: This table is NEVER queried by the client app.
 * It is a backend/admin mapping table only.
 * This type is provided for reference and future server-side tooling only.
 */
export interface PrivateEntityAliasRow {
  id: string;
  /** Real-world name — kept private, never surfaced in the client app */
  private_alias: string;
  /** Generic Fanfolio display name used in the public app */
  public_name: string;
  entity_type: "player" | "team" | "coach" | "league";
  mapped_asset_id: string | null;
  mapped_team_id: string | null;
  mapped_player_role_id: string | null;
  confidence_weight: number;
  notes: string | null;
  created_at: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Conversion helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Maps a DbAssetType to the app's existing AssetType union.
 * Used by mapAssetRowToAppAsset() in marketRepository.ts.
 */
export function dbAssetTypeToAppType(dbType: DbAssetType): AssetType {
  switch (dbType) {
    case "team_stock":    return "Team Stock";
    case "player_coin":   return "Player Coin";
    case "coach_stock":   return "Coach Stock";
    case "sport_index":   return "Sport Index";
    case "meme_coin":     return "Meme Coin";
    case "award_future":
    case "season_future": return "Future";
    default:              return "Team Stock";
  }
}

/**
 * Partial shape of a converted AssetRow ready to merge into the app Asset type.
 * mapAssetRowToAppAsset() in marketRepository.ts fills the remaining fields.
 */
export type AssetRowConverted = Pick<
  Asset,
  | "id"
  | "name"
  | "symbol"
  | "type"
  | "price"
  | "previousPrice"
  | "dailyChangePercent"
  | "riskScore"
  | "description"
  | "bullish"
  | "tags"
  | "educationalNote"
  | "league"
>;
