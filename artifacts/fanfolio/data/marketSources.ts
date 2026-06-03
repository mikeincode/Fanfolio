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
    title: "[SIMULATED] Kelce Knee Concern — Listed as Limited in Practice",
    summary:
      "Simulated injury report: Travis Kelce is listed as limited in Wednesday practice with a knee concern. Availability for the upcoming game is uncertain, creating short-term selling pressure on player-coin holders.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] 49ers Starting QB Listed as Questionable — Ankle Issue",
    summary:
      "Simulated injury report: The 49ers' starting quarterback is officially questionable for Sunday following an ankle sprain in Wednesday practice. Team stock holders face short-term uncertainty until the final injury designation.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] Jefferson Posts 220-Yard Historic Night — Three TDs",
    summary:
      "Simulated box score: Justin Jefferson recorded 220 receiving yards and three touchdowns in a prime-time matchup, setting a new single-game simulated franchise record. JJC surged to a monthly high immediately after the final whistle.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] Hurts Explodes for Four TDs and 80 Rush Yards — Eagles Dominant",
    summary:
      "Simulated game summary: Jalen Hurts posted a career-high four touchdowns — two rushing, two passing — driving the Eagles' offense to a season-best performance. Dual-threat output is the core value driver for JHRT holders.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] Parsons Shatters Single-Game Disruption Record — Defense Takes Over",
    summary:
      "Simulated performance data: Micah Parsons recorded 3.5 sacks and forced two fumbles, reaching a new single-game simulated record for total disruptions. Defensive-linked assets surged as the narrative shifted firmly to defense dominating the league.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] Lions Win 6th Straight — Playoff Confidence at Season High",
    summary:
      "Simulated standings model: Detroit has won six consecutive games, building the most dominant mid-season run in the NFC. Playoff probability scores are surging for DETL holders, and the championship narrative is driving futures higher.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] Ravens Hold Three Straight Opponents Under 10 Points",
    summary:
      "Simulated defensive stats: Baltimore has now held three consecutive opponents under 10 points — the most dominant defensive stretch of the simulated season. BALT, defensive coach stocks, and the defense index are all moving higher.",
    sport: "Football",
    league: "NFL",
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
    league: "NFL",
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
    league: "NFL",
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
    league: "NFL",
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
    league: "NFL",
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
    league: "NFL",
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
    title: "[SIMULATED] Chiefs Clinch Division — Championship Model Tilts in Their Favor",
    summary:
      "Simulated playoff model: The Kansas City Chiefs have clinched their division, moving to the top seed in the simulated playoff bracket. KCC and Mahomes Coin surge as championship probability shifts to the clear market leader.",
    sport: "Football",
    league: "NFL",
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
    league: "NFL",
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
    league: "NFL",
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
    league: "NFL",
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
      "Simulated capital flow model: A broad rotation out of high-volatility meme coins into the NFL Power Index and Fanfolio 100 is underway this week. Experienced traders are shifting toward stability following last week's meme-coin selloff.",
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
    title: "[SIMULATED] Trade Rumor: Jefferson in Discussions — Market Reacts to Uncertainty",
    summary:
      "Simulated trade rumor (unconfirmed): Multiple simulated sources suggest Justin Jefferson is in trade discussions with a new franchise. Until confirmed or denied, uncertainty is the dominant force — JJC is volatile while the broad index barely moves.",
    sport: "Football",
    league: "NFL",
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
    title: "[SIMULATED] Parsons Signs Long-Term Extension — Market Certainty Returns",
    summary:
      "Simulated transaction wire: Micah Parsons has agreed to a long-term contract extension with Dallas, ending months of speculation. Certainty is restored, and MPC surges as holders gain confidence in the asset's long-term value.",
    sport: "Football",
    league: "NFL",
    storyType: "confirmed_trade",
    relatedAssetIds: ["parsons-coin", "cowboys-stock", "defensive-coach-stock", "defense-index"],
    confidenceScore: 0.97,
    sourceLabel: "Simulated Transaction Wire",
    publishedAt: "2025-10-31T16:30:00Z",
    educationalAngle:
      "Confirmed contracts remove uncertainty and let the market price in long-term value. This is the opposite of a trade rumor — clarity resolves the risk premium and drives prices up as confidence returns.",
    reliability: "confirmed",
  },

  // ── General News ────────────────────────────────────────────────────────────

  {
    id: "src-general-cowboys-media-cycle",
    title: "[SIMULATED] Cowboys Dominate National Media Coverage — Rally in Brand Assets",
    summary:
      "Simulated media tracker: The Dallas Cowboys have generated more national media coverage this week than any other franchise, driven by a high-profile rivalry matchup preview. Brand-driven assets rally on coverage alone — performance is secondary.",
    sport: "Football",
    league: "NFL",
    storyType: "general_news",
    relatedAssetIds: ["cowboys-stock", "parsons-coin", "nfl-power-index"],
    confidenceScore: 0.72,
    sourceLabel: "Simulated Media Attention Tracker",
    publishedAt: "2025-11-13T08:00:00Z",
    educationalAngle:
      "High-media assets can rally on coverage alone. Brand value and performance value are different drivers — the Cowboys demonstrate that media narrative moves price even when underlying stats are mixed.",
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
