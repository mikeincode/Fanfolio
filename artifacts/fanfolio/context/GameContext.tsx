import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Asset } from "@/data/mockAssets";
import { getAllAssetById } from "@/data/assetUniverse";
import { getEventById, getRandomEvent, MarketEvent } from "@/data/mockMarketEvents";
import { generateRandomSourceEvent } from "@/lib/marketSourceAdapter";
import { supabase, isSupabaseConfigured } from "@/lib/supabase";
import { safeMerge } from "@/lib/cloudSaveUtils";
import { safeParseGameState, SaveHealthStatus } from "@/lib/saveHealth";
import type { User } from "@supabase/supabase-js";

// ─── Live asset catalog ref ───────────────────────────────────────────────────
// Populated by LiveAssetRegistrar (rendered inside GameProvider in _layout.tsx).
// Avoids a circular import: useLiveAssets → GameContext → useLiveAssets.
// buildSnapshot consults this first; falls back to getAllAssetById for local mode.
let _liveAssetCatalog: Asset[] = [];

/** Call this from a component inside GameProvider to keep snapshot lookups current. */
export function registerLiveAssetCatalog(assets: Asset[]): void {
  _liveAssetCatalog = assets;
}

const STORAGE_KEY = "@fanfolio_game_state_v2";
const SAVED_AT_KEY = "@fanfolio_local_saved_at";
const BACKUP_KEY = "@fanfolio_local_backup_v1";
export const CORRUPTED_BACKUP_KEY = "@fanfolio_corrupted_save_backup_v1";
const INITIAL_BALANCE = 10000;
const DAILY_CLAIM_AMOUNT = 1000;

export interface Holding {
  assetId: string;
  quantity: number;
  averageCost: number;
  totalInvested: number;
}

export interface Transaction {
  id: string;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  type: "buy" | "sell";
  quantity: number;
  price: number;
  total: number;
  timestamp: number;
}

export interface AssetPriceOverride {
  price: number;
  previousPrice: number;
  dailyChangePercent: number;
  whyItMoved: string;
  chartData: number[];
  bullish: boolean;
}

export interface AppliedEvent {
  eventId: string;
  title: string;
  summary: string;
  sport: string;
  category: string;
  emoji: string;
  marketLesson: string;
  appliedAt: number;
  biggestMove: { symbol: string; assetId: string; changePercent: number };
}

export interface PortfolioSnapshot {
  id: string;
  timestamp: number;
  totalPortfolioValue: number;
  cashBalance: number;
  holdingsValue: number;
  totalReturnPercent: number;
  dayChangeValue?: number;
  dayChangePercent?: number;
  topHoldingId?: string;
  topMoverId?: string;
  trigger: "app_open" | "trade" | "market_event" | "manual";
}

export interface GameState {
  luckyCoinBalance: number;
  holdings: Holding[];
  transactions: Transaction[];
  hasCompletedOnboarding: boolean;
  lastDailyClaim: string | null;
  username: string;
  joinDate: number;
  priceOverrides: Record<string, AssetPriceOverride>;
  appliedEvents: AppliedEvent[];
  watchlist: string[];
  xp: number;
  claimedChallenges: string[];
  challengeFlags: string[];
  lessonsOpened: number;
  portfolioSnapshots: PortfolioSnapshot[];
  lastAutoPulseDate: string | null;
  pendingPulseId: string | null;
  /** Full generated event stored when the daily pulse was produced by the source adapter (not a curated event ID). */
  pendingGeneratedPulse: MarketEvent | null;
}

