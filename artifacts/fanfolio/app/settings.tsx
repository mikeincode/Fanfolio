import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
  Share,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { useUserPreferences } from "@/lib/userPreferences";
import { formatSyncTime } from "@/lib/cloudSaveUtils";

export default function SettingsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const {
    cloudUser,
    cloudEmail,
    isCloudReady,
    localSavedAt,
    localBackupAt,
    lastSyncedAt,
    saveHealthStatus,
    saveHealthMessage,
    saveWasRepaired,
    signOut,
    restoreLocalBackup,
    luckyCoinBalance,
    holdings,
    transactions,
    watchlist,
    appliedEvents,
    claimedChallenges,
    xp,
    username,
    joinDate,
  } = useGame();

  const { prefs, updatePref } = useUserPreferences();
  const [exporting, setExporting] = useState(false);
  const [restoring, setRestoring] = useState(false);

  const handleSignOut = () => {
    Alert.alert(
      "Sign Out",
      "You'll continue playing with your local save. Sign back in anytime to sync.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Sign Out",
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const exportData = {
        exportedAt: new Date().toISOString(),
        note: "Fanfolio simulated game state — LuckyCoin has no cash value.",
        summary: {
          username,
          joinDate: new Date(joinDate).toISOString(),
          luckyCoinBalance,
          holdingsCount: holdings.length,
          transactionCount: transactions.length,
          watchlistCount: watchlist.length,
          appliedEventsCount: appliedEvents.length,
          claimedChallengesCount: claimedChallenges.length,
          xp,
        },
        holdings,
        transactions,
      };
      const json = JSON.stringify(exportData, null, 2);

      if (Platform.OS === "web") {
        Alert.alert("Export Unavailable", "Save export is not available in the web preview. On a real device, this would open the system share sheet.");
        return;
      }

      await Share.share({
        message: json,
        title: "Fanfolio Save Export",
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Export failed.";
      if (!msg.includes("cancelled")) {
        Alert.alert("Export Failed", msg);
      }
    } finally {
      setExporting(false);
    }
  };

  const handleRestoreBackup = async () => {
    Alert.alert(
      "Restore Local Backup",
      "This will replace your current local save with the backup. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Restore",
          style: "destructive",
          onPress: async () => {
            setRestoring(true);
            const result = await restoreLocalBackup();
            setRestoring(false);
            if (result.success) {
              Alert.alert("Restored", "Local backup restored successfully.");
            } else {
              Alert.alert("Failed", result.error ?? "Could not restore backup.");
            }
          },
        },
      ]
    );
  };

  const localSaveLabel = localSavedAt ? formatSyncTime(localSavedAt) : null;
  const lastSyncLabel = lastSyncedAt ? formatSyncTime(lastSyncedAt) : null;

  const healthColor =
    saveHealthStatus === "ok" ? colors.green :
    saveHealthStatus === "repaired" ? "#F59E0B" :
    "#EF4444";

  const healthIcon =
    saveHealthStatus === "ok" ? "check-circle" as const :
    saveHealthStatus === "repaired" ? "tool" as const :
    "alert-triangle" as const;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: 60 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Nav */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Settings</Text>
        <View style={{ width: 30 }} />
      </View>

      {/* ── Account ───────────────────────────────────────────────────── */}
      <SectionHeader title="Account" icon="user" colors={colors} />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {cloudUser ? (
          <>
            <View style={styles.accountRow}>
              <View style={[styles.accountIconWrap, { backgroundColor: colors.primary + "18" }]}>
                <Feather name="cloud" size={18} color={colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.accountEmail, { color: colors.foreground }]}>{cloudEmail}</Text>
                <Text style={[styles.accountSub, { color: colors.green }]}>Cloud save active</Text>
              </View>
            </View>

            <Divider colors={colors} />

            <NavRow
              icon="settings"
              label="Cloud Save Manager"
              onPress={() => router.push("/cloud-save")}
              colors={colors}
            />
            <NavRow
              icon="log-out"
              label="Sign Out"
              onPress={handleSignOut}
              colors={colors}
              tint="#EF4444"
            />
          </>
        ) : (
          <>
            <View style={styles.accountRow}>
              <View style={[styles.accountIconWrap, { backgroundColor: colors.border }]}>
                <Feather name="user" size={18} color={colors.mutedForeground} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.accountEmail, { color: colors.foreground }]}>Local save only</Text>
                <Text style={[styles.accountSub, { color: colors.mutedForeground }]}>
                  {isCloudReady ? "Sign in to back up your progress" : "Cloud save not configured"}
                </Text>
              </View>
            </View>

            {isCloudReady && (
              <>
                <Divider colors={colors} />
                <NavRow
                  icon="user-plus"
                  label="Create Account"
                  onPress={() => router.push("/auth")}
                  colors={colors}
                />
                <NavRow
                  icon="log-in"
                  label="Sign In"
                  onPress={() => router.push("/auth")}
                  colors={colors}
                />
              </>
            )}
          </>
        )}
      </View>

      {/* ── Data & Progress ───────────────────────────────────────────── */}
      <SectionHeader title="Data & Progress" icon="database" colors={colors} />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Save health pill */}
        <View style={styles.saveHealthRow}>
          <Feather name={healthIcon} size={14} color={healthColor} />
          <Text style={[styles.saveHealthText, { color: healthColor }]}>
            {saveHealthStatus === "ok" && "Save healthy"}
            {saveHealthStatus === "repaired" && "Save repaired"}
            {saveHealthStatus === "corrupted" && "Save was corrupted"}
          </Text>
        </View>
        {(saveWasRepaired || saveHealthStatus === "corrupted") && (
          <Text style={[styles.saveHealthDetail, { color: colors.mutedForeground }]} numberOfLines={3}>
            {saveHealthMessage}
          </Text>
        )}

        {(localSaveLabel || lastSyncLabel) && <Divider colors={colors} />}

        {localSaveLabel && (
          <View style={styles.infoRow}>
            <Feather name="hard-drive" size={13} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Local save: {localSaveLabel}
            </Text>
          </View>
        )}
        {lastSyncLabel && (
          <View style={styles.infoRow}>
            <Feather name="cloud" size={13} color={colors.mutedForeground} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Last cloud sync: {lastSyncLabel}
            </Text>
          </View>
        )}

        <Divider colors={colors} />

        <NavRow
          icon="settings"
          label="Cloud Save Manager"
          onPress={() => router.push("/cloud-save")}
          colors={colors}
        />

        <NavRow
          icon="share-2"
          label="Export Local Save"
          onPress={handleExport}
          colors={colors}
          rightEl={exporting ? <ActivityIndicator size="small" color={colors.mutedForeground} /> : undefined}
        />

        {localBackupAt && (
          <NavRow
            icon="refresh-cw"
            label="Restore Local Backup"
            sublabel={`Backed up ${formatSyncTime(localBackupAt)}`}
            onPress={handleRestoreBackup}
            colors={colors}
            rightEl={restoring ? <ActivityIndicator size="small" color={colors.mutedForeground} /> : undefined}
          />
        )}

        {__DEV__ && (
          <>
            <Divider colors={colors} />
            <NavRow
              icon="tool"
              label="Developer Reset"
              onPress={() => router.push("/dev-reset")}
              colors={colors}
              tint="#F59E0B"
            />
          </>
        )}
      </View>

      {/* ── Preferences ──────────────────────────────────────────────── */}
      <SectionHeader title="Preferences" icon="sliders" colors={colors} />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <ToggleRow
          icon="zap"
          label="Haptic Feedback"
          sublabel="Vibration on actions"
          value={prefs.hapticsEnabled}
          onValueChange={(v) => updatePref("hapticsEnabled", v)}
          colors={colors}
        />
        <Divider colors={colors} />
        <ToggleRow
          icon="book-open"
          label="Educational Tips"
          sublabel="Market lesson hints across the app"
          value={prefs.educationalTipsEnabled}
          onValueChange={(v) => updatePref("educationalTipsEnabled", v)}
          colors={colors}
        />
        <Divider colors={colors} />
        <ToggleRow
          icon="layout"
          label="Compact Cards"
          sublabel="Smaller asset cards in the market"
          value={prefs.compactCardsEnabled}
          onValueChange={(v) => updatePref("compactCardsEnabled", v)}
          colors={colors}
        />
        <Divider colors={colors} />
        <ToggleRow
          icon="shield"
          label="Safety Disclaimers"
          sublabel="Show reminders that LuckyCoin has no cash value"
          value={prefs.showSafetyDisclaimers}
          onValueChange={(v) => updatePref("showSafetyDisclaimers", v)}
          colors={colors}
        />
      </View>

      {/* ── About Fanfolio ───────────────────────────────────────────── */}
      <SectionHeader title="About Fanfolio" icon="info" colors={colors} />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.aboutBlock}>
          <Text style={[styles.aboutTitle, { color: colors.foreground }]}>What is Fanfolio?</Text>
          <Text style={[styles.aboutBody, { color: colors.mutedForeground }]}>
            Fanfolio is a fake-money educational sports market simulator. You use LuckyCoin — simulated currency — to buy and sell fictional sports assets, learn how markets move, and track your progress.
          </Text>
        </View>

        <Divider colors={colors} />

        <View style={[styles.legalCard, { backgroundColor: colors.background, borderColor: colors.border }]}>
          <Feather name="shield" size={14} color={colors.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1, gap: 6 }}>
            <Text style={[styles.legalTitle, { color: colors.foreground }]}>Legal — always visible</Text>
            <Text style={[styles.legalBody, { color: colors.mutedForeground }]}>
              LuckyCoin has no cash value and cannot be exchanged for real money, prizes, or goods.
              {"\n\n"}Fanfolio does not involve real money, gambling, deposits, withdrawals, brokerage services, odds, parlays, or cash prizes.
              {"\n\n"}Cloud save stores simulated game progress only. No financial data is collected.
            </Text>
          </View>
        </View>
      </View>

      {/* ── App Status ───────────────────────────────────────────────── */}
      <SectionHeader title="App Status" icon="activity" colors={colors} />

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.statusGrid}>
          {[
            { label: "Storage", value: "Local-first" },
            { label: "Cloud", value: cloudUser ? "Connected" : "Optional" },
            { label: "Market data", value: "Simulated" },
            { label: "App type", value: "Edu simulator" },
          ].map((item) => (
            <View
              key={item.label}
              style={[styles.statusChip, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "25" }]}
            >
              <Text style={[styles.statusChipLabel, { color: colors.mutedForeground }]}>{item.label}</Text>
              <Text style={[styles.statusChipValue, { color: colors.primary }]}>{item.value}</Text>
            </View>
          ))}
        </View>
      </View>

    </ScrollView>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

