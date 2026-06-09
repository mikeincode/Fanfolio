# Fanfolio Database Foundation v1

## Overview

This document describes the Fanfolio market database layer — a scalable Supabase foundation designed to sit alongside the existing local mock data system. **The app currently uses local mock data.** The database layer is ready but not yet wired as the live data source.

---

## Current State

| Layer | Status | Source |
|---|---|---|
| User saves / game state | Live | Supabase `user_game_state` |
| Market assets | Local mock | `data/assetUniverse.ts` + `data/mockAssets.ts` |
| Market events / pulses | Local mock | `data/mockMarketEvents.ts` |
| Market news | Local mock | `data/mockNews.ts` |
| Market source stories | Local mock | `data/marketSources.ts` |

The new database tables (`sports`, `leagues`, `generic_teams`, `assets`, etc.) are ready to be created in Supabase, but the app continues to read from local files until the switch is made deliberately.

---

## Files Created

| File | Purpose |
|---|---|
| `supabase/fanfolio_market_schema.sql` | Schema: 13 tables with RLS |
| `supabase/seed_fanfolio_market_v1.sql` | Seed: 32 teams, 160 roles, 32 team stocks, 160 player coins, indexes, futures, meme coins |
| `data/databaseMarketTypes.ts` | TypeScript interfaces for all rows |
| `lib/marketRepository.ts` | Fetch/convert stub — falls back to local data |

---

## Tables

### Public reference tables (anon readable)

| Table | Purpose |
|---|---|
| `sports` | Top-level sport categories (Pro Football, MMA, etc.) |
| `leagues` | Sub-groupings within a sport |
| `generic_teams` | 32 generic franchise entities — city names only, no mascots |
| `generic_player_roles` | Positional roles (QB1, WR1, Edge Rusher) — not real individuals |
| `coach_roles` | Coaching archetypes — not real coaches |
| `assets` | Core tradeable asset registry |
| `asset_price_history` | Append-only simulated price log |
| `index_definitions` | Metadata for index-type assets |
| `index_members` | Composition weights for each index |
| `futures_markets` | Settlement rules for future-type assets |
| `market_pulses` | Simulated market event summaries |
| `market_pulse_impacts` | Per-asset impact records per pulse |

### Private table (no anon access)

| Table | Purpose |
|---|---|
| `private_entity_aliases` | Backend-only mapping from real-world entity names to generic Fanfolio names |

---

## Naming and IP Safety

All public-facing names follow the Fanfolio generic naming convention:

- **Teams:** `Kansas City Football Team`, `Dallas Football Team`, `Los Angeles Football Team A`
- **Player roles:** `Kansas City QB1`, `Dallas Edge Rusher`, `Los Angeles A QB1`
- **Coaches:** `Offensive Mastermind Coach Stock`, `Defensive Architect Coach Stock`
- **Leagues:** `Pro Football League`, `Pro Basketball League`
- **Assets:** `Pro Football Power Index`, `Pro Football MVP Future`
- **Duplicate markets:** `Los Angeles Football Team A / B`, `New York Football Team A / B`

**No real team names, player names, coach names, mascots, logos, official marks, or licensed branding appear in any public-facing column.**

---

## The Private Entity Alias System

The `private_entity_aliases` table exists for a future backend feature: mapping real-world entity names (as they appear in live sports news APIs) into generic Fanfolio names.

**How it works:**
1. A live news article is ingested by a backend worker.
2. The worker extracts entity mentions (player names, team names, etc.).
3. It looks up each entity in `private_entity_aliases` to find the corresponding generic Fanfolio asset.
4. The market pulse is created using the **generic Fanfolio name** — the real name never reaches the client app.

**Security:** RLS is enabled on this table with no anon read policy. Only service-role / backend workers can access it. The client app must never query this table.

---

## Seed Coverage (v1)

| Category | Count | Notes |
|---|---|---|
| Sports | 7 | Pro Football, Basketball, Baseball, Hockey, Soccer, MMA, College |
| Leagues | 7 | One per sport |
| Generic Pro Football teams | 32 | All 32 markets; duplicate cities use A/B suffix |
| Player role rows | 160 | 32 teams × 5 roles each (QB1, WR1, RB1, Edge Rusher, LB1) |
| Coach role rows | 6 | 3 global archetypes + 3 featured-team coaches |
| Team stock assets | 32 | One per Pro Football team (symbol: `{PREFIX}FT`) |
| Player coin assets | 160 | One per player role (symbol: e.g. `KCQB1`, `LAAQB1`) |
| Sport index assets | 4 | PFPI, PBSI, MMACI, FF100 |
| Futures assets | 6 | MVP, Championship, COTY, OROTY, Comeback, MMA Champ |
| Meme coin assets | 6 | CHOKE, DRAMA, UPSET, 4QC, KO, CMBC |
| Seed price history rows | ~208 | All seeded assets get an initial price row |

### Player Role Standard Set

Every team has exactly 5 player roles seeded. The 8 originally-featured teams retain their legacy role assignments (some include TE1, CB1, DL1 for variety). The remaining 24 teams use the standard minimum set:

| Role | Position Group | Symbol Suffix |
|---|---|---|
| QB1 | Quarterback | `QB1` |
| WR1 | Wide Receiver | `WR1` |
| RB1 | Running Back | `RB1` |
| Edge Rusher | Defensive End | `ER1` |
| LB1 | Linebacker | `LB1` |