interface GameContextValue extends GameState {
  buyAsset: (assetId: string, assetName: string, assetSymbol: string, price: number, quantity: number) => { success: boolean; message: string };
  sellAsset: (assetId: string, assetName: string, assetSymbol: string, price: number, quantity: number) => { success: boolean; message: string };
  claimDaily: () => { success: boolean; message: string };
  completeOnboarding: (username: string) => void;
  getHolding: (assetId: string) => Holding | undefined;
  canClaimDaily: boolean;
  updateUsername: (username: string) => void;
  isLoaded: boolean;
  applyMarketEvent: (eventId?: string, opts?: { clearPending?: boolean; overrideEvent?: MarketEvent }) => { success: boolean; event: MarketEvent | null; message: string };
  prepareDailyPulse: () => void;
  reviewDailyPulse: () => { success: boolean; event: MarketEvent | null; message: string };
  latestEvent: AppliedEvent | null;
  addToWatchlist: (assetId: string) => void;
  removeFromWatchlist: (assetId: string) => void;
  isWatched: (assetId: string) => boolean;
  setChallengeFlag: (flagId: string) => void;
  addLessonOpen: () => void;
  claimChallengeReward: (challengeId: string, xpReward: number, lcReward: number) => { success: boolean };
  // ── Cloud Save ─────────────────────────────────────────────────────────────
  cloudUser: User | null;
  cloudEmail: string | null;
  isCloudReady: boolean;
  isSyncing: boolean;
  lastSyncedAt: number | null;
  localSavedAt: number | null;
  localBackupAt: number | null;
  syncError: string | null;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signUp: (email: string, password: string) => Promise<{ error: string | null; needsConfirmation: boolean }>;
  signOut: () => Promise<void>;
  saveToCloud: () => Promise<{ success: boolean; error: string | null }>;
  loadFromCloud: () => Promise<{ success: boolean; error: string | null; hasData: boolean }>;
  mergeCloudSave: (choice: "keep_local" | "load_cloud") => Promise<{ success: boolean; error: string | null }>;
  // ── Backup / Restore ──────────────────────────────────────────────────────
  saveLocalBackup: () => Promise<void>;
  restoreLocalBackup: () => Promise<{ success: boolean; error: string | null }>;
  // ── Advanced cloud ops ────────────────────────────────────────────────────
  fetchCloudState: () => Promise<{ state: GameState | null; updatedAt: number | null; error: string | null }>;
  smartMergeWithCloud: (cloudState: GameState) => Promise<{ success: boolean; error: string | null }>;
  loadFromCloudWithBackup: () => Promise<{ success: boolean; error: string | null; hasData: boolean }>;
  // ── Save health ───────────────────────────────────────────────────────────
  saveHealthStatus: SaveHealthStatus;
  saveHealthMessage: string;
  saveWasRepaired: boolean;
  corruptedSaveBackedUpAt: number | null;
  resetCorruptedLocalSave: () => void;
  restoreCorruptedBackup: () => Promise<{ success: boolean; error: string | null }>;
  // ── Performance snapshots ────────────────────────────────────────────────
  takeSnapshot: (trigger: PortfolioSnapshot["trigger"]) => void;
}

const GameContext = createContext<GameContextValue | null>(null);

