# Fanfolio Entity Mapping Pipeline

**Purpose:** Explain why Fanfolio uses generic public names, how real-world sports data can safely become a Market Pulse, and why this architecture protects users and the product.

---

## Why Fanfolio Uses Generic Public Names

Fanfolio is an educational sports market simulator. It teaches market concepts using sports as the theme.

**Key rules:**

1. **No real team names** — using official team names, mascots, or branding in app content creates IP risk and implies an official relationship that does not exist.

2. **No real player names** — using official player names or likenesses without a license creates both IP and right-of-publicity risk.

3. **No official league branding** — league logos and marks are heavily protected. Fanfolio has no affiliation with any professional sports league.

4. **Generic names do the same educational job** — "Kansas City Football Team" teaches the same portfolio concepts as any named team. "Kansas City QB1 Coin" teaches the same player-coin mechanics. The names are vehicles for learning, not entertainment based on real individuals.

---

## The Entity Map: Private Aliases → Public Names

The entity map lives in `lib/entitySanitizer.ts` and is never sent to clients.

Each entry maps one or more **private aliases** to a single **public Fanfolio name**:

```
privateAlias: "example star quarterback"
→ publicName:  "Kansas City QB1"
→ assetId:     "kc-qb1-coin"
```

Private aliases are placeholder strings that represent real-world entities in a future server-side integration. They are:
- Never shown in the app UI
- Never stored in user-facing saves
- Only used in the sanitization step

Public names are always generic, always safe, and match the asset definitions in `data/assetUniverse.ts`.

---

## How Real Sports Stories Become Market Pulses

```
[STEP 1] Raw sports story / headline
         (from a sports API, stats feed, or editorial source)

[STEP 2] sanitizeStoryText(rawText, entityMap)
         → sanitizedText:    safe for user display
         → matchedEntities[]: Fanfolio assets involved
         (lib/entitySanitizer.ts)

[STEP 3] Build a MarketSourceStory
         story.relatedAssetIds = matchedEntities.map(e => e.assetId)
         story.title           = sanitized headline
         story.summary         = sanitized body (short, original — not republished)
         story.storyType       = inferred from keywords or AI classification
         (data/marketSources.ts types)

[STEP 4] generateMarketEventFromStory(story)
         → MarketEvent with impacts computed by volatility rules
         (lib/marketSourceAdapter.ts — no changes needed)

[STEP 5] Market Pulse delivered to the user
         prepareDailyPulse() in GameContext stores the event
         User reviews it via the Market Pulse card on Home
```

---

## Why AI Is Optional

The pipeline works without AI at all:

- **Alias matching** handles the entity recognition step with rules.
- **Story type** can be inferred from keyword lists (injury words → "injury", sack/tackle → "breakout_performance", etc.).
- **Impact generation** is fully rule-based in `marketSourceAdapter.ts`.

AI (LLM classification) can be added later as an optional enhancement for:
- Better disambiguation when a story mentions multiple possible entities
- Classifying story type in ambiguous cases
- Generating more natural-sounding Market Pulse summaries

But the system is fully functional as a rules-only pipeline. Adding AI later does not require changing any existing files — only `lib/entitySanitizer.ts` needs an optional AI disambiguation hook.

---

## Why Full Articles Are Never Republished

Fanfolio does **not** republish sports articles. Instead:

1. A raw story is used only to **identify entities** (which assets are involved) and **classify the event** (what type of story).

2. Fanfolio generates a **short original Market Pulse summary** using the entity and event-type information — it does not copy or paraphrase the source article.

3. The user-facing summary is Fanfolio's own educational content, not a reproduction of any external source.

This approach:
- Avoids copyright issues with article reproduction
- Keeps Market Pulses consistent, educational, and appropriate in tone
- Allows Fanfolio to control exactly what language users see (no real names, no odds language, no gambling framing)

---

## Confidence Weights and Disambiguation

Each entity map entry has a `confidenceWeight` (0.0–1.0):

| Weight | Meaning |
|--------|---------|
| 0.9–1.0 | High confidence — single alias uniquely identifies the entity |
| 0.7–0.9 | Good confidence — alias is distinctive but may need context check |
| 0.5–0.7 | Moderate — alias is shared across sports/leagues, disambiguation needed |
| < 0.5   | Low — alias is generic; must combine with other signals before acting |

In a future AI-enhanced pipeline, low-confidence matches would be passed to an LLM with surrounding context before being promoted to a `relatedAssetId`.

---

## What Is Stored vs. What Is Shown

| Layer | Contains | Visible to users? |
|-------|----------|------------------|
| Entity map (server-side future) | Real names, aliases, mappings | Never |
| `sanitizeStoryText()` output | Generic public names only | Yes — in Market Pulse |
| `MarketSourceStory.relatedAssetIds` | Asset IDs (e.g. `kc-qb1-coin`) | No — internal only |
| `MarketEvent.summary` | Sanitized educational prose | Yes |
| User save (AsyncStorage / Supabase) | Asset IDs, portfolio, XP, LC | Only asset names via UI |

---

## Current Status (v1 — Demo Only)

| Component | Status |
|-----------|--------|
| `data/assetUniverse.ts` — Pro Football Starter Pack v1 | ✅ Added (39 new assets) |
| `lib/entitySanitizer.ts` — Types + sanitizer function | ✅ Added |
| `data/marketSources.ts` — Generic pro football stories | ✅ Added (25 new stories) |
| `data/mockMarketEvents.ts` — Generic curated events | ✅ Added (13 new events) |
| Real alias map (real player/team names) | ❌ Not added yet — server-side only |
| Live sports API integration | ❌ Not wired — future phase |
| AI disambiguation layer | ❌ Not added — optional enhancement |

---

## Files Involved

```
data/assetUniverse.ts        — Asset definitions (public names only)
data/marketSources.ts        — Source story definitions and mock stories
data/mockMarketEvents.ts     — Curated Market Events (direct pulse delivery)
lib/entitySanitizer.ts       — Entity map types + sanitizeStoryText()
lib/marketSourceAdapter.ts   — Story → MarketEvent adapter (unchanged)
docs/ENTITY_MAPPING_PIPELINE.md  — This file
```

---

*Fanfolio is a fake-money educational simulator. LuckyCoin has no cash value. No real money, deposits, withdrawals, gambling, or sportsbook mechanics are involved.*
