# Fanfolio Beta RC Checklist & Tester Instructions

> Build tag: **beta-rc1**
> Last updated: June 2026
> Stack: Expo ~54 · React Native 0.81.5 · Expo Router · Supabase JS v2

---

## 1. Current App Status

Fanfolio is a fake-money educational sports market simulator. Players trade simulated assets using **LuckyCoin (LC)** — a fictional in-app currency with no cash value, no real-money conversion, no gambling, and no payout of any kind.

### What is live and working

| Area | Status |
|---|---|
| Onboarding flow | Complete |
| Home tab (market pulse, coach, watchlist, top movers) | Complete |
| Market tab (208 assets, search, filter by type/sport) | Complete |
| Scanner tab (dip watch, momentum, smart picks) | Complete |
| Portfolio tab (holdings, P&L, stale-save handling) | Complete |
| Learn tab (lesson modals, educational tips) | Complete |
| Leaderboard tab (simulated rankings, diversification score) | Complete |
| Asset detail screen (price, sparkline, trade, watchlist, news) | Complete |
| Index basket display (Sport Index assets only) | Complete |
| Index basket member rows — tappable, navigate to member | Complete |
| Journal (trade history, filters, asset lookup) | Complete |
| Challenges & Achievements (17 challenges, 10 achievements, 7 levels) | Complete |
| Performance screen (top holding, top mover, P&L chart) | Complete |
| Strategy Profile (trader identity) | Complete |
| Rookie Playbook | Complete |
| Portfolio Coach | Complete |
| Profile screen (stats, rank, username) | Complete |
| Settings (haptics, educational tips, theme) | Complete |
| Cloud Save (manual export/import of game state) | Complete |
| Tally feedback form (web popup + native link fallback) | Complete |
| Supabase market mode (208 live assets) | Complete |
| Local mock mode (offline fallback, 200+ assets) | Complete |
| Dev tools (dev-market-db, dev-reset) | Present — not visible to testers |

### Sport Index baskets (Supabase mode)

| Index | Members | Total Weight |
|---|---|---|
| Fanfolio 100 | 52 | 100.000% |
| Pro Football Power Index | 32 | 100.000% |
| Featured Player Stars Index | 8 | 100.000% |
| MMA Chaos Index | 4 | 100.000% |

---

## 2. Required Replit Secrets

All five environment variables must be set in Replit **Secrets** before running. Do not hardcode values in files.

| Secret name | Purpose | Status |
|---|---|---|
| `EXPO_PUBLIC_SUPABASE_URL` | Supabase project API URL | Set |
| `EXPO_PUBLIC_SUPABASE_ANON_KEY` | Supabase public anon key (safe to expose on client) | Set |
| `EXPO_PUBLIC_MARKET_DATA_SOURCE` | Set to `supabase` for live data, omit or `local` for mock | Set to `supabase` |
| `EXPO_PUBLIC_TALLY_FEEDBACK_URL` | Tally embed URL for the feedback form | Set |
| `EXPO_PUBLIC_TALLY_FORM_ID` | Tally form ID (used by the web popup API) | Set |

**Important:** `EXPO_PUBLIC_` variables are baked at Metro bundle time — changing them requires restarting the Expo workflow, not just reloading the app.

---

## 3. Supabase Setup Status

- Project URL: `https://kujitsedvebdkkhlohra.supabase.co`
- Auth: anon key (read-only RLS policies on all market tables)
- Client: `lib/supabase.ts` — uses AsyncStorage for session persistence; guards every query with `if (!supabase) return`

### Seeded table counts

| Table | Rows |
|---|---|
| sports | 7 |
| leagues | 7 |
| generic_teams | 32 |
| generic_player_roles | 160 |
| coach_roles | 6 |
| assets | 208 |
| asset_price_history | 208 |
| futures_markets | 6 |
| index_definitions | 4 |
| index_members | 96 |

### What Supabase mode changes vs. local mode

- Asset list is fetched from the `assets` table (208 rows) instead of the local mock catalog
- Sport Index detail screens load the "What's inside this index?" basket section from `index_definitions` + `index_members` + `assets`
- All asset IDs remain `symbol.toLowerCase()` — save data is compatible across modes
- `private_entity_aliases` is never queried

---

