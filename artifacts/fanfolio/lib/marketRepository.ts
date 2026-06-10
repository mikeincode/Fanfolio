/**
 * lib/marketRepository.ts
 *
 * Market data repository stub — Database Foundation v1.
 *
 * Current behavior:
 *   The app still uses local mock data (ALL_ASSETS, MOCK_ASSETS) as its
 *   live data source. This module provides the scaffolding to switch the
 *   Market, Scanner, and News screens to Supabase in a future pass.
 *
 * How the switch will work later:
 *   1. Set MARKET_DATA_SOURCE = "supabase" in your env / config.
 *   2. Implement the Supabase fetch calls (stubs are below).
 *   3. The adapter fills in chart data, market lessons, etc.
 *      from the educational_note and metadata columns.
 *   4. ALL_ASSETS becomes the fallback, not the primary source.
 *
 * Safety:
 *   - Does not crash if Supabase is unavailable.
 *   - Returns local data on any error.
 *   - No real team/player/coach names in any returned value.
 *   - LuckyCoin has no cash value. No gambling, odds, or real money.
 */

import { supabase } from "@/lib/supabase";
import { ALL_ASSETS } from "@/data/assetUniverse";
import type { Asset } from "@/data/mockAssets";
import type {
  AssetRow,
  MarketPulseRow,
  AssetRowConverted,
  DbAssetSentiment,
  DbAssetType,
} from "@/data/databaseMarketTypes";
import { dbAssetTypeToAppType } from "@/data/databaseMarketTypes";

// ─────────────────────────────────────────────────────────────────────────────
// Source mode
// ─────────────────────────────────────────────────────────────────────────────

export type MarketDataSourceMode = "local" | "supabase";

/**
 * Reads the active market data source mode.
 * Defaults to "local" until Supabase market tables are populated and
 * EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase is set in the environment.
 */
export function getMarketDataSourceMode(): MarketDataSourceMode {
  const envMode = process.env.EXPO_PUBLIC_MARKET_DATA_SOURCE;
  if (envMode === "supabase") return "supabase";
  return "local";
}

// ─────────────────────────────────────────────────────────────────────────────
// Local fallback
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the current local ALL_ASSETS array.
 * Used as the default source and as a fallback when Supabase is unavailable.
 */
export function fallbackToLocalAssets(): Asset[] {
  return ALL_ASSETS;
}

// ─────────────────────────────────────────────────────────────────────────────
// Asset conversion
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Converts a Supabase AssetRow into the app's Asset shape.
 *
 * Fields not present in the database row (chartData, marketLesson,
 * whyItMoved) are filled with sensible defaults here. In a future
 * pass, chartData can be built from asset_price_history rows and
 * the lesson fields can come from the educational_note column.
 */
export function mapAssetRowToAppAsset(row: AssetRow): Asset {
  const converted: AssetRowConverted = {
    id: row.id,
    name: row.public_name,
    symbol: row.symbol,
    type: dbAssetTypeToAppType(row.asset_type),
    price: row.current_price,
    previousPrice: row.current_price * (1 - row.daily_change_percent / 100),
    dailyChangePercent: row.daily_change_percent,
    riskScore: row.risk_score,
    description: row.description ?? "",
    bullish: row.daily_change_percent >= 0,
    tags: row.tags ?? [],
    educationalNote: row.educational_note ?? undefined,
    league: undefined,
  };

  return {
    ...converted,
    sport: "All Sports",          // resolved via sport join in a future pass
    marketLesson: row.educational_note ?? "Markets are simulated. LuckyCoin has no cash value.",
    whyItMoved: "Simulated market movement.",
    chartData: generatePlaceholderChart(row.current_price, row.daily_change_percent),
  };
}

/** Generates a 20-point placeholder sparkline from a current price + change. */
function generatePlaceholderChart(price: number, changePercent: number): number[] {
  const points: number[] = [];
  const trend = (price * changePercent) / 100 / 20;
  let current = price * (1 - Math.abs(changePercent) / 100);
  for (let i = 0; i < 20; i++) {
    current = current + trend + (Math.sin(i * 0.8) * price * 0.005);
    if (current < 0.01) current = 0.01;
    points.push(Math.round(current * 100) / 100);
  }
  return points;
}

