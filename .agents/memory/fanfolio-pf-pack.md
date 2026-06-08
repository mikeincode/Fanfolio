---
name: Fanfolio Pro Football Starter Pack v1 + Entity Sanitizer
description: Asset naming rules, array structure, and sanitizer architecture for the generic pro football pack.
---

## Asset Naming Rule
New generic assets must use `league: "Pro Football"` — never `"NFL"`. Existing arrays (`NFL_TEAM_STOCKS`, `NFL_PLAYER_COINS`, etc.) keep their existing league values for save-file backward compatibility.

## Array Structure in assetUniverse.ts
New arrays added before the `UNIVERSE_ASSETS` export, then spread in:
- `PF_TEAM_STOCKS` — 8 generic team stocks (kcft-stock, lvft-stock, detft-stock, dalft-stock, sfft-stock, balft-stock, bufft-stock, miaft-stock)
- `PF_PLAYER_COINS` — 16 role-based player coins (pattern: `{city}-{role}-coin`, e.g. `kc-qb1-coin`)
- `PF_COACH_STOCKS` — 4 coach stocks (pf-off-coach-stock, pf-def-arch-stock, pf-rookie-dev-stock, pf-hot-seat-stock)
- `PF_FUTURES` — 6 futures (pf-mvp-future, pf-off-rookie-future, pf-def-star-future, pf-comeback-future, pf-coach-momentum-future, pf-champ-momentum-future)
- `PF_INDEXES` — 3 indexes (pf-power-index, pf-young-stars-index, pf-def-edge-index)
- `PF_MEME_COINS` — 2 new meme coins (missed-tackle-coin, hail-mary-coin); fourth-quarter-coin and red-zone-coin already existed in NEW_MEME_COINS

**Why:** Backward-compatible — existing arrays and save files unchanged. New arrays spread in separately.

## Entity Sanitizer (lib/entitySanitizer.ts)
- Types: `EntityType`, `EntityAlias`, `FanfolioEntity`, `EntityMapEntry`, `SanitizedStoryResult`
- `DEMO_ENTITY_MAP` — demo aliases (fictional placeholder strings, no real names)
- `sanitizeStoryText(text, entityMap)` — matches longer/higher-priority aliases first, case-insensitive, returns sanitizedText + matchedEntities[]
- `PIPELINE_FLOW_DESCRIPTION` — documents the 5-step real-data→Market Pulse pipeline

**Why:** Foundation for a future real-sports-data pipeline. The app only ever shows publicName strings; private aliases are never stored or displayed.

## Documentation
- `docs/ENTITY_MAPPING_PIPELINE.md` — full architecture explanation, what-stored-vs-shown table, confidence weight guide, current status table.
