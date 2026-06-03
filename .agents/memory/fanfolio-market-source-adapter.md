---
name: Fanfolio Market Source Adapter
description: Architecture of the market source story → MarketEvent pipeline; GameState field requirements; integration points.
---

## Files

- `data/marketSources.ts` — `MarketSourceStory`, `SourceStoryType`, `SourceReliability`, `GeneratedPulseCandidate` types; 20 `MOCK_SOURCE_STORIES`; `getRandomSourceStory(excludeId?)`
- `lib/marketSourceAdapter.ts` — `generateMarketEventFromStory(story)` pure function; `generateRandomSourceEvent(excludeStoryId?)` convenience wrapper
- `docs/MARKET_SOURCE_PIPELINE.md` — full architecture doc

## GameState field added

- `pendingGeneratedPulse: MarketEvent | null` — stores the full adapter-generated event when the daily pulse comes from the adapter (not a curated ID)

**Why:** `pendingPulseId` is a string ID that only resolves via `getEventById()` in MARKET_EVENTS. Adapter-generated events have unique IDs not in that pool, so the full event must be stored separately.

**How to apply:** When adding new GameState fields, update ALL of these in lockstep:
1. `GameState` interface in `context/GameContext.tsx`
2. `defaultState` object
3. `mergeGameState()` return object
4. `REPAIR_DEFAULTS` in `lib/saveHealth.ts`
5. The explicit `state: GameState` object at line ~322 in `lib/saveHealth.ts` (parsed state builder — most easily forgotten)
6. `safeMerge()` return in `lib/cloudSaveUtils.ts`
7. `localState: GameState` in `app/cloud-save.tsx`

## applyMarketEvent opts

Now accepts `opts?: { clearPending?: boolean; overrideEvent?: MarketEvent }`.
When `overrideEvent` is provided, it bypasses `getEventById()`/`getRandomEvent()` entirely.

## prepareDailyPulse strategy

50% adapter / 50% curated. Adapter path stores both `pendingPulseId = event.id` and `pendingGeneratedPulse = event`. Curated path stores `pendingPulseId = event.id` and `pendingGeneratedPulse = null`.

## reviewDailyPulse routing

Checks `state.pendingGeneratedPulse` first — if set, uses `overrideEvent`. Otherwise falls back to ID lookup. Both paths call `{ clearPending: true }` which clears both `pendingPulseId` and `pendingGeneratedPulse`.

## Volatility tiers (adapter)

Meme Coin 1.0 → Future 0.85 → Player Coin 0.75 → Coach Stock 0.70 → Team Stock 0.55 → Sport Index 0.22.
Secondary assets always dampened ×0.45 vs primary. Index rotation flips sign for indexes (+) and meme coins (−).