// ─────────────────────────────────────────────────────────────────────────────
// Supabase fetch stubs
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Fetches all active assets from Supabase.
 *
 * Returns null if the Supabase client is not configured, the market tables
 * don't exist yet, or any error occurs. The caller should fall back to
 * fallbackToLocalAssets() on a null return.
 *
 * @example
 * const dbAssets = await fetchAssetsFromSupabase();
 * const assets = dbAssets
 *   ? dbAssets.map(mapAssetRowToAppAsset)
 *   : fallbackToLocalAssets();
 */
export async function fetchAssetsFromSupabase(): Promise<AssetRow[] | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("assets")
      .select("*")
      .eq("status", "active")
      .order("asset_type")
      .order("symbol");

    if (error) {
      if (__DEV__) console.warn("[marketRepository] fetchAssetsFromSupabase:", error.message);
      return null;
    }

    return (data as AssetRow[]) ?? null;
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] fetchAssetsFromSupabase exception:", err);
    return null;
  }
}

/**
 * Fetches recent market pulses from Supabase.
 *
 * Returns null on any error. The caller should fall back to local
 * MOCK_MARKET_EVENTS data on a null return.
 *
 * @param limit  Max number of pulses to return (default 20).
 */
export async function fetchMarketPulsesFromSupabase(
  limit = 20,
): Promise<MarketPulseRow[] | null> {
  try {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("market_pulses")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(limit);

    if (error) {
      if (__DEV__) console.warn("[marketRepository] fetchMarketPulsesFromSupabase:", error.message);
      return null;
    }

    return (data as MarketPulseRow[]) ?? null;
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] fetchMarketPulsesFromSupabase exception:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Catalog adapter — Supabase → App Asset
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Enriched asset row returned by the catalog adapter's join query.
 * sport_data / league_data are embedded via PostgREST FK joins.
 * _settlementRule is populated from a parallel futures_markets query —
 * it is not a real database column.
 */
interface EnrichedAssetRow extends AssetRow {
  sport_data: { name: string; slug: string } | null;
  league_data: { name: string; slug: string } | null;
  /** Populated from public.futures_markets for Future-type assets. */
  _settlementRule?: string;
}

/**
 * Maps a Supabase sport name to the app's sport filter value.
 * Scanner uses: "Football" | "Basketball" | "MMA" | "Baseball" | "Soccer" | "Hockey"
 * Index/meme/coach assets with no sport → "All Sports"
 */
function dbSportToAppSport(name: string | null | undefined): string {
  if (!name) return "All Sports";
  const map: Record<string, string> = {
    "Pro Football":   "Football",
    "Pro Basketball": "Basketball",
    "Pro Baseball":   "Baseball",
    "Pro Hockey":     "Hockey",
    "Pro Soccer":     "Soccer",
    "MMA":            "MMA",
    "College Sports": "All Sports",
  };
  return map[name] ?? "All Sports";
}

/** Generates a simple user-facing "why it moved" string from db sentiment. */
function whyItMovedFromSentiment(
  sentiment: DbAssetSentiment,
  changePercent: number,
): string {
  const dir = changePercent >= 0 ? "higher" : "lower";
  switch (sentiment) {
    case "bullish":  return `Positive simulated momentum drove this asset ${dir} today.`;
    case "bearish":  return `Simulated market pressure moved this asset ${dir} today.`;
    case "volatile": return `High simulated volatility — sharp price swings in both directions today.`;
    default:         return `Modest simulated market movement today.`;
  }
}

/** Returns a type-appropriate market lesson fallback when educational_note is absent. */
function defaultMarketLesson(type: import("@/data/mockAssets").AssetType): string {
  switch (type) {
    case "Team Stock":
      return "Team stocks reflect simulated market confidence in a franchise's season trajectory. LuckyCoin has no cash value.";
    case "Player Coin":
      return "Player coins track simulated performance narratives for a roster position. They move with in-game momentum. LuckyCoin has no cash value.";
    case "Coach Stock":
      return "Coach stocks reflect simulated confidence in a coaching staff's performance. Great coaching lifts entire rosters. LuckyCoin has no cash value.";
    case "Sport Index":
      return "Indexes spread risk across many assets. Even if one coin drops, the index barely moves. LuckyCoin has no cash value.";
    case "Meme Coin":
      return "Meme coins are high-volatility, narrative-driven assets. They can spike fast and drop just as fast. LuckyCoin has no cash value.";
    case "Future":
      return "Futures track simulated season storylines — not gambling, odds, or real-money prediction markets. LuckyCoin has no cash value.";
  }
}

/**
 * Maps a single enriched Supabase asset row to the app Asset type.
 *
 * ID safety rule: id = symbol.toLowerCase()
 *   This matches the format used by local mock assets (e.g. "ff100", "kcqb1").
 *   It ensures watchlist entries, holdings, and trade records created against
 *   local mock data continue to resolve correctly if Supabase data is later
 *   switched on — as long as symbols are consistent.
 *
 * UUID preservation: row.id is stored as asset.dbAssetId (optional field).
 *   It is never used as the app asset id.
 *
 * No real names, gambling odds, or real-money language in any output field.
 */
export function mapDatabaseAssetToAppAsset(row: EnrichedAssetRow): Asset {
  const type = dbAssetTypeToAppType(row.asset_type);
  const sport = dbSportToAppSport(row.sport_data?.name);
  const league = row.league_data?.name ?? undefined;
  const bullish = row.daily_change_percent >= 0;
  const previousPrice =
    row.current_price / (1 + row.daily_change_percent / 100);

  return {
    id: row.symbol.toLowerCase(),
    dbAssetId: row.id,
    name: row.public_name,
    symbol: row.symbol,
    type,
    sport,
    league,
    price: row.current_price,
    previousPrice: Math.max(0.01, previousPrice),
    dailyChangePercent: row.daily_change_percent,
    riskScore: row.risk_score,
    description:
      row.description ??
      `${row.public_name} is a simulated Fanfolio market asset. LuckyCoin has no cash value.`,
    marketLesson: row.educational_note ?? defaultMarketLesson(type),
    whyItMoved: whyItMovedFromSentiment(row.sentiment, row.daily_change_percent),
    chartData: generatePlaceholderChart(row.current_price, row.daily_change_percent),
    bullish,
    tags: Array.isArray(row.tags) ? row.tags : [],
    settlementRule: row._settlementRule ?? undefined,
    educationalNote: row.educational_note ?? undefined,
  };
}

/**
 * Fetches all active assets from Supabase, enriched with sport and league names.
 * Runs a parallel query to attach settlement rules for Future-type assets.
 *
 * Returns null if Supabase is not configured or any query fails.
 * Does not affect local mock data — caller decides what to do with null.
 */
export async function getSupabaseMarketAssets(): Promise<EnrichedAssetRow[] | null> {
  try {
    if (!supabase) return null;

    const [assetsResult, futuresResult] = await Promise.all([
      supabase
        .from("assets")
        .select(
          "*, sport_data:sports!sport_id ( name, slug ), league_data:leagues!league_id ( name, slug )"
        )
        .eq("status", "active")
        .order("symbol"),
      supabase
        .from("futures_markets")
        .select("asset_id, settlement_rule"),
    ]);

    if (assetsResult.error) {
      if (__DEV__)
        console.warn("[marketRepository] getSupabaseMarketAssets:", assetsResult.error.message);
      return null;
    }

    // Build settlement_rule lookup keyed by asset UUID
    const futuresMap: Record<string, string> = {};
    if (!futuresResult.error && futuresResult.data) {
      for (const f of futuresResult.data as { asset_id: string; settlement_rule: string | null }[]) {
        if (f.settlement_rule) futuresMap[f.asset_id] = f.settlement_rule;
      }
    }

    // Attach _settlementRule to matching rows
    return ((assetsResult.data ?? []) as EnrichedAssetRow[]).map((row) => ({
      ...row,
      _settlementRule: futuresMap[row.id] ?? undefined,
    }));
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] getSupabaseMarketAssets exception:", err);
    return null;
  }
}

