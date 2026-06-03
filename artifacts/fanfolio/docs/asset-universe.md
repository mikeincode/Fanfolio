# Fanfolio Asset Universe — Developer Notes

All data in Fanfolio is simulated and educational. LuckyCoin has no cash value.
No real money, gambling, sportsbook odds, or cash prizes are involved.

---

## Current Architecture

```
data/mockAssets.ts       ← Core asset type definitions + original 24 assets
data/assetUniverse.ts    ← 17 expanded assets + ALL_ASSETS + getAllAssetById
hooks/useLiveAssets.ts   ← Merges ALL_ASSETS with GameContext price overrides
```

All screens consume `useLiveAssets()` or `useLiveAsset(id)` — never import
`MOCK_ASSETS` or `ALL_ASSETS` directly in UI components.

---

## Asset Types

| Type         | Color     | Description                                              |
|--------------|-----------|----------------------------------------------------------|
| Team Stock   | Blue      | Simulated franchise value by win rate and fan engagement |
| Player Coin  | Purple    | Individual player performance metric coin                |
| Coach Stock  | Cyan      | Coaching staff season performance narrative              |
| Sport Index  | Green     | Basket of assets — lower individual risk                 |
| Meme Coin    | Orange    | Hype-driven, no fundamentals, high volatility            |
| Future       | Pink      | Season storyline outcome — settles at simulated end      |

---

## Futures in Fanfolio

Futures are **not** gambling, sportsbook odds, or real-money prediction markets.

They are simulated season assets that:
- Track an ongoing storyline (award race, championship run, comeback narrative)
- Rise and fall based on simulated performance updates
- Carry higher risk because they depend on a single outcome
- Settle in simulated LuckyCoin only at a defined season endpoint

**Educational value:** Futures teach how expectation-based markets move —
how traders price in probability before an outcome is known, how narratives
shift prices before stats confirm them, and why patience and position-sizing
matter in long-horizon plays.

---

## Plugging in Real Sports Data (Future Path)

When a real sports API is connected, the flow would be:

```
Sports API (stats, scores, rosters)
        │
        ▼
API Adapter (transforms raw stats → price inputs)
        │
        ▼
asset_prices table (Supabase, updated on schedule)
        │
        ▼
useLiveAssets() hook (reads latest prices, merges overrides)
        │
        ▼
All screens (Market, Scanner, Asset Detail, Portfolio Coach)
```

**User portfolios remain fully separate.** `user_game_state` in Supabase
stores holdings as `{ assetId, quantity, averageCost }`. The asset ID is the
bridge — no user data needs to change when real prices replace mock prices.

### Steps to connect real data:
1. Create `services/sportsApiAdapter.ts` — fetches from your chosen API,
   maps team/player stats to `{ price, dailyChangePercent, bullish, whyItMoved }`.
2. Run the adapter on a schedule (cron job, Supabase Edge Function, or
   background fetch) and write results to `asset_prices` table.
3. Update `useLiveAssets.ts` to fetch from `asset_prices` instead of
   the static `ALL_ASSETS` array — or keep the static array as fallback.
4. The `GameContext` price override system already handles real-time
   event-driven overrides — no changes needed there.

### Recommended sports APIs (check licensing before use):
- **MySportsFeeds** — historical + live stats, affordable tiers
- **SportsDataIO** — broad coverage, good NFL/NBA endpoints
- **The Sports DB** (free tier) — team/player metadata
- **Rapid API sports endpoints** — various providers, mixed quality

---

## Adding New Assets

1. Add the asset object to `data/assetUniverse.ts` in the appropriate array
   (or create a new thematic array like `NBA_TEAM_STOCKS`).
2. The asset automatically appears in Market, Scanner, Asset Detail, and
   Portfolio Coach — no screen changes needed unless the asset type is new.
3. If adding a **new AssetType**, update:
   - `AssetType` union in `data/mockAssets.ts`
   - `typeColor` records in `AssetCard.tsx`, `asset/[id].tsx`, `portfolio-coach.tsx`
   - Filter arrays in `market.tsx` (TABS/TAB_LABELS) and `scanner.tsx` (TYPE_FILTERS/TYPE_LABELS)
   - `typeLabel` switch in `scanner.tsx`

---

## Supabase Schema

Active tables (current): `user_profiles`, `user_game_state`
Future tables (commented in `supabase/schema.sql`): `sports`, `leagues`, `teams`,
`people`, `assets`, `asset_prices`, `index_components`, `futures_metadata`

Do **not** uncomment the future tables without running migrations carefully —
the active user save tables must not be disrupted.
