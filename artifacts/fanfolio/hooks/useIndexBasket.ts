/**
 * hooks/useIndexBasket.ts
 *
 * Fetches and caches the index basket members for a Sport Index asset.
 * Only active in Supabase mode — returns null cleanly in local mode.
 *
 * LuckyCoin only. No real money, no gambling, no odds, no cash value.
 */

import { useState, useEffect, useRef } from "react";
import type { Asset } from "@/data/mockAssets";
import {
  getIndexBasketForAsset,
  getMarketDataSourceMode,
  type IndexBasket,
} from "@/lib/marketRepository";

// ─── Module-level cache keyed by dbAssetId ────────────────────────────────────
// Avoids redundant Supabase queries when the user navigates back to the same
// index asset detail screen during the same app session.
const _basketCache = new Map<string, IndexBasket>();

export interface UseIndexBasketResult {
  loading: boolean;
  basket: IndexBasket | null;
  error: string | null;
  /** True when EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase. */
  isSupabaseMode: boolean;
}

/**
 * Returns basket data for a Sport Index asset.
 *
 * - Returns `{ loading: false, basket: null }` immediately for non-index assets,
 *   local mode, or assets without a dbAssetId (local mock assets).
 * - Reads synchronously from module-level cache on re-mounts.
 * - Fetches once per unique dbAssetId per app session.
 * - Never throws — errors surface as `error` string.
 */
export function useIndexBasket(asset: Asset | undefined): UseIndexBasketResult {
  const isSupabaseMode = getMarketDataSourceMode() === "supabase";
  const isIndex = asset?.type === "Sport Index";
  const cacheKey = asset?.dbAssetId ?? null;

  const [loading, setLoading] = useState<boolean>(() => {
    // Only start in loading state if we actually need to fetch
    if (!isIndex || !isSupabaseMode || !cacheKey) return false;
    return !_basketCache.has(cacheKey);
  });

  const [basket, setBasket] = useState<IndexBasket | null>(() => {
    if (!cacheKey) return null;
    return _basketCache.get(cacheKey) ?? null;
  });

  const [error, setError] = useState<string | null>(null);

  // Track which dbAssetId we already fired a fetch for to prevent double-fetch
  // on StrictMode double-invoke or rapid asset changes.
  const fetchedKeyRef = useRef<string | null>(null);

  useEffect(() => {
    if (!isIndex || !isSupabaseMode || !cacheKey || !asset) return;

    // Cache hit — no network needed
    if (_basketCache.has(cacheKey)) {
      setBasket(_basketCache.get(cacheKey)!);
      setLoading(false);
      return;
    }

    // Already in-flight for this key
    if (fetchedKeyRef.current === cacheKey) return;
    fetchedKeyRef.current = cacheKey;

    setLoading(true);
    setError(null);

    getIndexBasketForAsset(asset)
      .then(result => {
        if (result) {
          _basketCache.set(cacheKey, result);
          setBasket(result);
        } else {
          setError("Basket data is not available for this index.");
        }
      })
      .catch(err => {
        setError(err instanceof Error ? err.message : "Failed to load basket.");
      })
      .finally(() => {
        setLoading(false);
      });
  // asset.dbAssetId and asset.type are the only things that matter here;
  // the full asset object reference changes on every price jitter.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cacheKey, isIndex, isSupabaseMode]);

  return { loading, basket, error, isSupabaseMode };
}