/**
 * Returns the active asset list for the app, respecting the feature flag.
 *
 * Fallback cascade — returns ALL_ASSETS if:
 *   1. EXPO_PUBLIC_MARKET_DATA_SOURCE !== "supabase"   (flag not set)
 *   2. Supabase env vars are missing                   (client is null)
 *   3. Supabase query fails                            (network / permissions)
 *   4. Supabase returns 0 valid mapped assets          (empty seed)
 *
 * Market, Scanner, and News screens continue to call useLiveAssets() which
 * uses ALL_ASSETS directly. This function is the future swap-in point for
 * those screens — they are not changed in this pass.
 */
export async function getMarketAssetsWithFallback(): Promise<Asset[]> {
  if (getMarketDataSourceMode() !== "supabase") return fallbackToLocalAssets();
  if (!supabase) return fallbackToLocalAssets();

  try {
    const rows = await getSupabaseMarketAssets();
    if (!rows || rows.length === 0) return fallbackToLocalAssets();

    const mapped: Asset[] = [];
    for (const row of rows) {
      try {
        mapped.push(mapDatabaseAssetToAppAsset(row));
      } catch (mapErr) {
        if (__DEV__)
          console.warn("[marketRepository] mapDatabaseAssetToAppAsset failed for", row.symbol, mapErr);
      }
    }

    return mapped.length > 0 ? mapped : fallbackToLocalAssets();
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] getMarketAssetsWithFallback exception:", err);
    return fallbackToLocalAssets();
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Dev-only: Market Database sanity check helpers
// ─────────────────────────────────────────────────────────────────────────────

export interface MarketDbCounts {
  sports: number;
  leagues: number;
  generic_teams: number;
  generic_player_roles: number;
  coach_roles: number;
  assets: number;
  asset_price_history: number;
  futures_markets: number;
  index_definitions: number;
  index_members: number;
}

export interface AssetPreviewRow {
  id: string;
  symbol: string;
  public_name: string;
  asset_type: string;
  current_price: number;
}

export interface TeamPreviewRow {
  id: string;
  city: string;
  public_name: string;
  symbol_prefix: string;
}

export interface PlayerRolePreviewRow {
  id: string;
  public_role: string;
  public_name: string;
  asset_symbol: string;
}

export interface IndexDefinitionPreviewRow {
  id: string;
  name: string;
  weighting_method: string;
}

export interface MarketDbPreview {
  assets: AssetPreviewRow[];
  generic_teams: TeamPreviewRow[];
  generic_player_roles: PlayerRolePreviewRow[];
  index_definitions: IndexDefinitionPreviewRow[];
}

export interface IndexMemberSummary {
  index_id: string;
  index_name: string;
  member_count: number;
  total_weight: number;
}

/**
 * Dev-only. Queries Supabase for exact row counts across all seeded tables.
 * Returns null if Supabase is not configured or any query fails.
 * Does NOT affect app behavior — local mock data is untouched.
 */
export async function getMarketDatabaseCounts(): Promise<MarketDbCounts | null> {
  try {
    if (!supabase) return null;

    const countOf = (table: string) =>
      supabase!.from(table).select("*", { count: "exact", head: true });

    const [
      sports,
      leagues,
      generic_teams,
      generic_player_roles,
      coach_roles,
      assets,
      asset_price_history,
      futures_markets,
      index_definitions,
      index_members,
    ] = await Promise.all([
      countOf("sports"),
      countOf("leagues"),
      countOf("generic_teams"),
      countOf("generic_player_roles"),
      countOf("coach_roles"),
      countOf("assets"),
      countOf("asset_price_history"),
      countOf("futures_markets"),
      countOf("index_definitions"),
      countOf("index_members"),
    ]);

    if (
      sports.error || leagues.error || generic_teams.error ||
      generic_player_roles.error || coach_roles.error || assets.error ||
      asset_price_history.error || futures_markets.error ||
      index_definitions.error || index_members.error
    ) {
      const firstError =
        sports.error ?? leagues.error ?? generic_teams.error ??
        generic_player_roles.error ?? coach_roles.error ?? assets.error ??
        asset_price_history.error ?? futures_markets.error ??
        index_definitions.error ?? index_members.error;
      if (__DEV__) console.warn("[marketRepository] getMarketDatabaseCounts error:", firstError?.message);
      return null;
    }

    return {
      sports: sports.count ?? -1,
      leagues: leagues.count ?? -1,
      generic_teams: generic_teams.count ?? -1,
      generic_player_roles: generic_player_roles.count ?? -1,
      coach_roles: coach_roles.count ?? -1,
      assets: assets.count ?? -1,
      asset_price_history: asset_price_history.count ?? -1,
      futures_markets: futures_markets.count ?? -1,
      index_definitions: index_definitions.count ?? -1,
      index_members: index_members.count ?? -1,
    };
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] getMarketDatabaseCounts exception:", err);
    return null;
  }
}

