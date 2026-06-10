import { useState, useEffect, useMemo } from "react";
import { Asset } from "@/data/mockAssets";
import { ALL_ASSETS } from "@/data/assetUniverse";
import { useGame } from "@/context/GameContext";
import { getMarketAssetsWithFallback, getMarketDataSourceMode } from "@/lib/marketRepository";

// ─── Module-level asset cache ────────────────────────────────────────────────
// Populated once per app session when EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase.
// Subsequent hook mounts read from this cache synchronously — no blank flash.
// LuckyCoin only. No real money, no gambling, no real-money data.

let _cachedAssets: Asset[] | null = null;
let _loadPromise: Promise<Asset[]> | null = null;

/** Kicks off the Supabase fetch (or returns the in-flight promise / cached result). */
function warmCache(): Promise<Asset[]> {
  if (_cachedAssets !== null) return Promise.resolve(_cachedAssets);
  if (_loadPromise !== null) return _loadPromise;
  _loadPromise = getMarketAssetsWithFallback().then((assets) => {
    _cachedAssets = assets;
    return assets;
  });
  return _loadPromise;
}

/**
 * Returns all assets with applied market-event price overrides merged in.
 *
 * Source behavior (controlled by EXPO_PUBLIC_MARKET_DATA_SOURCE):
 *  • Unset / "local" — uses local ALL_ASSETS. Identical to previous behavior:
 *    synchronous, no React state transitions, no network requests.
 *  • "supabase"      — fetches from Supabase once per app session via
 *    getMarketAssetsWithFallback(). Falls back to ALL_ASSETS silently on any
 *    network or config error. During the initial load frame, returns ALL_ASSETS
 *    with overrides so no screen shows a blank list.
 *
 * All screens that call this hook (Market, Scanner, Portfolio, Asset Detail,
 * Watchlist, Coach, Journal) automatically use the correct source with no
 * further changes needed.
 */
export function useLiveAssets(): Asset[] {
  const { priceOverrides } = useGame();
  const mode = getMarketDataSourceMode();

  // Initialise synchronously from cache when possible so re-mounts after the
  // first load show supabase data immediately with no blank flash.
  const [baseAssets, setBaseAssets] = useState<Asset[]>(() =>
    mode === "supabase" && _cachedAssets !== null ? _cachedAssets : ALL_ASSETS
  );

  useEffect(() => {
    if (mode !== "supabase") return;

    // Cache already populated (e.g. re-mount after first load) — sync state.
    if (_cachedAssets !== null) {
      setBaseAssets(_cachedAssets);
      return;
    }

    // First load: warm the cache then push the result into state.
    let cancelled = false;
    warmCache().then((assets) => {
      if (!cancelled) setBaseAssets(assets);
    });
    return () => { cancelled = true; };
  }, [mode]);

  return useMemo(() => {
    return baseAssets.map(asset => {
      const override = priceOverrides[asset.id];
      if (!override) return asset;
      return { ...asset, ...override };
    });
  }, [baseAssets, priceOverrides]);
}

/**
 * Returns a single live asset by id, with any price override applied.
 * Searches the active source (Supabase or local) so asset detail screens
 * work correctly in both modes without changes.
 */
export function useLiveAsset(id: string): Asset | undefined {
  const assets = useLiveAssets();
  return useMemo(() => assets.find(a => a.id === id), [assets, id]);
}
