---
name: Fanfolio routing conventions
description: Expo Router routing rules, onboarding gate, and Stack.Screen conventions for Fanfolio.
---

## Root redirect gate
`app/index.tsx` reads `hasCompletedOnboarding` from `useGame()` and renders `<Redirect>` to either `/onboarding` or `/(tabs)`. This is the ONLY place the onboarding gate lives. Do NOT put redirect logic in `_layout.tsx` — the old `RootRedirect` function was dead code that was removed.

**Why:** Without `app/index.tsx`, Expo Router had no root route and `RootRedirect` was defined but never rendered, so new users bypassed onboarding entirely.

## Stack.Screen conventions
All named routes must have an explicit `Stack.Screen` entry in `app/_layout.tsx` with `headerShown: false` (and `presentation: "card"` for push screens). Registered routes as of the audit:
- `index`, `onboarding`, `(tabs)`, `asset/[id]`, `profile`
- `news`, `journal`, `challenges`, `portfolio-coach`, `strategy-profile`

**Why:** Unregistered routes still work in Expo Router but get default options (e.g. native header shows). Explicit entries ensure consistent appearance.

## appliedEvents ordering
In `GameContext.tsx`, events are prepended: `[newEvent, ...state.appliedEvents]`. So `appliedEvents[0]` is always the MOST RECENT event. Using `appliedEvents[appliedEvents.length - 1]` is a bug that gets the oldest event.

## challenge flags
Flags are loose strings set via `setChallengeFlag(flag)`. Only flags listed in `useChallenges.ts` switch cases affect challenge progress. Extra flags (e.g. `view_news`) are harmless. Current checked flags: `open_scanner`, `view_journal`, `view_dip_watch`, `view_momentum`.

## marginLeft: "auto" as any
React Native's TypeScript types don't include `"auto"` for margin values, but it works at runtime on Expo SDK 50+ (RN 0.73+). The `as any` cast is the accepted workaround for this type gap — do not remove or refactor unless upgrading RN types.
