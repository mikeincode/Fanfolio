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
import { MOCK_NEWS } from "@/data/mockNews";
import { useUserPreferences } from "@/lib/userPreferences";

type FilterTab = "All" | "Watchlist" | AssetType;

const TABS: FilterTab[] = ["All", "Watchlist", "Team Stock", "Player Coin", "Coach Stock", "Sport Index", "Meme Coin", "Future"];
const TAB_LABELS: Record<FilterTab, string> = {
  "All": "All",
  "Watchlist": "Watchlist",
  "Team Stock": "Teams",
  "Player Coin": "Players",
  "Coach Stock": "Coaches",
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
  const { latestEvent, watchlist, addToWatchlist, removeFromWatchlist, isWatched } = useGame();
  const { prefs } = useUserPreferences();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = useMemo(() => {
    let assets = liveAssets;
    if (activeTab === "Watchlist") {
      assets = assets.filter(a => watchlist.includes(a.id));
    } else if (activeTab !== "All") {
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
  }, [activeTab, search, liveAssets, watchlist]);

  const handleWatchToggle = (assetId: string) => {
    if (isWatched(assetId)) {
      removeFromWatchlist(assetId);
    } else {
      addToWatchlist(assetId);
    }
  };

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
            {watchlist.length > 0 && (
              <View style={styles.metaItem}>
                <Feather name="bookmark" size={11} color={colors.coin} />
                <Text style={[styles.metaText, { color: colors.coin }]}>{watchlist.length} watching</Text>
              </View>
            )}
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

        {/* ── News Banner ────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/news")}
          style={({ pressed }) => [
            styles.newsBanner,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 },
          ]}
        >
          <View style={[styles.newsBannerIcon, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="rss" size={14} color={colors.primary} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={[styles.newsBannerHeadline, { color: colors.foreground }]} numberOfLines={1}>
              {MOCK_NEWS[0].title}
            </Text>
            <Text style={[styles.newsBannerMeta, { color: colors.mutedForeground }]}>
              {MOCK_NEWS[0].category} · {MOCK_NEWS[0].timestampLabel} · {MOCK_NEWS.length} headlines
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
        </Pressable>

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
            const isWatchlistTab = item === "Watchlist";
            const activeBg = isWatchlistTab ? colors.coin : colors.primary;
            return (
              <Pressable
                onPress={() => setActiveTab(item)}
                style={[
                  styles.tab,
                  {
                    backgroundColor: active ? activeBg : colors.card,
                    borderColor: active ? activeBg : colors.border,
                  },
                ]}
              >
                {isWatchlistTab && (
                  <Feather
                    name="bookmark"
                    size={11}
                    color={active ? "#0C0F14" : colors.coin}
                  />
                )}
                <Text style={[
                  styles.tabText,
                  { color: active ? (isWatchlistTab ? "#0C0F14" : colors.primaryForeground) : colors.mutedForeground },
                ]}>
                  {TAB_LABELS[item]}{isWatchlistTab && watchlist.length > 0 ? ` (${watchlist.length})` : ""}
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
            isWatched={isWatched(item.id)}
            onWatchToggle={handleWatchToggle}
            compact={prefs.compactCardsEnabled}
            onPress={() => router.push({ pathname: "/asset/[id]", params: { id: item.id } })}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            {activeTab === "Watchlist" ? (
              <>
                <Feather name="bookmark" size={36} color={colors.coin} />
                <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No assets on your watchlist</Text>
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                  Tap the {"\u{1F516}"} icon on any asset to watch it. Following an asset helps you learn how prices move before spending LuckyCoin.
                </Text>
                <Pressable
                  onPress={() => setActiveTab("All")}
                  style={[styles.emptyBtn, { backgroundColor: colors.coin, borderRadius: colors.radius - 4 }]}
                >
                  <Text style={[styles.emptyBtnText, { color: "#0C0F14" }]}>Browse All Assets</Text>
                </Pressable>
              </>
            ) : (
              <>
                <Feather name="search" size={32} color={colors.mutedForeground} />
                <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No assets found</Text>
              </>
            )}
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
  marketMeta: { flexDirection: "row", gap: 10, alignItems: "center" },
  metaItem: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaDot: { width: 6, height: 6, borderRadius: 3 },
  metaText: { fontSize: 12, fontFamily: "Inter_500Medium" },
  eventBanner: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 8 },
  bannerEmoji: { fontSize: 18 },
  bannerText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular" },
  searchBar: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, height: 40 },
  searchInput: { flex: 1, fontSize: 14 },
  tabList: { gap: 8, paddingVertical: 4 },
  tab: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  empty: { alignItems: "center", paddingTop: 60, paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyText: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 21 },
  emptyBtn: { marginTop: 8, paddingHorizontal: 20, paddingVertical: 11 },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  newsBanner: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 10, borderWidth: 1, paddingHorizontal: 12, paddingVertical: 10 },
  newsBannerIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  newsBannerHeadline: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  newsBannerMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
});
