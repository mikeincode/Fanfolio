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

export default function ProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { username, luckyCoinBalance, holdings, joinDate, transactions, updateUsername, watchlist, appliedEvents } = useGame();
  const { xpInfo, claimedCount, unlockedAchievementCount } = useChallenges();
  const liveAssets = useLiveAssets();
  const traderIdentity = useTraderIdentity();
  const [editing, setEditing] = useState(false);
  const [draftName, setDraftName] = useState(username);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = liveAssets.find(a => a.id === h.assetId);
    return sum + (asset ? asset.price * h.quantity : 0);
  }, 0);
  const totalValue = portfolioValue + luckyCoinBalance;

  const joinedDate = new Date(joinDate).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const handleSave = () => {
    const name = draftName.trim() || username;
    updateUsername(name);
    setEditing(false);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
  };

  const stats = [
    { label: "Total Value", value: `${Math.round(totalValue).toLocaleString()} LC`, icon: "dollar-sign" as const },
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

      {/* XP / Level card */}
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
            <Text style={[styles.xpPillText, { color: colors.coin }]}>🏅 {unlockedAchievementCount} badges</Text>
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

      <View style={styles.menuSection}>
        {[
          { label: "Trader Identity", icon: "user" as const, onPress: () => router.push("/strategy-profile") },
          { label: "Portfolio Coach", icon: "activity" as const, onPress: () => router.push("/portfolio-coach") },
          { label: "Challenges & Achievements", icon: "target" as const, onPress: () => router.push("/challenges") },
          { label: "View Trading Journal", icon: "book" as const, onPress: () => router.push("/journal") },
          { label: "Learn Market Basics", icon: "book-open" as const, onPress: () => { router.back(); router.push("/(tabs)/learn"); } },
          { label: "View Leaderboard", icon: "award" as const, onPress: () => { router.back(); router.push("/(tabs)/leaderboard"); } },
          { label: "Browse Market", icon: "trending-up" as const, onPress: () => { router.back(); router.push("/(tabs)/market"); } },
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
  xpTrack: { height: 6, borderRadius: 3, overflow: "hidden" },
  xpFill: { height: 6, borderRadius: 3 },
  xpProgress: { fontSize: 11, fontFamily: "Inter_400Regular" },
});
