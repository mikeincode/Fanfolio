# Market Source Adapter Pipeline

> **Status:** Local mock layer only. No real APIs connected.  
> **Purpose:** Structural foundation for a future real sports-data pipeline.

---

## Overview

Fanfolio's Market Pulse Auto Mode generates one educational market event per day.
This pipeline defines how those events can be produced from *source stories* —
structured summaries of sports news, performance data, injury reports, and
league storylines — rather than only from the hand-curated `mockMarketEvents.ts` pool.

The architecture is a clean adapter boundary:

```
MarketSourceStory  →  generateMarketEventFromStory()  →  MarketEvent
     (data)                   (adapter)                    (applied to game)
```

When real sports APIs are connected later, only the **data source** changes.
The adapter function and downstream event system stay unchanged.

---

## Files

| File | Role |
|---|---|
| `data/marketSources.ts` | Types (`MarketSourceStory`, `SourceStoryType`, `SourceReliability`, `GeneratedPulseCandidate`) + 20 simulated mock stories |
| `lib/marketSourceAdapter.ts` | Pure adapter: `generateMarketEventFromStory(story)` → `MarketEvent`; convenience wrapper `generateRandomSourceEvent()` |
| `context/GameContext.tsx` | `prepareDailyPulse()` randomly picks curated OR adapter-generated event (50/50); `pendingGeneratedPulse` stored in state |
| `app/dev-reset.tsx` | "Market Source Adapter" dev section to test the full pipeline manually |

---

## Story Types → Event Categories

| `SourceStoryType` | `EventCategory` | Typical Assets |
|---|---|---|
| `injury` | Chaos | Player coins, team stocks, indexes |
| `breakout_performance` | Breakout | Player coins, coach stocks, indexes |
| `team_momentum` | Championship | Team stocks, futures, indexes |
| `coach_buzz` | Coach | Coach stocks, futures |
| `coach_controversy` | Coach | Coach stocks, team stocks, futures |
| `award_race` | Futures | Futures, player coins, indexes |
| `championship_momentum` | Championship | Team stocks, player coins, futures, indexes |
| `meme_hype` | Rally | Meme coins, meme index |
| `index_rotation` | Stability | Indexes (↑), meme coins (↓) |
| `trade_rumor` | Chaos | Player coins, indexes |
| `confirmed_trade` | Breakout | Player coins, team stocks, coach stocks |
| `general_news` | Rally | Team stocks, player coins, indexes |

---

## Impact Rules (Volatility Tiers)

The adapter enforces these rules so generated events match the educational intent:

| Asset Type | Volatility Multiplier | Typical Range |
|---|---|---|
| Meme Coin | 1.00 (full) | ±20–45% |
| Future | 0.85 | ±15–25% |
| Player Coin | 0.75 | ±10–20% |
| Coach Stock | 0.70 | ±8–18% |
| Team Stock | 0.55 | ±6–15% |
| Sport Index | 0.22 (dampened) | ±1–6% |

**Key rules:**
- Indexes always move less than individual assets (diversification lesson)
- The primary asset (`relatedAssetIds[0]`) always moves more than secondary assets (×0.45 dampening)
- Index rotation stories flip the sign: indexes go UP, meme coins go DOWN
- Each generation adds ±20% random variation so the same story produces slightly different events

---

## Mock Source Stories (20 stories)

All stories are prefixed `[SIMULATED]` and labeled clearly as mock data.

| Story ID | Type | Primary Asset |
|---|---|---|
| `src-injury-kelce-knee` | injury | kelce-coin |
| `src-injury-niners-starter` | injury | niners-stock |
| `src-breakout-jefferson-historic` | breakout_performance | jefferson-coin |
| `src-breakout-hurts-dual-threat` | breakout_performance | hurts-coin |
| `src-breakout-parsons-record-disruption` | breakout_performance | parsons-coin |
| `src-momentum-lions-win-streak` | team_momentum | lions-stock |
| `src-momentum-ravens-elite-defense` | team_momentum | ravens-stock |
| `src-coach-buzz-play-caller` | coach_buzz | offensive-coach-stock |
| `src-coach-controversy-locker-room` | coach_controversy | offensive-coach-stock |
| `src-award-coty-two-candidate-race` | award_race | coty-future |
| `src-award-oroty-leader-pulls-clear` | award_race | oroty-future |
| `src-award-comeback-player-milestone` | award_race | comeback-future |
| `src-champ-chiefs-division-clinch` | championship_momentum | chiefs-stock |
| `src-meme-4qc-triple-walk-off` | meme_hype | fourth-quarter-coin |
| `src-meme-red-zone-record-week` | meme_hype | red-zone-coin |
| `src-meme-drama-press-conference` | meme_hype | drama-coin |
| `src-index-rotation-to-stability` | index_rotation | nfl-power-index |
| `src-trade-rumor-jefferson` | trade_rumor | jefferson-coin |
| `src-trade-confirmed-parsons-extension` | confirmed_trade | parsons-coin |
| `src-general-cowboys-media-cycle` | general_news | cowboys-stock |

