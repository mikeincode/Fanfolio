import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Modal,
  ActivityIndicator,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame, type GameState } from "@/context/GameContext";
import {
  summarizeState,
  detectConflict,
  diffSummaries,
  formatSyncTime,
  type SaveSummary,
  type ConflictInfo,
  type SummaryDiff,
} from "@/lib/cloudSaveUtils";
import { useUserPreferences } from "@/lib/userPreferences";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

type ConfirmAction =
  | { type: "upload" }
  | { type: "load_cloud" }
  | { type: "merge" }
  | { type: "restore_backup" };

// ─────────────────────────────────────────────────────────────────────────────
// Main screen
// ─────────────────────────────────────────────────────────────────────────────

export default function CloudSaveScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    cloudUser, cloudEmail, isCloudReady, isSyncing, lastSyncedAt,
    localSavedAt, localBackupAt, syncError,
    signOut, saveToCloud, loadFromCloudWithBackup, smartMergeWithCloud,
    saveLocalBackup, restoreLocalBackup, fetchCloudState,
    // local game state fields for summary
    luckyCoinBalance, holdings, transactions, watchlist, appliedEvents,
    xp, claimedChallenges, lessonsOpened, hasCompletedOnboarding, username,
    priceOverrides, joinDate, lastDailyClaim, challengeFlags, portfolioSnapshots,
  } = useGame();

  const { prefs } = useUserPreferences();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // ── Cloud fetch state ───────────────────────────────────────────────────────
  const [cloudState, setCloudState] = useState<GameState | null>(null);
  const [cloudUpdatedAt, setCloudUpdatedAt] = useState<number | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const [fetchLoading, setFetchLoading] = useState(false);
  const fetchedOnce = useRef(false);

  // ── Confirm modal state ─────────────────────────────────────────────────────
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [actionResult, setActionResult] = useState<{ success: boolean; message: string } | null>(null);

  // ── Build local game state object for summarize ─────────────────────────────
  const localState: GameState = {
    luckyCoinBalance, holdings, transactions, hasCompletedOnboarding,
    lastDailyClaim, username, joinDate, priceOverrides, appliedEvents,
    watchlist, xp, claimedChallenges, challengeFlags, lessonsOpened,
    portfolioSnapshots: portfolioSnapshots ?? [],
    lastAutoPulseDate: null,
    pendingPulseId: null,
    pendingGeneratedPulse: null,
  };

  const localSummary: SaveSummary = summarizeState(localState, localSavedAt);
  const cloudSummary: SaveSummary | null = cloudState ? summarizeState(cloudState, cloudUpdatedAt) : null;

  const conflict: ConflictInfo = detectConflict({
    isConfigured: isCloudReady,
    isSignedIn: !!cloudUser,
    localSummary,
    cloudSummary,
    lastSyncedAt,
  });

  // ── Fetch cloud state on mount (once) ──────────────────────────────────────
  const doFetch = useCallback(async () => {
    if (!isCloudReady || !cloudUser) return;
    setFetchLoading(true);
    setFetchError(null);
    const result = await fetchCloudState();
    setFetchLoading(false);
    if (result.error) {
      setFetchError(result.error);
    } else {
      setCloudState(result.state);
      setCloudUpdatedAt(result.updatedAt);
    }
  }, [isCloudReady, cloudUser, fetchCloudState]);

  useEffect(() => {
    if (!fetchedOnce.current && cloudUser) {
      fetchedOnce.current = true;
      doFetch();
    }
  }, [cloudUser, doFetch]);

  // ── Diffs ──────────────────────────────────────────────────────────────────
  const diffs: SummaryDiff[] = localSummary && cloudSummary
    ? diffSummaries(localSummary, cloudSummary)
    : [];

  // ── Confirm modal helpers ──────────────────────────────────────────────────
  const openConfirm = (action: ConfirmAction) => {
    setActionResult(null);
    setConfirmAction(action);
    if (prefs.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };
  const closeConfirm = () => { setConfirmAction(null); setActionResult(null); };

  const handleConfirm = async () => {
    if (!confirmAction) return;
    setActionLoading(true);
    setActionResult(null);

    let result: { success: boolean; error: string | null } = { success: false, error: null };

    if (confirmAction.type === "upload") {
      result = await saveToCloud();
    } else if (confirmAction.type === "load_cloud") {
      const r = await loadFromCloudWithBackup();
      result = { success: r.success, error: r.error };
      if (r.success && r.hasData) {
        setCloudState(null);
        fetchedOnce.current = false;
      }
    } else if (confirmAction.type === "merge") {
      if (cloudState) {
        result = await smartMergeWithCloud(cloudState);
      } else {
        result = { success: false, error: "No cloud save to merge with." };
      }
    } else if (confirmAction.type === "restore_backup") {
      result = await restoreLocalBackup();
    }

    setActionLoading(false);

    if (result.success) {
      if (prefs.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setActionResult({ success: true, message: getSuccessMessage(confirmAction.type) });
      if (confirmAction.type !== "restore_backup") {
        fetchedOnce.current = false;
        setTimeout(() => {
          closeConfirm();
          doFetch();
        }, 1400);
      } else {
        setTimeout(closeConfirm, 1400);
      }
    } else {
      setActionResult({ success: false, message: result.error ?? "Something went wrong." });
    }
  };

  const getSuccessMessage = (type: ConfirmAction["type"]): string => {
    if (type === "upload") return "Progress uploaded to cloud.";
    if (type === "load_cloud") return "Cloud save loaded. Backup created.";
    if (type === "merge") return "Saves merged and uploaded.";
    if (type === "restore_backup") return "Local backup restored.";
    return "Done.";
  };

  const getConfirmTitle = (action: ConfirmAction): string => {
    if (action.type === "upload") return "Upload This Device";
    if (action.type === "load_cloud") return "Load Cloud Save";
    if (action.type === "merge") return "Merge Saves";
    if (action.type === "restore_backup") return "Restore Backup";
    return "Confirm";
  };

  const getConfirmBody = (action: ConfirmAction): string => {
    if (action.type === "upload") return "Your current device progress will be saved to the cloud. Any existing cloud save will be replaced.";
    if (action.type === "load_cloud") return "Your cloud save will replace the current device data. A local backup will be created first so you can restore if needed.";
    if (action.type === "merge") return "The two saves will be combined: higher balance, max XP, and all unique trades/challenges/watchlist items will be kept.";
    if (action.type === "restore_backup") return "The most recent local backup will be restored on this device. Your current progress will be overwritten.";
    return "";
  };

  const getConfirmBtnLabel = (action: ConfirmAction): string => {
    if (action.type === "upload") return "Upload to Cloud";
    if (action.type === "load_cloud") return "Replace Local with Cloud";
    if (action.type === "merge") return "Merge Saves";
    if (action.type === "restore_backup") return "Restore Backup";
    return "Confirm";
  };

  // ── Not configured ─────────────────────────────────────────────────────────
  if (!isCloudReady) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <NavBar title="Cloud Save" colors={colors} />
        <View style={styles.centeredMsg}>
          <Feather name="cloud-off" size={44} color={colors.mutedForeground} />
          <Text style={[styles.centeredTitle, { color: colors.foreground }]}>Cloud save not configured</Text>
          <Text style={[styles.centeredBody, { color: colors.mutedForeground }]}>
            Cloud save is not available in this version. Your progress is saved locally on this device and will not be lost.
          </Text>
          <Pressable onPress={() => router.back()} style={[styles.btnPrimary, { backgroundColor: colors.primary }]}>
            <Text style={[styles.btnPrimaryText, { color: colors.primaryForeground }]}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  // ── Signed out ──────────────────────────────────────────────────────────────
  if (!cloudUser) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <NavBar title="Cloud Save" colors={colors} />
        <View style={styles.centeredMsg}>
          <Feather name="log-in" size={44} color={colors.primary} />
          <Text style={[styles.centeredTitle, { color: colors.foreground }]}>Sign in to manage cloud save</Text>
          <Text style={[styles.centeredBody, { color: colors.mutedForeground }]}>
            Create a free account or sign in to back up and sync your simulated portfolio across devices.
          </Text>
          <Pressable onPress={() => router.push("/auth")} style={[styles.btnPrimary, { backgroundColor: colors.primary }]}>
            <Text style={[styles.btnPrimaryText, { color: colors.primaryForeground }]}>Sign In / Create Account</Text>
          </Pressable>
          <Disclaimer colors={colors} />
        </View>
      </View>
    );
  }

  // ── Main screen ────────────────────────────────────────────────────────────
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <NavBar title="Cloud Save Manager" colors={colors} />

        {/* ── Account row ── */}
        <View style={[styles.accountRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.avatarSmall, { backgroundColor: colors.primary }]}>
            <Text style={[styles.avatarLetter, { color: colors.primaryForeground }]}>
              {(cloudEmail ?? "?")[0].toUpperCase()}
            </Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.accountEmail, { color: colors.foreground }]}>{cloudEmail}</Text>
            <Text style={[styles.accountSub, { color: colors.mutedForeground }]}>Signed in</Text>
          </View>
          <StatusBadge conflict={conflict} />
        </View>

        {/* ── Conflict description ── */}
        <View style={[styles.conflictRow, { backgroundColor: conflict.color + "18", borderColor: conflict.color + "35" }]}>
          <Text style={styles.conflictEmoji}>{conflict.emoji}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[styles.conflictLabel, { color: conflict.color }]}>{conflict.label}</Text>
            <Text style={[styles.conflictDesc, { color: colors.mutedForeground }]}>{conflict.description}</Text>
          </View>
        </View>

        {/* ── Save comparison cards ── */}
        <View style={styles.cardsRow}>
          <SaveCard
            title="This Device"
            icon="smartphone"
            summary={localSummary}
            updatedLabel={localSavedAt ? `Saved ${formatSyncTime(localSavedAt)}` : "Not yet saved"}
            isLocal
            colors={colors}
          />
          <SaveCard
            title="Cloud Save"
            icon="cloud"
            summary={cloudSummary}
            updatedLabel={cloudUpdatedAt ? `Saved ${formatSyncTime(cloudUpdatedAt)}` : cloudState === null && !fetchLoading ? "No cloud save" : "—"}
            isLocal={false}
            loading={fetchLoading}
            error={fetchError ?? undefined}
            colors={colors}
          />
        </View>

        {/* ── Key differences ── */}
        {diffs.length > 0 && (
          <View style={[styles.diffsCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.diffsTitle, { color: colors.foreground }]}>Key Differences</Text>
            {diffs.map(d => (
              <View key={d.field} style={styles.diffRow}>
                <Text style={[styles.diffField, { color: colors.mutedForeground }]}>{d.field}</Text>
                <Text style={[styles.diffVal, { color: d.localWins ? colors.green : colors.foreground }]}>{d.localVal}</Text>
                <Text style={[styles.diffVs, { color: colors.mutedForeground }]}>vs</Text>
                <Text style={[styles.diffVal, { color: d.cloudWins ? colors.green : colors.foreground }]}>{d.cloudVal}</Text>
              </View>
            ))}
          </View>
        )}

        {/* ── Sync error ── */}
        {(syncError || fetchError) && (
          <View style={[styles.errorRow, { backgroundColor: "#FF4D4D18", borderColor: "#FF4D4D35" }]}>
            <Feather name="alert-circle" size={14} color="#FF4D4D" />
            <Text style={[styles.errorText, { color: "#FF4D4D" }]}>{syncError || fetchError}</Text>
          </View>
        )}

        {/* ── Last synced ── */}
        {lastSyncedAt && (
          <Text style={[styles.lastSynced, { color: colors.mutedForeground }]}>
            Last synced: {formatSyncTime(lastSyncedAt)}
          </Text>
        )}

        {/* ── Actions ── */}
        <View style={styles.actionsSection}>
          <Text style={[styles.actionsTitle, { color: colors.mutedForeground }]}>ACTIONS</Text>

          <ActionButton
            icon="upload-cloud"
            label="Upload This Device"
            sublabel="Save local progress to cloud"
            onPress={() => openConfirm({ type: "upload" })}
            loading={isSyncing}
            colors={colors}
            variant="primary"
          />

          <ActionButton
            icon="download-cloud"
            label="Load Cloud Save"
            sublabel={cloudState ? "Replace device with cloud save — backup created first" : "No cloud save to load"}
            onPress={() => openConfirm({ type: "load_cloud" })}
            loading={isSyncing}
            disabled={!cloudState}
            colors={colors}
          />

          <ActionButton
            icon="git-merge"
            label="Merge Saves Safely"
            sublabel={cloudState ? "Combine both saves — keeps higher values" : "No cloud save available to merge"}
            onPress={() => openConfirm({ type: "merge" })}
            loading={isSyncing}
            disabled={!cloudState}
            colors={colors}
          />

          {localBackupAt && (
            <ActionButton
              icon="rotate-ccw"
              label="Restore Last Local Backup"
              sublabel={`Backed up ${formatSyncTime(localBackupAt)}`}
              onPress={() => openConfirm({ type: "restore_backup" })}
              loading={false}
              colors={colors}
              variant="warning"
            />
          )}

          <ActionButton
            icon="refresh-cw"
            label="Refresh Cloud Data"
            sublabel="Re-fetch the latest cloud save info"
            onPress={() => { fetchedOnce.current = false; doFetch(); }}
            loading={fetchLoading}
            colors={colors}
          />

          <Pressable
            onPress={async () => {
              await signOut();
              router.back();
            }}
            style={({ pressed }) => [styles.signOutBtn, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
          >
            <Feather name="log-out" size={16} color={colors.mutedForeground} />
            <Text style={[styles.signOutText, { color: colors.mutedForeground }]}>Sign Out</Text>
          </Pressable>
        </View>

        <Disclaimer colors={colors} />
      </ScrollView>

      {/* ── Confirmation Modal ── */}
      {confirmAction && (
        <Modal transparent animationType="fade" visible onRequestClose={closeConfirm}>
          <View style={styles.modalOverlay}>
            <View style={[styles.modalSheet, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={styles.modalHeader}>
                <Text style={[styles.modalTitle, { color: colors.foreground }]}>
                  {getConfirmTitle(confirmAction)}
                </Text>
                <Pressable onPress={closeConfirm} style={styles.modalClose}>
                  <Feather name="x" size={20} color={colors.foreground} />
                </Pressable>
              </View>

              <Text style={[styles.modalBody, { color: colors.mutedForeground }]}>
                {getConfirmBody(confirmAction)}
              </Text>

              {/* Show diffs in load_cloud / merge confirm */}
              {(confirmAction.type === "load_cloud" || confirmAction.type === "merge") && diffs.length > 0 && (
                <View style={[styles.modalDiffs, { backgroundColor: colors.background, borderColor: colors.border }]}>
                  <Text style={[styles.modalDiffsTitle, { color: colors.mutedForeground }]}>KEY DIFFERENCES</Text>
                  {diffs.slice(0, 5).map(d => (
                    <View key={d.field} style={styles.diffRow}>
                      <Text style={[styles.diffField, { color: colors.mutedForeground }]}>{d.field}</Text>
                      <Text style={[styles.diffVal, { color: d.localWins ? colors.green : colors.foreground, fontSize: 12 }]}>{d.localVal} (local)</Text>
                      <Text style={[styles.diffVs, { color: colors.mutedForeground }]}>·</Text>
                      <Text style={[styles.diffVal, { color: d.cloudWins ? colors.green : colors.foreground, fontSize: 12 }]}>{d.cloudVal} (cloud)</Text>
                    </View>
                  ))}
                </View>
              )}

              {confirmAction.type === "load_cloud" && (
                <View style={[styles.modalNote, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
                  <Feather name="info" size={13} color={colors.primary} />
                  <Text style={[styles.modalNoteText, { color: colors.primary }]}>
                    A backup of your current device progress will be saved automatically before loading.
                  </Text>
                </View>
              )}

              {actionResult && (
                <View style={[
                  styles.resultRow,
                  { backgroundColor: actionResult.success ? colors.green + "18" : "#FF4D4D18", borderColor: actionResult.success ? colors.green + "35" : "#FF4D4D35" }
                ]}>
                  <Feather name={actionResult.success ? "check-circle" : "alert-circle"} size={14} color={actionResult.success ? colors.green : "#FF4D4D"} />
                  <Text style={[styles.resultText, { color: actionResult.success ? colors.green : "#FF4D4D" }]}>
                    {actionResult.message}
                  </Text>
                </View>
              )}

              <View style={styles.modalBtns}>
                <Pressable
                  onPress={closeConfirm}
                  disabled={actionLoading}
                  style={({ pressed }) => [styles.modalBtnCancel, { borderColor: colors.border, opacity: pressed || actionLoading ? 0.6 : 1 }]}
                >
                  <Text style={[styles.modalBtnCancelText, { color: colors.foreground }]}>Cancel</Text>
                </Pressable>
                <Pressable
                  onPress={handleConfirm}
                  disabled={actionLoading}
                  style={({ pressed }) => [
                    styles.modalBtnConfirm,
                    { backgroundColor: confirmAction.type === "load_cloud" || confirmAction.type === "restore_backup" ? "#EF4444" : colors.primary, opacity: pressed || actionLoading ? 0.7 : 1 }
                  ]}
                >
                  {actionLoading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.modalBtnConfirmText}>{getConfirmBtnLabel(confirmAction)}</Text>
                  )}
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function NavBar({ title, colors }: { title: string; colors: any }) {
  return (
    <View style={styles.navBar}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <Feather name="arrow-left" size={22} color={colors.foreground} />
      </Pressable>
      <Text style={[styles.navTitle, { color: colors.foreground }]}>{title}</Text>
      <View style={{ width: 30 }} />
    </View>
  );
}

function StatusBadge({ conflict }: { conflict: ConflictInfo }) {
  return (
    <View style={[styles.badge, { backgroundColor: conflict.color + "20" }]}>
      <Text style={[styles.badgeText, { color: conflict.color }]}>
        {conflict.emoji} {conflict.label}
      </Text>
    </View>
  );
}

function SaveCard({
  title, icon, summary, updatedLabel, isLocal, loading, error, colors,
}: {
  title: string;
  icon: any;
  summary: SaveSummary | null;
  updatedLabel: string;
  isLocal: boolean;
  loading?: boolean;
  error?: string;
  colors: any;
}) {
  const fmt = (n: number) => Math.round(n).toLocaleString();
  return (
    <View style={[styles.saveCard, { backgroundColor: colors.card, borderColor: isLocal ? colors.primary + "40" : colors.border }]}>
      <View style={styles.saveCardHeader}>
        <Feather name={icon} size={14} color={isLocal ? colors.primary : colors.mutedForeground} />
        <Text style={[styles.saveCardTitle, { color: isLocal ? colors.primary : colors.foreground }]}>{title}</Text>
      </View>
      {loading ? (
        <View style={{ alignItems: "center", paddingVertical: 12 }}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={[styles.saveCardSub, { color: colors.mutedForeground, marginTop: 6 }]}>Fetching…</Text>
        </View>
      ) : error ? (
        <Text style={[styles.saveCardSub, { color: "#EF4444" }]}>Error: {error}</Text>
      ) : !summary ? (
        <Text style={[styles.saveCardSub, { color: colors.mutedForeground }]}>No save found</Text>
      ) : (
        <>
          <Text style={[styles.saveCardUsername, { color: colors.foreground }]}>{summary.username}</Text>
          <SaveRow label="Balance" value={`${fmt(summary.balance)} LC`} colors={colors} />
          <SaveRow label="Portfolio" value={`${fmt(summary.portfolioValue)} LC`} colors={colors} />
          <SaveRow label="Holdings" value={String(summary.holdingsCount)} colors={colors} />
          <SaveRow label="Trades" value={String(summary.transactionCount)} colors={colors} />
          <SaveRow label="XP" value={fmt(summary.xp)} colors={colors} />
          <SaveRow label="Challenges" value={String(summary.claimedChallengeCount)} colors={colors} />
        </>
      )}
      <Text style={[styles.saveCardTime, { color: colors.mutedForeground }]}>{updatedLabel}</Text>
    </View>
  );
}

function SaveRow({ label, value, colors }: { label: string; value: string; colors: any }) {
  return (
    <View style={styles.saveRow}>
      <Text style={[styles.saveRowLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.saveRowValue, { color: colors.foreground }]}>{value}</Text>
    </View>
  );
}

function ActionButton({
  icon, label, sublabel, onPress, loading, disabled, colors, variant = "default",
}: {
  icon: any;
  label: string;
  sublabel: string;
  onPress: () => void;
  loading: boolean;
  disabled?: boolean;
  colors: any;
  variant?: "default" | "primary" | "warning";
}) {
  const iconColor = variant === "primary" ? colors.primaryForeground : variant === "warning" ? "#F59E0B" : colors.primary;
  const bgColor = variant === "primary" ? colors.primary : colors.card;
  const textColor = variant === "primary" ? colors.primaryForeground : colors.foreground;
  const subColor = variant === "primary" ? colors.primaryForeground + "bb" : colors.mutedForeground;
  const borderColor = variant === "warning" ? "#F59E0B40" : variant === "primary" ? "transparent" : colors.border;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.actionBtn,
        { backgroundColor: bgColor, borderColor, opacity: pressed || disabled || loading ? 0.65 : 1 },
      ]}
    >
      <View style={[styles.actionBtnIcon, { backgroundColor: iconColor + "22" }]}>
        {loading ? (
          <ActivityIndicator size="small" color={iconColor} />
        ) : (
          <Feather name={icon} size={17} color={iconColor} />
        )}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[styles.actionBtnLabel, { color: textColor }]}>{label}</Text>
        <Text style={[styles.actionBtnSub, { color: subColor }]}>{sublabel}</Text>
      </View>
      {!loading && !disabled && <Feather name="chevron-right" size={16} color={textColor + "88"} />}
    </Pressable>
  );
}

function Disclaimer({ colors }: { colors: any }) {
  return (
    <View style={[styles.disclaimer, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <Feather name="shield" size={13} color={colors.primary} />
      <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
        Cloud save stores simulated Fanfolio progress only. LuckyCoin has no cash value.
      </Text>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },

  centeredMsg: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16, paddingTop: 60 },
  centeredTitle: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  centeredBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, textAlign: "center" },

  accountRow: { marginHorizontal: 16, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 10 },
  avatarSmall: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarLetter: { fontSize: 16, fontFamily: "Inter_700Bold" },
  accountEmail: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  accountSub: { fontSize: 12, fontFamily: "Inter_400Regular" },

  badge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  conflictRow: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 14 },
  conflictEmoji: { fontSize: 22 },
  conflictLabel: { fontSize: 13, fontFamily: "Inter_700Bold" },
  conflictDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, marginTop: 1 },

  cardsRow: { flexDirection: "row", marginHorizontal: 16, gap: 8, marginBottom: 12 },
  saveCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, gap: 4 },
  saveCardHeader: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 4 },
  saveCardTitle: { fontSize: 12, fontFamily: "Inter_700Bold" },
  saveCardUsername: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 4 },
  saveCardSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  saveCardTime: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 6 },
  saveRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  saveRowLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  saveRowValue: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  diffsCard: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 10, gap: 6 },
  diffsTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.5, marginBottom: 4 },
  diffRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  diffField: { fontSize: 12, fontFamily: "Inter_400Regular", width: 80 },
  diffVal: { fontSize: 12, fontFamily: "Inter_600SemiBold", flex: 1 },
  diffVs: { fontSize: 11, fontFamily: "Inter_400Regular" },

  errorRow: { marginHorizontal: 16, borderRadius: 10, borderWidth: 1, padding: 10, flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 8 },
  errorText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  lastSynced: { textAlign: "center", fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 4 },

  actionsSection: { paddingHorizontal: 16, gap: 8, marginTop: 8 },
  actionsTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.8, marginBottom: 2 },

  actionBtn: { borderRadius: 13, borderWidth: 1, padding: 13, flexDirection: "row", alignItems: "center", gap: 12 },
  actionBtnIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  actionBtnLabel: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  actionBtnSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },

  signOutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, borderWidth: 1, paddingVertical: 13, marginTop: 4 },
  signOutText: { fontSize: 14, fontFamily: "Inter_500Medium" },

  disclaimer: { marginHorizontal: 16, borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 8, marginTop: 16 },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },

  btnPrimary: { borderRadius: 12, paddingHorizontal: 28, paddingVertical: 14, alignItems: "center", marginTop: 4 },
  btnPrimaryText: { fontSize: 15, fontFamily: "Inter_700Bold" },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.55)", justifyContent: "flex-end" },
  modalSheet: { borderTopLeftRadius: 24, borderTopRightRadius: 24, borderWidth: 1, padding: 24, gap: 14 },
  modalHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  modalTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  modalClose: { padding: 4 },
  modalBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  modalDiffs: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 6 },
  modalDiffsTitle: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.8, marginBottom: 2 },
  modalNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 8, borderWidth: 1, padding: 10 },
  modalNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  resultRow: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 8, borderWidth: 1, padding: 10 },
  resultText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },
  modalBtns: { flexDirection: "row", gap: 10, marginTop: 4 },
  modalBtnCancel: { flex: 1, borderRadius: 11, borderWidth: 1, height: 48, alignItems: "center", justifyContent: "center" },
  modalBtnCancelText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  modalBtnConfirm: { flex: 1, borderRadius: 11, height: 48, alignItems: "center", justifyContent: "center" },
  modalBtnConfirmText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },
});
