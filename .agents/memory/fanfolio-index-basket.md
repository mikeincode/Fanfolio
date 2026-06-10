---
name: Fanfolio index basket feature
description: How the Sport Index basket display works — types, fetch function, hook, UI, and dev test screen.
---

## Overview
Sport Index assets can display their basket members (weight %, daily change %) on the asset detail screen when EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase.

## Key pieces
- `lib/marketRepository.ts` — `IndexBasketMember`, `IndexBasket` types + `getIndexBasketForAsset(asset: Asset): Promise<IndexBasket | null>`. 3-query approach: find index_definition by asset.dbAssetId → fetch index_members ordered by weight DESC → fetch asset details by IDs.
- `hooks/useIndexBasket.ts` — module-level `Map<string, IndexBasket>` cache keyed by dbAssetId. Returns `{ loading, basket, error, isSupabaseMode }`. No-ops cleanly in local mode or for non-index assets.
- `app/asset/[id].tsx` — basket section renders after local "Index Composition" card. 3 states: loading (ActivityIndicator), empty/error (educational fallback text), full table (top 10 members with symbol, name, weight%, daily change%). `basketStyles` StyleSheet defined at bottom of file.
- `app/dev-market-db.tsx` — `BasketTestResult` interface, `handleRun` uses `liveAssets.find(a => a.type === "Sport Index" && a.dbAssetId)` to pick test asset, calls `getIndexBasketForAsset` in the same `Promise.all`, shows member count + total weight in a table card.

## Why module-level cache in useIndexBasket
Avoids redundant Supabase queries when user navigates back to the same index screen in the same session. Cache key = asset.dbAssetId (Supabase UUID).

## Safe language rules
No cash, gambling, odds, or betting wording anywhere. All educational copy uses LuckyCoin / simulated language.

## Local mode behaviour
- `isSupabaseMode = false` → basket section shows "Basket details are available when the market database is active." instead of fetching.
- Dev test screen shows "No Sport Index with dbAssetId found" if in local mode (no dbAssetIds on mock assets).
