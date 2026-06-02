---
name: Fanfolio challenge system
description: Architecture and data flow for the Challenges & Achievements feature in Fanfolio.
---

## Key files
- `data/challenges.ts` — static definitions for CHALLENGES (17), ACHIEVEMENTS (10), LEVELS (7)
- `hooks/useChallenges.ts` — hook that computes live progress using useGame() + useLiveAssets()
- `app/challenges.tsx` — full challenges screen
- `context/GameContext.tsx` — holds xp, claimedChallenges, challengeFlags, lessonsOpened

## GameState additions
```ts
xp: number;
claimedChallenges: string[];  // IDs claimed (prevents re-claiming)
challengeFlags: string[];     // one-time action flags (open_scanner, view_journal, view_dip_watch, view_momentum)
lessonsOpened: number;        // count of lesson modal opens in Learn tab
```

## Context functions
- `setChallengeFlag(flagId)` — idempotent; called from scanner (mount + preset change), journal (mount)
- `addLessonOpen()` — increments lessonsOpened; called from learn.tsx onPress
- `claimChallengeReward(id, xp, lc)` — adds XP + LC, marks challenge claimed

## Challenge categories & IDs
- Getting Started: claim_daily, buy_first, add_watchlist, open_scanner, view_journal
- Portfolio Building: own_3_assets, three_sports, buy_index, low_avg_risk, own_5_assets
- Market Learning: simulate_3_events, use_coach, learn_3_lessons, sell_first
- Scanner & Watchlist: view_dip_watch, view_momentum, watch_3_assets

## Progress logic (non-obvious cases)
- `low_avg_risk`: requires holdings.length >= 2 AND weighted avg riskScore < 6
- `use_coach`: complete when appliedEvents.length > 0 (coach appears automatically after first event)
- `meme_coin_maniac` achievement: computed from unique meme coin buy assetIds >= 3 (NOT from challenge claim)
- `fanfolio_rookie` achievement: all 5 Getting Started challenges claimed

## Level XP thresholds
0 / 300 / 700 / 1300 / 2200 / 3500 / 5000

**Why:** Challenges total ~2900 XP, so completing all challenges reaches level 6 (Fanfolio Shark). Level 7 (Market MVP) requires repeated play or future challenge additions.
