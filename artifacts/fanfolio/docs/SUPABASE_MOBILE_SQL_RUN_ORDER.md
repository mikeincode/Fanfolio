# Supabase Mobile SQL Run Order

Run all chunks from `supabase/mobile_chunks/` in the exact numbered order below using
**Supabase Dashboard → SQL Editor → New Query → paste → Run**.

Each chunk is self-contained. Every file starts with a complete INSERT statement
and ends with a semicolon. No file starts or ends mid-statement.

---

## Step 1 — Run schema chunks (001–006) in order

| File | What it creates |
|------|----------------|
| `001_extensions_and_helpers.sql` | `set_updated_at()` trigger function |
| `002_core_reference_tables.sql` | `sports`, `leagues`, `generic_teams`, `generic_player_roles`, `coach_roles` |
| `003_asset_enums_and_asset_tables.sql` | 3 asset enums + `assets`, `asset_price_history` |
| `004_indexes_futures_pulses.sql` | `index_definitions`, `index_members`, 2 future enums, `futures_markets`, `market_pulses`, `market_pulse_impacts`, `private_entity_aliases` |
| `005_rls_and_policies.sql` | All RLS enablement + all anon-read policies |
| `006_comments.sql` | Table documentation comments |

---

## Step 2 — Run seed chunks in order

### 2a — Sports, leagues, teams

| File | Rows |
|------|------|
| `101_seed_sports_leagues_teams.sql` | 7 sports + 7 leagues + 32 teams |

### 2b — Player roles (split into 4 files + coach roles)

Run all five files. Each is independently runnable.

| File | Teams | Rows |
|------|-------|------|
| `102a_seed_player_roles_teams_1_to_8.sql` | Kansas City, Baltimore, Detroit, Dallas, San Francisco, Buffalo, Philadelphia, Las Vegas | 40 roles |
| `102b_seed_player_roles_teams_9_to_16.sql` | Arizona, Atlanta, Carolina, Chicago, Cincinnati, Cleveland, Denver, Green Bay | 40 roles |
| `102c_seed_player_roles_teams_17_to_24.sql` | Houston, Indianapolis, Jacksonville, Los Angeles A, Los Angeles B, Miami, Minnesota, New England | 40 roles |
| `102d_seed_player_roles_teams_25_to_32.sql` | New Orleans, New York A, New York B, Pittsburgh, Seattle, Tampa Bay, Tennessee, Washington | 40 roles |
| `102e_seed_coach_roles.sql` | 3 global archetypes + 3 featured coaches | 6 roles |

**Total after 102a–102e:** 160 player roles + 6 coach roles

### 2c — Team stock assets

| File | Rows |
|------|------|
| `103a_seed_team_stock_assets.sql` | 32 team stocks (one per franchise) |

### 2d — Player coin assets (split into 4 files)

Run all four files. Each is independently runnable. Must run after 102a–102d and 103a.

| File | Teams | Rows |
|------|-------|------|
| `103b_seed_player_coin_assets_teams_1_to_8.sql` | Kansas City, Baltimore, Detroit, Dallas, San Francisco, Buffalo, Philadelphia, Las Vegas | 40 coins |
| `103c_seed_player_coin_assets_teams_9_to_16.sql` | Arizona, Atlanta, Carolina, Chicago, Cincinnati, Cleveland, Denver, Green Bay | 40 coins |
| `103d_seed_player_coin_assets_teams_17_to_24.sql` | Houston, Indianapolis, Jacksonville, Los Angeles A, Los Angeles B, Miami, Minnesota, New England | 40 coins |
| `103e_seed_player_coin_assets_teams_25_to_32.sql` | New Orleans, New York A, New York B, Pittsburgh, Seattle, Tampa Bay, Tennessee, Washington | 40 coins |

**Total after 103b–103e:** 160 player coins

### 2e — Sport index, futures, and meme coin assets

| File | Rows |
|------|------|
| `103f_seed_coach_index_future_meme_assets.sql` | 4 sport indexes + 6 futures + 6 meme coins = 16 assets |

**Total assets after 103a–103f:** 32 + 160 + 16 = **208 assets**

### 2f — Futures market definitions

| File | Rows |
|------|------|
| `104_seed_indexes_futures_pulses.sql` | 6 futures market definitions |

### 2f-b — Index definitions and index members

| File | Rows |
|------|------|
| `104b_seed_index_definitions_and_members.sql` | 4 index definitions + 96 index members |

Indexes seeded:

| Symbol | Name | Members | Weighting |
|--------|------|---------|-----------|
| PFPI | Pro Football Power Index | 32 team stocks @ 3.0 % each | equal |
| PBSI | Pro Basketball Stars Index | 8 featured QB1 coins @ 12.5 % each* | equal |
| MMACI | MMA Chaos Index | MMACHAMP future (40 %) + KO/DRAMA/UPSET memes | market_cap |
| FF100 | Fanfolio 100 | 32 stocks + 8 QB1 coins + 6 memes + 6 futures | equal |

\* No basketball-specific assets exist in the v1 seed. PBSI is bootstrapped with the 8 featured-team QB1 player coins as "top-tier star player" proxies until basketball assets are added.

### 2g — Price history

| File | Rows |
|------|------|
| `105_seed_price_history.sql` | 208 seed price rows (one per asset) |

> **Note:** `market_pulses` and `market_pulse_impacts` are intentionally empty after seeding.
> `index_definitions` and `index_members` are now seeded in chunk `104b`.

---

## Step 3 — Run the count check

Run `999_count_check.sql`.

Expected results after a clean seed:

| Table | Expected rows |
|-------|--------------|
| sports | 7 |
| leagues | 7 |
| generic_teams | 32 |
| generic_player_roles | 160 |
| coach_roles | 6 |
| assets | 208 |
| asset_price_history | 208 |
| index_definitions | 4 |
| index_members | 96 |
| futures_markets | 6 |
| market_pulses | 0 |
| market_pulse_impacts | 0 |
| private_entity_aliases | 0 |

---

## Complete run order (quick reference)

```
001  002  003  004  005  006
101
102a  102b  102c  102d  102e
103a
103b  103c  103d  103e  103f
104  104b  105
999 (count check)
```

---

## If a chunk fails

1. Screenshot the full error message including the line number.
2. **Do not run the next chunk.** Fix the problem first.
3. All chunks use `CREATE TABLE IF NOT EXISTS`, `CREATE INDEX IF NOT EXISTS`,
   `DROP POLICY IF EXISTS`, and `INSERT ... ON CONFLICT DO NOTHING` — they are safe
   to re-run after fixing an error.
4. Exception: `105_seed_price_history.sql` does **not** use ON CONFLICT because
   `asset_price_history` has no unique constraint. Running it twice adds duplicate
   seed rows, which is harmless but avoidable — prefer running it only once.

---

## Idempotency notes

- All schema chunks (001–006) are fully idempotent and safe to re-run.
- All seed chunks (101–103f) use `INSERT ... ON CONFLICT DO NOTHING` and are idempotent.
- Seed chunk 105 is append-only (no unique constraint on price history) — run once.
- All 5 enum blocks use `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`
  and are safe to re-run.

---

## File inventory

| # | File | Lines | Purpose |
|---|------|-------|---------|
| 1 | `001_extensions_and_helpers.sql` | ~15 | Helper function |
| 2 | `002_core_reference_tables.sql` | ~78 | 5 core tables |
| 3 | `003_asset_enums_and_asset_tables.sql` | ~101 | 3 enums + 2 asset tables |
| 4 | `004_indexes_futures_pulses.sql` | ~122 | 2 enums + 6 tables |
| 5 | `005_rls_and_policies.sql` | ~97 | All RLS + policies |
| 6 | `006_comments.sql` | ~42 | Table comments |
| 7 | `101_seed_sports_leagues_teams.sql` | ~97 | 46 rows |
| 8 | `102a_seed_player_roles_teams_1_to_8.sql` | ~108 | 40 player roles |
| 9 | `102b_seed_player_roles_teams_9_to_16.sql` | ~96 | 40 player roles |
| 10 | `102c_seed_player_roles_teams_17_to_24.sql` | ~96 | 40 player roles |
| 11 | `102d_seed_player_roles_teams_25_to_32.sql` | ~96 | 40 player roles |
| 12 | `102e_seed_coach_roles.sql` | ~20 | 6 coach roles |
| 13 | `103a_seed_team_stock_assets.sql` | ~209 | 32 team stocks |
| 14 | `103b_seed_player_coin_assets_teams_1_to_8.sql` | ~279 | 40 player coins |
| 15 | `103c_seed_player_coin_assets_teams_9_to_16.sql` | ~167 | 40 player coins |
| 16 | `103d_seed_player_coin_assets_teams_17_to_24.sql` | ~152 | 40 player coins |
| 17 | `103e_seed_player_coin_assets_teams_25_to_32.sql` | ~152 | 40 player coins |
| 18 | `103f_seed_coach_index_future_meme_assets.sql` | ~178 | 16 other assets |
| 19 | `104_seed_indexes_futures_pulses.sql` | ~47 | 6 futures markets |
| 20 | `105_seed_price_history.sql` | ~271 | 208 price rows |
| 21 | `999_count_check.sql` | ~46 | Verify all counts |