## 4. Tally Feedback Status

- Form ID: `pbzN5J`
- Build tag sent with every submission: `beta-rc1`
- Hidden fields: `build`, `source`, `screen`, `username`
- **Web** (Expo web preview): Tally popup opens via `Tally.openPopup()` after lazy-loading the Tally embed script
- **Native / fallback**: opens the form URL via `Linking.openURL()`
- If env vars are missing: dev-only alert in `__DEV__`, no crash in production

Feedback buttons are accessible from the profile screen and settings screen.

---

## 5. How to Run — Local Mode

Local mode uses the built-in mock asset catalog (~200+ assets). No Supabase connection is made.

1. In Replit Secrets, either remove `EXPO_PUBLIC_MARKET_DATA_SOURCE` or set it to `local`
2. Restart the `expo` workflow (Metro must rebundle)
3. Open the Fanfolio preview
4. The app loads immediately with mock data — no network calls for market data
5. Index basket sections on Sport Index screens show: "Basket details are available when the market database is active."

---

## 6. How to Run — Supabase Mode

1. Confirm all five Replit Secrets are set (see Section 2)
2. Confirm `EXPO_PUBLIC_MARKET_DATA_SOURCE` is set to `supabase`
3. Restart the `expo` workflow
4. Open the Fanfolio preview
5. On first load, assets are fetched from Supabase (one request per app session, then cached)
6. Sport Index detail screens show the full "What's inside this index?" basket table with tappable member rows

To verify Supabase is active: open the Fanfolio 100 asset detail page and confirm the basket section shows "52 assets" in the pill badge.

---

## 7. Manual Smoke Test Checklist

Run through each item before handing off to testers. Check off anything that fails.

### Startup & Onboarding

- [ ] App loads without white screen or crash
- [ ] Onboarding flow completes and saves username
- [ ] Home screen renders market pulse card and watchlist

### Market & Assets

- [ ] Market tab loads all assets (should show 208 in Supabase mode)
- [ ] Search filters assets by name and symbol
- [ ] Type filter (Team Stock, Player Coin, etc.) works
- [ ] Sport filter works
- [ ] Tapping any asset opens the detail screen
- [ ] Asset detail shows price, sparkline, risk bar, and type badge
- [ ] Buying an asset deducts LuckyCoin balance correctly
- [ ] Selling an asset adds LuckyCoin balance correctly
- [ ] Watchlist toggle works and persists after navigation

### Sport Index Baskets (Supabase mode)

- [ ] Opening Fanfolio 100 shows "52 assets" in basket header pill
- [ ] Opening Fanfolio 100 shows "Showing top 10 of 52 members" footer
- [ ] Opening Pro Football Power Index shows "32 assets"
- [ ] Opening Featured Player Stars Index shows "8 assets" and all 8 rows visible
- [ ] Opening MMA Chaos Index shows "4 assets" and all 4 rows visible
- [ ] All four indexes show "100.0% total weight" in the weight pill
- [ ] Tapping a basket member row navigates to that member's asset detail screen
- [ ] Back button from member detail returns to the index detail screen
- [ ] A member row with a valid symbol shows a chevron-right icon
- [ ] Opening a non-index asset (e.g. a Team Stock) shows no basket section

### Portfolio & Journal

- [ ] Portfolio tab shows holdings and total value
- [ ] Selling all of an asset removes it from holdings
- [ ] Journal shows all trades with correct type (buy/sell) and asset name
- [ ] Journal filters by asset type
- [ ] Performance screen shows top holding and top mover

### Challenges & Progression

- [ ] Challenges screen loads and shows progress
- [ ] Buying first asset marks "First Buy" challenge as claimable
- [ ] Claiming a challenge reward adds XP and LuckyCoin
- [ ] Level badge updates after XP gain

### Learn & Coach

- [ ] Learn tab loads lesson cards
- [ ] Opening a lesson modal counts toward "Learn 3 Lessons" challenge
- [ ] Portfolio Coach screen opens
- [ ] Rookie Playbook screen opens

### Market Events

- [ ] Triggering a market pulse event from Home changes asset prices
- [ ] Event result modal shows simulated gain/loss (not real money language)

### Feedback Form

- [ ] Feedback button in Settings opens the Tally form (popup on web, link on native)
- [ ] Feedback button in Profile opens the Tally form

