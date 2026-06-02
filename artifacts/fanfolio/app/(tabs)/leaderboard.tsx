import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { LEADERBOARD_FILTERS, LeaderboardFilter, LeaderboardEntry, getLeaderboard } from "@/data/mockLeaderboard";
import { useGame } from "@/context/GameContext";
import { MOCK_ASSETS } from "@/data/mockAssets";

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { holdings, luckyCoinBalance, username } = useGame();
  const [activeFilter, setActiveFilter] = useState<LeaderboardFilter>("Overall");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = MOCK_ASSETS.find(a => a.id === h.assetId);
    return sum + (asset ? asset.price * h.quantity : 0);
  }, 0);
  const totalValue = portfolioValue + luckyCoinBalance;

  const entries = getLeaderboard(activeFilter).map(e =>
    e.isCurrentUser ? { ...e, username, portfolioValue: Math.round(totalValue) } : e
  );

  const topThree = entries.slice(0, 3);
  const rest = entries.slice(3);

  const rankColor = (rank: number) =>
    rank === 1 ? "#FFD700" : rank === 2 ? "#C0C0C0" : rank === 3 ? "#CD7F32" : colors.mutedForeground;

  const plColor = (pct: number) => (pct >= 0 ? colors.green : colors.red);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12 }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Fanfolio 500</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Global leaderboard</Text>

        <FlatList
          horizontal
          data={LEADERBOARD_FILTERS}
          keyExtractor={f => f}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 8 }}
          renderItem={({ item }) => {
            const active = activeFilter === item;
            return (
              <Pressable
                onPress={() => setActiveFilter(item)}
                style={[
                  styles.filterTab,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.filterText, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>
                  {item}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={rest}
        keyExtractor={e => e.username}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 90 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.podium}>
            {topThree.length >= 2 && (
              <View style={styles.podiumItem}>
                <View style={[styles.podiumAvatar, { backgroundColor: rankColor(2) + "30", borderColor: rankColor(2) }]}>
                  <Text style={[styles.podiumAvatarText, { color: rankColor(2) }]}>
                    {topThree[1].username.charAt(0)}
                  </Text>
                </View>
                <Text style={[styles.podiumRank, { color: rankColor(2) }]}>#2</Text>
                <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{topThree[1].username}</Text>
                <Text style={[styles.podiumValue, { color: colors.mutedForeground }]}>
                  {(topThree[1].portfolioValue / 1000).toFixed(0)}K LC
                </Text>
              </View>
            )}
            {topThree.length >= 1 && (
              <View style={[styles.podiumItem, styles.podiumFirst]}>
                <Feather name="award" size={20} color={rankColor(1)} style={{ marginBottom: 4 }} />
                <View style={[styles.podiumAvatar, styles.podiumAvatarLg, { backgroundColor: rankColor(1) + "30", borderColor: rankColor(1) }]}>
                  <Text style={[styles.podiumAvatarText, styles.podiumAvatarTextLg, { color: rankColor(1) }]}>
                    {topThree[0].username.charAt(0)}
                  </Text>
                </View>
                <Text style={[styles.podiumRank, { color: rankColor(1) }]}>#1</Text>
                <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{topThree[0].username}</Text>
                <Text style={[styles.podiumValue, { color: colors.mutedForeground }]}>
                  {(topThree[0].portfolioValue / 1000).toFixed(0)}K LC
                </Text>
              </View>
            )}
            {topThree.length >= 3 && (
              <View style={styles.podiumItem}>
                <View style={[styles.podiumAvatar, { backgroundColor: rankColor(3) + "30", borderColor: rankColor(3) }]}>
                  <Text style={[styles.podiumAvatarText, { color: rankColor(3) }]}>
                    {topThree[2].username.charAt(0)}
                  </Text>
                </View>
                <Text style={[styles.podiumRank, { color: rankColor(3) }]}>#3</Text>
                <Text style={[styles.podiumName, { color: colors.foreground }]} numberOfLines={1}>{topThree[2].username}</Text>
                <Text style={[styles.podiumValue, { color: colors.mutedForeground }]}>
                  {(topThree[2].portfolioValue / 1000).toFixed(0)}K LC
                </Text>
              </View>
            )}
          </View>
        }
        renderItem={({ item: entry }) => (
          <View
            style={[
              styles.row,
              {
                backgroundColor: entry.isCurrentUser ? colors.primary + "12" : colors.card,
                borderColor: entry.isCurrentUser ? colors.primary + "40" : colors.border,
              },
            ]}
          >
            <Text style={[styles.rowRank, { color: rankColor(entry.rank) }]}>#{entry.rank}</Text>
            <View style={[styles.rowAvatar, { backgroundColor: entry.isCurrentUser ? colors.primary : colors.muted }]}>
              <Text style={[styles.rowAvatarText, { color: entry.isCurrentUser ? colors.primaryForeground : colors.mutedForeground }]}>
                {entry.username.charAt(0)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.rowName, { color: colors.foreground }]}>
                {entry.username}{entry.isCurrentUser ? " (You)" : ""}
              </Text>
              <Text style={[styles.rowSpecialty, { color: colors.mutedForeground }]} numberOfLines={1}>
                {entry.specialties.join(" · ")}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={[styles.rowValue, { color: colors.foreground }]}>
                {(entry.portfolioValue / 1000).toFixed(0)}K LC
              </Text>
              <Text style={[styles.rowChange, { color: plColor(entry.weeklyChangePercent) }]}>
                {entry.weeklyChangePercent >= 0 ? "+" : ""}{entry.weeklyChangePercent.toFixed(1)}%
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular" },
  filterTab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  filterText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  podium: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", paddingVertical: 24, gap: 12 },
  podiumItem: { alignItems: "center", flex: 1, gap: 4 },
  podiumFirst: { flex: 1.2 },
  podiumAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  podiumAvatarLg: { width: 64, height: 64, borderRadius: 32 },
  podiumAvatarText: { fontSize: 18, fontFamily: "Inter_700Bold" },
  podiumAvatarTextLg: { fontSize: 22 },
  podiumRank: { fontSize: 12, fontFamily: "Inter_700Bold" },
  podiumName: { fontSize: 11, fontFamily: "Inter_600SemiBold", maxWidth: 80, textAlign: "center" },
  podiumValue: { fontSize: 10, fontFamily: "Inter_400Regular" },
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  rowRank: { width: 34, fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center" },
  rowAvatar: { width: 34, height: 34, borderRadius: 17, alignItems: "center", justifyContent: "center" },
  rowAvatarText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  rowName: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  rowSpecialty: { fontSize: 11, fontFamily: "Inter_400Regular" },
  rowValue: { fontSize: 13, fontFamily: "Inter_700Bold" },
  rowChange: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});
