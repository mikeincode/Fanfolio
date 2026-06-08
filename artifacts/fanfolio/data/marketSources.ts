/**
 * marketSources.ts
 *
 * Market Source Adapter foundation — typed models for simulated "source stories"
 * that are converted into Fanfolio Market Pulses by the adapter in
 * lib/marketSourceAdapter.ts.
 *
 * These are NOT real sports news. All stories are simulated and educational.
 * They serve as a structural stand-in for a future real sports-data feed.
 *
 * Future integration point:
 *   Replace MOCK_SOURCE_STORIES with a live call to a real sports news /
 *   stats API (ESPN, Sportradar, Rotowire, The Athletic feed, etc.).
 *   The adapter function in marketSourceAdapter.ts stays unchanged —
 *   only the data source changes.
 *
 * No real money, no gambling, no sportsbook odds.
 * LuckyCoin has no cash value.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SourceStoryType =
  | "injury"
  | "breakout_performance"
  | "team_momentum"
  | "coach_buzz"
  | "coach_controversy"
  | "award_race"
  | "championship_momentum"
  | "meme_hype"
  | "index_rotation"
  | "trade_rumor"
  | "confirmed_trade"
  | "general_news";

export type SourceReliability = "confirmed" | "strong" | "moderate" | "rumor";

export interface MarketSourceStory {
  id: string;
  title: string;
  summary: string;
  sport: string;
  league: string;
  storyType: SourceStoryType;
  /** Asset IDs from assetUniverse.ts — first entry is the primary (most impacted) asset */
  relatedAssetIds: string[];
  /** 0.0–1.0 — how confident the simulated source is in this story */
  confidenceScore: number;
  sourceLabel: string;
  /** ISO date string (simulated) */
  publishedAt: string;
  /** The educational finance lesson this story is designed to teach */
  educationalAngle: string;
  reliability: SourceReliability;
}

