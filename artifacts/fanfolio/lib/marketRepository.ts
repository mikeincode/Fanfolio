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
