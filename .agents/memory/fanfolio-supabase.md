---
name: Fanfolio Supabase layer
description: Supabase client setup, market repository adapter, and feature flag conventions.
---

## Packages
`@supabase/supabase-js` and `react-native-url-polyfill` must both be installed (they were missing on the GitHub clone — install with pnpm before any TS checks).

## lib/supabase.ts
Exports `supabase` (null if env vars missing) and `isSupabaseConfigured` (bool). Auth uses AsyncStorage for session persistence. Guard all usage with `if (!supabase) return`.

## lib/marketRepository.ts — adapter functions
- `getSupabaseMarketAssets()` — enriched join query (assets + sports + leagues + futures_markets); returns `EnrichedAssetRow[] | null`
- `mapDatabaseAssetToAppAsset(row)` — maps one `EnrichedAssetRow` → `Asset`; id = `symbol.toLowerCase()` (matches local mock id format); fills chartData with placeholder sparkline
- `getMarketAssetsWithFallback()` — respects feature flag, falls back to `ALL_ASSETS` on any error
- `getMarketDataSourceMode()` — reads `EXPO_PUBLIC_MARKET_DATA_SOURCE`; defaults to "local"

## Feature flag
Set `EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase` in env to activate Supabase market data.
Without this flag, `getMarketAssetsWithFallback()` returns local `ALL_ASSETS` immediately — Supabase is never queried.

## Supabase DB counts (seeded)
sports 7, leagues 7, generic_teams 32, generic_player_roles 160, coach_roles 6, assets 208, asset_price_history 208, futures_markets 6, index_definitions 4, index_members 96.

## Dev tool
`app/dev-market-db.tsx` — read-only sanity check screen. Includes "Validate App Asset Mapping" section that calls `getSupabaseMarketAssets()` + `mapDatabaseAssetToAppAsset()` and checks for empty fields, duplicate IDs, and duplicate symbols.

## Not yet wired
Market, Scanner, and News screens still call `useLiveAssets()` which uses `ALL_ASSETS` directly. `getMarketAssetsWithFallback()` is the swap-in point for those screens in a future pass.

**Why:** Safe incremental approach — local mock data is untouched until the flag is flipped and the screens are wired.
