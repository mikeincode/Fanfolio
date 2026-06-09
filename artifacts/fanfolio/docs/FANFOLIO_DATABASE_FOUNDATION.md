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
| `supabase/seed_fanfolio_market_v1.sql` | Seed: 30 teams, 40 roles, indexes, futures, meme coins |
| `data/databaseMarketTypes.ts` | TypeScript interfaces for all rows |
| `lib/marketRepository.ts` | Fetch/convert stub — falls back to local data |

---

## Tables

### Public reference tables (anon readable)

| Table | Purpose |
|---|---|
| `sports` | Top-level sport categories (Pro Football, MMA, etc.) |
| `leagues` | Sub-groupings within a sport |
| `generic_teams` | 30+ generic franchise entities — city names only, no mascots |
| `generic_player_roles` | Positional roles (QB1, TE1, Edge Rusher) — not real individuals |
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

- **Teams:** `Kansas City Football Team`, `Dallas Football Team`, `Philadelphia Football Team`
- **Player roles:** `Kansas City QB1`, `Dallas Edge Rusher`, `Las Vegas RB1`
- **Coaches:** `Offensive Mastermind Coach Stock`, `Defensive Architect Coach Stock`
- **Leagues:** `Pro Football League`, `Pro Basketball League`
- **Assets:** `Pro Football Power Index`, `Pro Football MVP Future`

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

| Category | Count |
|---|---|
| Sports | 7 |
| Leagues | 7 |
| Generic Pro Football teams | 30 (all 30 markets) |
| Player role rows | 40 (8 featured teams × 5 roles each) |
| Coach role rows | 6 |
| Sport index assets | 4 (PFPI, PBSI, MMACI, FF100) |
| Futures assets | 6 (MVP, Championship, COTY, OROTY, Comeback, MMA Champ) |
| Meme coin assets | 6 (CHOKE, DRAMA, UPSET, 4QC, KO, CMBC) |
| Seed price history rows | 16 |

Teams without player role seeds in v1 will be seeded in v2 (remaining 22 teams × 3–5 roles each).

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

## Safety Reminders

- LuckyCoin has no cash value.
- No real money, gambling, deposits, withdrawals, prizes, betting, odds, parlays, or financial advice.
- No real team names, player names, coach names, league marks, logos, or mascots in any public-facing column.
- The `private_entity_aliases` table is never exposed to the client app.
- All market data is simulated and educational only.