type ColorsType = ReturnType<typeof import("@/hooks/useColors").useColors>;

function SectionHeader({ title, icon, colors }: { title: string; icon: React.ComponentProps<typeof Feather>["name"]; colors: ColorsType }) {
  return (
    <View style={styles.sectionHeader}>
      <Feather name={icon} size={13} color={colors.mutedForeground} />
      <Text style={[styles.sectionTitle, { color: colors.mutedForeground }]}>{title.toUpperCase()}</Text>
    </View>
  );
}

function Divider({ colors }: { colors: ColorsType }) {
  return <View style={[styles.divider, { backgroundColor: colors.border }]} />;
}

function NavRow({
  icon,
  label,
  sublabel,
  onPress,
  colors,
  tint,
  rightEl,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  sublabel?: string;
  onPress: () => void;
  colors: ColorsType;
  tint?: string;
  rightEl?: React.ReactNode;
}) {
  const iconColor = tint ?? colors.foreground;
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.navRow, { opacity: pressed ? 0.7 : 1 }]}
    >
      <Feather name={icon} size={16} color={iconColor} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.navRowLabel, { color: tint ?? colors.foreground }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.navRowSub, { color: colors.mutedForeground }]}>{sublabel}</Text>
        )}
      </View>
      {rightEl ?? <Feather name="chevron-right" size={16} color={colors.mutedForeground} />}
    </Pressable>
  );
}

