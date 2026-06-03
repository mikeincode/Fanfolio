---
name: Fanfolio stack conventions
description: Key patterns and constraints for the Fanfolio Expo app to stay consistent across sessions.
---

## Stack
- Expo Router (file-based routing), AsyncStorage persistence
- `useGame()` from `context/GameContext.tsx` — provides `holdings`, `transactions`, `luckyCoinBalance`, `watchlist`, `username`, `joinDate`, `appliedEvents`, `updateUsername`
- `useLiveAssets()` — live price-jittered array of `Asset` objects from `data/assetUniverse.ts` (ALL_ASSETS)
- `useColors()` from `hooks/useColors.ts` — exposes `colors.primary`, `colors.green`, `colors.red`, `colors.coin`, `colors.blue`, `colors.foreground`, `colors.mutedForeground`, `colors.card`, `colors.border`, `colors.background`, `colors.primaryForeground`, `colors.radius`
- `@expo/vector-icons` Feather icons throughout
- Components: `SparklineChart`, `CoinBadge`, `RiskBar`
- `getAllAssetById(id)` exported from `data/assetUniverse.ts` — use this everywhere, NOT `getAssetById` from `mockAssets.ts` (only covers legacy 24 assets)

## Route structure
- Tabs: `app/(tabs)/` — Home (index), Market, Scanner, Portfolio, Learn, Leaderboard (ranks)
- Stack routes: `app/profile.tsx`, `app/asset/[id].tsx`, `app/journal.tsx`
- `app/scanner.tsx` redirects to `/(tabs)/scanner`

## Safe language rules (enforced in all copy)
- Use: trade, buy, sell, asset, portfolio, journal, LuckyCoin, spent, received, simulated gain, simulated loss, no cash value
- Avoid: bet, wager, odds, parlay, payout, winnings, cash out, deposit, withdrawal, sportsbook

## Transaction interface
```ts
{ id, assetId, assetName, assetSymbol, type: "buy"|"sell", quantity, price, total, timestamp }
```
Transactions do NOT store asset type (Team Stock, etc.) — must look up via `getAllAssetById(assetId)` from `data/assetUniverse.ts`. Never use `getAssetById` from `mockAssets.ts` — it only covers the legacy 24 assets and misses the full universe.

## Pre-existing TS errors (don't fix unless asked)
- `SparklineChart` does not accept `color` prop (used in scanner.tsx + index.tsx scanner pick card)
- `useColors.ts` cast error on `radius` key — runtime safe, TS only
**Why:** These were introduced when adding the Scanner tab and scanner pick card; Metro bundles fine despite them.
