import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { useChallenges } from "@/hooks/useChallenges";
import { useTraderIdentity } from "@/hooks/useTraderIdentity";
import { CoinBadge } from "@/components/CoinBadge";
import { ALL_ASSETS } from "@/data/assetUniverse";
import { buildLeaderboard, getBestCategory, CATEGORIES, UserLeaderboardStats } from "@/data/mockLeaderboard";
import { useUserPreferences } from "@/lib/userPreferences";

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    username, luckyCoinBalance, holdings, joinDate, transactions,
    updateUsername, watchlist, appliedEvents, challengeFlags, xp,
    cloudUser, cloudEmail, isCloudReady, isSyncing, lastSyncedAt, syncError,
    signOut, saveToCloud, loadFromCloud, mergeCloudSave,
  } = useGame();
  const { xpInfo, claimedCount, claimableCount, unlockedAchievementCount } = useChallenges();
  const liveAssets = useLiveAssets();
  const traderIdentity = useTraderIdentity();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(username);

  const { prefs } = useUserPreferences();
  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = liveAssets.find(a => a.id === h.assetId);
    return sum + (asset ? asset.price * h.quantity : 0);
  }, 0);
  const totalValue = portfolioValue + luckyCoinBalance;

  // ── Leaderboard rank computation ──
  const userLeaderboardStats: UserLeaderboardStats = React.useMemo(() => {
    const pv = portfolioValue;
    let avgRisk = 5;
    if (holdings.length > 0 && pv > 0) {
      avgRisk = holdings.reduce((s, h) => {
        const a = liveAssets.find(x => x.id === h.assetId);
        const v = a ? a.price * h.quantity : 0;
        return s + (a ? a.riskScore * (v / pv) : 0);
      }, 0);
    }
    const indexVal = holdings.reduce((s, h) => {
      const a = liveAssets.find(x => x.id === h.assetId);
      return s + (a?.type === "Sport Index" ? a.price * h.quantity : 0);
    }, 0);
    const memeVal = holdings.reduce((s, h) => {
      const a = liveAssets.find(x => x.id === h.assetId);
      return s + (a?.type === "Meme Coin" ? a.price * h.quantity : 0);
    }, 0);
    const indexExposurePct = pv > 0 ? (indexVal / pv) * 100 : 0;
    const memeExposurePct = pv > 0 ? (memeVal / pv) * 100 : 0;
    const uniqueSports = new Set(holdings.map(h => ALL_ASSETS.find(a => a.id === h.assetId)?.sport).filter(Boolean)).size;
    const uniqueTypes = new Set(holdings.map(h => ALL_ASSETS.find(a => a.id === h.assetId)?.type).filter(Boolean)).size;
    let divScore = Math.min(uniqueSports * 18, 45) + Math.min(uniqueTypes * 15, 40);
    if (indexExposurePct > 0) divScore += 15;
    if (memeExposurePct < 30) divScore += 5;
    const diversificationScore = Math.min(100, divScore);
    const usedScanner = challengeFlags.includes("open_scanner");
    const usedDipWatch = challengeFlags.includes("view_dip_watch");
    const usedMomentum = challengeFlags.includes("view_momentum");
    const viewedJournal = challengeFlags.includes("view_journal");
    const scannerScore = Math.min(100, (usedScanner ? 30 : 0) + (usedDipWatch ? 18 : 0) + (usedMomentum ? 18 : 0) + (viewedJournal ? 15 : 0) + Math.min(watchlist.length * 5, 19));
    const lowRiskScore = Math.max(0, (10 - avgRisk) * 8 + diversificationScore * 0.3 + indexExposurePct * 0.2);
    const weeklyChangePct = transactions.length === 0 ? 0 : Math.min(25, transactions.filter(t => t.type === "buy").length * 0.8 + transactions.filter(t => t.type === "sell").length * 1.2 + (xp / 100));
    return {
      totalValue, xp, weeklyChangePct, avgRisk, diversificationScore,
      indexExposurePct, memeExposurePct, tradeCount: transactions.length,
      badgesCount: unlockedAchievementCount, scannerScore, comebackScore: transactions.length > 5 ? 45 : 30, lowRiskScore,
    };
  }, [portfolioValue, holdings, liveAssets, challengeFlags, watchlist, transactions, xp, totalValue, unlockedAchievementCount]);

  const overallRank = React.useMemo(() => {
    const entries = buildLeaderboard("Overall", username, userLeaderboardStats);
    return entries.find(e => e.isUser)?.rank ?? 99;
  }, [username, userLeaderboardStats]);

  const bestCategory = React.useMemo(() =>
    getBestCategory(username, userLeaderboardStats),
    [username, userLeaderboardStats]
  );
  const bestCatDef = CATEGORIES.find(c => c.id === bestCategory);

  const joinedDate = new Date(joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleSave = () => {
    const name = draftName.trim() || username;
    updateUsername(name);
    setEditing(false);
    if (prefs.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const handleSyncNow = async () => {
    const result = await saveToCloud();
    if (result.success) {
      if (prefs.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert("Synced", "Your progress has been saved to the cloud.");
    } else {
      Alert.alert("Sync Failed", result.error ?? "Something went wrong. Try again.");
    }
  };

  const handleLoadCloud = () => {
    Alert.alert(
      "Load Cloud Save",
      "This will replace your current device progress with your cloud save. Continue?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Load Cloud Save",
          style: "destructive",
          onPress: async () => {
            const result = await loadFromCloud();
            if (!result.success) {
              Alert.alert("Error", result.error ?? "Failed to load cloud save.");
            } else if (!result.hasData) {
              Alert.alert("No Cloud Save", "No cloud save was found for your account. Use 'Sync Now' to upload your current progress.");
            } else {
              if (prefs.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
              Alert.alert("Loaded", "Cloud save loaded successfully.");
            }
          },
        },
      ]
    );
  };

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
            if (prefs.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          },
        },
      ]
    );
  };

  const lastSyncLabel = lastSyncedAt
    ? new Date(lastSyncedAt).toLocaleString("en-US", { month: "short", day: "numeric", hour: "numeric", minute: "2-digit" })
    : null;

  const stats = [
    { label: "Total Value", value: `${Math.round(totalValue).toLocaleString()} LC`, icon: "layers" as const },
    { label: "Holdings", value: holdings.length.toString(), icon: "briefcase" as const },
    { label: "Trades", value: transactions.length.toString(), icon: "repeat" as const },
    { label: "Watching", value: `${watchlist.length} asset${watchlist.length !== 1 ? "s" : ""}`, icon: "bookmark" as const },
    { label: "Events", value: appliedEvents.length.toString(), icon: "zap" as const },
    { label: "Joined", value: joinedDate, icon: "calendar" as const },
  ];

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: bottomPad + 40 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Profile</Text>
        <Pressable onPress={() => { setEditing(!editing); setDraftName(username); }}>
          <Feather name={editing ? "x" : "edit-2"} size={20} color={colors.foreground} />
        </Pressable>
      </View>

      <View style={styles.avatarSection}>
        <View style={[styles.avatar, { backgroundColor: colors.primary }]}>
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </View>

        {editing ? (
          <View style={styles.editRow}>
            <TextInput
              style={[styles.nameInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
              value={draftName}
              onChangeText={setDraftName}
              autoFocus
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Pressable onPress={handleSave} style={[styles.saveBtn, { backgroundColor: colors.primary }]}>
              <Feather name="check" size={16} color={colors.primaryForeground} />
            </Pressable>
          </View>
        ) : (
          <Text style={[styles.username, { color: colors.foreground }]}>{username}</Text>
        )}

        <Text style={[styles.rank, { color: colors.mutedForeground }]}>Trader · Member since {joinedDate}</Text>

        <View style={[styles.balancePill, { backgroundColor: colors.coin + "20", borderColor: colors.coin + "40" }]}>
          <CoinBadge amount={luckyCoinBalance} size="lg" />
        </View>
      </View>

      <View style={styles.statsGrid}>
        {stats.map(s => {
          const isWatch = s.icon === "bookmark";
          return (
            <View
              key={s.label}
              style={[
                styles.statCard,
                {
                  backgroundColor: colors.card,
                  borderColor: isWatch && watchlist.length > 0 ? colors.coin + "50" : colors.border,
                },
              ]}
            >
              <Feather name={s.icon} size={16} color={isWatch ? colors.coin : colors.primary} />
              <Text style={[styles.statValue, { color: colors.foreground }]}>{s.value}</Text>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
            </View>
          );
        })}
      </View>

      {/* ── Cloud Save Card ──────────────────────────────────── */}
      {!isCloudReady ? (
        <View style={[styles.cloudCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cloudHeader}>
            <Feather name="cloud-off" size={16} color={colors.mutedForeground} />
            <Text style={[styles.cloudTitle, { color: colors.foreground }]}>Cloud Save</Text>
            <Text style={[styles.cloudStatus, { color: colors.mutedForeground }]}>Not configured</Text>
          </View>
          <Text style={[styles.cloudBody, { color: colors.mutedForeground }]}>
            Cloud save is not set up in this environment. Your progress is saved locally on this device.
          </Text>
        </View>
      ) : cloudUser ? (
        <View style={[styles.cloudCard, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "25" }]}>
          <View style={styles.cloudHeader}>
            <Feather name="cloud" size={16} color={colors.primary} />
            <Text style={[styles.cloudTitle, { color: colors.foreground }]}>Cloud Save</Text>
            <View style={[styles.cloudBadge, { backgroundColor: colors.green + "20" }]}>
              <Text style={[styles.cloudBadgeText, { color: colors.green }]}>Active</Text>
            </View>
          </View>

          <Text style={[styles.cloudEmail, { color: colors.foreground }]}>{cloudEmail}</Text>
          {lastSyncLabel && (
            <Text style={[styles.cloudSyncTime, { color: colors.mutedForeground }]}>Last synced: {lastSyncLabel}</Text>
          )}
          {syncError && (
            <Text style={[styles.cloudSyncError, { color: "#FF4D4D" }]}>{syncError}</Text>
          )}

          <View style={styles.cloudActions}>
            <Pressable
              onPress={handleSyncNow}
              disabled={isSyncing}
              style={({ pressed }) => [
                styles.cloudBtn,
                { backgroundColor: colors.primary, opacity: pressed || isSyncing ? 0.7 : 1 },
              ]}
            >
              {isSyncing ? (
                <ActivityIndicator size="small" color={colors.primaryForeground} />
              ) : (
                <Feather name="upload-cloud" size={14} color={colors.primaryForeground} />
              )}
              <Text style={[styles.cloudBtnText, { color: colors.primaryForeground }]}>Sync Now</Text>
            </Pressable>

            <Pressable
              onPress={handleLoadCloud}
              disabled={isSyncing}
              style={({ pressed }) => [
                styles.cloudBtnOutline,
                { borderColor: colors.border, opacity: pressed || isSyncing ? 0.7 : 1 },
              ]}
            >
              <Feather name="download-cloud" size={14} color={colors.foreground} />
              <Text style={[styles.cloudBtnOutlineText, { color: colors.foreground }]}>Load Cloud</Text>
            </Pressable>
          </View>

          <Pressable
            onPress={() => router.push("/cloud-save")}
            style={({ pressed }) => [
              styles.cloudBtnOutline,
              { borderColor: colors.primary + "50", opacity: pressed ? 0.75 : 1 },
            ]}
          >
            <Feather name="settings" size={14} color={colors.primary} />
            <Text style={[styles.cloudBtnOutlineText, { color: colors.primary }]}>Manage Cloud Save</Text>
          </Pressable>

          <Pressable onPress={handleSignOut} style={styles.signOutBtn}>
            <Text style={[styles.signOutText, { color: colors.mutedForeground }]}>Sign Out</Text>
          </Pressable>

          <Text style={[styles.cloudDisclaimer, { color: colors.mutedForeground }]}>
            Cloud save stores simulated progress only. LuckyCoin has no cash value.
          </Text>
        </View>
      ) : (
        <View style={[styles.cloudCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.cloudHeader}>
            <Feather name="cloud" size={16} color={colors.mutedForeground} />
            <Text style={[styles.cloudTitle, { color: colors.foreground }]}>Cloud Save</Text>
            <Text style={[styles.cloudStatus, { color: colors.mutedForeground }]}>Local save only</Text>
          </View>
          <Text style={[styles.cloudBody, { color: colors.mutedForeground }]}>
            Cloud save lets you keep your simulated portfolio across devices. Free to set up — no payment needed.
          </Text>
          <View style={styles.cloudActions}>
            <Pressable
              onPress={() => router.push("/auth")}
              style={({ pressed }) => [
                styles.cloudBtn,
                { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="user-plus" size={14} color={colors.primaryForeground} />
              <Text style={[styles.cloudBtnText, { color: colors.primaryForeground }]}>Create Account</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push("/auth")}
              style={({ pressed }) => [
                styles.cloudBtnOutline,
                { borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <Feather name="log-in" size={14} color={colors.foreground} />
              <Text style={[styles.cloudBtnOutlineText, { color: colors.foreground }]}>Sign In</Text>
            </Pressable>
          </View>
        </View>
      )}

      {/* ── XP / Level card ─────────────────────────────────── */}
      <Pressable
        onPress={() => router.push("/challenges")}
        style={[styles.xpCard, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "25" }]}
      >
        <View style={styles.xpCardTop}>
          <View style={[styles.xpLevelBadge, { backgroundColor: colors.primary }]}>
            <Text style={[styles.xpLevelNum, { color: colors.primaryForeground }]}>{xpInfo.level}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.xpLevelTitle, { color: colors.primary }]}>{xpInfo.levelTitle}</Text>
            <Text style={[styles.xpTotalText, { color: colors.foreground }]}>{xpInfo.totalXP.toLocaleString()} XP</Text>
          </View>
          <View style={styles.xpRightPills}>
            <Text style={[styles.xpPillText, { color: colors.green }]}>✓ {claimedCount} done</Text>
            <Text style={[styles.xpPillText, { color: colors.coin }]}>🏅 {unlockedAchievementCount} achievements</Text>
            {claimableCount > 0 && (
              <View style={[styles.claimablePill, { backgroundColor: colors.coin }]}>
                <Text style={[styles.claimablePillText, { color: "#0C0F14" }]}>⚡ {claimableCount} to claim</Text>
              </View>
            )}
          </View>
          <Feather name="chevron-right" size={15} color={colors.mutedForeground} />
        </View>
        <View style={[styles.xpTrack, { backgroundColor: colors.primary + "20" }]}>
          <View style={[styles.xpFill, { width: `${Math.round(xpInfo.progressInLevel * 100)}%` as any, backgroundColor: colors.primary }]} />
        </View>
        {!xpInfo.isMaxLevel && (
          <Text style={[styles.xpProgress, { color: colors.mutedForeground }]}>
            {xpInfo.totalXP} / {xpInfo.levelXPEnd} XP to next level
          </Text>
        )}
      </Pressable>

      {watchlist.length > 0 && (
        <View style={[styles.watchlistCard, { backgroundColor: colors.coin + "10", borderColor: colors.coin + "30" }]}>
          <View style={styles.watchlistHeader}>
            <Feather name="bookmark" size={16} color={colors.coin} />
            <Text style={[styles.watchlistTitle, { color: colors.coin }]}>Your Watchlist</Text>
            <Text style={[styles.watchlistCount, { color: colors.mutedForeground }]}>{watchlist.length} assets</Text>
          </View>
          <Text style={[styles.watchlistBody, { color: colors.foreground }]}>
            Watching an asset means you are following it without buying yet. Like scouting a player before drafting them — you study the market before spending LuckyCoin.
          </Text>
          <Pressable
            onPress={() => { router.back(); router.push("/(tabs)/market"); }}
            style={[styles.watchlistBtn, { borderColor: colors.coin + "50" }]}
          >
            <Feather name="trending-up" size={14} color={colors.coin} />
            <Text style={[styles.watchlistBtnText, { color: colors.coin }]}>View Watchlist in Market</Text>
          </Pressable>
        </View>
      )}

      <View style={[styles.disclaimerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.disclaimerHeader}>
          <Feather name="shield" size={16} color={colors.primary} />
          <Text style={[styles.disclaimerTitle, { color: colors.foreground }]}>About Fanfolio</Text>
        </View>
        <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
          Fanfolio is a fake-money educational sports market simulator. LuckyCoin has no cash value. No real money, gambling, deposits, withdrawals, or cash prizes are involved.
        </Text>
      </View>

      {/* ── Trader Identity Card ───────────────────────── */}
      <Pressable
        onPress={() => router.push("/strategy-profile")}
        style={({ pressed }) => [
          styles.identityCard,
          { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28", opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.identityIconWrap, { backgroundColor: colors.primary + "18" }]}>
          <Text style={styles.identityEmoji}>{traderIdentity.primary.emoji}</Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.identityLabel, { color: colors.mutedForeground }]}>Trader Identity</Text>
          <Text style={[styles.identityTitle, { color: colors.foreground }]}>{traderIdentity.primary.title}</Text>
          <Text style={[styles.identityDesc, { color: colors.mutedForeground }]} numberOfLines={1}>
            {traderIdentity.primary.shortDesc}
          </Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </Pressable>

      {/* ── Leaderboard Rank Card ──────────────────────── */}
      <Pressable
        onPress={() => { router.back(); router.push("/(tabs)/leaderboard"); }}
        style={({ pressed }) => [
          styles.rankCard,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={styles.rankCardLeft}>
          <View style={[styles.rankNumWrap, { backgroundColor: colors.primary + "18" }]}>
            <Text style={[styles.rankNumText, { color: colors.primary }]}>#{overallRank}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.rankLabel, { color: colors.mutedForeground }]}>Fanfolio 500 Overall Rank</Text>
            <Text style={[styles.rankBestCat, { color: colors.foreground }]}>
              Best: {bestCatDef?.label ?? "Overall"}
            </Text>
          </View>
        </View>
        <View style={styles.rankCardRight}>
          <Feather name="award" size={16} color={colors.primary} />
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </View>
      </Pressable>

      <View style={styles.menuSection}>
        {[
          { label: "Settings", icon: "settings" as const, onPress: () => router.push("/settings"), badge: undefined as number | undefined },
          { label: "Portfolio Coach", icon: "activity" as const, onPress: () => router.push("/portfolio-coach"), badge: undefined as number | undefined },
          { label: "Challenges & Achievements", icon: "target" as const, onPress: () => router.push("/challenges"), badge: claimableCount > 0 ? claimableCount : undefined },
          { label: "Trading Journal", icon: "book" as const, onPress: () => router.push("/journal"), badge: undefined as number | undefined },
        ].map(item => (
          <Pressable
            key={item.label}
            onPress={item.onPress}
            style={({ pressed }) => [
              styles.menuItem,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View style={[styles.menuIcon, { backgroundColor: colors.primary + "15" }]}>
              <Feather name={item.icon} size={18} color={colors.primary} />
            </View>
            <Text style={[styles.menuLabel, { color: colors.foreground }]}>{item.label}</Text>
            {item.badge != null && (
              <View style={[styles.menuBadge, { backgroundColor: colors.coin }]}>
                <Text style={[styles.menuBadgeText, { color: "#0C0F14" }]}>{item.badge}</Text>
              </View>
            )}
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 24 },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  avatarSection: { alignItems: "center", paddingHorizontal: 20, marginBottom: 28, gap: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 32, fontFamily: "Inter_700Bold" },
  editRow: { flexDirection: "row", gap: 8, alignItems: "center" },
  nameInput: { flex: 1, height: 44, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, fontSize: 16, fontFamily: "Inter_600SemiBold" },
  saveBtn: { width: 44, height: 44, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  username: { fontSize: 22, fontFamily: "Inter_700Bold" },
  rank: { fontSize: 13, fontFamily: "Inter_400Regular" },
  balancePill: { borderRadius: 50, borderWidth: 1, paddingHorizontal: 20, paddingVertical: 10, marginTop: 4 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  statCard: { width: "47%", borderRadius: 14, borderWidth: 1, padding: 16, gap: 4, alignItems: "center" },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold", textAlign: "center" },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  // Cloud Save Card
  cloudCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 16, gap: 10 },
  cloudHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cloudTitle: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1 },
  cloudStatus: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cloudBadge: { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 2 },
  cloudBadgeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  cloudEmail: { fontSize: 14, fontFamily: "Inter_500Medium" },
  cloudSyncTime: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: -4 },
  cloudSyncError: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cloudBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  cloudActions: { flexDirection: "row", gap: 8 },
  cloudBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 40, borderRadius: 10 },
  cloudBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  cloudBtnOutline: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 40, borderRadius: 10, borderWidth: 1 },
  cloudBtnOutlineText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  signOutBtn: { alignSelf: "flex-start", paddingVertical: 2 },
  signOutText: { fontSize: 12, fontFamily: "Inter_400Regular" },
  cloudDisclaimer: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
  // rest unchanged
  watchlistCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, gap: 10, marginBottom: 16 },
  watchlistHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  watchlistTitle: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1 },
  watchlistCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  watchlistBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  watchlistBtn: { flexDirection: "row", alignItems: "center", gap: 6, borderWidth: 1, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, alignSelf: "flex-start" },
  watchlistBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  disclaimerCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 20, gap: 8 },
  disclaimerHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  disclaimerTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  disclaimerText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  menuSection: { paddingHorizontal: 20, gap: 8 },
  menuItem: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 14, borderWidth: 1, padding: 14 },
  menuIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  menuLabel: { flex: 1, fontSize: 15, fontFamily: "Inter_500Medium" },
  menuBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10, marginRight: 4 },
  menuBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  identityCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  identityIconWrap: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  identityEmoji: { fontSize: 26 },
  identityLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  identityTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  identityDesc: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  xpCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 14, marginBottom: 16, gap: 8 },
  xpCardTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  xpLevelBadge: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  xpLevelNum: { fontSize: 18, fontFamily: "Inter_700Bold" },
  xpLevelTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  xpTotalText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  xpRightPills: { alignItems: "flex-end", gap: 2, marginRight: 4 },
  xpPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  claimablePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 8 },
  claimablePillText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  xpTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: 6, borderRadius: 3 },
  xpProgress: { fontSize: 11, fontFamily: "Inter_400Regular" },
  rankCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  rankCardLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rankCardRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  rankNumWrap: { width: 50, height: 50, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  rankNumText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  rankLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 2 },
  rankBestCat: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
});
