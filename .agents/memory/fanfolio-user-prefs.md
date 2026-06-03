---
name: Fanfolio user preferences wiring
description: How the 4 user prefs are wired into app behavior, and conventions for adding pref-gated content.
---

# Fanfolio User Preferences — Wiring Conventions

## Preferences and their effect

| Pref | Effect |
|---|---|
| `hapticsEnabled` | Every `Haptics.*` call in app screens is wrapped in `if (prefs.hapticsEnabled)`. Onboarding haptics are intentionally NOT gated. |
| `educationalTipsEnabled` | All lesson boxes, coach tips, edu banners, insight cards, and "learn the concepts" sections are wrapped in `{prefs.educationalTipsEnabled && ...}`. |
| `compactCardsEnabled` | `AssetCard` has a `compact?: boolean` prop (smaller padding, no sparkline, no sentiment badge, smaller fonts). `market.tsx` passes `compact={prefs.compactCardsEnabled}`. |
| `showSafetyDisclaimers` | Optional repeated disclaimer text (not core legal copy) is wrapped in `{prefs.showSafetyDisclaimers && ...}`. The "About Fanfolio" legal text in Profile/Settings must NEVER be removed. |

## Hook insertion pattern

To add `useUserPreferences` to an existing screen function, use `const topPad = Platform.OS === "web"` as anchor:

```tsx
const { prefs } = useUserPreferences();
const topPad = Platform.OS === "web" ? 67 : insets.top;
```

For sub-components with an early `if (!item) return null;`, the hook call MUST come before it:

```tsx
function MyModal(...) {
  const { prefs } = useUserPreferences();  // before early return
  if (!item) return null;
  ...
}
```

**Why:** React hooks cannot be called after a conditional return.

## Files wired

- `hooks/useHaptics.ts` — convenience wrapper around all 3 haptic types
- `components/AssetCard.tsx` — compact prop
- `app/(tabs)/market.tsx` — compact prop pass-through
- `app/(tabs)/index.tsx` — EventResultModal, DecisionCoachCard, HomeScreen
- `app/(tabs)/scanner.tsx` — edu banner, lesson box
- `app/asset/[id].tsx` — TradeModal, AssetDetailScreen
- `app/portfolio-coach.tsx` — Coach Tips, Learn the Concepts
- `app/strategy-profile.tsx` — lessonCard, eduCard, disclaimerCard
- `app/journal.tsx` — introCard, insightSection, rvuCard
- `app/news.tsx` — lesson card, disclaimer
- `app/profile.tsx` — all 4 haptic calls
- `app/cloud-save.tsx` — openConfirm + handleConfirm haptics
