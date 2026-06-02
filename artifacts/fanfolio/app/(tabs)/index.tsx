import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { MOCK_ASSETS } from "@/data/mockAssets";
import { SparklineChart } from "@/components/SparklineChart";
import { CoinBadge } from "@/components/CoinBadge";

export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { luckyCoinBalance, holdings, username, canClaimDaily, claimDaily, transactions } = useGame();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = MOCK_ASSETS.find(a => a.id === h.assetId);
    if (!asset) return sum;
    return sum + asset.price * h.quantity;
  }, 0);

  const totalValue = luckyCoinBalance + portfolioValue;

  const topMovers = [...MOCK_ASSETS]
    .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent))
    .slice(0, 5);

  const handleClaim = () => {
    const result = claimDaily();
    Haptics.notificationAsync(
      result.success
        ? Haptics.NotificationFeedbackType.Success
        : Haptics.NotificationFeedbackType.Warning
    );
    Alert.alert(result.success ? "Daily Claim!" : "Already Claimed", result.message);
  };

  const recentTx = transactions.slice(0, 3);

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Hey, {username}</Text>
          <Text style={[styles.subGreeting, { color: colors.foreground }]}>Your Dashboard</Text>
        </View>
        <Pressable
          onPress={() => router.push("/profile")}
          style={[styles.avatar, { backgroundColor: colors.primary }]}
        >
          <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
            {username.charAt(0).toUpperCase()}
          </Text>
        </Pressable>
      </View>

      <View style={[styles.portfolioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.portfolioLabel, { color: colors.mutedForeground }]}>Total Value</Text>
        <Text style={[styles.portfolioValue, { color: colors.foreground }]}>
          {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text style={[styles.lcLabel, { color: colors.mutedForeground }]}>LuckyCoin</Text>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Portfolio</Text>
            <CoinBadge amount={portfolioValue} size="md" showLabel={false} />
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Available</Text>
            <CoinBadge amount={luckyCoinBalance} size="md" showLabel={false} />
          </View>
          <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
          <View style={styles.stat}>
            <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Holdings</Text>
            <Text style={[styles.statValue, { color: colors.foreground }]}>{holdings.length}</Text>
          </View>
        </View>
      </View>

      <Pressable
        onPress={handleClaim}
        disabled={!canClaimDaily}
        style={({ pressed }) => [
          styles.claimCard,
          {
            backgroundColor: canClaimDaily ? colors.coin + "18" : colors.card,
            borderColor: canClaimDaily ? colors.coin + "60" : colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={styles.claimLeft}>
          <View style={[styles.claimIcon, { backgroundColor: canClaimDaily ? colors.coin + "30" : colors.muted }]}>
            <Feather name="gift" size={20} color={canClaimDaily ? colors.coin : colors.mutedForeground} />
          </View>
          <View>
            <Text style={[styles.claimTitle, { color: canClaimDaily ? colors.coin : colors.mutedForeground }]}>
              {canClaimDaily ? "Daily Claim Available!" : "Daily Claim"}
            </Text>
            <Text style={[styles.claimSub, { color: colors.mutedForeground }]}>
              {canClaimDaily ? "+1,000 LuckyCoin free" : "Come back tomorrow"}
            </Text>
          </View>
        </View>
        {canClaimDaily && (
          <View style={[styles.claimBtn, { backgroundColor: colors.coin }]}>
            <Text style={[styles.claimBtnText, { color: "#0C0F14" }]}>Claim</Text>
          </View>
        )}
      </Pressable>

      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Movers</Text>
          <Pressable onPress={() => router.push("/(tabs)/market")}>
            <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
          </Pressable>
        </View>

        {topMovers.map(asset => {
          const isUp = asset.dailyChangePercent >= 0;
          const changeColor = isUp ? colors.green : colors.red;
          return (
            <Pressable
              key={asset.id}
              onPress={() => router.push({ pathname: "/asset/[id]", params: { id: asset.id } })}
              style={({ pressed }) => [
                styles.moverCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={styles.moverLeft}>
                <Text style={[styles.moverSymbol, { color: colors.foreground }]}>{asset.symbol}</Text>
                <Text style={[styles.moverName, { color: colors.mutedForeground }]} numberOfLines={1}>{asset.name}</Text>
              </View>
              <SparklineChart data={asset.chartData} width={60} height={24} positive={isUp} />
              <View style={styles.moverRight}>
                <Text style={[styles.moverPrice, { color: colors.foreground }]}>
                  {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </Text>
                <View style={[styles.changeBadge, { backgroundColor: changeColor + "20" }]}>
                  <Text style={[styles.changeText, { color: changeColor }]}>
                    {isUp ? "+" : ""}{asset.dailyChangePercent.toFixed(2)}%
                  </Text>
                </View>
              </View>
            </Pressable>
          );
        })}
      </View>

      {recentTx.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Trades</Text>
          {recentTx.map(tx => {
            const isBuy = tx.type === "buy";
            return (
              <View
                key={tx.id}
                style={[styles.txCard, { backgroundColor: colors.card, borderColor: colors.border }]}
              >
                <View style={[styles.txIcon, { backgroundColor: (isBuy ? colors.green : colors.red) + "20" }]}>
                  <Feather
                    name={isBuy ? "arrow-down-left" : "arrow-up-right"}
                    size={16}
                    color={isBuy ? colors.green : colors.red}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.txTitle, { color: colors.foreground }]}>
                    {isBuy ? "Bought" : "Sold"} {tx.assetSymbol}
                  </Text>
                  <Text style={[styles.txSub, { color: colors.mutedForeground }]}>
                    {tx.quantity} shares @ {tx.price.toLocaleString()}
                  </Text>
                </View>
                <Text style={[styles.txAmount, { color: isBuy ? colors.red : colors.green }]}>
                  {isBuy ? "-" : "+"}{tx.total.toLocaleString()} LC
                </Text>
              </View>
            );
          })}
        </View>
      )}

      {holdings.length === 0 && (
        <Pressable
          onPress={() => router.push("/(tabs)/market")}
          style={({ pressed }) => [
            styles.ctaCard,
            { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40", opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="trending-up" size={24} color={colors.primary} />
          <Text style={[styles.ctaTitle, { color: colors.primary }]}>Start your first trade</Text>
          <Text style={[styles.ctaSub, { color: colors.mutedForeground }]}>Browse the market and buy your first asset</Text>
          <Feather name="arrow-right" size={18} color={colors.primary} />
        </Pressable>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  subGreeting: { fontSize: 22, fontFamily: "Inter_700Bold" },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  portfolioCard: {
    marginHorizontal: 20,
    borderRadius: 16,
    borderWidth: 1,
    padding: 20,
    marginBottom: 12,
  },
  portfolioLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  portfolioValue: { fontSize: 42, fontFamily: "Inter_700Bold", lineHeight: 50 },
  lcLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: -4 },
  divider: { height: 1, marginVertical: 16 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statDivider: { width: 1, height: 32 },
  claimCard: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  claimLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  claimIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  claimTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  claimSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  claimBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  claimBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  moverCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  moverLeft: { flex: 1 },
  moverSymbol: { fontSize: 14, fontFamily: "Inter_700Bold" },
  moverName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  moverRight: { alignItems: "flex-end", gap: 2, marginLeft: 12 },
  moverPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  changeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  changeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  txCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  txIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  txTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  txSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  txAmount: { fontSize: 13, fontFamily: "Inter_700Bold" },
  ctaCard: {
    marginHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1,
    padding: 20,
    gap: 6,
    alignItems: "center",
    marginBottom: 12,
  },
  ctaTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  ctaSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
});