/**
 * Dev-only. Fetches a small preview of key reference table rows.
 * Returns null if Supabase is not configured or any query fails.
 */
export async function getMarketDatabasePreview(): Promise<MarketDbPreview | null> {
  try {
    if (!supabase) return null;

    const [assets, teams, roles, indexDefs] = await Promise.all([
      supabase
        .from("assets")
        .select("id, symbol, public_name, asset_type, current_price")
        .order("symbol")
        .limit(5),
      supabase
        .from("generic_teams")
        .select("id, city, public_name, symbol_prefix")
        .order("city")
        .limit(5),
      supabase
        .from("generic_player_roles")
        .select("id, public_role, public_name, asset_symbol")
        .order("asset_symbol")
        .limit(5),
      supabase
        .from("index_definitions")
        .select("id, name, weighting_method")
        .order("name"),
    ]);

    if (assets.error || teams.error || roles.error || indexDefs.error) {
      if (__DEV__)
        console.warn("[marketRepository] getMarketDatabasePreview error:", assets.error ?? teams.error ?? roles.error ?? indexDefs.error);
      return null;
    }

    return {
      assets: (assets.data ?? []) as AssetPreviewRow[],
      generic_teams: (teams.data ?? []) as TeamPreviewRow[],
      generic_player_roles: (roles.data ?? []) as PlayerRolePreviewRow[],
      index_definitions: (indexDefs.data ?? []) as IndexDefinitionPreviewRow[],
    };
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] getMarketDatabasePreview exception:", err);
    return null;
  }
}