function ToggleRow({
  icon,
  label,
  sublabel,
  value,
  onValueChange,
  colors,
}: {
  icon: React.ComponentProps<typeof Feather>["name"];
  label: string;
  sublabel?: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
  colors: ColorsType;
}) {
  return (
    <View style={styles.toggleRow}>
      <Feather name={icon} size={16} color={colors.foreground} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.navRowLabel, { color: colors.foreground }]}>{label}</Text>
        {sublabel && (
          <Text style={[styles.navRowSub, { color: colors.mutedForeground }]}>{sublabel}</Text>
        )}
      </View>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.border, true: colors.primary + "80" }}
        thumbColor={value ? colors.primary : colors.mutedForeground}
        ios_backgroundColor={colors.border}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Styles
// ─────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 8,
  },
  sectionTitle: { fontSize: 11, fontFamily: "Inter_700Bold", letterSpacing: 0.7 },

  card: {
    marginHorizontal: 16,
    borderRadius: 16,
    borderWidth: 1,
    overflow: "hidden",
    marginBottom: 4,
  },

  divider: { height: StyleSheet.hairlineWidth, marginHorizontal: 16 },

  // Account section
  accountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  accountIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  accountEmail: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  accountSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },

  // Nav rows
  navRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 13,
  },
  navRowLabel: { fontSize: 15, fontFamily: "Inter_500Medium" },
  navRowSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },

  // Toggle rows
  toggleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },

  // Save health
  saveHealthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  saveHealthText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  saveHealthDetail: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
    paddingHorizontal: 16,
    paddingBottom: 10,
    marginTop: -4,
  },

  // Info rows
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 6,
  },
  infoText: { fontSize: 12, fontFamily: "Inter_400Regular" },

  // About
  aboutBlock: { padding: 16, gap: 8 },
  aboutTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  aboutBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },

  legalCard: {
    margin: 12,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  legalTitle: { fontSize: 12, fontFamily: "Inter_700Bold", marginBottom: 2 },
  legalBody: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 19 },

  // Status
  statusGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    padding: 14,
  },
  statusChip: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    minWidth: "45%",
    flex: 1,
  },
  statusChipLabel: { fontSize: 10, fontFamily: "Inter_500Medium", marginBottom: 3 },
  statusChipValue: { fontSize: 13, fontFamily: "Inter_700Bold" },
});
