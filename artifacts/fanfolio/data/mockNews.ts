export type NewsSentiment = "bullish" | "bearish" | "neutral" | "volatile";

export type NewsCategory =
  | "Market Pulse"
  | "Meme Watch"
  | "Injury Report"
  | "Championship Picture"
  | "Rookie Watch"
  | "Index Report"
  | "Volatility Alert"
  | "Scanner Spotlight"
  | "Portfolio Lesson";

export interface MockNewsItem {
  id: string;
  title: string;
  summary: string;
  body: string;
  category: NewsCategory;
  timestampLabel: string;
  sentiment: NewsSentiment;
  relatedAssetIds: string[];
  relatedAssetSymbols: string[];
  relatedSports: string[];
  relatedAssetTypes: string[];
  impactLabel: string;
  lessonTitle: string;
  lessonCopy: string;
}

export const MOCK_NEWS: MockNewsItem[] = [
  {
    id: "news-01",
    title: "Meme Coins Cool After Hot Streak",
    summary: "After a multi-day surge, meme coin assets are showing signs of cooling. Traders who entered late are watching gains shrink.",
    body: "Meme assets including CHOKE, MWC, DRAMA, and UPSET saw heavy volume over the past week before pulling back sharply. Market observers noted that hype-driven assets often peak when casual traders pile in late. The MMA meme segment was hit hardest, with MWC dropping alongside broader cooling in the sector. Scanner users who spotted the reversal early had time to reassess their positions before the broader pullback.",
    category: "Meme Watch",
    timestampLabel: "2h ago",
    sentiment: "bearish",
    relatedAssetIds: ["choke-coin", "missed-weight-coin", "drama-coin", "upset-coin"],
    relatedAssetSymbols: ["CHOKE", "MWC", "DRAMA", "UPSET"],
    relatedSports: ["All Sports", "MMA"],
    relatedAssetTypes: ["Meme Coin"],
    impactLabel: "Sector pullback",
    lessonTitle: "Hype can fade quickly",
    lessonCopy: "Meme assets can surge on excitement and reverse just as fast. Traders who understand this use the scanner to monitor momentum before committing LuckyCoin.",
  },
  {
    id: "news-02",
    title: "Indexes Hold Steady During Chaotic Weekend",
    summary: "While individual player coins and meme assets swung wildly, sport indexes stayed relatively flat — a reminder of diversification at work.",
    body: "The Football Power Index (FPI), Basketball Stars Index (BSI), and MMA Chaos Index (MCI) all remained within a narrow range over a turbulent weekend of simulated action. The Fanfolio 100 (FF100), which tracks the overall simulated market, showed only minor movement. Index holders, by contrast, saw smoother simulated performance. This reinforces why index exposure is often described as a stabilizer in a portfolio that also includes higher-risk assets.",
    category: "Index Report",
    timestampLabel: "5h ago",
    sentiment: "neutral",
    relatedAssetIds: ["football-power-index", "basketball-stars-index", "mma-chaos-index", "fanfolio-100"],
    relatedAssetSymbols: ["FPI", "BSI", "MCI", "FF100"],
    relatedSports: ["Football", "Basketball", "MMA", "All Sports"],
    relatedAssetTypes: ["Sport Index"],
    impactLabel: "Low movement",
    lessonTitle: "Diversification can reduce swings",
    lessonCopy: "Indexes bundle many assets together. When one piece struggles, others can offset it. That is why index holders often see smoother portfolios — even when individual sectors are volatile.",
  },
  {
    id: "news-03",
    title: "Rookie Futures Heat Up After Breakout Performance",
    summary: "First-round rookie futures jumped after early simulated standout numbers. Traders who held through the preseason period are now sitting on simulated gains.",
    body: "The First-Round Rookie Future (RKF1) asset moved upward after simulated early-season breakout data was factored in. Futures pricing generally reflects expectations, so any signal that a rookie is outperforming preseason projections can move the market before the final results arrive. This is a textbook example of a futures contract reacting to updated expectations rather than confirmed results. Traders who bought early and held through uncertainty are now seeing the simulated payoff — though nothing is guaranteed in either direction.",
    category: "Rookie Watch",
    timestampLabel: "8h ago",
    sentiment: "bullish",
    relatedAssetIds: ["rookie-future"],
    relatedAssetSymbols: ["RKF1"],
    relatedSports: ["Football"],
    relatedAssetTypes: ["Future"],
    impactLabel: "Moderate upward move",
    lessonTitle: "Futures react to expectations",
    lessonCopy: "A futures contract is priced based on what the market expects to happen — not what has already happened. New information that shifts those expectations can move the price significantly, even before any final result is in.",
  },
  {
    id: "news-04",
    title: "Defense Assets Rise After Low-Scoring Simulated Week",
    summary: "The Defense Index gained ground after a low-scoring stretch drew renewed interest in defensive performance assets.",
    body: "The Defense Index (DEX) climbed after a simulated week featuring unusually low offensive output across multiple sports segments. When defensive play dominates, assets specifically tracking defensive performance tend to attract increased attention. DEX holders saw simulated gains while player coins tied to offensive output softened. This rotation illustrates how market attention can shift between sectors as the broader simulated environment changes — a concept central to understanding sector rotation in real markets.",
    category: "Market Pulse",
    timestampLabel: "12h ago",
    sentiment: "bullish",
    relatedAssetIds: ["defense-index"],
    relatedAssetSymbols: ["DEX"],
    relatedSports: ["Football"],
    relatedAssetTypes: ["Sport Index"],
    impactLabel: "Sector rotation signal",
    lessonTitle: "Market attention can rotate sectors",
    lessonCopy: "In real markets, money often rotates from one sector to another as conditions change. Traders who notice these patterns early — using tools like the scanner — can sometimes position ahead of the move.",
  },
  {
    id: "news-05",
    title: "Scanner Traders Spot Dip Opportunities in Meme Segment",
    summary: "Traders using the scanner's dip-watch presets flagged multiple meme assets trading well below their recent highs.",
    body: "As meme coin assets pulled back from recent highs, scanner users who had activated the dip-watch preset began flagging CHOKE, UPSET, and MWC as potential opportunities. The scanner spotted assets with significant negative daily changes while still showing elevated volume — a setup some traders watch for. Whether these assets rebound or continue lower depends on broader simulated conditions, but the scanner identified them before many manual searches would have. This is an example of research tools doing the early work so you can make a more informed decision.",
    category: "Scanner Spotlight",
    timestampLabel: "1d ago",
    sentiment: "neutral",
    relatedAssetIds: ["choke-coin", "upset-coin", "missed-weight-coin"],
    relatedAssetSymbols: ["CHOKE", "UPSET", "MWC"],
    relatedSports: ["All Sports", "MMA"],
    relatedAssetTypes: ["Meme Coin"],
    impactLabel: "Research opportunity",
    lessonTitle: "Scanners help traders find setups",
    lessonCopy: "A scanner does not tell you what to do — it tells you where to look. After identifying an asset, the research still needs to happen. Is the dip a bargain, or does it have further to fall?",
  },
  {
    id: "news-06",
    title: "MMA Chaos Sends Volatile Assets Moving Both Ways",
    summary: "A volatile stretch of simulated MMA events sent the MMA segment swinging. MWC surged, while KO and SUB moved in opposite directions.",
    body: "The MMA Chaos Index (MCI) whipsawed this week as multiple simulated fight outcomes defied expectations. MissedWeightCoin (MWC) jumped sharply on one event and fell the next. KnockoutCoin (KO) and SubmissionCoin (SUB) moved in opposite directions on the same card — a reminder that high-risk assets can move fast and unpredictably. Traders with concentrated MMA meme positions experienced larger swings than those with diversified exposure through indexes. The MCI itself showed more moderate movement than any individual meme coin.",
    category: "Volatility Alert",
    timestampLabel: "1d ago",
    sentiment: "volatile",
    relatedAssetIds: ["missed-weight-coin", "knockout-coin", "submission-coin", "mma-chaos-index"],
    relatedAssetSymbols: ["MWC", "KO", "SUB", "MCI"],
    relatedSports: ["MMA"],
    relatedAssetTypes: ["Meme Coin", "Sport Index"],
    impactLabel: "High volatility",
    lessonTitle: "High-risk assets move fast both ways",
    lessonCopy: "Volatility means prices can rise or fall sharply in a short time. That creates opportunity, but also risk. Holding a basket or index alongside individual high-risk assets can smooth out some of the swings.",
  },
  {
    id: "news-07",
    title: "Portfolio Builders Shift Toward Indexes",
    summary: "Simulated portfolio data shows a trend: traders with growing LuckyCoin balances are increasing index exposure relative to individual assets.",
    body: "As portfolios grow larger in the Fanfolio simulator, a pattern emerges — traders add more index assets over time. The Football Power Index (FPI), Basketball Stars Index (BSI), and Defense Index (DEX) have all seen steady simulated demand. Index assets provide exposure to a broad sector without concentrating all risk on a single player or team. For new traders focused on individual assets like player coins, this shift toward indexes represents a natural stage of portfolio maturity. A balanced portfolio often combines individual picks with index coverage.",
    category: "Portfolio Lesson",
    timestampLabel: "2d ago",
    sentiment: "bullish",
    relatedAssetIds: ["football-power-index", "basketball-stars-index", "defense-index"],
    relatedAssetSymbols: ["FPI", "BSI", "DEX"],
    relatedSports: ["Football", "Basketball"],
    relatedAssetTypes: ["Sport Index"],
    impactLabel: "Educational signal",
    lessonTitle: "Indexes are baskets",
    lessonCopy: "When you hold an index, you are exposed to the performance of many assets at once. One bad performer has a smaller impact. This is the core idea behind diversification — spreading exposure to reduce single-point risk.",
  },
  {
    id: "news-08",
    title: "Comeback Assets Rally After Dramatic Simulated Finish",
    summary: "ComebackCoin surged after a late rally in the simulated sports market rewarded traders who held through a painful drawdown.",
    body: "ComebackCoin (CMBC) recovered sharply after traders who had watched the asset fall 30% from its peak held their positions through the decline. The simulated asset, which tracks comeback-style market narratives, reversed course when late-week simulated events shifted sentiment. CMBC had been near the bottom of many portfolio reports for weeks before the recovery. This illustrates one of the hardest lessons in investing: recoveries often happen when confidence is lowest, and selling into weakness can sometimes mean missing the rebound.",
    category: "Market Pulse",
    timestampLabel: "2d ago",
    sentiment: "bullish",
    relatedAssetIds: ["comeback-coin"],
    relatedAssetSymbols: ["CMBC"],
    relatedSports: ["All Sports"],
    relatedAssetTypes: ["Meme Coin"],
    impactLabel: "Sharp reversal",
    lessonTitle: "Surprise events can create momentum",
    lessonCopy: "Markets do not move in straight lines. An asset near its lows can reverse sharply when unexpected positive news arrives. Patience and portfolio research can help separate a temporary dip from a deeper structural problem.",
  },
  {
    id: "news-09",
    title: "Championship Futures Surge on Playoff Momentum",
    summary: "The Championship Future and Super Bowl Future both jumped as playoff scenarios tightened in the simulated football market.",
    body: "Championship Future (CHAMP) gained significant ground as simulated playoff positioning narrowed. Futures prices tend to move sharply when the probability of an outcome changes — and in this case, a smaller field of contenders pushed values higher for holders who had entered before the move. The MMA Title Future (MMAF) also saw a smaller sympathetic gain. Futures are unique assets in that their value is entirely based on expected outcomes. As more uncertainty gets resolved, prices can swing dramatically either direction.",
    category: "Championship Picture",
    timestampLabel: "3d ago",
    sentiment: "bullish",
    relatedAssetIds: ["super-bowl-future", "mma-champ-future"],
    relatedAssetSymbols: ["CHAMP", "MMAF"],
    relatedSports: ["Football", "MMA"],
    relatedAssetTypes: ["Future"],
    impactLabel: "Futures repricing",
    lessonTitle: "Futures are priced on probability",
    lessonCopy: "The closer a future gets to resolution, the more sensitive its price becomes to new information. A narrowing field of outcomes can move a futures asset more than almost any other market event.",
  },
  {
    id: "news-10",
    title: "LeBron Coin Softens Ahead of Simulated Season Opener",
    summary: "LBJ pulled back slightly as the simulated market priced in uncertainty heading into the new season. Long-term holders are watching closely.",
    body: "LeBron Coin (LBJ) edged lower as the simulated basketball market entered its pre-season phase. Player coin assets tend to price in both current form and future expectations, and uncertainty about the coming season — even simulated — can create hesitation in the market. The Lakers FC Stock (LAL) moved in a similar direction. Traders who hold LBJ as a long-term position may view this pullback as normal pre-season noise, while shorter-term traders may interpret it as a signal to reassess. This type of pre-event uncertainty is common across real markets.",
    category: "Injury Report",
    timestampLabel: "3d ago",
    sentiment: "bearish",
    relatedAssetIds: ["lebron-coin", "lakers-stock"],
    relatedAssetSymbols: ["LBJ", "LAL"],
    relatedSports: ["Basketball"],
    relatedAssetTypes: ["Player Coin", "Team Stock"],
    impactLabel: "Minor pullback",
    lessonTitle: "Pre-event uncertainty creates volatility",
    lessonCopy: "Markets often price in uncertainty before major events. Assets can move before any news arrives — simply because traders are adjusting their expectations. This is sometimes called buying the rumor, selling the news.",
  },
  {
    id: "news-11",
    title: "Mahomes Coin Reaches Simulated Season High",
    summary: "PMC hit a new high in the simulated market as consistent performance metrics reinforced long-term holder conviction.",
    body: "Mahomes Coin (PMC) reached its highest point in the current simulated season after sustained positive performance data. The Chiefs FC Stock (KCC) tracked the move upward as well. PMC represents a player coin tied to expected on-field excellence — and consistent results reduce the uncertainty that typically creates downward pressure. Long-term holders who added to their positions at lower prices are now seeing the thesis play out in simulated form. This is a case study in patience: holding through normal volatility when fundamentals remain strong.",
    category: "Market Pulse",
    timestampLabel: "4d ago",
    sentiment: "bullish",
    relatedAssetIds: ["mahomes-coin", "chiefs-stock"],
    relatedAssetSymbols: ["PMC", "KCC"],
    relatedSports: ["Football"],
    relatedAssetTypes: ["Player Coin", "Team Stock"],
    impactLabel: "New high",
    lessonTitle: "Consistent performance drives long-term value",
    lessonCopy: "Assets tied to sustained excellence tend to trend upward over time in simulated markets. Short-term noise matters less when the underlying performance story stays strong. This mirrors real-world growth investing.",
  },
  {
    id: "news-12",
    title: "Fanfolio 100 Hits Monthly High",
    summary: "The broad market index FF100 crossed its monthly high — a sign that overall simulated market sentiment is improving across sectors.",
    body: "The Fanfolio 100 (FF100), which represents a broad basket of simulated sports market assets, crossed its monthly high. This movement reflects positive sentiment across multiple sectors simultaneously — football, basketball, and general market assets all contributed. When the broad index rises, it typically means more assets are gaining than falling. For portfolio builders, a strong broad market environment can lift all holdings — though individual asset selection still matters for outperformance. The Football Power Index (FPI) and Basketball Stars Index (BSI) both contributed meaningfully to the overall move.",
    category: "Index Report",
    timestampLabel: "5d ago",
    sentiment: "bullish",
    relatedAssetIds: ["fanfolio-100", "football-power-index", "basketball-stars-index"],
    relatedAssetSymbols: ["FF100", "FPI", "BSI"],
    relatedSports: ["All Sports", "Football", "Basketball"],
    relatedAssetTypes: ["Sport Index"],
    impactLabel: "Broad market strength",
    lessonTitle: "Broad index moves reflect overall sentiment",
    lessonCopy: "A rising broad index does not mean every asset gains — but it does suggest the overall environment is favorable. Traders use broad index signals alongside individual asset research to build conviction.",
  },
  {
    id: "news-13",
    title: "Meme Market Index Swings Wildly — Volatility Alert",
    summary: "The Meme Market Index recorded its largest single-week range since launch. Individual meme coins amplified the move in both directions.",
    body: "The Meme Market Index (MMI) saw extreme swings this week as its component meme coins all moved with above-average volatility. ChokeCoin (CHOKE) and DramaCoin (DRAMA) were the biggest contributors on opposing sides. The index recorded both a new weekly high and a near-term low within the same five-day period. For traders holding MMI as a diversified meme exposure vehicle, the ride was still smoother than holding any single meme coin — but the sector as a whole showed why high-risk assets deserve careful position sizing. The lesson: diversification within a high-risk sector reduces single-asset blow-up risk, but does not eliminate sector-wide volatility.",
    category: "Volatility Alert",
    timestampLabel: "5d ago",
    sentiment: "volatile",
    relatedAssetIds: ["meme-market-index", "choke-coin", "drama-coin"],
    relatedAssetSymbols: ["MMI", "CHOKE", "DRAMA"],
    relatedSports: ["All Sports"],
    relatedAssetTypes: ["Meme Coin"],
    impactLabel: "Extreme volatility",
    lessonTitle: "Position sizing matters in volatile sectors",
    lessonCopy: "Even diversified exposure to a volatile sector can produce large swings. Sizing positions according to your risk tolerance — not just expected return — is one of the most important portfolio habits to build.",
  },
  {
    id: "news-14",
    title: "Underdog Index Surprises With Quiet Rally",
    summary: "UDI gained ground steadily over the past week without a single dramatic headline. Slow and steady may have won this round.",
    body: "The Underdog Index (UDI), which tracks simulated market assets representing upsets and unexpected outcomes, gained quietly over the past week without a single major catalyst. No dramatic events. No viral moments. Just consistent upward drift. This type of move — called a slow grind — is less exciting than a spike but is often considered more durable by experienced traders. UDI holders who checked their portfolios daily may have almost missed it. This illustrates one of the underappreciated lessons in markets: not every gain comes with a headline attached.",
    category: "Market Pulse",
    timestampLabel: "6d ago",
    sentiment: "bullish",
    relatedAssetIds: ["underdog-index"],
    relatedAssetSymbols: ["UDI"],
    relatedSports: ["All Sports"],
    relatedAssetTypes: ["Sport Index"],
    impactLabel: "Slow grind higher",
    lessonTitle: "Not every gain comes with a headline",
    lessonCopy: "Dramatic news gets attention. But many of the best simulated portfolio gains happen quietly over time, not from a single spike. Checking in periodically rather than obsessively tracking every tick can help develop this kind of patience.",
  },
  {
    id: "news-15",
    title: "MMA Title Future Heats Up Pre-Event",
    summary: "MMAF gained ahead of the next simulated MMA championship event. Pre-event futures moves can sometimes reverse sharply after resolution.",
    body: "The MMA Title Future (MMAF) rose as the simulated championship fight week approached. This is a well-documented pattern with futures assets: they often rise ahead of anticipated events, then either spike on resolution or fall sharply if expectations were priced in. Traders who held MMAF for weeks may be considering whether to realize gains before the event or hold through resolution. The ClutchCoin (CLUTCH) also gained on the basketball side. This type of pre-event positioning — sometimes called front-running — is a strategy with both upside and downside. Getting the event right helps; getting out at the wrong time still costs.",
    category: "Championship Picture",
    timestampLabel: "7d ago",
    sentiment: "bullish",
    relatedAssetIds: ["mma-champ-future", "clutch-coin"],
    relatedAssetSymbols: ["MMAF", "CLUTCH"],
    relatedSports: ["MMA", "Basketball"],
    relatedAssetTypes: ["Future", "Meme Coin"],
    impactLabel: "Pre-event move",
    lessonTitle: "Pre-event moves can reverse after resolution",
    lessonCopy: "Assets sometimes rise ahead of events and fall after them — even if the result is positive. This is the classic buy the rumor, sell the news dynamic. Knowing when you plan to exit before an event is as important as deciding to enter.",
  },
];