---

## How Stories Become Market Pulses

### Daily Auto Mode (50/50 split)

```
prepareDailyPulse() called on HomeScreen focus
        │
        ├─ Math.random() < 0.5  ──→  generateRandomSourceEvent()
        │                                    │
        │                         getRandomSourceStory()  →  story
        │                         generateMarketEventFromStory(story)  →  MarketEvent
        │                         save: { pendingPulseId: event.id,
        │                                 pendingGeneratedPulse: event }
        │
        └─ else  ──→  getRandomEvent()  →  curated MarketEvent
                      save: { pendingPulseId: event.id,
                              pendingGeneratedPulse: null }
```

### User Reviews Pulse

```
User taps "Review Pulse"  →  reviewDailyPulse()
        │
        ├─ pendingGeneratedPulse set?  →  applyMarketEvent(undefined, { overrideEvent: pendingGeneratedPulse, clearPending: true })
        │
        └─ else  →  applyMarketEvent(pendingPulseId, { clearPending: true })  →  ID lookup in MARKET_EVENTS
```

Both paths converge at `applyMarketEvent()`, which:
1. Updates `priceOverrides` for each impacted asset
2. Writes an `AppliedEvent` record to `appliedEvents[]`
3. Takes a `PortfolioSnapshot`
4. Clears `pendingPulseId` and `pendingGeneratedPulse`

---

## Asset ID → Story Connection

Stories reference asset IDs from `data/assetUniverse.ts` (and `mockAssets.ts`).
The adapter calls `getAllAssetById(assetId)` for each `relatedAssetId` to:
- Confirm the asset exists
- Get its `type` (determines volatility tier)
- Get its `symbol` (stored in the impact record)

If an asset ID in a story doesn't exist in the universe, the adapter silently skips it.
This makes it safe to add stories referencing future assets before those assets are added.

---

## Where Real Sports APIs Would Plug In

The integration boundary is `MOCK_SOURCE_STORIES` in `data/marketSources.ts`.

**Future integration:**

```typescript
// data/marketSources.ts — future version
export async function fetchLiveSourceStories(): Promise<MarketSourceStory[]> {
  const rawNews = await sportsNewsAPI.getTopStories();          // ESPN / Sportradar / etc.
  const injuries = await injuryFeed.getLatestReport();           // Rotowire / official feed
  return [...rawNews, ...injuries].map(mapRawToSourceStory);    // normalize to MarketSourceStory
}
```

The adapter (`lib/marketSourceAdapter.ts`) and the GameContext integration stay unchanged.
Only `marketSources.ts` evolves from static mock data to a live async feed.

Candidate real data sources:
- **ESPN API** — team news, scores, injury reports
- **Sportradar** — official stats feeds (requires licensing)
- **The Athletic / Rotowire** — narrative injury and roster news
- **NFL official injury report** — public weekly PDF / feed
- **Twitter/X trending sports topics** — meme narrative signals

---

## Educational and Safety Boundaries

This system is **always** simulated and educational:

- LuckyCoin has **no cash value**
- No real money is involved at any stage
- Stories never use betting, odds, parlay, sportsbook, or prediction-market language
- Generated events use the same safe-language rules as curated events
- The adapter enforces these rules in the `marketLesson` field (sourced from `educationalAngle`)
- Mock stories are explicitly labeled `[SIMULATED]` in their titles
- All source labels include "Simulated" to distinguish from real data feeds

Even when real sports APIs are connected in the future, the game layer remains a
**simulated educational portfolio simulator** — not a prediction market or sportsbook.

---

## Typecheck

Run from the workspace root:

```bash
pnpm --filter fanfolio run typecheck
```

Expected: no errors. The `MarketEvent` type flows cleanly from adapter → GameContext → existing event system without any structural changes to `AppliedEvent` or `priceOverrides`.