const defaultState: GameState = {
  luckyCoinBalance: INITIAL_BALANCE,
  holdings: [],
  transactions: [],
  hasCompletedOnboarding: false,
  lastDailyClaim: null,
  username: "TraderFan",
  joinDate: Date.now(),
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

export function mergeGameState(base: GameState, partial: Partial<GameState>): GameState {
  return {
    ...base,
    ...partial,
    priceOverrides: partial.priceOverrides ?? base.priceOverrides ?? {},
    appliedEvents: partial.appliedEvents ?? base.appliedEvents ?? [],
    watchlist: partial.watchlist ?? base.watchlist ?? [],
    xp: partial.xp ?? base.xp ?? 0,
    claimedChallenges: partial.claimedChallenges ?? base.claimedChallenges ?? [],
    challengeFlags: partial.challengeFlags ?? base.challengeFlags ?? [],
    lessonsOpened: partial.lessonsOpened ?? base.lessonsOpened ?? 0,
    portfolioSnapshots: partial.portfolioSnapshots ?? base.portfolioSnapshots ?? [],
    lastAutoPulseDate: partial.lastAutoPulseDate ?? base.lastAutoPulseDate ?? null,
    pendingPulseId: partial.pendingPulseId ?? base.pendingPulseId ?? null,
    pendingGeneratedPulse: partial.pendingGeneratedPulse ?? base.pendingGeneratedPulse ?? null,
  };
}

// ─────────────────────────────────────────────────────────────────────────────
// Portfolio snapshot builder (pure, module-level)
// ─────────────────────────────────────────────────────────────────────────────

function buildSnapshot(
  params: {
    holdings: Holding[];
    luckyCoinBalance: number;
    priceOverrides: Record<string, AssetPriceOverride>;
    previousSnapshots: PortfolioSnapshot[];
  },
  trigger: PortfolioSnapshot["trigger"]
): PortfolioSnapshot | null {
  const now = Date.now();

  let holdingsValue = 0;
  let topHoldingId: string | undefined;
  let topHoldingValue = 0;
  let topMoverId: string | undefined;
  let topMoverChange = 0;

  for (const h of params.holdings) {
    // Resolve asset: live catalog (Supabase mode) → local mock fallback
    const base = _liveAssetCatalog.find(a => a.id === h.assetId) ?? getAllAssetById(h.assetId);
    if (!base) continue;
    const override = params.priceOverrides[h.assetId];
    const price = override?.price ?? base.price;
    const dailyChange = override?.dailyChangePercent ?? base.dailyChangePercent ?? 0;
    const value = price * h.quantity;
    holdingsValue += value;
    if (value > topHoldingValue) { topHoldingValue = value; topHoldingId = h.assetId; }
    if (Math.abs(dailyChange) > Math.abs(topMoverChange)) { topMoverChange = dailyChange; topMoverId = h.assetId; }
  }

  const totalPortfolioValue = holdingsValue + params.luckyCoinBalance;

  // Dedup: skip if last snapshot is too recent with same trigger and identical value
  const last = params.previousSnapshots[0];
  if (last) {
    const age = now - last.timestamp;
    const dedupMs = trigger === "app_open" ? 5 * 60 * 1000 : 4000;
    if (age < dedupMs && last.trigger === trigger && Math.abs(last.totalPortfolioValue - totalPortfolioValue) < 0.01) {
      return null;
    }
  }

  const totalReturnPercent = ((totalPortfolioValue - INITIAL_BALANCE) / INITIAL_BALANCE) * 100;

  let dayChangeValue: number | undefined;
  let dayChangePercent: number | undefined;
  if (last) {
    dayChangeValue = totalPortfolioValue - last.totalPortfolioValue;
    dayChangePercent = last.totalPortfolioValue > 0
      ? (dayChangeValue / last.totalPortfolioValue) * 100
      : 0;
  }

  return {
    id: `snap_${now}_${Math.random().toString(36).slice(2, 7)}`,
    timestamp: now,
    totalPortfolioValue,
    cashBalance: params.luckyCoinBalance,
    holdingsValue,
    totalReturnPercent,
    dayChangeValue,
    dayChangePercent,
    topHoldingId,
    topMoverId,
    trigger,
  };
}

export function GameProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<GameState>(defaultState);
  const [loaded, setLoaded] = useState(false);

  // ── Cloud state ─────────────────────────────────────────────────────────────
  const [cloudUser, setCloudUser] = useState<User | null>(null);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncedAt, setLastSyncedAt] = useState<number | null>(null);
  const [localSavedAt, setLocalSavedAt] = useState<number | null>(null);
  const [localBackupAt, setLocalBackupAt] = useState<number | null>(null);
  const [syncError, setSyncError] = useState<string | null>(null);

  // ── Save health state ────────────────────────────────────────────────────────
  const [saveHealthStatus, setSaveHealthStatus] = useState<SaveHealthStatus>("ok");
  const [saveHealthMessage, setSaveHealthMessage] = useState("Save loaded successfully.");
  const [saveWasRepaired, setSaveWasRepaired] = useState(false);
  const [corruptedSaveBackedUpAt, setCorruptedSaveBackedUpAt] = useState<number | null>(null);

  const stateRef = useRef<GameState>(defaultState);
  useEffect(() => { stateRef.current = state; }, [state]);

  // ── Load local state ────────────────────────────────────────────────────────
  useEffect(() => {
    const load = async () => {
      const [raw, savedAtRaw, backupRaw, corruptedRaw] = await Promise.all([
        AsyncStorage.getItem(STORAGE_KEY),
        AsyncStorage.getItem(SAVED_AT_KEY),
        AsyncStorage.getItem(BACKUP_KEY),
        AsyncStorage.getItem(CORRUPTED_BACKUP_KEY),
      ]);

      if (raw) {
        const result = safeParseGameState(raw);

        if (result.status === "corrupted") {
          // Back up the corrupted raw bytes before resetting
          const backedUpAt = Date.now();
          await AsyncStorage.setItem(
            CORRUPTED_BACKUP_KEY,
            JSON.stringify({ raw, backedUpAt })
          );
          await AsyncStorage.removeItem(STORAGE_KEY);
          setState(defaultState);
          stateRef.current = defaultState;
          setSaveHealthStatus("corrupted");
          setSaveHealthMessage(result.message);
          setCorruptedSaveBackedUpAt(backedUpAt);
        } else {
          const merged = mergeGameState(defaultState, result.state!);
          setState(merged);
          stateRef.current = merged;
          setSaveHealthStatus(result.status);
          setSaveHealthMessage(result.message);
          if (result.status === "repaired") {
            setSaveWasRepaired(true);
            // Persist the repaired state back to AsyncStorage
            const now = Date.now();
            await Promise.all([
              AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged)),
              AsyncStorage.setItem(SAVED_AT_KEY, String(now)),
            ]);
            setLocalSavedAt(now);
          }
        }
      }

      if (savedAtRaw && !raw) {
        const n = parseInt(savedAtRaw, 10);
        if (!isNaN(n)) setLocalSavedAt(n);
      } else if (savedAtRaw && raw) {
        const n = parseInt(savedAtRaw, 10);
        if (!isNaN(n)) setLocalSavedAt(n);
      }

      if (backupRaw) {
        try {
          const b = JSON.parse(backupRaw) as { savedAt?: number };
          if (b?.savedAt) setLocalBackupAt(b.savedAt);
        } catch {}
      }

      if (corruptedRaw && !raw) {
        // Corrupted backup already exists from a previous session
        try {
          const c = JSON.parse(corruptedRaw) as { backedUpAt?: number };
          if (c?.backedUpAt) setCorruptedSaveBackedUpAt(c.backedUpAt);
        } catch {}
      }

      setLoaded(true);
    };
    load();
  }, []);

  // ── Restore Supabase session ─────────────────────────────────────────────────
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    supabase.auth.getSession().then(({ data }) => {
      setCloudUser(data.session?.user ?? null);
    });
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setCloudUser(session?.user ?? null);
    });
    return () => { listener.subscription.unsubscribe(); };
  }, []);

  const save = useCallback((newState: GameState) => {
    setState(newState);
    stateRef.current = newState;
    const now = Date.now();
    setLocalSavedAt(now);
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
    AsyncStorage.setItem(SAVED_AT_KEY, String(now));
  }, []);

  // ── Backup / Restore ────────────────────────────────────────────────────────
  const saveLocalBackup = useCallback(async () => {
    const backup = { state: stateRef.current, savedAt: Date.now() };
    await AsyncStorage.setItem(BACKUP_KEY, JSON.stringify(backup));
    setLocalBackupAt(backup.savedAt);
  }, []);

  const restoreLocalBackup = useCallback(async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      const raw = await AsyncStorage.getItem(BACKUP_KEY);
      if (!raw) return { success: false, error: "No backup found." };
      const { state: backupState } = JSON.parse(raw) as { state: unknown };
      if (!backupState) return { success: false, error: "Backup data is invalid." };
      const restored = mergeGameState(defaultState, backupState as GameState);
      save(restored);
      return { success: true, error: null };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Restore failed." };
    }
  }, [save]);

  // ── Corrupted-save recovery ──────────────────────────────────────────────────
  const resetCorruptedLocalSave = useCallback(() => {
    const fresh = { ...defaultState, joinDate: Date.now() };
    save(fresh);
    setSaveHealthStatus("ok");
    setSaveHealthMessage("Started fresh after corrupted save was cleared.");
    setSaveWasRepaired(false);
  }, [save]);

  const restoreCorruptedBackup = useCallback(async (): Promise<{ success: boolean; error: string | null }> => {
    try {
      const raw = await AsyncStorage.getItem(CORRUPTED_BACKUP_KEY);
      if (!raw) return { success: false, error: "No corrupted backup found." };
      const parsed = JSON.parse(raw) as { raw?: string };
      if (!parsed?.raw) return { success: false, error: "Corrupted backup has no data." };

      const result = safeParseGameState(parsed.raw);
      if (result.status === "corrupted" || !result.state) {
        return { success: false, error: "Corrupted backup is still unreadable — cannot restore." };
      }
      const restored = mergeGameState(defaultState, result.state);
      save(restored);
      setSaveHealthStatus(result.status);
      setSaveHealthMessage("Restored from corrupted backup (fields repaired where needed).");
      setSaveWasRepaired(result.status === "repaired");
      return { success: true, error: null };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Restore failed." };
    }
  }, [save]);

  // ── Cloud helpers ────────────────────────────────────────────────────────────
  const saveToCloud = useCallback(async (): Promise<{ success: boolean; error: string | null }> => {
    if (!isSupabaseConfigured || !supabase || !cloudUser) {
      return { success: false, error: "Not signed in or cloud not configured." };
    }
    setIsSyncing(true);
    setSyncError(null);
    try {
      const s = stateRef.current;
      const { error } = await supabase.from("user_game_state").upsert({
        user_id: cloudUser.id,
        balance: s.luckyCoinBalance,
        holdings: s.holdings,
        transactions: s.transactions,
        watchlist: s.watchlist,
        applied_events: s.appliedEvents,
        claimed_challenges: s.claimedChallenges,
        challenge_flags: s.challengeFlags,
        lessons_opened: s.lessonsOpened,
        xp: s.xp,
        game_state: s,
      }, { onConflict: "user_id" });

      if (error) {
        setSyncError(error.message);
        return { success: false, error: error.message };
      }

      await supabase.from("user_profiles").upsert({
        user_id: cloudUser.id,
        email: cloudUser.email ?? "",
        username: s.username,
      }, { onConflict: "user_id" });

      setLastSyncedAt(Date.now());
      return { success: true, error: null };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Sync failed.";
      setSyncError(msg);
      return { success: false, error: msg };
    } finally {
      setIsSyncing(false);
    }
  }, [cloudUser]);

  const loadFromCloud = useCallback(async (): Promise<{ success: boolean; error: string | null; hasData: boolean }> => {
    if (!isSupabaseConfigured || !supabase || !cloudUser) {
      return { success: false, error: "Not signed in or cloud not configured.", hasData: false };
    }
    setIsSyncing(true);
    setSyncError(null);
    try {
      const { data, error } = await supabase
        .from("user_game_state")
        .select("game_state")
        .eq("user_id", cloudUser.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return { success: true, error: null, hasData: false };
        setSyncError(error.message);
        return { success: false, error: error.message, hasData: false };
      }
      if (!data?.game_state) return { success: true, error: null, hasData: false };

      const cloudState = mergeGameState(defaultState, data.game_state as GameState);
      save(cloudState);
      setLastSyncedAt(Date.now());
      return { success: true, error: null, hasData: true };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Load failed.";
      setSyncError(msg);
      return { success: false, error: msg, hasData: false };
    } finally {
      setIsSyncing(false);
    }
  }, [cloudUser, save]);

  const loadFromCloudWithBackup = useCallback(async (): Promise<{ success: boolean; error: string | null; hasData: boolean }> => {
    await saveLocalBackup();
    return loadFromCloud();
  }, [saveLocalBackup, loadFromCloud]);

  const mergeCloudSave = useCallback(async (choice: "keep_local" | "load_cloud"): Promise<{ success: boolean; error: string | null }> => {
    if (choice === "keep_local") return saveToCloud();
    const result = await loadFromCloudWithBackup();
    return { success: result.success, error: result.error };
  }, [saveToCloud, loadFromCloudWithBackup]);

  const fetchCloudState = useCallback(async (): Promise<{ state: GameState | null; updatedAt: number | null; error: string | null }> => {
    if (!isSupabaseConfigured || !supabase || !cloudUser) {
      return { state: null, updatedAt: null, error: null };
    }
    try {
      const { data, error } = await supabase
        .from("user_game_state")
        .select("game_state, updated_at")
        .eq("user_id", cloudUser.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") return { state: null, updatedAt: null, error: null };
        return { state: null, updatedAt: null, error: error.message };
      }

      const updatedAt = data?.updated_at ? new Date(data.updated_at as string).getTime() : null;
      const cloudState = data?.game_state ? mergeGameState(defaultState, data.game_state as GameState) : null;
      return { state: cloudState, updatedAt, error: null };
    } catch (err: unknown) {
      return { state: null, updatedAt: null, error: err instanceof Error ? err.message : "Failed to fetch." };
    }
  }, [cloudUser]);

  const smartMergeWithCloud = useCallback(async (cloudState: GameState): Promise<{ success: boolean; error: string | null }> => {
    try {
      await saveLocalBackup();
      const merged = safeMerge(stateRef.current, cloudState);
      save(merged);
      if (cloudUser) {
        await saveToCloud();
      }
      return { success: true, error: null };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : "Merge failed." };
    }
  }, [saveLocalBackup, save, cloudUser, saveToCloud]);

  // ── Auth ─────────────────────────────────────────────────────────────────────
  const signIn = useCallback(async (email: string, password: string): Promise<{ error: string | null }> => {
    if (!isSupabaseConfigured || !supabase) return { error: "Cloud save not configured." };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { error: error.message };
    return { error: null };
  }, []);

  const signUp = useCallback(async (email: string, password: string): Promise<{ error: string | null; needsConfirmation: boolean }> => {
    if (!isSupabaseConfigured || !supabase) return { error: "Cloud save not configured.", needsConfirmation: false };
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) return { error: error.message, needsConfirmation: false };
    return { error: null, needsConfirmation: !data.session };
  }, []);

  const signOut = useCallback(async () => {
    if (!isSupabaseConfigured || !supabase) return;
    await supabase.auth.signOut();
    setCloudUser(null);
    setLastSyncedAt(null);
    setSyncError(null);
  }, []);

  // ── Game actions ──────────────────────────────────────────────────────────────
  const buyAsset = useCallback((
    assetId: string, assetName: string, assetSymbol: string, price: number, quantity: number
  ): { success: boolean; message: string } => {
    const total = price * quantity;
    if (state.luckyCoinBalance < total) return { success: false, message: "Not enough LuckyCoin" };

    const existingIdx = state.holdings.findIndex(h => h.assetId === assetId);
    const newHoldings = [...state.holdings];

    if (existingIdx >= 0) {
      const existing = newHoldings[existingIdx];
      const newQty = existing.quantity + quantity;
      const newInvested = existing.totalInvested + total;
      newHoldings[existingIdx] = { ...existing, quantity: newQty, totalInvested: newInvested, averageCost: newInvested / newQty };
    } else {
      newHoldings.push({ assetId, quantity, averageCost: price, totalInvested: total });
    }

    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      assetId, assetName, assetSymbol, type: "buy", quantity, price, total, timestamp: Date.now(),
    };
    const newBalance = state.luckyCoinBalance - total;
    const prevSnaps = state.portfolioSnapshots ?? [];
    const snap = buildSnapshot({ holdings: newHoldings, luckyCoinBalance: newBalance, priceOverrides: state.priceOverrides, previousSnapshots: prevSnaps }, "trade");
    const newSnaps = snap ? [snap, ...prevSnaps].slice(0, 500) : prevSnaps;
    save({ ...state, luckyCoinBalance: newBalance, holdings: newHoldings, transactions: [tx, ...state.transactions], portfolioSnapshots: newSnaps });
    return { success: true, message: `Bought ${quantity} ${assetSymbol} for ${total.toLocaleString()} LC` };
  }, [state, save]);

  const sellAsset = useCallback((
    assetId: string, assetName: string, assetSymbol: string, price: number, quantity: number
  ): { success: boolean; message: string } => {
    const existingIdx = state.holdings.findIndex(h => h.assetId === assetId);
    if (existingIdx < 0) return { success: false, message: "You do not own this asset" };

    const existing = state.holdings[existingIdx];
    if (existing.quantity < quantity) return { success: false, message: "Not enough shares to sell" };

    const total = price * quantity;
    const newHoldings = [...state.holdings];

    if (existing.quantity === quantity) {
      newHoldings.splice(existingIdx, 1);
    } else {
      const newQty = existing.quantity - quantity;
      const remainingInvested = existing.totalInvested * (1 - quantity / existing.quantity);
      newHoldings[existingIdx] = { ...existing, quantity: newQty, totalInvested: remainingInvested, averageCost: remainingInvested / newQty };
    }

    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      assetId, assetName, assetSymbol, type: "sell", quantity, price, total, timestamp: Date.now(),
    };
    const newBalance = state.luckyCoinBalance + total;
    const prevSnaps = state.portfolioSnapshots ?? [];
    const snap = buildSnapshot({ holdings: newHoldings, luckyCoinBalance: newBalance, priceOverrides: state.priceOverrides, previousSnapshots: prevSnaps }, "trade");
    const newSnaps = snap ? [snap, ...prevSnaps].slice(0, 500) : prevSnaps;
    save({ ...state, luckyCoinBalance: newBalance, holdings: newHoldings, transactions: [tx, ...state.transactions], portfolioSnapshots: newSnaps });
    return { success: true, message: `Sold ${quantity} ${assetSymbol} for ${total.toLocaleString()} LC` };
  }, [state, save]);

  const claimDaily = useCallback((): { success: boolean; message: string } => {
    const today = new Date().toDateString();
    if (state.lastDailyClaim === today) return { success: false, message: "Already claimed today. Come back tomorrow!" };
    save({ ...state, luckyCoinBalance: state.luckyCoinBalance + DAILY_CLAIM_AMOUNT, lastDailyClaim: today });
    return { success: true, message: `+${DAILY_CLAIM_AMOUNT.toLocaleString()} LuckyCoin claimed!` };
  }, [state, save]);

  const completeOnboarding = useCallback((username: string) => {
    save({ ...state, hasCompletedOnboarding: true, username, joinDate: Date.now() });
  }, [state, save]);

  const updateUsername = useCallback((username: string) => {
    save({ ...state, username });
  }, [state, save]);

  const getHolding = useCallback((assetId: string): Holding | undefined => {
    return state.holdings.find(h => h.assetId === assetId);
  }, [state.holdings]);

  const applyMarketEvent = useCallback((
    eventId?: string,
    opts?: { clearPending?: boolean; overrideEvent?: MarketEvent }
  ): { success: boolean; event: MarketEvent | null; message: string } => {
    const lastEventId = state.appliedEvents[0]?.eventId;
    const event = opts?.overrideEvent ?? (eventId ? getEventById(eventId) : getRandomEvent(lastEventId));
    if (!event) return { success: false, event: null, message: "Event not found" };

    const newOverrides: Record<string, AssetPriceOverride> = { ...state.priceOverrides };
    let biggestMove = { symbol: "", assetId: "", changePercent: 0 };

    for (const impact of event.impacts) {
      const base = getAllAssetById(impact.assetId);
      if (!base) continue;
      const existing = newOverrides[impact.assetId];
      const currentPrice = existing?.price ?? base.price;
      const currentChart = existing?.chartData ?? base.chartData;
      const newPrice = Math.max(0.01, currentPrice * (1 + impact.impactPercent / 100));
      const newChartData = [...currentChart, newPrice].slice(-25);
      newOverrides[impact.assetId] = {
        price: Math.round(newPrice * 100) / 100, previousPrice: currentPrice,
        dailyChangePercent: impact.impactPercent, whyItMoved: event.summary,
        chartData: newChartData, bullish: impact.impactPercent >= 0,
      };
      if (Math.abs(impact.impactPercent) > Math.abs(biggestMove.changePercent)) {
        biggestMove = { symbol: impact.symbol, assetId: impact.assetId, changePercent: impact.impactPercent };
      }
    }

    const appliedEvent: AppliedEvent = {
      eventId: event.id, title: event.title, summary: event.summary, sport: event.sport,
      category: event.category, emoji: event.emoji, marketLesson: event.marketLesson,
      appliedAt: Date.now(), biggestMove,
    };
    const prevSnaps = state.portfolioSnapshots ?? [];
    const snap = buildSnapshot({ holdings: state.holdings, luckyCoinBalance: state.luckyCoinBalance, priceOverrides: newOverrides, previousSnapshots: prevSnaps }, "market_event");
    const newSnaps = snap ? [snap, ...prevSnaps].slice(0, 500) : prevSnaps;
    save({
      ...state,
      priceOverrides: newOverrides,
      appliedEvents: [appliedEvent, ...state.appliedEvents].slice(0, 20),
      portfolioSnapshots: newSnaps,
      ...(opts?.clearPending ? { pendingPulseId: null, pendingGeneratedPulse: null } : {}),
    });
    return { success: true, event, message: event.title };
  }, [state, save]);

  const prepareDailyPulse = useCallback(() => {
    const today = new Date().toDateString();
    if (state.lastAutoPulseDate === today) return;

    const lastEventId = state.appliedEvents[0]?.eventId;

    // 50 % chance: generate from the source-story adapter; fallback to curated events
    const useAdapter = Math.random() < 0.5;
    if (useAdapter) {
      const generated = generateRandomSourceEvent();
      if (generated) {
        save({ ...state, lastAutoPulseDate: today, pendingPulseId: generated.id, pendingGeneratedPulse: generated });
        return;
      }
    }

    // Curated path (also used as adapter fallback)
    const event = getRandomEvent(lastEventId);
    if (!event) return;
    save({ ...state, lastAutoPulseDate: today, pendingPulseId: event.id, pendingGeneratedPulse: null });
  }, [state, save]);

  const reviewDailyPulse = useCallback((): { success: boolean; event: MarketEvent | null; message: string } => {
    const pulseId = state.pendingPulseId;
    if (!pulseId) return { success: false, event: null, message: "No pending pulse to review." };
    // If the pulse was generated by the source adapter, apply it directly
    if (state.pendingGeneratedPulse) {
      return applyMarketEvent(undefined, { clearPending: true, overrideEvent: state.pendingGeneratedPulse });
    }
    return applyMarketEvent(pulseId, { clearPending: true });
  }, [state.pendingPulseId, applyMarketEvent]);

  const addToWatchlist = useCallback((assetId: string) => {
    if (state.watchlist.includes(assetId)) return;
    save({ ...state, watchlist: [...state.watchlist, assetId] });
  }, [state, save]);

  const removeFromWatchlist = useCallback((assetId: string) => {
    save({ ...state, watchlist: state.watchlist.filter(id => id !== assetId) });
  }, [state, save]);

  const isWatched = useCallback((assetId: string): boolean => state.watchlist.includes(assetId), [state.watchlist]);

  const setChallengeFlag = useCallback((flagId: string) => {
    if (state.challengeFlags.includes(flagId)) return;
    save({ ...state, challengeFlags: [...state.challengeFlags, flagId] });
  }, [state, save]);

  const addLessonOpen = useCallback(() => {
    save({ ...state, lessonsOpened: state.lessonsOpened + 1 });
  }, [state, save]);

  const claimChallengeReward = useCallback((
    challengeId: string, xpReward: number, lcReward: number
  ): { success: boolean } => {
    if (state.claimedChallenges.includes(challengeId)) return { success: false };
    save({
      ...state,
      xp: state.xp + xpReward,
      luckyCoinBalance: state.luckyCoinBalance + lcReward,
      claimedChallenges: [...state.claimedChallenges, challengeId],
    });
    return { success: true };
  }, [state, save]);

  // ── App-open snapshot (once per 5 min) ──────────────────────────────────────
  useEffect(() => {
    if (!loaded) return;
    const s = stateRef.current;
    const snap = buildSnapshot({
      holdings: s.holdings,
      luckyCoinBalance: s.luckyCoinBalance,
      priceOverrides: s.priceOverrides,
      previousSnapshots: s.portfolioSnapshots ?? [],
    }, "app_open");
    if (!snap) return;
    const next = { ...s, portfolioSnapshots: [snap, ...(s.portfolioSnapshots ?? [])].slice(0, 500) };
    save(next);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loaded]);

  // ── Manual snapshot ──────────────────────────────────────────────────────────
  const takeSnapshot = useCallback((trigger: PortfolioSnapshot["trigger"]) => {
    const s = stateRef.current;
    const snap = buildSnapshot({
      holdings: s.holdings,
      luckyCoinBalance: s.luckyCoinBalance,
      priceOverrides: s.priceOverrides,
      previousSnapshots: s.portfolioSnapshots ?? [],
    }, trigger);
    if (!snap) return;
    const next = { ...s, portfolioSnapshots: [snap, ...(s.portfolioSnapshots ?? [])].slice(0, 500) };
    save(next);
  }, [save]);

  const latestEvent = state.appliedEvents[0] ?? null;
  const canClaimDaily = state.lastDailyClaim !== new Date().toDateString();

  if (!loaded) return null;

  return (
    <GameContext.Provider value={{
      ...state,
      buyAsset, sellAsset, claimDaily, completeOnboarding, getHolding, canClaimDaily,
      updateUsername, applyMarketEvent, prepareDailyPulse, reviewDailyPulse, isLoaded: loaded, latestEvent, addToWatchlist, removeFromWatchlist,
      isWatched, setChallengeFlag, addLessonOpen, claimChallengeReward,
      cloudUser,
      cloudEmail: cloudUser?.email ?? null,
      isCloudReady: isSupabaseConfigured,
      isSyncing, lastSyncedAt, localSavedAt, localBackupAt, syncError,
      signIn, signUp, signOut,
      saveToCloud, loadFromCloud, mergeCloudSave, loadFromCloudWithBackup,
      saveLocalBackup, restoreLocalBackup,
      fetchCloudState, smartMergeWithCloud,
      saveHealthStatus, saveHealthMessage, saveWasRepaired,
      corruptedSaveBackedUpAt, resetCorruptedLocalSave, restoreCorruptedBackup,
      takeSnapshot,
    }}>
      {children}
    </GameContext.Provider>
  );
}

export function useGame(): GameContextValue {
  const ctx = useContext(GameContext);
  if (!ctx) throw new Error("useGame must be used inside GameProvider");
  return ctx;
}
