---
name: Fanfolio feedback integration
description: Tally feedback lib, env vars, entry points, and home screen stylesheet trap.
---

## Rule
`lib/feedback.ts` wraps Tally popup (web) + `Linking.openURL` fallback (native).
Env vars live in `artifacts/fanfolio/.env` (EXPO_PUBLIC_ prefix, non-secret).

## How to apply
- Call `openFeedbackForm(source, screen, username)` from any screen.
- Hidden fields sent: `source`, `screen`, `build=beta-rc1`, `username`.
- Web path: injects `https://tally.so/widgets/embed.js` once via `loadTallyScript()`, then calls `Tally.openPopup(FORM_ID, opts)`. Falls back to `window.open` or `Linking` if Tally unavailable.
- Missing env vars: dev-only Alert, no crash, entry points silently no-op in prod.

## Home screen stylesheet trap
`app/(tabs)/index.tsx` has FOUR StyleSheet.create() blocks:
1. `const styles` — main (ends at `scanChipChange`) ← add new home-screen styles here
2. `const rpStyles` — Rookie Playbook compact cards (has `compactLink`, `compactLinkText`)
3. `const evtStyles` — Event modal
4. `const coachStyles` — Coach card
5. `const lsStyles` — Lesson modal

Adding styles to `rpStyles` instead of `styles` causes TS2339 "property does not exist" — the block boundary looks identical in isolation.

**Why:** Multiple inline StyleSheet blocks are defined at the bottom of the 1600-line file; compactLink is in rpStyles not styles.
