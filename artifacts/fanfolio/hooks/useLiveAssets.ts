import { useMemo } from "react";
import { Asset } from "@/data/mockAssets";
import { ALL_ASSETS, getAllAssetById } from "@/data/assetUniverse";
import { useGame } from "@/context/GameContext";

/**
 * Returns all assets (mock + universe) with any applied market-event
 * price overrides merged in. Components should use this instead of
 * MOCK_ASSETS or ALL_ASSETS directly so they reflect the latest
 * simulated market state.
 */
export function useLiveAssets(): Asset[] {
  const { priceOverrides } = useGame();
  return useMemo(() => {
    return ALL_ASSETS.map(asset => {
      const override = priceOverrides[asset.id];
      if (!override) return asset;
      return { ...asset, ...override };
    });
  }, [priceOverrides]);
}

/**
 * Returns a single asset merged with any price override.
 * Searches the full universe (mock + expanded).
 */
export function useLiveAsset(id: string): Asset | undefined {
  const { priceOverrides } = useGame();
  return useMemo(() => {
    const base = getAllAssetById(id);
    if (!base) return undefined;
    const override = priceOverrides[id];
    if (!override) return base;
    return { ...base, ...override };
  }, [id, priceOverrides]);
}
