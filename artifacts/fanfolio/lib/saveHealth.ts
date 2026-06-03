import type {
  GameState,
  Holding,
  Transaction,
  AppliedEvent,
  PortfolioSnapshot,
} from "@/context/GameContext";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type SaveHealthStatus = "ok" | "repaired" | "corrupted";

export interface SaveHealthResult {
  status: SaveHealthStatus;
  state: GameState | null;
  message: string;
  repairedFields: string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Repair defaults (mirrors GameContext defaultState, kept in sync manually)
// ─────────────────────────────────────────────────────────────────────────────

const REPAIR_DEFAULTS: Readonly<GameState> = {
  luckyCoinBalance: 10000,
  holdings: [],
  transactions: [],
  hasCompletedOnboarding: false,
  lastDailyClaim: null,
  username: "TraderFan",
  joinDate: 0,
  priceOverrides: {},
  appliedEvents: [],
  watchlist: [],
  xp: 0,
  claimedChallenges: [],
  challengeFlags: [],
  lessonsOpened: 0,
  portfolioSnapshots: [],
  lastAutoPulseDate: null,
  pendingPulseId: null,
  pendingGeneratedPulse: null,
};

// ─────────────────────────────────────────────────────────────────────────────
// Type guards
// ─────────────────────────────────────────────────────────────────────────────

function isStringArray(val: unknown): val is string[] {
  return Array.isArray(val) && val.every((v) => typeof v === "string");
}

function isValidHolding(h: unknown): h is Holding {
  if (!h || typeof h !== "object" || Array.isArray(h)) return false;
  const obj = h as Record<string, unknown>;
  return (
    typeof obj.assetId === "string" &&
    typeof obj.quantity === "number" &&
    isFinite(obj.quantity) &&
    obj.quantity >= 0 &&
    typeof obj.averageCost === "number" &&
    isFinite(obj.averageCost) &&
    obj.averageCost >= 0 &&
    typeof obj.totalInvested === "number" &&
    isFinite(obj.totalInvested) &&
    obj.totalInvested >= 0
  );
}

function isValidTransaction(t: unknown): t is Transaction {
  if (!t || typeof t !== "object" || Array.isArray(t)) return false;
  const obj = t as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.assetId === "string" &&
    typeof obj.assetName === "string" &&
    typeof obj.assetSymbol === "string" &&
    (obj.type === "buy" || obj.type === "sell") &&
    typeof obj.quantity === "number" &&
    typeof obj.price === "number" &&
    typeof obj.total === "number" &&
    typeof obj.timestamp === "number"
  );
}

function isValidAppliedEvent(e: unknown): e is AppliedEvent {
  if (!e || typeof e !== "object" || Array.isArray(e)) return false;
  const obj = e as Record<string, unknown>;
  return (
    typeof obj.eventId === "string" &&
    typeof obj.title === "string" &&
    typeof obj.appliedAt === "number"
  );
}