### Local Mode Fallback

- [ ] Switching to local mode: basket section shows informational fallback card (no crash)
- [ ] All tabs load and trade correctly in local mode
- [ ] No Supabase network calls are made when in local mode

---

## 8. Beta Tester Mission Checklist

Share this with testers. Each mission is a self-contained task.

### Mission 1 — First Trade
1. Complete onboarding and set a trader name
2. Open the Market tab
3. Find any Team Stock and buy 5 shares
4. Open your Portfolio and confirm the holding appears
5. Open the Journal and confirm the buy transaction is recorded

### Mission 2 — Index Explorer
1. Open the Market tab and filter by type "Sport Index"
2. Open **Fanfolio 100**
3. Scroll to "What's inside this index?"
4. Confirm you can see the basket members with weight percentages
5. Tap any basket member row — confirm it opens that asset's detail screen
6. Go back. Tap a different member row.

### Mission 3 — Build a Diversified Portfolio
1. Buy at least one asset from three different sports
2. Open the Scanner tab and check Dip Watch
3. Open the Portfolio Coach screen
4. Open Challenges and claim the "Three Sports" challenge reward

### Mission 4 — Market Event
1. On the Home screen, tap the Daily Market Pulse card
2. Apply an event and read the result
3. Check how your portfolio value changed in the Portfolio tab

### Mission 5 — Feedback
1. Open Settings
2. Tap "Send Feedback"
3. Fill in at least one field and submit
4. Confirm the form closes after submission

---

## 9. Known Limitations

| Limitation | Detail |
|---|---|
| Prices are simulated | Prices jitter randomly — they are not real market data |
| No real-time sync | Price changes from another session are not reflected without a full reload |
| Basket capped at top 10 | Sport Index baskets with > 10 members show only the top 10 by weight. Full count is shown in the header pill. |
| Chart data is placeholder | Sparklines use seeded random data — not historical prices |
| Cloud save is manual | Game state must be manually exported/imported. There is no automatic cloud sync. |
| Web-first preview | The Replit preview runs as Expo Web. Native iOS/Android distribution is not part of this beta. |
| Two pre-existing TypeScript warnings | `SparklineChart` does not accept a `color` prop (scanner + home screen). `useColors.ts` has a cast on the `radius` key. Both are runtime-safe. |
| Supabase anon key is public | By design — Supabase RLS policies restrict all writes. Do not grant write permissions to the anon role. |

---

## 10. No Real Money / No Gambling Disclaimer

**Fanfolio uses fictional LuckyCoin (LC) currency only.**

- LuckyCoin has no cash value
- LuckyCoin cannot be purchased, withdrawn, or converted to real money
- There are no real prizes, no deposits, no withdrawals
- There is no gambling, betting, wagering, odds, parlays, or payouts
- No official team names, player names, league marks, or real sports betting data are used
- All asset names, symbols, prices, and events are simulated and fictional
- The app is for educational entertainment purposes only

All copy in the app must avoid: bet, wager, odds, parlay, payout, winnings, cash out, deposit, withdrawal, sportsbook. Use instead: trade, buy, sell, portfolio, simulated gain, simulated loss, LuckyCoin.

---

## 11. What Not to Change Before Beta

These items must remain frozen until after beta testing is complete and findings are reviewed.

| Item | Why it must not change |
|---|---|
| `GameState` shape in `GameContext.tsx` | Cloud save compatibility — any shape change breaks existing exported saves |
| Asset IDs (`symbol.toLowerCase()`) | Save data links holdings/watchlist/transactions to asset IDs — changing the convention corrupts existing saves |
| Supabase table schema | The `assets`, `index_definitions`, `index_members` tables must not be altered — the app queries are tied to their column names |
| Replit Secret names | Any rename breaks all env var reads at Metro bundle time |
| `EXPO_PUBLIC_MARKET_DATA_SOURCE` value | Changing this requires a Metro rebundle and re-test of both modes |
| Build tag `beta-rc1` in `lib/feedback.ts` | Used to tag all Tally submissions — change only when cutting a new build |
| Dev screen routes (`/dev-market-db`, `/dev-reset`) | Leave in place — they are not linked from the main nav and are safe to keep for the beta period |
