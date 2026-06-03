---
name: Fanfolio Rookie Playbook
description: Implementation notes for the Rookie Playbook beginner feature — flags, step detection, ordering gotcha.
---

## Flag storage
New "view" flags are stored in the existing `challengeFlags: string[]` array via `setChallengeFlag()`.
- `"hasViewedPortfolio"` — set on mount of `app/(tabs)/portfolio.tsx`
- `"hasViewedPerformance"` — set on mount of `app/performance.tsx`
- `"rookiePlaybookDismissed"` — set when user taps X on the home card

No new GameState fields were added, so saveHealth and cloudSaveUtils needed zero changes. Old saves load safely because `challengeFlags` already defaults to `[]`.

## Step completion sources
| Step | Source |
|------|--------|
| Claim LuckyCoin | `lastDailyClaim !== null` |
| Watch asset | `watchlist.length > 0` |
| Buy asset | `transactions.some(t => t.type === "buy") || holdings.length > 0` |
| Market Pulse | `appliedEvents.length > 0` |
| Check portfolio | `challengeFlags.includes("hasViewedPortfolio")` |
| Performance History | `challengeFlags.includes("hasViewedPerformance")` |
| Complete lesson | `lessonsOpened > 0` |

## Critical ordering rule — TDZ bug
The `playbookSteps` useMemo references `handleSimulateEvent`. This function is declared as a `const` arrow function later in the HomeScreen component body. Placing `playbookSteps` before `handleSimulateEvent` causes a **ReferenceError** (Temporal Dead Zone) on first render.

**Fix:** Always declare `playbookSteps` useMemo AFTER `handleSimulateEvent` and `handleEventModalClose` in the component body.

**Why:** In a React function component, all hook calls execute top-to-bottom on every render. `const` arrow functions are not hoisted, so referencing one before its declaration throws immediately.

## Files changed
- `app/(tabs)/index.tsx` — RookiePlaybookCard component + home card insertion + rpStyles
- `app/(tabs)/portfolio.tsx` — setChallengeFlag("hasViewedPortfolio") on mount
- `app/performance.tsx` — setChallengeFlag("hasViewedPerformance") on mount
- `app/rookie-playbook.tsx` — new full-screen guide (created)
