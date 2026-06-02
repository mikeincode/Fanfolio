import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  TextInput,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { AssetType } from "@/data/mockAssets";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { AssetCard } from "@/components/AssetCard";
import { useGame } from "@/context/GameContext";

type FilterTab = "All" | AssetType;

const TABS: FilterTab[] = ["All", "Team Stock", "Player Coin", "Sport Index", "Meme Coin", "Future"];
const TAB_LABELS: Record<FilterTab, string> = {
  "All": "All",
  "Team Stock": "Teams",
  "Player Coin": "Players",
  "Sport Index": "Indexes",
  "Meme Coin": "Meme",
  "Future": "Futures",
};

export default function MarketScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<FilterTab>("All");
  const [search, setSearch] = useState("");
  const liveAssets = useLiveAssets();
  const { latestEvent } = useGame();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = useMemo(() => {
    let assets = liveAssets;
    if (activeTab !== "All") {
      assets = assets.filter(a => a.type === activeTab);
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      assets = assets.filter(a =>
        a.name.toLowerCase().includes(q) ||
        a.symbol.toLowerCase().includes(q) ||
        a.sport.toLowerCase().includes(q)
      );
    }
    return assets;
  }, [activeTab, search, liveAssets]);

  const gainers = liveAssets.filter(a => a.dailyChangePercent > 0).length;
  const losers = liveAssets.filter(a => a.dailyChangePercent < 0).length;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <Text style={[styles.title, { color: colors.foreground }]}>Market</Text>
          <View style={styles.marketMeta}>
            <View style={styles.metaItem}>
              <View style={[styles.metaDot, { backgroundColor: colors.green }]} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{gainers} up</Text>
            </View>
            <View style={styles.metaItem}>
              <View style={[styles.metaDot, { backgroundColor: colors.red }]} />
              <Text style={[styles.metaText, { color: colors.mutedForeground }]}>{losers} down</Text>
            </View>
          </View>
        </View>

        {latestEvent && (
          <View style={[styles.eventBanner, { backgroundColor: colors.primary + "12", borderColor: colors.primary + "30" }]}>
            <Text style={styles.bannerEmoji}>{latestEvent.emoji}</Text>
            <Text style={[styles.bannerText, { color: colors.foreground }]} numberOfLines={1}>
              <Text style={{ fontFamily: "Inter_700Bold" }}>{latestEvent.title}</Text>
              {" — prices updated"}
            </Text>
          </View>
        )}

        <View style={[styles.searchBar, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="search" size={16} color={colors.mutedForeground} />
          <TextInput
            style={[styles.searchInput, { color: colors.foreground, fontFamily: "Inter_400Regular" }]}
            placeholder="Search assets..."
            placeholderTextColor={colors.mutedForeground}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch("")}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          )}
        </View>

        <FlatList
          horizontal
          data={TABS}
          keyExtractor={t => t}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabList}
          renderItem={({ item }) => {
            const active = activeTab === item;
            return (
              <Pressable
                onPress={() => setActiveTab(item)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text style={[styles.tabText, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>
                  {TAB_LABELS[item]}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={a => a.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPad + 90, paddingTop: 8 }}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <AssetCard
            asset={item}
            onPress={() => router.push({ pathname: "/asset/[id]", params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name="search" size={32} color={colors.mutedForeground} />
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No assets found</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 8, gap: 10 },
  headerTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 2 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  marketMeta: { flexDirection: "row", gap: 12 },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaDot: { width: 6, height: 6, borderRadius: 3 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  eventBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  bannerEmoji: { fontSize: 18 },
  bannerText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 14 },
  tabList: { gap: 8, paddingVertical: 4 },
  tab: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 60, gap: 8 },
  emptyText: { fontSize: 15, fontFamily: "Inter_500Medium" },
});