### Duplicate-Market Symbol Convention

| Market | Team Stock | QB1 Coin | WR1 Coin |
|---|---|---|---|
| Los Angeles A | `LAAFT` | `LAAQB1` | `LAAWR1` |
| Los Angeles B | `LABFT` | `LABQB1` | `LABWR1` |
| New York A | `NYAFT` | `NYAQB1` | `NYAWR1` |
| New York B | `NYBFT` | `NYBQB1` | `NYBWR1` |

---

## How to Run the SQL Files

**Step 1 — Create tables:**
1. Open [Supabase Dashboard](https://app.supabase.com) → Your Project → SQL Editor
2. Paste the contents of `supabase/fanfolio_market_schema.sql`
3. Click **Run**

**Step 2 — Seed data:**
1. In the same SQL Editor, paste `supabase/seed_fanfolio_market_v1.sql`
2. Click **Run**

Both files are idempotent (`IF NOT EXISTS`, `ON CONFLICT DO NOTHING`) — safe to re-run.

> **Note on price history:** The `asset_price_history` table is append-only and has no unique constraint on `(asset_id, source_type)`. Re-running the seed adds duplicate price history rows, which is harmless since the table is additive by design.

**The app is not affected** until you explicitly set `EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase` and update the screens to call `getMarketAssets()` from `lib/marketRepository.ts`.

---

## How to Switch the App to Supabase Data

When the market tables are populated and you are ready to migrate:

1. Set `EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase` in `artifacts/fanfolio/.env`
2. In each screen that imports `ALL_ASSETS` directly, replace with:
   ```ts
   import { getMarketAssets } from "@/lib/marketRepository";
   // ...
   const assets = await getMarketAssets();
   ```
3. `getMarketAssets()` falls back to `ALL_ASSETS` if Supabase is unreachable — the app will not break.

---

## RLS Summary

| Table | Anon Read | Auth Write |
|---|---|---|
| `sports` | ✅ Yes | ❌ No (admin only) |
| `leagues` | ✅ Yes | ❌ No |
| `generic_teams` | ✅ Yes | ❌ No |
| `generic_player_roles` | ✅ Yes | ❌ No |
| `coach_roles` | ✅ Yes | ❌ No |
| `assets` | ✅ Active only | ❌ No |
| `asset_price_history` | ✅ Yes | ❌ No |
| `index_definitions` | ✅ Yes | ❌ No |
| `index_members` | ✅ Yes | ❌ No |
| `futures_markets` | ✅ Yes | ❌ No |
| `market_pulses` | ✅ Yes | ❌ No |
| `market_pulse_impacts` | ✅ Yes | ❌ No |
| `private_entity_aliases` | 🔒 None | 🔒 Service role only |

---

## Seed Verification Record (v1 — June 2026)

A full seed verification pass was completed. All tables, enums, IDs, symbols, and
price history rows were audited. Three bugs were found and repaired.

### Verified Clean

| Check | Result |
|---|---|
| All 32 generic Pro Football teams present with correct A/B suffixes | ✅ |
| All 160 player role rows present (32 teams × 5 roles each) | ✅ |
| All 160 player coin assets present with correct UUIDs and FK links | ✅ |
| All 32 team stock assets present with correct symbol pattern (`{PREFIX}FT`) | ✅ |
| All 4 index assets present (`PFPI`, `PBSI`, `MMACI`, `FF100`) | ✅ |
| All 6 futures assets present | ✅ (after repair — see below) |
| All 6 meme coin assets present | ✅ |
| All seed price history rows present (~208 rows) | ✅ |
| `futures_markets` rows reference correct asset UUIDs | ✅ |
| `on conflict` clauses on all insert blocks | ✅ |
| No real names in any public-facing column | ✅ |
| RLS policies match schema | ✅ |
| `databaseMarketTypes.ts` `DbAssetType` union matches `asset_type_enum` | ✅ |

### Bugs Repaired

**Bug 1 — Cyrillic characters in NYB Edge Rusher `asset_symbol`**
- `generic_player_roles` row for New York B Edge Rusher had `asset_symbol = 'NYBЕР1'`
  where 'Е' (U+0415) and 'Р' (U+0420) were Cyrillic characters, not ASCII.
- The corresponding player_coin asset correctly used ASCII `'NYBER1'`, creating a
  symbol mismatch that would break the role ↔ coin link on insert.
- **Fixed:** `'NYBЕР1'` → `'NYBER1'` in `generic_player_roles` insert.

**Bug 2 — `PFCHAMP` used invalid `asset_type` enum value `'championship'`**
- `'championship'` is a valid value in `future_type_enum` (for the `futures_markets`
  table) but is **not** in `asset_type_enum` (for the `assets` table).
- **Fixed:** `'championship'` → `'season_future'` for the `PFCHAMP` asset row.

**Bug 3 — `PFCPOY` used invalid `asset_type` enum value `'comeback'`**
- `'comeback'` does not exist in `asset_type_enum` at all.
- **Fixed:** `'comeback'` → `'award_future'` for the `PFCPOY` asset row.

---

## Safety Reminders

- LuckyCoin has no cash value.
- No real money, gambling, deposits, withdrawals, prizes, betting, odds, parlays, or financial advice.
- No real team names, player names, coach names, league marks, logos, or mascots in any public-facing column.
- The `private_entity_aliases` table is never exposed to the client app.
- All market data is simulated and educational only.
