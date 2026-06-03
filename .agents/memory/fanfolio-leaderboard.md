---
name: Fanfolio leaderboard system
description: Architecture of the Better Leaderboards feature — categories, rival traders, user rank calculation, and screen layout.
---

## Categories (10)
Overall, Weekly, Diversified, Index, Meme, Scanner, Low Risk, XP, Active, Comeback — defined in `CATEGORIES` array in `data/mockLeaderboard.ts`.

## Rival Traders (10)
MarketMVP, IndexKing, ChaosTrader, DipBuyer, ClutchBull, RookieRocket, DefenseFund, ScannerQueen, DiamondFan, VolatilityVince — each has full `RivalStats` (12 numeric fields) + identity, lesson, strategy text.

## User rank calculation
`buildUserStats()` in `app/(tabs)/leaderboard.tsx` (not exported) computes all 12 stats from game state. Inline copy also in `app/profile.tsx`.
`buildLeaderboard(category, username, userStats)` sorts rivals by category stat, inserts user at correct position, returns ranked entries.
`getBestCategory(username, userStats)` runs all 10 categories and returns the one where the user ranks highest.

## Key stat formulas
- lowRiskScore = (10 - avgRisk) * 8 + diversificationScore * 0.3 + indexExposurePct * 0.2
- diversificationScore = uniqueSports*18 (cap 45) + uniqueTypes*15 (cap 40) + 15 if index held + 5 if meme < 30%
- scannerScore = flags (open_scanner=30, view_dip_watch=18, view_momentum=18, view_journal=15) + watchlist*5 (cap 19)

## Screen layout (app/(tabs)/leaderboard.tsx)
Fixed header with category FlatList → ScrollView body: user rank summary card → podium (top 3) → rank list rows (#4–10) → separated "Your Rank" if user outside top 10 → category education card → Compare Yourself bars → all-categories grid → disclaimer.
Rival detail modal: pageSheet presentation, shows all stats + risk bar + exposure bars + market lesson.

## Challenge flag
Sets `view_leaderboard` flag via `useEffect` on mount.

## Profile integration
`app/profile.tsx` shows a rank card (overall rank + best category) that links to the leaderboard screen.
