import type { GameState, PortfolioSnapshot } from "@/context/GameContext";
import { getAllAssetById } from "@/data/assetUniverse";

// ─────────────────────────────────────────────────────────────────────────────
// Save Summary
// ─────────────────────────────────────────────────────────────────────────────

export interface SaveSummary {
  username: string;
  balance: number;
  portfolioValue: number;
  totalValue: number;
  holdingsCount: number;
  transactionCount: number;
  watchlistCount: number;
  appliedEventCount: number;
  xp: number;
  claimedChallengeCount: number;
  lessonsOpened: number;
  hasCompletedOnboarding: boolean;
  snapshotCount: number;
  updatedAt: number | null;
}

export function summarizeState(
  state: GameState,
  updatedAt: number | null = null
): SaveSummary {
  const portfolioValue = state.holdings.reduce((sum, h) => {
    const asset = getAllAssetById(h.assetId);
    return sum + (asset ? asset.price * h.quantity : 0);
  }, 0);
  return {
    username: state.username,
    balance: state.luckyCoinBalance,
    portfolioValue,
    totalValue: portfolioValue + state.luckyCoinBalance,
    holdingsCount: state.holdings.length,
    transactionCount: state.transactions.length,
    watchlistCount: state.watchlist.length,
    appliedEventCount: state.appliedEvents.length,
    xp: state.xp,
    claimedChallengeCount: state.claimedChallenges.length,
    lessonsOpened: state.lessonsOpened,
    hasCompletedOnboarding: state.hasCompletedOnboarding,
    snapshotCount: (state.portfolioSnapshots ?? []).length,
    updatedAt,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Conflict Detection
// ─────────────────────────────────────────────────────────────────────────────

export type ConflictStatus =
  | "not_configured"
  | "signed_out"
  | "no_cloud_save"
  | "synced"
  | "local_newer"
  | "cloud_newer"
  | "possible_conflict";

export interface ConflictInfo {
  status: ConflictStatus;
  emoji: string;
  label: string;
  description: string;
  color: string;
}

const SYNCED_THRESHOLD_MS = 5 * 60 * 1000; // 5 minutes

export function detectConflict(params: {
  isConfigured: boolean;
  isSignedIn: boolean;
  localSummary: SaveSummary | null;
  cloudSummary: SaveSummary | null;
  lastSyncedAt: number | null;
}): ConflictInfo {
  const { isConfigured, isSignedIn, localSummary, cloudSummary, lastSyncedAt } = params;

  if (!isConfigured) {
    return { status: "not_configured", emoji: "🔌", label: "Not Configured", color: "#888", description: "Cloud save is not set up in this environment." };
  }
  if (!isSignedIn) {
    return { status: "signed_out", emoji: "🔓", label: "Signed Out", color: "#888", description: "Sign in to compare and sync your saves." };
  }
  if (!cloudSummary) {
    return { status: "no_cloud_save", emoji: "☁️", label: "No Cloud Save", color: "#F59E0B", description: "No cloud save found. Upload this device to back up your progress." };
  }

  const localTs = localSummary?.updatedAt ?? 0;
  const cloudTs = cloudSummary.updatedAt ?? 0;
  const diff = Math.abs(localTs - cloudTs);

  if (diff < SYNCED_THRESHOLD_MS && lastSyncedAt !== null) {
    return { status: "synced", emoji: "✅", label: "In Sync", color: "#22C55E", description: "Local and cloud saves appear to be in sync." };
  }
  if (localTs > cloudTs && diff > SYNCED_THRESHOLD_MS) {
    return { status: "local_newer", emoji: "📱", label: "Device Ahead", color: "#F59E0B", description: "This device has newer progress than your cloud save." };
  }
  if (cloudTs > localTs && diff > SYNCED_THRESHOLD_MS) {
    return { status: "cloud_newer", emoji: "☁️", label: "Cloud Ahead", color: "#3B82F6", description: "Your cloud save has newer progress than this device." };
  }
  return { status: "possible_conflict", emoji: "⚠️", label: "Differences Found", color: "#EF4444", description: "Both saves have differences. Compare before syncing." };
}

// ─────────────────────────────────────────────────────────────────────────────
// Diff helpers
// ─────────────────────────────────────────────────────────────────────────────

export interface SummaryDiff {
  field: string;
  localVal: string;
  cloudVal: string;
  localWins: boolean;
  cloudWins: boolean;
}

export function diffSummaries(local: SaveSummary, cloud: SaveSummary): SummaryDiff[] {
  const fmt = (n: number) => Math.round(n).toLocaleString();
  const rows: SummaryDiff[] = [
    { field: "Balance", localVal: fmt(local.balance) + " LC", cloudVal: fmt(cloud.balance) + " LC", localWins: local.balance > cloud.balance, cloudWins: cloud.balance > local.balance },
    { field: "Portfolio Value", localVal: fmt(local.portfolioValue) + " LC", cloudVal: fmt(cloud.portfolioValue) + " LC", localWins: local.portfolioValue > cloud.portfolioValue, cloudWins: cloud.portfolioValue > local.portfolioValue },
    { field: "Holdings", localVal: String(local.holdingsCount), cloudVal: String(cloud.holdingsCount), localWins: local.holdingsCount > cloud.holdingsCount, cloudWins: cloud.holdingsCount > local.holdingsCount },
    { field: "Trades", localVal: String(local.transactionCount), cloudVal: String(cloud.transactionCount), localWins: local.transactionCount > cloud.transactionCount, cloudWins: cloud.transactionCount > local.transactionCount },
    { field: "XP", localVal: fmt(local.xp), cloudVal: fmt(cloud.xp), localWins: local.xp > cloud.xp, cloudWins: cloud.xp > local.xp },
    { field: "Challenges", localVal: String(local.claimedChallengeCount), cloudVal: String(cloud.claimedChallengeCount), localWins: local.claimedChallengeCount > cloud.claimedChallengeCount, cloudWins: cloud.claimedChallengeCount > local.claimedChallengeCount },
    { field: "Watchlist", localVal: String(local.watchlistCount), cloudVal: String(cloud.watchlistCount), localWins: local.watchlistCount > cloud.watchlistCount, cloudWins: cloud.watchlistCount > local.watchlistCount },
  ];
  return rows.filter(r => r.localWins || r.cloudWins);
}

// ─────────────────────────────────────────────────────────────────────────────
// Safe merge (defined here but called via GameContext.smartMergeWithCloud)
// ─────────────────────────────────────────────────────────────────────────────

function mergeByKey<T>(items: T[], getKey: (item: T) => string): T[] {
  const map = new Map<string, T>();
  for (const item of items) {
    const key = getKey(item);
    if (!map.has(key)) map.set(key, item);
  }
  return Array.from(map.values());
}

function mergeHoldings(
  local: GameState["holdings"],
  cloud: GameState["holdings"]
): GameState["holdings"] {
  const map = new Map<string, GameState["holdings"][number]>();
  for (const h of [...local, ...cloud]) {
    const existing = map.get(h.assetId);
    if (!existing || h.quantity > existing.quantity) {
      map.set(h.assetId, h);
    }
  }
  return Array.from(map.values());
}

export function safeMerge(local: GameState, cloud: GameState): GameState {
  const localSnaps = local.portfolioSnapshots ?? [];
  const cloudSnaps = cloud.portfolioSnapshots ?? [];
  const mergedSnaps = mergeByKey(
    [...localSnaps, ...cloudSnaps],
    (s: PortfolioSnapshot) => s.id
  ).sort((a, b) => b.timestamp - a.timestamp).slice(0, 500);

  return {
    luckyCoinBalance: Math.max(local.luckyCoinBalance, cloud.luckyCoinBalance),
    watchlist: [...new Set([...local.watchlist, ...cloud.watchlist])],
    claimedChallenges: [...new Set([...local.claimedChallenges, ...cloud.claimedChallenges])],
    challengeFlags: [...new Set([...local.challengeFlags, ...cloud.challengeFlags])],
    xp: Math.max(local.xp, cloud.xp),
    lessonsOpened: Math.max(local.lessonsOpened, cloud.lessonsOpened),
    transactions: mergeByKey(
      [...local.transactions, ...cloud.transactions],
      t => t.id
    ).sort((a, b) => b.timestamp - a.timestamp).slice(0, 500),
    appliedEvents: mergeByKey(
      [...local.appliedEvents, ...cloud.appliedEvents],
      e => `${e.eventId}_${e.appliedAt}`
    ).sort((a, b) => b.appliedAt - a.appliedAt).slice(0, 20),
    holdings: mergeHoldings(local.holdings, cloud.holdings),
    hasCompletedOnboarding: local.hasCompletedOnboarding || cloud.hasCompletedOnboarding,
    username: local.username || cloud.username,
    joinDate: Math.min(local.joinDate, cloud.joinDate),
    priceOverrides: local.priceOverrides,
    lastDailyClaim: local.lastDailyClaim ?? cloud.lastDailyClaim,
    portfolioSnapshots: mergedSnaps,
    lastAutoPulseDate: local.lastAutoPulseDate ?? cloud.lastAutoPulseDate ?? null,
    pendingPulseId: local.pendingPulseId ?? cloud.pendingPulseId ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Format helpers for UI
// ─────────────────────────────────────────────────────────────────────────────

export function formatSyncTime(ts: number | null): string {
  if (!ts) return "Never";
  const d = new Date(ts);
  return d.toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" });
}