export interface GeneratedPulseCandidate {
  story: MarketSourceStory;
  generatedEvent: import("@/data/mockMarketEvents").MarketEvent;
  generatedAt: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// Simulated Source Stories (20 stories)
// All titles are prefixed [SIMULATED] to distinguish from any future real feed.
// ─────────────────────────────────────────────────────────────────────────────

export const MOCK_SOURCE_STORIES: MarketSourceStory[] = [

  // ── Injury ─────────────────────────────────────────────────────────────────

  {
    id: "src-injury-kelce-knee",
    title: "[SIMULATED] KC TE1 Knee Concern — Listed as Limited in Practice",
    summary:
      "Simulated injury report: The Kansas City TE1 is listed as limited in Wednesday practice with a knee concern. Availability for the upcoming game is uncertain, creating short-term selling pressure on player-coin holders.",
    sport: "Football",
    league: "Pro Football",
    storyType: "injury",
    relatedAssetIds: ["kelce-coin", "chiefs-stock", "nfl-power-index"],
    confidenceScore: 0.72,
    sourceLabel: "Simulated Injury Report Feed",
    publishedAt: "2025-11-14T09:00:00Z",
    educationalAngle:
      "Injury news is one of the fastest-moving market signals in sports. Player coins react immediately to availability reports — even 'limited practice' creates short-term selling pressure. Indexes absorb the shock with a smaller dip because they hold many assets at once.",
    reliability: "strong",
  },
  {
    id: "src-injury-niners-starter",
    title: "[SIMULATED] San Francisco Starting QB Listed as Questionable — Ankle Issue",
    summary:
      "Simulated injury report: The San Francisco Football Team's starting quarterback is officially questionable for Sunday following an ankle sprain in Wednesday practice. Team stock holders face short-term uncertainty until the final injury designation.",
    sport: "Football",
    league: "Pro Football",
    storyType: "injury",
    relatedAssetIds: ["niners-stock", "nfl-power-index", "football-power-index"],
    confidenceScore: 0.80,
    sourceLabel: "Simulated Injury Report Feed",
    publishedAt: "2025-11-20T10:30:00Z",
    educationalAngle:
      "Team stocks absorb injury risk differently than player coins. A QB injury drops the team stock and the broad index slightly — but the index barely blinks because it holds many teams. This is diversification absorbing a single shock.",
    reliability: "confirmed",
  },

  // ── Breakout Performance ────────────────────────────────────────────────────

  {
    id: "src-breakout-jefferson-historic",
    title: "[SIMULATED] Football WR Star Posts 220-Yard Historic Night — Three TDs",
    summary:
      "Simulated box score: The Football WR Star recorded 220 receiving yards and three touchdowns in a prime-time matchup, setting a new single-game simulated franchise record. FWRS surged to a monthly high immediately after the final whistle.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["jefferson-coin", "nfl-power-index", "rookie-futures-index"],
    confidenceScore: 0.95,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-11-10T23:15:00Z",
    educationalAngle:
      "Elite receiver breakout games move the player coin sharply, with smaller ripple effects on broad indexes. This gap in magnitude illustrates why individual assets carry more risk — and more reward — than diversified baskets.",
    reliability: "confirmed",
  },
  {
    id: "src-breakout-hurts-dual-threat",
    title: "[SIMULATED] Philadelphia QB1 Explodes for Four TDs and 80 Rush Yards",
    summary:
      "Simulated game summary: The Philadelphia QB1 posted a career-high four touchdowns — two rushing, two passing — driving the offense to a season-best performance. Dual-threat output is the core value driver for PHQB1 holders.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["hurts-coin", "offensive-coach-stock", "nfl-power-index"],
    confidenceScore: 0.92,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-11-17T22:00:00Z",
    educationalAngle:
      "A dual-threat QB's breakout lifts both their own coin and the offensive coordinator's simulated stock — showing how correlated assets move together when one performance benefits an entire offensive system.",
    reliability: "confirmed",
  },
  {
    id: "src-breakout-parsons-record-disruption",
    title: "[SIMULATED] Dallas Edge Rusher Shatters Single-Game Disruption Record — Defense Takes Over",
    summary:
      "Simulated performance data: The Dallas Edge Rusher recorded 3.5 sacks and forced two fumbles, reaching a new single-game simulated record for total disruptions. Defensive-linked assets surged as the narrative shifted firmly to defense dominating the league.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["parsons-coin", "cowboys-stock", "defensive-coach-stock", "defense-index"],
    confidenceScore: 0.88,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-11-24T21:30:00Z",
    educationalAngle:
      "A defensive star's breakout ripples across team stocks, coordinator stocks, and sector indexes simultaneously. Understanding this cluster behavior — how correlated assets move together — is a core portfolio analysis skill.",
    reliability: "confirmed",
  },

  // ── Team Momentum ───────────────────────────────────────────────────────────

  {
    id: "src-momentum-lions-win-streak",
    title: "[SIMULATED] Detroit Football Team Wins 6th Straight — Playoff Confidence at Season High",
    summary:
      "Simulated standings model: The Detroit Football Team has won six consecutive games, building the most dominant mid-season run of the year. Playoff probability scores are surging for DETL holders, and the championship narrative is driving futures higher.",
    sport: "Football",
    league: "Pro Football",
    storyType: "team_momentum",
    relatedAssetIds: ["lions-stock", "super-bowl-future", "nfl-power-index", "coty-future"],
    confidenceScore: 0.85,
    sourceLabel: "Simulated Standings and Momentum Engine",
    publishedAt: "2025-11-21T18:00:00Z",
    educationalAngle:
      "Winning streaks create momentum premiums for a team's stock. But notice: the index rises too, by much less. The index spreads risk across all teams, so any single team's hot streak gets cushioned by the rest of the basket.",
    reliability: "strong",
  },
  {
    id: "src-momentum-ravens-elite-defense",
    title: "[SIMULATED] Baltimore Football Team Holds Three Straight Opponents Under 10 Points",
    summary:
      "Simulated defensive stats: The Baltimore Football Team has now held three consecutive opponents under 10 points — the most dominant defensive stretch of the simulated season. BALT, defensive coach stocks, and the defense index are all moving higher.",
    sport: "Football",
    league: "Pro Football",
    storyType: "team_momentum",
    relatedAssetIds: ["ravens-stock", "defensive-coach-stock", "defense-index", "super-bowl-future"],
    confidenceScore: 0.87,
    sourceLabel: "Simulated Defensive Analytics Feed",
    publishedAt: "2025-11-28T16:00:00Z",
    educationalAngle:
      "Elite defensive momentum moves coach stocks, team stocks, and sector indexes simultaneously. This cluster behavior shows how theme-based narratives create correlated asset movements across an entire sector.",
    reliability: "strong",
  },

  // ── Coach Stories ───────────────────────────────────────────────────────────

  {
    id: "src-coach-buzz-play-caller",
    title: "[SIMULATED] Offensive Coordinator Earns National Play-Caller Recognition",
    summary:
      "Simulated analyst rankings: The league's leading offensive coordinator has been rated the most creative fourth-quarter play-caller in the league for the third straight week. Coach of the Year buzz is building early, lifting COTY futures.",
    sport: "Football",
    league: "Pro Football",
    storyType: "coach_buzz",
    relatedAssetIds: ["offensive-coach-stock", "coty-future", "nfl-power-index"],
    confidenceScore: 0.78,
    sourceLabel: "Simulated Analyst Rating Engine",
    publishedAt: "2025-11-12T11:00:00Z",
    educationalAngle:
      "Coaching narrative buzz moves Coach of the Year futures before any formal award is decided. Markets price in cumulative recognition — early leader status creates a momentum premium that compounds as the season progresses.",
    reliability: "moderate",
  },
  {
    id: "src-coach-controversy-locker-room",
    title: "[SIMULATED] Reports of Locker Room Tension — Coaching Staff Under Pressure",
    summary:
      "Simulated report (unconfirmed): Multiple unnamed sources describe growing friction between the offensive coaching staff and key skill players. Morale concerns are being priced into coaching stocks and the team franchise immediately.",
    sport: "Football",
    league: "Pro Football",
    storyType: "coach_controversy",
    relatedAssetIds: ["offensive-coach-stock", "lions-stock", "coty-future", "nfl-power-index"],
    confidenceScore: 0.55,
    sourceLabel: "Simulated Team Report Feed",
    publishedAt: "2025-11-18T13:45:00Z",
    educationalAngle:
      "Coach controversies are uniquely volatile signals. Even a rumor can drop a coaching stock because the market prices narrative confidence — not just results. Low-reliability stories still move markets when sentiment is already fragile.",
    reliability: "rumor",
  },

  // ── Award Races ─────────────────────────────────────────────────────────────

  {
    id: "src-award-coty-two-candidate-race",
    title: "[SIMULATED] Coach of the Year Race Narrows to Two — Uncertainty Compresses",
    summary:
      "Simulated award tracker: Two head coaches are now separated by just 0.3 simulated performance points. The narrowing race is driving COTY futures higher as the market prices in tighter uncertainty and a clearer path to settlement.",
    sport: "Football",
    league: "Pro Football",
    storyType: "award_race",
    relatedAssetIds: ["coty-future", "offensive-coach-stock", "defensive-coach-stock"],
    confidenceScore: 0.82,
    sourceLabel: "Simulated Award Probability Engine",
    publishedAt: "2025-12-02T09:00:00Z",
    educationalAngle:
      "As award races narrow, futures prices rise because uncertainty compresses. When the outcome becomes clearer, the risk premium shrinks and value buyers step in — this is classic expectation-based pricing.",
    reliability: "strong",
  },
  {
    id: "src-award-oroty-leader-pulls-clear",
    title: "[SIMULATED] Offensive Rookie Pulls to Widest Lead of the Season",
    summary:
      "Simulated rookie stats model: One offensive rookie has extended their lead in the cumulative stats model to the widest margin of the season. OROTY futures and the Rookie Futures Index are re-rating upward as the race clarifies.",
    sport: "Football",
    league: "Pro Football",
    storyType: "award_race",
    relatedAssetIds: ["oroty-future", "rookie-futures-index", "hurts-coin"],
    confidenceScore: 0.79,
    sourceLabel: "Simulated Award Probability Engine",
    publishedAt: "2025-12-05T10:30:00Z",
    educationalAngle:
      "Futures assets often move in tandem with the player coin of the leading candidate. When a favorite gains clarity, the whole asset basket re-rates — and the index capturing that basket lifts with it.",
    reliability: "strong",
  },
  {
    id: "src-award-comeback-player-milestone",
    title: "[SIMULATED] Comeback Candidate Posts Best Game Since Return",
    summary:
      "Simulated performance data: The leading Comeback Player candidate recorded their highest single-game performance score since returning from a season-ending injury. Narrative momentum and emotional buying sent CMPBK and ComebackCoin sharply higher.",
    sport: "Football",
    league: "Pro Football",
    storyType: "award_race",
    relatedAssetIds: ["comeback-future", "comeback-coin", "underdog-index"],
    confidenceScore: 0.84,
    sourceLabel: "Simulated Award Probability Engine",
    publishedAt: "2025-11-30T20:00:00Z",
    educationalAngle:
      "Comeback narratives blend real performance with emotional market behavior. The futures asset rises on expectation; ComebackCoin rises on emotion. This two-driver dynamic is behavioral finance in action.",
    reliability: "confirmed",
  },

  // ── Championship Momentum ───────────────────────────────────────────────────

  {
    id: "src-champ-chiefs-division-clinch",
    title: "[SIMULATED] Kansas City Football Team Clinches Division — Championship Model Tilts in Their Favor",
    summary:
      "Simulated playoff model: The Kansas City Football Team has clinched their division, moving to the top seed in the simulated playoff bracket. KCC and Football QB Star Coin surge as championship probability shifts to the clear market leader.",
    sport: "Football",
    league: "Pro Football",
    storyType: "championship_momentum",
    relatedAssetIds: ["chiefs-stock", "mahomes-coin", "super-bowl-future", "nfl-power-index"],
    confidenceScore: 0.90,
    sourceLabel: "Simulated Championship Probability Model",
    publishedAt: "2025-12-08T21:00:00Z",
    educationalAngle:
      "Division clinching is a clarity event — it resolves uncertainty about playoff position. When uncertainty drops, asset prices rise to reflect reduced risk. This is how expectation-based markets behave at every major deadline.",
    reliability: "confirmed",
  },

  // ── Meme Hype ───────────────────────────────────────────────────────────────

  {
    id: "src-meme-4qc-triple-walk-off",
    title: "[SIMULATED] Three Walk-Off Plays in One Night — 4QC Mania Erupts",
    summary:
      "Simulated game data: Three separate games ended on walk-off plays in the final four seconds. 4QC holders drove prices to a weekly high immediately as the shared narrative captured the meme-coin market in a single burst of excitement.",
    sport: "Football",
    league: "Pro Football",
    storyType: "meme_hype",
    relatedAssetIds: ["fourth-quarter-coin", "comeback-coin", "clutch-coin", "meme-market-index"],
    confidenceScore: 0.70,
    sourceLabel: "Simulated Viral Moments Tracker",
    publishedAt: "2025-11-23T23:45:00Z",
    educationalAngle:
      "Meme coins spike on shared excitement — not fundamentals. Three walk-off moments in one night is exactly the emotional event that drives 4QC. But the move is fast and reversible: the excitement fades faster than it builds.",
    reliability: "confirmed",
  },
  {
    id: "src-meme-red-zone-record-week",
    title: "[SIMULATED] Record Red Zone Efficiency — RZC and 4QC Surge",
    summary:
      "Simulated stats: This week posted the highest red zone scoring efficiency in the simulated season — 94% conversion across all tracked games. RZC holders saw immediate price action as the theme dominated fan commentary.",
    sport: "Football",
    league: "Pro Football",
    storyType: "meme_hype",
    relatedAssetIds: ["red-zone-coin", "fourth-quarter-coin", "meme-market-index"],
    confidenceScore: 0.68,
    sourceLabel: "Simulated Viral Moments Tracker",
    publishedAt: "2025-11-09T22:00:00Z",
    educationalAngle:
      "Scoring efficiency drives football meme coins — not wins and losses, just the entertainment metric. This is pure sentiment driving price with no fundamental anchor, a core behavioral finance lesson.",
    reliability: "strong",
  },
  {
    id: "src-meme-drama-press-conference",
    title: "[SIMULATED] Viral Press Conference Exchange Ignites Drama Coin",
    summary:
      "Simulated narrative tracker: A heated post-game press conference exchange between two coaches went viral within the first hour. DramaCoin, UpsetCoin, and ChokeCoin all surged as the meme-coin market captured the emotional reaction.",
    sport: "Football",
    league: "Pro Football",
    storyType: "meme_hype",
    relatedAssetIds: ["drama-coin", "upset-coin", "choke-coin", "meme-market-index"],
    confidenceScore: 0.65,
    sourceLabel: "Simulated Viral Moments Tracker",
    publishedAt: "2025-11-16T19:30:00Z",
    educationalAngle:
      "Drama-themed meme coins are pure social signal assets. Their price is driven entirely by the narrative cycle — when the drama fades, so does the price. High ceiling, near-zero fundamentals.",
    reliability: "strong",
  },

  // ── Index Rotation ──────────────────────────────────────────────────────────

  {
    id: "src-index-rotation-to-stability",
    title: "[SIMULATED] Capital Rotates from Meme Coins to Index Assets",
    summary:
      "Simulated capital flow model: A broad rotation out of high-volatility meme coins into the Football Stars Index and Fanfolio 100 is underway this week. Experienced traders are shifting toward stability following last week's meme-coin selloff.",
    sport: "All Sports",
    league: "Multi",
    storyType: "index_rotation",
    relatedAssetIds: ["nfl-power-index", "fanfolio-100", "football-power-index", "choke-coin", "drama-coin"],
    confidenceScore: 0.75,
    sourceLabel: "Simulated Capital Flow Model",
    publishedAt: "2025-11-25T12:00:00Z",
    educationalAngle:
      "Index rotation is a defensive move — when high-risk assets get volatile, capital flows into diversified baskets. This mirrors real-world 'flight to quality' in uncertain markets. Indexes gain while meme coins weaken.",
    reliability: "moderate",
  },

  // ── Trade Stories ───────────────────────────────────────────────────────────

  {
    id: "src-trade-rumor-jefferson",
    title: "[SIMULATED] Trade Rumor: WR Star in Discussions — Market Reacts to Uncertainty",
    summary:
      "Simulated trade rumor (unconfirmed): Multiple simulated sources suggest the Football WR Star is in trade discussions with a new franchise. Until confirmed or denied, uncertainty is the dominant force — FWRS is volatile while the broad index barely moves.",
    sport: "Football",
    league: "Pro Football",
    storyType: "trade_rumor",
    relatedAssetIds: ["jefferson-coin", "nfl-power-index"],
    confidenceScore: 0.45,
    sourceLabel: "Simulated Trade Rumor Feed (Unconfirmed)",
    publishedAt: "2025-10-28T14:00:00Z",
    educationalAngle:
      "Trade rumors create uncertainty, and markets hate uncertainty. An unconfirmed rumor drops a player coin even without evidence — because the possibility of change is now priced in. This is how risk premiums work.",
    reliability: "rumor",
  },
  {
    id: "src-trade-confirmed-parsons-extension",
    title: "[SIMULATED] Dallas Edge Rusher Signs Long-Term Extension — Market Certainty Returns",
    summary:
      "Simulated transaction wire: The Dallas Edge Rusher has agreed to a long-term contract extension, ending months of speculation. Certainty is restored, and DALER surges as holders gain confidence in the asset's long-term value.",
    sport: "Football",
    league: "Pro Football",
    storyType: "confirmed_trade",
    relatedAssetIds: ["parsons-coin", "cowboys-stock", "defensive-coach-stock", "defense-index"],
    confidenceScore: 0.97,
    sourceLabel: "Simulated Transaction Wire",
    publishedAt: "2025-10-31T16:30:00Z",
    educationalAngle:
      "Confirmed contracts remove uncertainty and let the market price in long-term value. This is the opposite of a trade rumor — clarity resolves the risk premium and drives prices up as confidence returns.",
    reliability: "confirmed",
  },

  // ── Pro Football Starter Pack v1 — Generic Source Stories ──────────────────
  // All names are generic. No real team names, player names, or official branding.

  // ── Injury ────────────────────────────────────────────────────────────────

  {
    id: "src-pf-injury-kc-qb1",
    title: "[SIMULATED] Kansas City QB1 Listed as Limited — Shoulder Concern",
    summary:
      "Simulated injury report: The Kansas City Football Team's franchise quarterback is listed as limited in Wednesday's practice with a shoulder concern. Game-day availability is uncertain, creating immediate selling pressure on KCQB1 and rippling into the team stock.",
    sport: "Football",
    league: "Pro Football",
    storyType: "injury",
    relatedAssetIds: ["kc-qb1-coin", "kcft-stock", "pf-power-index", "pf-mvp-future"],
    confidenceScore: 0.75,
    sourceLabel: "Simulated Injury Report Feed",
    publishedAt: "2025-11-05T09:15:00Z",
    educationalAngle:
      "Quarterback injury reports are the single highest-impact market signal in football. Even a 'limited practice' designation moves the player coin, the team stock, and any futures tied to that player's performance. This cascading effect shows how concentrated risk behaves.",
    reliability: "strong",
  },
  {
    id: "src-pf-injury-det-wr1",
    title: "[SIMULATED] Detroit WR1 Hamstring Concern — Day-to-Day",
    summary:
      "Simulated injury report: Detroit Football Team's top wide receiver is listed as day-to-day with a hamstring issue following Wednesday's limited practice session. DETWR1 holders face uncertainty heading into the weekend.",
    sport: "Football",
    league: "Pro Football",
    storyType: "injury",
    relatedAssetIds: ["det-wr1-coin", "detft-stock", "pf-young-stars-index", "pf-power-index"],
    confidenceScore: 0.70,
    sourceLabel: "Simulated Injury Report Feed",
    publishedAt: "2025-11-12T10:00:00Z",
    educationalAngle:
      "Skill-position injuries send immediate ripples through related assets: the player coin drops most, the team stock dips moderately, and the broad index barely moves. This magnitude difference is diversification doing its job.",
    reliability: "moderate",
  },
  {
    id: "src-pf-injury-bal-qb1",
    title: "[SIMULATED] Baltimore QB1 Knee Bruise — Probable Tag Applied",
    summary:
      "Simulated medical report: Baltimore Football Team's dual-threat quarterback received a Probable designation after a knee bruise suffered in Sunday's game. Expected to play, but reduced mobility could limit the rushing game that drives Baltimore's offensive system.",
    sport: "Football",
    league: "Pro Football",
    storyType: "injury",
    relatedAssetIds: ["bal-qb1-coin", "balft-stock", "pf-mvp-future", "pf-power-index"],
    confidenceScore: 0.82,
    sourceLabel: "Simulated Injury Report Feed",
    publishedAt: "2025-11-19T11:30:00Z",
    educationalAngle:
      "A 'Probable' designation reduces uncertainty more than it eliminates it. The market partially prices in the injury risk but retains a portion of the discount until game-day confirmation. This is how markets handle partial information.",
    reliability: "confirmed",
  },

  // ── Breakout Performance ─────────────────────────────────────────────────

  {
    id: "src-pf-breakout-kc-qb1-perfect",
    title: "[SIMULATED] Kansas City QB1 Posts Perfect Passer Rating — Fourth Straight Dominant Game",
    summary:
      "Simulated box score: The Kansas City QB1 recorded a perfect efficiency rating for the second time this season — 340 yards, four touchdowns, zero turnovers. KCQB1 reached a new season high as MVP conversation solidified.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["kc-qb1-coin", "kcft-stock", "pf-mvp-future", "pf-champ-momentum-future"],
    confidenceScore: 0.96,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-11-16T23:00:00Z",
    educationalAngle:
      "Elite quarterback efficiency across multiple games creates both player coin appreciation and team stock momentum. The MVP futures connection shows how individual excellence becomes a macro-market narrative — lifting the whole ecosystem.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-breakout-dal-edge",
    title: "[SIMULATED] Dallas Edge Rusher Sets Single-Game Disruption Record",
    summary:
      "Simulated performance data: The Dallas Edge Rusher recorded four sacks and three quarterback hurries in a dominant defensive performance — the highest single-game disruption score in the simulated season. DALEDG surged to a monthly high.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["dal-edge-coin", "dalft-stock", "pf-def-star-future", "pf-def-edge-index"],
    confidenceScore: 0.92,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-11-23T22:30:00Z",
    educationalAngle:
      "Defensive breakout games move the player coin most, with ripples into team stock, the defensive futures asset, and the sector index. The magnitude drops at each step — primary asset moves most, index moves least. This is the cascade effect of concentrated star performance.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-breakout-buf-qb1-wind",
    title: "[SIMULATED] Buffalo QB1 Throws for 380 Yards in Gusting Wind — Arm Talent Validated",
    summary:
      "Simulated box score: Buffalo QB1 overcame 25 mph gusting winds to throw for 380 yards and three touchdowns in a statement performance. The weather condition made the efficiency metrics even more impressive, accelerating the MVP narrative.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["buf-qb1-coin", "bufft-stock", "pf-mvp-future", "pf-champ-momentum-future"],
    confidenceScore: 0.94,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-11-30T21:15:00Z",
    educationalAngle:
      "Adverse-condition performance validates a player's core skill claim more than good-weather numbers. Markets price in a 'weather premium' on big-arm quarterbacks who deliver in difficult environments — it's a quality-of-evidence signal.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-breakout-lv-rb1-streak",
    title: "[SIMULATED] Las Vegas RB1 Breaks 140-Yard Mark for Third Straight Week",
    summary:
      "Simulated box score: Las Vegas RB1 rushed for 148 yards and two touchdowns, extending a three-game 140-yard streak — the longest in the simulated season. LVRB1 holders saw the biggest weekly gain among all pro football running backs.",
    sport: "Football",
    league: "Pro Football",
    storyType: "breakout_performance",
    relatedAssetIds: ["lv-rb1-coin", "lvft-stock", "pf-young-stars-index"],
    confidenceScore: 0.90,
    sourceLabel: "Simulated Box Score Pipeline",
    publishedAt: "2025-12-07T22:00:00Z",
    educationalAngle:
      "Streak performance creates a momentum premium that extends beyond individual game value. Markets price in continuation probability — three straight elite games makes LVRB1 more valuable than the raw stat total suggests, because it validates consistency.",
    reliability: "confirmed",
  },

  // ── Team Momentum ────────────────────────────────────────────────────────

  {
    id: "src-pf-momentum-det-win-streak",
    title: "[SIMULATED] Detroit Football Team Wins 7th Straight — Playoff Seeding Locked",
    summary:
      "Simulated standings model: The Detroit Football Team has now won seven consecutive games, locking their playoff seeding position. DETFT reached a seasonal high as the championship narrative solidified around this franchise's unexpected run.",
    sport: "Football",
    league: "Pro Football",
    storyType: "team_momentum",
    relatedAssetIds: ["detft-stock", "det-wr1-coin", "det-rb1-coin", "pf-champ-momentum-future", "pf-power-index"],
    confidenceScore: 0.88,
    sourceLabel: "Simulated Standings and Momentum Engine",
    publishedAt: "2025-11-22T19:00:00Z",
    educationalAngle:
      "Win streaks create compounding momentum premiums — each additional win raises the probability of the next, which lifts price further. The team stock, player coins, and championship futures all gain together when franchise momentum is this strong.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-momentum-bal-defense-shutout",
    title: "[SIMULATED] Baltimore Football Team Posts Second Shutout in Three Weeks",
    summary:
      "Simulated defensive stats: Baltimore Football Team has shut out their second opponent in three weeks — the most dominant defensive stretch of the simulated season. BALFT, the Defensive Edge Index, and defensive futures all moved sharply higher.",
    sport: "Football",
    league: "Pro Football",
    storyType: "team_momentum",
    relatedAssetIds: ["balft-stock", "bal-lb1-coin", "pf-def-edge-index", "pf-def-arch-stock", "pf-champ-momentum-future"],
    confidenceScore: 0.90,
    sourceLabel: "Simulated Defensive Analytics Feed",
    publishedAt: "2025-11-29T18:30:00Z",
    educationalAngle:
      "Back-to-back defensive dominance moves the entire defensive asset cluster: team stock, linebacker coins, coach stock, and sector index all gain. This cluster behavior demonstrates how a single franchise theme can simultaneously lift a basket of related assets.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-momentum-buf-road-win",
    title: "[SIMULATED] Buffalo Football Team Goes 4-0 Away from Home — Road Warriors Premium",
    summary:
      "Simulated travel-game model: Buffalo Football Team is now a perfect 4-0 in road games, generating the strongest away-game differential in the simulated league. Road dominance is one of the strongest championship predictor signals in the model.",
    sport: "Football",
    league: "Pro Football",
    storyType: "team_momentum",
    relatedAssetIds: ["bufft-stock", "buf-qb1-coin", "pf-champ-momentum-future", "pf-power-index"],
    confidenceScore: 0.85,
    sourceLabel: "Simulated Standings and Momentum Engine",
    publishedAt: "2025-12-01T17:00:00Z",
    educationalAngle:
      "Road wins are weighted more heavily than home wins in championship probability models because they require more consistent execution. A perfect road record creates a statistical premium that lifts both the team stock and the championship futures basket.",
    reliability: "strong",
  },

  // ── Coach Stories ────────────────────────────────────────────────────────

  {
    id: "src-pf-coach-off-mastermind-recognition",
    title: "[SIMULATED] Offensive Mastermind Coach Named Top Coordinator for Third Straight Week",
    summary:
      "Simulated analyst ratings: The Offensive Mastermind Coach has topped the weekly coordinator rankings for the third consecutive week, building the most dominant Coach of the Year case of the simulated season. OFMC and the Coach Momentum Future surged.",
    sport: "Football",
    league: "Pro Football",
    storyType: "coach_buzz",
    relatedAssetIds: ["pf-off-coach-stock", "pf-coach-momentum-future", "pf-power-index"],
    confidenceScore: 0.80,
    sourceLabel: "Simulated Analyst Rating Engine",
    publishedAt: "2025-11-14T10:00:00Z",
    educationalAngle:
      "Coaching award recognition accumulates over time — early leaders build a reputation premium that compounds as the season progresses. The market prices in this compounding effect, lifting coaching stocks beyond what a single-game analysis would justify.",
    reliability: "strong",
  },
  {
    id: "src-pf-coach-hot-seat-blowout",
    title: "[SIMULATED] Hot Seat Coach Faces Fourth Blowout Loss — Front Office Pressure Intensifies",
    summary:
      "Simulated narrative tracker: The franchise in question has now lost four games by more than 20 points, and reports of front-office dissatisfaction are spreading through the simulated analyst ecosystem. HOTS dropped to a new season low.",
    sport: "Football",
    league: "Pro Football",
    storyType: "coach_controversy",
    relatedAssetIds: ["pf-hot-seat-stock", "pf-power-index"],
    confidenceScore: 0.62,
    sourceLabel: "Simulated Team Report Feed",
    publishedAt: "2025-11-18T14:00:00Z",
    educationalAngle:
      "Job-security controversy is the most volatile coaching narrative. Markets price in leadership uncertainty immediately because the outcome — coaching change or continuation — is a binary event with major asset implications. Even unconfirmed pressure reports move prices.",
    reliability: "moderate",
  },
  {
    id: "src-pf-coach-rookie-dev-breakout",
    title: "[SIMULATED] Rookie Developer Coach Produces Third Player Breakout in One Season",
    summary:
      "Simulated performance analytics: For the third time this season, a player under the Rookie Developer Coach's system has produced a career-high statistical performance. Development narrative is building the most compelling long-term coaching stock case in the market.",
    sport: "Football",
    league: "Pro Football",
    storyType: "coach_buzz",
    relatedAssetIds: ["pf-rookie-dev-stock", "pf-young-stars-index", "pf-power-index"],
    confidenceScore: 0.78,
    sourceLabel: "Simulated Development Analytics Feed",
    publishedAt: "2025-11-26T11:00:00Z",
    educationalAngle:
      "Player development success creates a long-term coaching stock premium that is often underpriced early in the season. The market re-rates upward as evidence accumulates — this is value discovery in a narrative asset.",
    reliability: "strong",
  },

  // ── Award Races ──────────────────────────────────────────────────────────

  {
    id: "src-pf-award-mvp-kc-vs-buf",
    title: "[SIMULATED] MVP Race Narrows to KC QB1 vs. Buffalo QB1 — Separation Compresses",
    summary:
      "Simulated award tracker: The simulated MVP race has narrowed to a two-candidate contest between the Kansas City and Buffalo quarterbacks, separated by just 0.4 composite performance points. Futures compression is creating a buying opportunity before the final stretch.",
    sport: "Football",
    league: "Pro Football",
    storyType: "award_race",
    relatedAssetIds: ["pf-mvp-future", "kc-qb1-coin", "buf-qb1-coin"],
    confidenceScore: 0.84,
    sourceLabel: "Simulated Award Probability Engine",
    publishedAt: "2025-12-03T09:30:00Z",
    educationalAngle:
      "When an award race narrows to two candidates, the futures price rises because uncertainty has compressed — one of two known outcomes will happen. This is how expectation-based pricing works when the probability distribution concentrates.",
    reliability: "strong",
  },
  {
    id: "src-pf-award-def-star-sack-leader",
    title: "[SIMULATED] Dallas Edge Rusher Leads League in Sacks — Defensive Star Case Builds",
    summary:
      "Simulated cumulative stats: The Dallas Edge Rusher has taken the sack lead for the first time this season, pushing the Defensive Star Future to a monthly high. The market had previously underweighted this candidate relative to the offense-heavy competition.",
    sport: "Football",
    league: "Pro Football",
    storyType: "award_race",
    relatedAssetIds: ["pf-def-star-future", "dal-edge-coin", "pf-def-edge-index"],
    confidenceScore: 0.82,
    sourceLabel: "Simulated Award Probability Engine",
    publishedAt: "2025-12-06T10:00:00Z",
    educationalAngle:
      "Defensive award futures are often underpriced because the market systematically underweights defensive performance. Taking the sack lead creates a sudden re-rating — the market rushes to catch up to what the stats already showed.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-award-coach-momentum-final-push",
    title: "[SIMULATED] Coach Momentum Future Surges as Two Candidates Separate from the Pack",
    summary:
      "Simulated coaching recognition tracker: The field has narrowed significantly, with two head coaches pulling well ahead of the rest. PFCMF futures reached a season high as the market priced in the clear path to a two-candidate finale.",
    sport: "Football",
    league: "Pro Football",
    storyType: "award_race",
    relatedAssetIds: ["pf-coach-momentum-future", "pf-off-coach-stock", "pf-rookie-dev-stock"],
    confidenceScore: 0.80,
    sourceLabel: "Simulated Award Probability Engine",
    publishedAt: "2025-12-09T09:00:00Z",
    educationalAngle:
      "When a field of many narrows to two, the futures price rises in two ways: uncertainty falls, and each remaining candidate's individual impact on the futures value increases. This is the mechanics of winner-take-all expectation markets.",
    reliability: "strong",
  },

  // ── Championship Momentum ────────────────────────────────────────────────

  {
    id: "src-pf-champ-kc-det-buf-surge",
    title: "[SIMULATED] Three Top Contenders Win Convincingly on the Same Weekend",
    summary:
      "Simulated championship model: Kansas City, Detroit, and Buffalo all posted dominant performances on the same weekend — the first time three of the four top contenders won by double digits in the same week. PFCHM reached a new season high.",
    sport: "Football",
    league: "Pro Football",
    storyType: "championship_momentum",
    relatedAssetIds: ["pf-champ-momentum-future", "kcft-stock", "detft-stock", "bufft-stock", "pf-power-index"],
    confidenceScore: 0.92,
    sourceLabel: "Simulated Championship Probability Model",
    publishedAt: "2025-12-10T20:00:00Z",
    educationalAngle:
      "When multiple championship contenders win simultaneously, the championship futures basket lifts even faster than individual team stocks because the overall quality level of the contender pool just rose. Basket assets amplify correlated upside.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-champ-sf-clinch",
    title: "[SIMULATED] San Francisco Football Team Clinches Top Seed — Home Field Secured",
    summary:
      "Simulated playoff bracket: San Francisco Football Team has clinched the top seed and home-field advantage through the simulated playoffs. SFFT jumped to a monthly high as the home-field premium was formally priced into the championship model.",
    sport: "Football",
    league: "Pro Football",
    storyType: "championship_momentum",
    relatedAssetIds: ["sfft-stock", "sf-rb1-coin", "pf-champ-momentum-future", "pf-power-index"],
    confidenceScore: 0.95,
    sourceLabel: "Simulated Championship Probability Model",
    publishedAt: "2025-12-14T17:00:00Z",
    educationalAngle:
      "Clinching events resolve a major uncertainty — seeding — and let the market price in the full home-field advantage premium in one moment. Clarity events like this are the clearest example of how certainty reduces risk premiums and lifts asset prices.",
    reliability: "confirmed",
  },

  // ── Meme Hype ────────────────────────────────────────────────────────────

  {
    id: "src-pf-meme-missed-tackle-week",
    title: "[SIMULATED] League-Wide Missed Tackle Epidemic — MTC Hits Weekly Record",
    summary:
      "Simulated missed tackle tracker: This week set a new record for total missed tackles across all tracked games — 487 missed in one weekend, shattering the previous high. Missed Tackle Coin holders celebrated the chaos with a 60%+ surge.",
    sport: "Football",
    league: "Pro Football",
    storyType: "meme_hype",
    relatedAssetIds: ["missed-tackle-coin", "fourth-quarter-coin", "red-zone-coin"],
    confidenceScore: 0.65,
    sourceLabel: "Simulated Viral Moments Tracker",
    publishedAt: "2025-11-17T23:00:00Z",
    educationalAngle:
      "MTC is a pure sentiment coin — it rises on collective frustration. There are no fundamentals to anchor it, which means the move is fast and the reversal is equally fast. This is the textbook case for why you do not hold meme coins long-term.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-meme-hail-mary-connects",
    title: "[SIMULATED] Miracle Hail Mary at the Final Whistle — HMC Explodes Overnight",
    summary:
      "Simulated viral moments: A desperation 60-yard heave into triple coverage somehow connected as time expired, producing the first successful Hail Mary play of the simulated season. HMC holders saw the largest single-game gain of any Fanfolio coin this year.",
    sport: "Football",
    league: "Pro Football",
    storyType: "meme_hype",
    relatedAssetIds: ["hail-mary-coin", "missed-tackle-coin", "fourth-quarter-coin"],
    confidenceScore: 0.60,
    sourceLabel: "Simulated Viral Moments Tracker",
    publishedAt: "2025-11-24T23:45:00Z",
    educationalAngle:
      "HMC teaches lottery-bias in markets. The coin's expected return is very low — Hail Marys almost never work. But when they do, the payoff is enormous, which keeps buyers interested at irrationally high prices. This is pure behavioral finance.",
    reliability: "confirmed",
  },

  // ── Index Rotation ───────────────────────────────────────────────────────

  {
    id: "src-pf-index-rotation-to-defense",
    title: "[SIMULATED] Capital Rotates from QB Coins into Defensive Sector",
    summary:
      "Simulated capital flow model: Following two consecutive low-scoring weekends, capital is rotating out of quarterback coins and into the Defensive Edge Index and defensive player coins. DEFI is gaining as KCQB1 and BUFQB1 apply modest giving back.",
    sport: "Football",
    league: "Pro Football",
    storyType: "index_rotation",
    relatedAssetIds: ["pf-def-edge-index", "pf-def-arch-stock", "kc-qb1-coin", "buf-qb1-coin"],
    confidenceScore: 0.74,
    sourceLabel: "Simulated Capital Flow Model",
    publishedAt: "2025-11-25T13:00:00Z",
    educationalAngle:
      "Sector rotation is how experienced simulated traders rebalance. Moving capital from QB coins (offense) to the Defensive Edge Index during a defensive-dominant stretch is a theme-based rotation — the same move institutional investors make in real markets.",
    reliability: "moderate",
  },
  {
    id: "src-pf-index-rotation-power-index-rally",
    title: "[SIMULATED] Capital Flows into Pro Football Power Index After Volatile Week",
    summary:
      "Simulated capital flow model: Following a week of high individual-asset volatility, capital is moving into the Pro Football Power Index as traders seek stability. PFPI is gaining even as individual team stocks show mixed results.",
    sport: "Football",
    league: "Pro Football",
    storyType: "index_rotation",
    relatedAssetIds: ["pf-power-index", "pf-champ-momentum-future", "missed-tackle-coin", "hail-mary-coin"],
    confidenceScore: 0.72,
    sourceLabel: "Simulated Capital Flow Model",
    publishedAt: "2025-12-08T12:00:00Z",
    educationalAngle:
      "After volatile individual-asset weeks, traders often retreat to indexes as a 'flight to diversification.' This is the portfolio equivalent of a flight to quality — buying the basket instead of the individual component.",
    reliability: "moderate",
  },

  // ── Confirmed Trades / General News ─────────────────────────────────────

  {
    id: "src-pf-trade-lv-edge-extension",
    title: "[SIMULATED] Las Vegas Edge Rusher Signs Multi-Year Extension — Certainty Restored",
    summary:
      "Simulated transaction wire: The Las Vegas Football Team's premier pass rusher has signed a multi-year contract extension, ending speculation about his future. LVEDG surged as the market priced in long-term certainty and commitment from both sides.",
    sport: "Football",
    league: "Pro Football",
    storyType: "confirmed_trade",
    relatedAssetIds: ["lv-edge-coin", "lvft-stock", "pf-def-edge-index"],
    confidenceScore: 0.96,
    sourceLabel: "Simulated Transaction Wire",
    publishedAt: "2025-10-30T15:00:00Z",
    educationalAngle:
      "Contract extensions eliminate a key uncertainty premium. Before the deal, LVEDG held a discount reflecting the chance the player would leave. After confirmation, that discount is erased immediately — certainty is always priced in the moment it arrives.",
    reliability: "confirmed",
  },
  {
    id: "src-pf-general-kcft-media-attention",
    title: "[SIMULATED] Kansas City Football Team Dominates National Media Coverage for Third Straight Week",
    summary:
      "Simulated media tracker: The Kansas City Football Team has generated the highest national media coverage score for the third consecutive week, driven by their winning streak and the ongoing MVP narrative around QB1. Brand assets and futures all benefit.",
    sport: "Football",
    league: "Pro Football",
    storyType: "general_news",
    relatedAssetIds: ["kcft-stock", "kc-qb1-coin", "kc-te1-coin", "pf-mvp-future"],
    confidenceScore: 0.76,
    sourceLabel: "Simulated Media Attention Tracker",
    publishedAt: "2025-11-20T08:30:00Z",
    educationalAngle:
      "Media attention is a compounding premium. Each additional week of national coverage lifts brand value — not just on-field performance. The Kansas City ecosystem demonstrates how media narrative and fundamentals reinforce each other during winning streaks.",
    reliability: "strong",
  },

  // ── General News ────────────────────────────────────────────────────────────

  {
    id: "src-general-cowboys-media-cycle",
    title: "[SIMULATED] Dallas Football Team Dominates National Media Coverage — Rally in Brand Assets",
    summary:
      "Simulated media tracker: The Dallas Football Team has generated more national media coverage this week than any other franchise, driven by a high-profile rivalry matchup preview. Brand-driven assets rally on coverage alone — performance is secondary.",
    sport: "Football",
    league: "Pro Football",
    storyType: "general_news",
    relatedAssetIds: ["cowboys-stock", "parsons-coin", "nfl-power-index"],
    confidenceScore: 0.72,
    sourceLabel: "Simulated Media Attention Tracker",
    publishedAt: "2025-11-13T08:00:00Z",
    educationalAngle:
      "High-media assets can rally on coverage alone. Brand value and performance value are different drivers — a high-profile franchise demonstrates that media narrative moves price even when underlying stats are mixed.",
    reliability: "strong",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Utilities
// ─────────────────────────────────────────────────────────────────────────────

export function getSourceStoryById(id: string): MarketSourceStory | undefined {
  return MOCK_SOURCE_STORIES.find(s => s.id === id);
}

export function getRandomSourceStory(excludeId?: string): MarketSourceStory | null {
  const pool = excludeId
    ? MOCK_SOURCE_STORIES.filter(s => s.id !== excludeId)
    : MOCK_SOURCE_STORIES;
  if (pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}