/**
 * Dev-only. Returns per-index member count and total weight, computed in JS.
 * Returns null if Supabase is not configured or any query fails.
 */
export async function getIndexMemberSummary(): Promise<IndexMemberSummary[] | null> {
  try {
    if (!supabase) return null;

    const [defsResult, membersResult] = await Promise.all([
      supabase.from("index_definitions").select("id, name"),
      supabase.from("index_members").select("index_id, weight_percent"),
    ]);

    if (defsResult.error || membersResult.error) {
      if (__DEV__)
        console.warn("[marketRepository] getIndexMemberSummary error:", defsResult.error ?? membersResult.error);
      return null;
    }

    const defs = (defsResult.data ?? []) as { id: string; name: string }[];
    const members = (membersResult.data ?? []) as { index_id: string; weight_percent: number }[];

    return defs.map((def) => {
      const defMembers = members.filter((m) => m.index_id === def.id);
      const total = defMembers.reduce((sum, m) => sum + (m.weight_percent ?? 0), 0);
      return {
        index_id: def.id,
        index_name: def.name,
        member_count: defMembers.length,
        total_weight: Math.round(total * 1000) / 1000,
      };
    });
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] getIndexMemberSummary exception:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Index basket — public types
// ─────────────────────────────────────────────────────────────────────────────

/** One member of an index basket, resolved with live asset data. */
export interface IndexBasketMember {
  /** Supabase UUID of the member asset. */
  assetId: string;
  symbol: string;
  name: string;
  /** App-friendly type label, e.g. "Team Stock". */
  type: string;
  weightPercent: number;
  price: number;
  dailyChangePercent: number;
}

/** Resolved basket for a Sport Index asset. */
export interface IndexBasket {
  indexId: string;
  indexName: string;
  weightingMethod: string;
  /** Ordered by weight_percent DESC (as returned by DB). */
  members: IndexBasketMember[];
  /** Sum of all member weight_percent values, rounded to 3 dp. */
  totalWeight: number;
}

/**
 * Fetches the index basket for a Sport Index asset.
 *
 * - Only runs in Supabase mode. Returns null in local mode.
 * - Returns null if the asset is not a "Sport Index".
 * - Returns null if asset.dbAssetId is missing (local mock asset).
 * - Never throws — returns null on any network or query error.
 * - Does NOT query private_entity_aliases.
 * - LuckyCoin only — no real money, no gambling, no odds.
 */
export async function getIndexBasketForAsset(asset: Asset): Promise<IndexBasket | null> {
  if (getMarketDataSourceMode() !== "supabase") return null;
  if (!supabase) return null;
  if (asset.type !== "Sport Index") return null;
  if (!asset.dbAssetId) return null;

  try {
    // 1. Resolve the index_definition row for this asset UUID
    const defResult = await supabase
      .from("index_definitions")
      .select("id, name, weighting_method")
      .eq("asset_id", asset.dbAssetId)
      .limit(1)
      .single();

    if (defResult.error || !defResult.data) {
      if (__DEV__) console.warn("[marketRepository] getIndexBasketForAsset: no index_definition for", asset.symbol, defResult.error?.message);
      return null;
    }

    const def = defResult.data as { id: string; name: string; weighting_method: string };

    // 2. Fetch index_members for this index, ordered by weight descending
    const membersResult = await supabase
      .from("index_members")
      .select("asset_id, weight_percent")
      .eq("index_id", def.id)
      .order("weight_percent", { ascending: false });

    if (membersResult.error || !membersResult.data || membersResult.data.length === 0) {
      if (__DEV__) console.warn("[marketRepository] getIndexBasketForAsset: no members for", def.name, membersResult.error?.message);
      return null;
    }

    const rawMembers = membersResult.data as { asset_id: string; weight_percent: number }[];
    const memberAssetIds = rawMembers.map(m => m.asset_id);

    // 3. Fetch asset details for all member IDs in one query
    const assetsResult = await supabase
      .from("assets")
      .select("id, symbol, public_name, asset_type, current_price, daily_change_percent")
      .in("id", memberAssetIds);

    if (assetsResult.error) {
      if (__DEV__) console.warn("[marketRepository] getIndexBasketForAsset: assets fetch failed:", assetsResult.error.message);
      return null;
    }

    const assetMap = new Map<string, {
      symbol: string;
      public_name: string;
      asset_type: string;
      current_price: number;
      daily_change_percent: number;
    }>();
    for (const row of (assetsResult.data ?? []) as {
      id: string; symbol: string; public_name: string;
      asset_type: string; current_price: number; daily_change_percent: number;
    }[]) {
      assetMap.set(row.id, row);
    }

    const members: IndexBasketMember[] = rawMembers
      .map(m => {
        const a = assetMap.get(m.asset_id);
        if (!a) return null;
        return {
          assetId: m.asset_id,
          symbol: a.symbol,
          name: a.public_name,
          type: dbAssetTypeToAppType(a.asset_type as DbAssetType),
          weightPercent: m.weight_percent,
          price: a.current_price,
          dailyChangePercent: a.daily_change_percent,
        } as IndexBasketMember;
      })
      .filter((m): m is IndexBasketMember => m !== null);

    const totalWeight = Math.round(
      members.reduce((sum, m) => sum + m.weightPercent, 0) * 1000
    ) / 1000;

    return { indexId: def.id, indexName: def.name, weightingMethod: def.weighting_method, members, totalWeight };
  } catch (err) {
    if (__DEV__) console.warn("[marketRepository] getIndexBasketForAsset exception:", err);
    return null;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point (used by screens in a future pass)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the active asset list.
 *
 * - If EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase and Supabase is reachable,
 *   fetches live data and maps it to the app Asset shape.
 * - Otherwise returns ALL_ASSETS (local mock data).
 *
 * This function is a no-op stub until the Supabase tables are populated.
 * Screens currently import ALL_ASSETS directly — they can be migrated
 * to call this function in a future pass.
 */
export async function getMarketAssets(): Promise<Asset[]> {
  const mode = getMarketDataSourceMode();

  if (mode === "supabase") {
    const rows = await fetchAssetsFromSupabase();
    if (rows && rows.length > 0) {
      return rows.map(mapAssetRowToAppAsset);
    }
  }

  return fallbackToLocalAssets();
}