export function getNewsByCategory(category: NewsCategory | "All"): MockNewsItem[] {
  if (category === "All") return MOCK_NEWS;
  return MOCK_NEWS.filter(n => n.category === category);
}

export function getNewsForAssets(assetIds: string[]): MockNewsItem[] {
  if (!assetIds.length) return [];
  return MOCK_NEWS.filter(n =>
    n.relatedAssetIds.some(id => assetIds.includes(id))
  );
}

export function getNewsForAsset(assetId: string): MockNewsItem[] {
  return MOCK_NEWS.filter(n => n.relatedAssetIds.includes(assetId));
}

export const NEWS_CATEGORIES: Array<NewsCategory | "All"> = [
  "All",
  "Market Pulse",
  "Meme Watch",
  "Index Report",
  "Rookie Watch",
  "Volatility Alert",
  "Scanner Spotlight",
  "Portfolio Lesson",
  "Championship Picture",
];

export const CATEGORY_ICONS: Record<NewsCategory | "All", string> = {
  "All": "rss",
  "Market Pulse": "activity",
  "Meme Watch": "zap",
  "Injury Report": "alert-circle",
  "Championship Picture": "award",
  "Rookie Watch": "star",
  "Index Report": "layers",
  "Volatility Alert": "alert-triangle",
  "Scanner Spotlight": "filter",
  "Portfolio Lesson": "book-open",
};

export const SENTIMENT_CONFIG: Record<NewsSentiment, { label: string; color: string; bgOpacity: string }> = {
  bullish: { label: "Bullish", color: "#22C55E", bgOpacity: "20" },
  bearish: { label: "Bearish", color: "#EF4444", bgOpacity: "20" },
  neutral: { label: "Neutral", color: "#94A3B8", bgOpacity: "20" },
  volatile: { label: "Volatile", color: "#F97316", bgOpacity: "20" },
};