function isValidPortfolioSnapshot(s: unknown): s is PortfolioSnapshot {
  if (!s || typeof s !== "object" || Array.isArray(s)) return false;
  const obj = s as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.timestamp === "number" &&
    isFinite(obj.timestamp as number) &&
    typeof obj.totalPortfolioValue === "number" &&
    isFinite(obj.totalPortfolioValue as number) &&
    typeof obj.cashBalance === "number" &&
    isFinite(obj.cashBalance as number) &&
    typeof obj.holdingsValue === "number" &&
    isFinite(obj.holdingsValue as number) &&
    typeof obj.totalReturnPercent === "number" &&
    isFinite(obj.totalReturnPercent as number) &&
    (obj.trigger === "app_open" || obj.trigger === "trade" || obj.trigger === "market_event" || obj.trigger === "manual")
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Core: safe parse + repair
// ─────────────────────────────────────────────────────────────────────────────

export function safeParseGameState(json: string): SaveHealthResult {
  // Step 1: JSON parse
  let raw: unknown;
  try {
    raw = JSON.parse(json);
  } catch {
    return {
      status: "corrupted",
      state: null,
      message: "Save file could not be read (invalid JSON).",
      repairedFields: [],
    };
  }

  // Step 2: top-level shape
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) {
    return {
      status: "corrupted",
      state: null,
      message: "Save file has an unexpected top-level format.",
      repairedFields: [],
    };
  }

  const obj = raw as Record<string, unknown>;
  const repaired: string[] = [];

  // ── luckyCoinBalance ──────────────────────────────────────────────────────
  let luckyCoinBalance: number;
  if (typeof obj.luckyCoinBalance === "number" && isFinite(obj.luckyCoinBalance)) {
    luckyCoinBalance = Math.max(0, obj.luckyCoinBalance);
    if (obj.luckyCoinBalance < 0) repaired.push("luckyCoinBalance (clamped to 0)");
  } else {
    luckyCoinBalance = REPAIR_DEFAULTS.luckyCoinBalance;
    repaired.push("luckyCoinBalance");
  }

  // ── holdings ─────────────────────────────────────────────────────────────
  let holdings: Holding[];
  if (Array.isArray(obj.holdings)) {
    holdings = (obj.holdings as unknown[]).filter(isValidHolding);
    if (holdings.length !== (obj.holdings as unknown[]).length) {
      repaired.push("holdings (removed invalid entries)");
    }
  } else {
    holdings = [];
    repaired.push("holdings");
  }

  // ── transactions ─────────────────────────────────────────────────────────
  let transactions: Transaction[];
  if (Array.isArray(obj.transactions)) {
    transactions = (obj.transactions as unknown[]).filter(isValidTransaction);
    if (transactions.length !== (obj.transactions as unknown[]).length) {
      repaired.push("transactions (removed invalid entries)");
    }
  } else {
    transactions = [];
    repaired.push("transactions");
  }

  // ── hasCompletedOnboarding ───────────────────────────────────────────────
  let hasCompletedOnboarding: boolean;
  if (typeof obj.hasCompletedOnboarding === "boolean") {
    hasCompletedOnboarding = obj.hasCompletedOnboarding;
  } else {
    hasCompletedOnboarding = REPAIR_DEFAULTS.hasCompletedOnboarding;
    repaired.push("hasCompletedOnboarding");
  }

  // ── lastDailyClaim ────────────────────────────────────────────────────────
  let lastDailyClaim: string | null;
  if (obj.lastDailyClaim === null || obj.lastDailyClaim === undefined) {
    lastDailyClaim = null;
  } else if (typeof obj.lastDailyClaim === "string") {
    lastDailyClaim = obj.lastDailyClaim;
  } else {
    lastDailyClaim = null;
    repaired.push("lastDailyClaim");
  }

  // ── username ──────────────────────────────────────────────────────────────
  let username: string;
  if (typeof obj.username === "string" && obj.username.trim().length > 0) {
    username = obj.username;
  } else {
    username = REPAIR_DEFAULTS.username;
    repaired.push("username");
  }

  // ── joinDate ──────────────────────────────────────────────────────────────
  let joinDate: number;
  if (typeof obj.joinDate === "number" && isFinite(obj.joinDate) && obj.joinDate > 0) {
    joinDate = obj.joinDate;
  } else {
    joinDate = Date.now();
    repaired.push("joinDate");
  }

  // ── priceOverrides ────────────────────────────────────────────────────────
  let priceOverrides: GameState["priceOverrides"];
  if (obj.priceOverrides && typeof obj.priceOverrides === "object" && !Array.isArray(obj.priceOverrides)) {
    priceOverrides = obj.priceOverrides as GameState["priceOverrides"];
  } else {
    priceOverrides = {};
    if (obj.priceOverrides !== undefined) repaired.push("priceOverrides");
  }

  // ── appliedEvents ─────────────────────────────────────────────────────────
  let appliedEvents: AppliedEvent[];
  if (Array.isArray(obj.appliedEvents)) {
    appliedEvents = (obj.appliedEvents as unknown[]).filter(isValidAppliedEvent);
    if (appliedEvents.length !== (obj.appliedEvents as unknown[]).length) {
      repaired.push("appliedEvents (removed invalid entries)");
    }
  } else {
    appliedEvents = [];
    if (obj.appliedEvents !== undefined) repaired.push("appliedEvents");
  }

  // ── watchlist ─────────────────────────────────────────────────────────────
  let watchlist: string[];
  if (isStringArray(obj.watchlist)) {
    watchlist = obj.watchlist;
  } else {
    watchlist = [];
    if (obj.watchlist !== undefined) repaired.push("watchlist");
  }

  // ── xp ───────────────────────────────────────────────────────────────────
  let xp: number;
  if (typeof obj.xp === "number" && isFinite(obj.xp)) {
    xp = Math.max(0, obj.xp);
    if (obj.xp < 0) repaired.push("xp (clamped to 0)");
  } else {
    xp = 0;
    if (obj.xp !== undefined) repaired.push("xp");
  }

  // ── claimedChallenges ─────────────────────────────────────────────────────
  let claimedChallenges: string[];
  if (isStringArray(obj.claimedChallenges)) {
    claimedChallenges = obj.claimedChallenges;
  } else {
    claimedChallenges = [];
    if (obj.claimedChallenges !== undefined) repaired.push("claimedChallenges");
  }

  // ── challengeFlags ────────────────────────────────────────────────────────
  let challengeFlags: string[];
  if (isStringArray(obj.challengeFlags)) {
    challengeFlags = obj.challengeFlags;
  } else {
    challengeFlags = [];
    if (obj.challengeFlags !== undefined) repaired.push("challengeFlags");
  }

  // ── lessonsOpened ─────────────────────────────────────────────────────────
  let lessonsOpened: number;
  if (typeof obj.lessonsOpened === "number" && isFinite(obj.lessonsOpened)) {
    lessonsOpened = Math.max(0, Math.floor(obj.lessonsOpened));
    if (obj.lessonsOpened < 0) repaired.push("lessonsOpened (clamped to 0)");
  } else {
    lessonsOpened = 0;
    if (obj.lessonsOpened !== undefined) repaired.push("lessonsOpened");
  }

  // ── portfolioSnapshots ────────────────────────────────────────────────────
  let portfolioSnapshots: PortfolioSnapshot[];
  if (Array.isArray(obj.portfolioSnapshots)) {
    portfolioSnapshots = (obj.portfolioSnapshots as unknown[]).filter(isValidPortfolioSnapshot);
    if (portfolioSnapshots.length !== (obj.portfolioSnapshots as unknown[]).length) {
      repaired.push("portfolioSnapshots (removed invalid entries)");
    }
  } else {
    portfolioSnapshots = [];
    if (obj.portfolioSnapshots !== undefined) repaired.push("portfolioSnapshots");
  }

  // ── lastAutoPulseDate ─────────────────────────────────────────────────────
  let lastAutoPulseDate: string | null;
  if (obj.lastAutoPulseDate === null || obj.lastAutoPulseDate === undefined) {
    lastAutoPulseDate = null;
  } else if (typeof obj.lastAutoPulseDate === "string") {
    lastAutoPulseDate = obj.lastAutoPulseDate;
  } else {
    lastAutoPulseDate = null;
    repaired.push("lastAutoPulseDate");
  }

  // ── pendingPulseId ────────────────────────────────────────────────────────
  let pendingPulseId: string | null;
  if (obj.pendingPulseId === null || obj.pendingPulseId === undefined) {
    pendingPulseId = null;
  } else if (typeof obj.pendingPulseId === "string") {
    pendingPulseId = obj.pendingPulseId;
  } else {
    pendingPulseId = null;
    repaired.push("pendingPulseId");
  }

  const state: GameState = {
    luckyCoinBalance,
    holdings,
    transactions,
    hasCompletedOnboarding,
    lastDailyClaim,
    username,
    joinDate,
    priceOverrides,
    appliedEvents,
    watchlist,
    xp,
    claimedChallenges,
    challengeFlags,
    lessonsOpened,
    portfolioSnapshots,
    lastAutoPulseDate,
    pendingPulseId,
    pendingGeneratedPulse: null,
  };

  const status: SaveHealthStatus = repaired.length === 0 ? "ok" : "repaired";
  const message =
    repaired.length === 0
      ? "Save loaded successfully."
      : `Save repaired — ${repaired.length} field${repaired.length === 1 ? "" : "s"} restored to defaults: ${repaired.join(", ")}.`;

  return { status, state, message, repairedFields: repaired };
}

// ─────────────────────────────────────────────────────────────────────────────
// UI summary helper
// ─────────────────────────────────────────────────────────────────────────────

export function summarizeSaveHealth(
  status: SaveHealthStatus,
  message: string
): string {
  if (status === "ok") return `Save OK: ${message}`;
  if (status === "repaired") return `Save repaired: ${message}`;
  return `Save corrupted: ${message}`;
}
