---
name: Fanfolio Supabase layer
description: Supabase client setup, market repository adapter, useLiveAssets wiring, feature flag conventions, and QA sweep findings.
---

## Packages
`@supabase/supabase-js` and `react-native-url-polyfill` must both be installed (they were missing on the GitHub clone — install with pnpm before any TS checks).

## lib/supabase.ts
Exports `supabase` (null if env vars missing) and `isSupabaseConfigured` (bool). Auth uses AsyncStorage for session persistence. Guard all usage with `if (!supabase) return`.

## lib/marketRepository.ts — adapter functions
- `getSupabaseMarketAssets()` — enriched join query (assets + sports + leagues + futures_markets); returns `EnrichedAssetRow[] | null`
- `mapDatabaseAssetToAppAsset(row)` — maps one `EnrichedAssetRow` → `Asset`; id = `symbol.toLowerCase()`; fills chartData with placeholder sparkline
- `getMarketAssetsWithFallback()` — respects feature flag, falls back to `ALL_ASSETS` on any error
- `getMarketDataSourceMode()` — reads `EXPO_PUBLIC_MARKET_DATA_SOURCE`; defaults to "local"

## hooks/useLiveAssets.ts — wiring
- "local" (default): reads `ALL_ASSETS` synchronously — zero overhead
- "supabase": module-level cache (`_cachedAssets` / `_loadPromise`); fetches once per app session; interim ALL_ASSETS until fetch completes

**Why cache is module-level:** React state initializer reads it synchronously on re-mounts — no loading flash.

## Feature flag
`EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase` activates Supabase data. Requires Metro rebundle (restart workflow) — baked at build time, not runtime.

## QA sweep — ALL_ASSETS / getAllAssetById bugs found and fixed
All hooks/screens that use `ALL_ASSETS` directly for type/sport lookups (instead of `liveAssets`) produce wrong results in Supabase mode. Fixed files:
- `leaderboard.tsx` — uniqueSports/uniqueTypes: `ALL_ASSETS` → `liveAssets` (diversification score was always 0)
- `profile.tsx` — same uniqueSports/uniqueTypes fix (rank computation wrong)
- `performance.tsx` — `getAllAssetById` for topHolding/topMover → `liveAssets.find()` (names blank)
- `useChallenges.ts` — holdingSports + indexBuyCount + memeBuyAssetIds: `ALL_ASSETS` → `liveAssets` (3-sports challenge and buy-index challenge never completed)
- `useTraderIdentity.ts` — memeHoldings/indexHoldings/futuresHoldings/memeBuyTx/indexBuyTx/holdingSports/holdingTypes: `assetMap` → `liveMap` (identity always misclassified; assetMap still used as price fallback)
- `journal.tsx` — `augmented` array + `TradeRow.resolvedAsset` prop: `getAllAssetById` → `liveAssets.find() ?? getAllAssetById()` (type badge and filter broken)

**Rule:** Never use `ALL_ASSETS.find()` or `getAllAssetById()` for live type/sport lookups. Always use `liveAssets` from `useLiveAssets()`. Keep `getAllAssetById` only as a stale-save fallback.

## Stale-save handling
`portfolio.tsx` adds `staleHoldings = holdings.filter(h => !liveAssets.find(...))` and renders dimmed "Unknown Asset · data unavailable" rows. User data is preserved, no crash, no silent deletion.
Journal `augmented` uses `liveAssets.find() ?? getAllAssetById()` — stale transactions still render with symbol/name/qty/price from the saved Transaction shape.

## Supabase DB counts (seeded)
sports 7, leagues 7, generic_teams 32, generic_player_roles 160, coach_roles 6, assets 208, asset_price_history 208, futures_markets 6, index_definitions 4, index_members 96.

## buildSnapshot live-catalog fix
`buildSnapshot` in `GameContext.tsx` is a module-level pure function — it cannot call hooks. It originally used `getAllAssetById()` only, which misses all Supabase assets → `holdingsValue=0`, `topHoldingId/topMoverId` undefined in Supabase mode.
**Fix pattern:** module-level `_liveAssetCatalog: Asset[]` ref + exported `registerLiveAssetCatalog(assets)` setter. `buildSnapshot` consults `_liveAssetCatalog.find()` first, then `getAllAssetById()` as fallback. A `LiveAssetRegistrar` component (renders `null`, calls `useLiveAssets()` + `registerLiveAssetCatalog()` on every render) is placed inside `<GameProvider>` in `_layout.tsx`. No circular dependency, no snapshot shape change, local mode fully preserved.
`performance.tsx` already renders topHolding/topMover via `liveAssets.find()` — the render side was already correct; the bug was only in snapshot creation.

## Dev tool — app/dev-market-db.tsx
Active Source Status card: mode (local/supabase), `useLiveAssets.length`, and flag value.
