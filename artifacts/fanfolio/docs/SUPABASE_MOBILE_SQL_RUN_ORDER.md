# Supabase Mobile SQL Run Order

Run all chunks from `supabase/mobile_chunks/` in the exact numbered order below using
**Supabase Dashboard → SQL Editor → New Query → paste → Run**.

Each chunk is self-contained. No chunk starts or ends in the middle of a statement.

---

## Step 1 — Run schema chunks (001–006) in order

Run each file separately. Wait for success before continuing.

| File | What it creates |
|------|----------------|
| `001_extensions_and_helpers.sql` | `set_updated_at()` trigger function |
| `002_core_reference_tables.sql` | `sports`, `leagues`, `generic_teams`, `generic_player_roles`, `coach_roles` |
| `003_asset_enums_and_asset_tables.sql` | 3 asset enums + `assets`, `asset_price_history` |
| `004_indexes_futures_pulses.sql` | `index_definitions`, `index_members`, 2 future enums, `futures_markets`, `market_pulses`, `market_pulse_impacts`, `private_entity_aliases` |
| `005_rls_and_policies.sql` | All RLS enablement + all anon-read policies |
| `006_comments.sql` | Table documentation comments |

---

## Step 2 — Run seed chunks (101–105) in order

Run each file separately. Wait for success before continuing.

| File | What it inserts |
|------|----------------|
| `101_seed_sports_leagues_teams.sql` | 7 sports, 7 leagues, 32 generic teams |
| `102_seed_player_roles.sql` | 160 player roles (32 teams × 5) + 6 coach roles |
| `103_seed_assets.sql` | 208 assets (32 team stocks + 160 player coins + 4 indexes + 6 futures + 6 meme coins) |
| `104_seed_indexes_futures_pulses.sql` | 6 futures market definitions |
| `105_seed_price_history.sql` | Initial seed price row for each asset (208 rows) |

> **Note:** `index_definitions`, `index_members`, `market_pulses`, and `market_pulse_impacts`
> are intentionally empty after seeding. They are populated by the app at runtime.

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
| index_definitions | 0 |
| index_members | 0 |
| futures_markets | 6 |
| market_pulses | 0 |
| market_pulse_impacts | 0 |
| private_entity_aliases | 0 |

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
- All seed chunks (101–104) use `INSERT ... ON CONFLICT DO NOTHING` and are idempotent.
- Seed chunk 105 is append-only (no unique constraint on price history) — run once.
- All 5 enum blocks use `DO $$ BEGIN ... EXCEPTION WHEN duplicate_object THEN null; END $$;`
  and are safe to re-run.
