import { useMemo } from "react";
import { MOCK_ASSETS, Asset, getAssetById } from "@/data/mockAssets";
import { useGame } from "@/context/GameContext";

/**
 * Returns all assets with any applied market-event price overrides merged in.
 * Components should use this instead of MOCK_ASSETS directly so they reflect
 * the latest simulated market state.
 */
export function useLiveAssets(): Asset[] {
  const { priceOverrides } = useGame();
  return useMemo(() => {
    return MOCK_ASSETS.map(asset => {
      const override = priceOverrides[asset.id];
      if (!override) return asset;
      return { ...asset, ...override };
    });
  }, [priceOverrides]);
}

/**
 * Returns a single asset merged with any price override.
 */
export function useLiveAsset(id: string): Asset | undefined {
  const { priceOverrides } = useGame();
  return useMemo(() => {
    const base = getAssetById(id);
    if (!base) return undefined;
    const override = priceOverrides[id];
    if (!override) return base;
    return { ...base, ...override };
  }, [id, priceOverrides]);
}
