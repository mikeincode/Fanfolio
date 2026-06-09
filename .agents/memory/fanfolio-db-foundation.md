---
name: Fanfolio Database Foundation
description: Market schema, seed, TypeScript types, and repository stub. App still uses local data.
---

## Rule
App uses ALL_ASSETS (local) until `EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase` is set.
`getMarketDataSourceMode()` in lib/marketRepository.ts is the single gate.

## Schema file layout
- `supabase/fanfolio_market_schema.sql` — 13 tables, run separately from schema.sql
- `supabase/seed_fanfolio_market_v1.sql` — seed data, idempotent ON CONFLICT DO NOTHING
- `data/databaseMarketTypes.ts` — row interfaces + `dbAssetTypeToAppType()` converter
- `lib/marketRepository.ts` — stubs; `getMarketAssets()` is the future screen entry point

## Key design decisions
- `private_entity_aliases` has RLS enabled with NO anon read policy. Client app must never query it.
- All public_name columns use generic Fanfolio names only (no real IP).
- Seed uses deterministic UUIDs (30000000-... for teams, 40000000-... for roles, etc.) for predictable FK cross-references across seed file.
- `mapAssetRowToAppAsset()` fills chartData with a sine-wave placeholder; real history comes from asset_price_history in a future pass.
- Do NOT touch schema.sql (user_profiles / user_game_state) when adding new market tables.

**Why:** Foundation-first approach keeps app stable while schema matures.
