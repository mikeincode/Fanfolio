---
name: Fanfolio Supabase layer
description: Supabase client setup, market repository adapter, useLiveAssets wiring, and feature flag conventions.
---

## Packages
`@supabase/supabase-js` and `react-native-url-polyfill` must both be installed (they were missing on the GitHub clone — install with pnpm before any TS checks).

## lib/supabase.ts
Exports `supabase` (null if env vars missing) and `isSupabaseConfigured` (bool). Auth uses AsyncStorage for session persistence. Guard all usage with `if (!supabase) return`.

## lib/marketRepository.ts — adapter functions
- `getSupabaseMarketAssets()` — enriched join query (assets + sports + leagues + futures_markets); returns `EnrichedAssetRow[] | null`
- `mapDatabaseAssetToAppAsset(row)` — maps one `EnrichedAssetRow` → `Asset`; id = `symbol.toLowerCase()` (matches local mock id format); fills chartData with placeholder sparkline
- `getMarketAssetsWithFallback()` — respects feature flag, falls back to `ALL_ASSETS` on any error; 4-level fallback cascade
- `getMarketDataSourceMode()` — reads `EXPO_PUBLIC_MARKET_DATA_SOURCE`; defaults to "local"

## hooks/useLiveAssets.ts — wiring
`useLiveAssets()` now checks `getMarketDataSourceMode()` on every render:
- "local" (default): reads `ALL_ASSETS` synchronously — identical to old behavior, zero overhead
- "supabase": uses module-level `_cachedAssets` / `_loadPromise` cache; fetches once per app session via `getMarketAssetsWithFallback()`; during initial load frame returns `ALL_ASSETS` as interim so no screen blanks
`useLiveAsset(id)` now calls `useLiveAssets()` internally and does `.find()` — works for both local and supabase assets.

**Why cache is module-level:** React state initializer reads it synchronously on re-mounts so there is no loading flash on screens that mount after the first load.

## Feature flag
Set `EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase` in env to activate Supabase market data.
Without this flag, `useLiveAssets` returns `ALL_ASSETS` immediately — Supabase is never queried.

## Screens affected when flag = "supabase"
All screens that call `useLiveAssets()` or `useLiveAsset(id)` automatically use Supabase data:
Market, Scanner, Asset Detail, Portfolio, Watchlist, Portfolio Coach, Journal, Home (index).
No screen-level changes needed.

## Screens NOT yet using the hook (still use ALL_ASSETS directly)
`useChallenges.ts` and `useTraderIdentity.ts` use `ALL_ASSETS.find()` for sport/type lookups on holdings/transactions. These work correctly because holdings are built with `symbol.toLowerCase()` ids that exist in both local and Supabase asset sets. No change needed for the current scope.

## Supabase DB counts (seeded)
sports 7, leagues 7, generic_teams 32, generic_player_roles 160, coach_roles 6, assets 208, asset_price_history 208, futures_markets 6, index_definitions 4, index_members 96.

## Dev tool — app/dev-market-db.tsx
Read-only sanity check screen. Shows:
- **Active Source Status** card: mode (local/supabase), `useLiveAssets.length`, and flag value
- "Run Supabase Market Check" button: row counts + index/team/player previews
- "Validate App Asset Mapping" section: per-row field validation + duplicate detection
