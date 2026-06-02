import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { useGame } from "@/context/GameContext";
import { Asset } from "@/data/mockAssets";
import { SparklineChart } from "@/components/SparklineChart";

// ── Types ──────────────────────────────────────────────────────

type SportFilter = "All Sports" | "Football" | "Basketball" | "MMA" | "Baseball" | "Soccer" | "Hockey";
type TypeFilter = "All Types" | "Team Stock" | "Player Coin" | "Sport Index" | "Meme Coin" | "Future";
type AccentType = "green" | "red" | "yellow" | "primary" | "coin";

interface ScanPreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  lesson: string;
  lessonTitle: string;
  emptyMessage: string;
  emptyIcon: string;
  accentType: AccentType;
}

// ── Preset Definitions ─────────────────────────────────────────

const PRESETS: ScanPreset[] = [
  {
    id: "biggest-movers",
    label: "Biggest Movers",
    emoji: "⚡",
    description: "Assets with the highest absolute price movement today — up or down.",
    lesson: "Big movers show where attention is. Big movement can mean opportunity, but also risk. Traders scan for movers to find where the energy is — but a fast move can reverse just as quickly.",
    lessonTitle: "Why watch the biggest movers?",
    emptyMessage: "No assets match this scan right now. Markets change after events.",
    emptyIcon: "activity",
    accentType: "coin",
  },
  {
    id: "momentum-leaders",
    label: "Momentum Leaders",
    emoji: "🚀",
    description: "Assets with strong positive daily movement above 10%.",
    lesson: "Momentum means an asset is already moving strongly in one direction. Momentum traders ride the trend hoping it continues — but they exit quickly when the trend breaks.",
    lessonTitle: "What is momentum trading?",
    emptyMessage: "No assets match this scan right now. Markets change after events.",
    emptyIcon: "trending-up",
    accentType: "green",
  },
  {
    id: "dip-watch",
    label: "Dip Watch",
    emoji: "📉",
    description: "Assets that dropped more than 10% today — potential bounce candidates.",
    lesson: "A dip is a price drop. Some traders watch dips for possible bounce-back opportunities — buying when others are selling. But not every dip recovers: always check why it dropped first.",
    lessonTitle: "What is buying the dip?",
    emptyMessage: "No assets match this scan right now. Markets change after events.",
    emptyIcon: "trending-down",
    accentType: "red",
  },
  {
    id: "high-volatility",
    label: "High Volatility",
    emoji: "🌊",
    description: "Assets with risk score ≥ 8 or large absolute daily movement.",
    lesson: "Volatile assets move fast in both directions. Meme coins and MMA chaos assets usually live here. The potential for big gains is real — but so is the potential for big losses.",
    lessonTitle: "What does volatility mean?",
    emptyMessage: "No assets match this scan right now. Markets change after events.",
    emptyIcon: "zap",
    accentType: "yellow",
  },
  {
    id: "lower-risk-indexes",
    label: "Lower Risk Indexes",
    emoji: "🛡️",
    description: "Sport Index assets with a risk score of 4 or below.",
    lesson: "Indexes spread risk across a basket of assets. When one player has a bad game, the index barely moves. This is the concept of diversification — owning many instead of one.",
    lessonTitle: "How do indexes reduce risk?",
    emptyMessage: "No assets match this scan right now. Markets change after events.",
    emptyIcon: "layers",
    accentType: "primary",
  },
  {
    id: "watchlist-movers",
    label: "Watchlist Movers",
    emoji: "👁️",
    description: "Assets on your watchlist that moved more than 5% today.",
    lesson: "Watching assets helps you learn price behavior before spending LuckyCoin. When a watched asset moves big, you can evaluate: was this expected? What drove it? That builds real market intuition.",
    lessonTitle: "Why watch before trading?",
    emptyMessage: "Add assets to your watchlist to track movement before trading.",
    emptyIcon: "bookmark",
    accentType: "coin",
  },
  {
    id: "portfolio-movers",
    label: "Portfolio Movers",
    emoji: "💼",
    description: "Assets you own, sorted by how much they moved today.",
    lesson: "Portfolio movers show what is actually affecting your total value. Knowing which holdings are driving your gains or losses helps you decide whether to hold, buy more, or trim.",
    lessonTitle: "Why track your portfolio movers?",
    emptyMessage: "Buy your first asset to see what is moving your portfolio.",
    emptyIcon: "briefcase",
    accentType: "primary",
  },
];

const SPORT_FILTERS: SportFilter[] = ["All Sports", "Football", "Basketball", "MMA", "Baseball", "Soccer", "Hockey"];
const TYPE_FILTERS: TypeFilter[] = ["All Types", "Team Stock", "Player Coin", "Sport Index", "Meme Coin", "Future"];
const TYPE_LABELS: Record<TypeFilter, string> = {
  "All Types": "All Types",
  "Team Stock": "Teams",
  "Player Coin": "Players",
  "Sport Index": "Indexes",
  "Meme Coin": "Meme",
  "Future": "Futures",
};

// ── Helper ─────────────────────────────────────────────────────

function accentColorFor(type: AccentType, colors: ReturnType<typeof useColors>): string {
  switch (type) {
    case "green": return colors.green;
    case "red": return colors.red;
    case "yellow": return "#F59E0B";
    case "coin": return colors.coin;
    case "primary": return colors.primary;
  }
}

function typeLabel(type: Asset["type"]): string {
  switch (type) {
    case "Sport Index": return "Index";
    case "Team Stock": return "Team";
    case "Player Coin": return "Player";
    case "Meme Coin": return "Meme";
    case "Future": return "Future";
  }
}

// ── Result Card ────────────────────────────────────────────────

function ScanResultCard({
  asset,
  accentType,
  colors,
  isWatched,
  isOwned,
  ownedQty,
  onWatchToggle,
}: {
  asset: Asset;
  accentType: AccentType;
  colors: ReturnType<typeof useColors>;
  isWatched: boolean;
  isOwned: boolean;
  ownedQty: number;
  onWatchToggle: (id: string) => void;
}) {
  const isUp = asset.dailyChangePercent >= 0;
  const changeColor = isUp ? colors.green : colors.red;
  const accent = accentColorFor(accentType, colors);
  const riskColor =
    asset.riskScore <= 3 ? colors.green :
    asset.riskScore <= 6 ? colors.coin :
    "#F59E0B";

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/asset/[id]", params: { id: asset.id } })}
      style={[styles.resultCard, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.cardAccent, { backgroundColor: accent }]} />
      <View style={styles.cardBody}>
        {/* Row 1: symbol + badges + sparkline + price */}
        <View style={styles.cardTop}>
          <View style={styles.cardLeft}>
            <View style={styles.symbolRow}>
              <Text style={[styles.symbol, { color: colors.foreground }]}>{asset.symbol}</Text>
              <View style={[styles.tagBadge, { backgroundColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{typeLabel(asset.type)}</Text>
              </View>
              <View style={[styles.tagBadge, { backgroundColor: colors.border }]}>
                <Text style={[styles.tagText, { color: colors.mutedForeground }]}>{asset.sport}</Text>
              </View>
            </View>
            <Text style={[styles.assetName, { color: colors.mutedForeground }]} numberOfLines={1}>
              {asset.name}
            </Text>
          </View>
          <View style={styles.cardRight}>
            <SparklineChart
              data={asset.chartData}
              width={52}
              height={24}
              color={isUp ? colors.green : colors.red}
            />
            <Text style={[styles.price, { color: colors.foreground }]}>
              {asset.price >= 1000
                ? asset.price.toLocaleString(undefined, { maximumFractionDigits: 0 })
                : asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Text>
          </View>
        </View>

        {/* Row 2: risk + sentiment + owned + watch + change */}
        <View style={styles.cardBottom}>
          <View style={[styles.riskPill, { backgroundColor: riskColor + "18" }]}>
            <Feather name="shield" size={9} color={riskColor} />
            <Text style={[styles.riskText, { color: riskColor }]}>Risk {asset.riskScore}</Text>
          </View>
          <View style={[styles.sentimentPill, { backgroundColor: (asset.bullish ? colors.green : colors.red) + "18" }]}>
            <Text style={[styles.sentimentText, { color: asset.bullish ? colors.green : colors.red }]}>
              {asset.bullish ? "Bullish" : "Bearish"}
            </Text>
          </View>
          {isOwned && (
            <View style={[styles.ownedPill, { backgroundColor: colors.primary + "18" }]}>
              <Feather name="briefcase" size={9} color={colors.primary} />
              <Text style={[styles.ownedText, { color: colors.primary }]}>{ownedQty}</Text>
            </View>
          )}
          <View style={{ flex: 1 }} />
          <View style={[styles.changePill, { backgroundColor: changeColor + "18" }]}>
            <Feather name={isUp ? "trending-up" : "trending-down"} size={10} color={changeColor} />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {isUp ? "+" : ""}{asset.dailyChangePercent.toFixed(2)}%
            </Text>
          </View>
          <Pressable onPress={() => onWatchToggle(asset.id)} hitSlop={10} style={styles.watchBtn}>
            <Feather
              name="bookmark"
              size={14}
              color={isWatched ? colors.coin : colors.mutedForeground + "60"}
            />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

// ── Main Screen ────────────────────────────────────────────────

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const liveAssets = useLiveAssets();
  const { isWatched, addToWatchlist, removeFromWatchlist, watchlist, holdings, setChallengeFlag } = useGame();

  useEffect(() => { setChallengeFlag("open_scanner"); }, []);

  const [activePreset, setActivePreset] = useState<string>("biggest-movers");
  const [sportFilter, setSportFilter] = useState<SportFilter>("All Sports");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("All Types");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const preset = PRESETS.find(p => p.id === activePreset)!;
  const accent = accentColorFor(preset.accentType, colors);

  const results = useMemo(() => {
    let base: Asset[] = [];

    switch (activePreset) {
      case "biggest-movers":
        base = [...liveAssets].sort(
          (a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent)
        );
        break;
      case "momentum-leaders":
        base = liveAssets
          .filter(a => a.dailyChangePercent > 10)
          .sort((a, b) => b.dailyChangePercent - a.dailyChangePercent);
        break;
      case "dip-watch":
        base = liveAssets
          .filter(a => a.dailyChangePercent < -10)
          .sort((a, b) => a.dailyChangePercent - b.dailyChangePercent);
        break;
      case "high-volatility":
        base = liveAssets
          .filter(a => a.riskScore >= 8 || Math.abs(a.dailyChangePercent) > 12)
          .sort((a, b) => b.riskScore - a.riskScore || Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent));
        break;
      case "lower-risk-indexes":
        base = liveAssets
          .filter(a => a.type === "Sport Index" && a.riskScore <= 4)
          .sort((a, b) => a.riskScore - b.riskScore);
        break;
      case "watchlist-movers":
        base = liveAssets
          .filter(a => watchlist.includes(a.id) && Math.abs(a.dailyChangePercent) > 5)
          .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent));
        break;
      case "portfolio-movers":
        base = liveAssets
          .filter(a => holdings.some(h => h.assetId === a.id))
          .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent));
        break;
    }

    // Apply sport filter
    if (sportFilter !== "All Sports") {
      base = base.filter(a => a.sport === sportFilter);
    }

    // Apply type filter
    if (typeFilter !== "All Types") {
      base = base.filter(a => a.type === typeFilter);
    }

    return base;
  }, [activePreset, sportFilter, typeFilter, liveAssets, watchlist, holdings]);

  const handleWatchToggle = (assetId: string) => {
    if (isWatched(assetId)) removeFromWatchlist(assetId);
    else addToWatchlist(assetId);
  };

  // Preset chip accent
  const presetAccent = (p: ScanPreset) => accentColorFor(p.accentType, colors);

  // Empty message for preset
  const emptyPreset = preset;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <Text style={[styles.title, { color: colors.foreground }]}>Scanner</Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Find assets that match a strategy
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={a => a.id}
        contentContainerStyle={{ paddingBottom: bottomPad + 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Education banner */}
            <View style={[styles.educationBanner, { backgroundColor: colors.blue + "10", borderColor: colors.blue + "25" }]}>
              <Feather name="info" size={14} color={colors.blue} />
              <Text style={[styles.educationText, { color: colors.foreground }]}>
                Scanner helps you find assets that match a strategy. Real traders use scanners to filter markets. Fanfolio uses sports assets so you can learn the idea without real money.
              </Text>
            </View>

            {/* Preset chips */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.chipScroll}
              style={styles.chipBar}
            >
              {PRESETS.map(p => {
                const isActive = p.id === activePreset;
                const pAccent = presetAccent(p);
                return (
                  <Pressable
                    key={p.id}
                    onPress={() => {
                      setActivePreset(p.id);
                      if (p.id === "dip-watch") setChallengeFlag("view_dip_watch");
                      if (p.id === "momentum-leaders") setChallengeFlag("view_momentum");
                    }}
                    style={[
                      styles.presetChip,
                      {
                        backgroundColor: isActive ? pAccent + "20" : colors.card,
                        borderColor: isActive ? pAccent : colors.border,
                      },
                    ]}
                  >
                    <Text style={styles.presetEmoji}>{p.emoji}</Text>
                    <Text style={[styles.presetLabel, { color: isActive ? pAccent : colors.mutedForeground }]}>
                      {p.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Sport filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.filterScroll}
            >
              {SPORT_FILTERS.map(sf => {
                const isActive = sportFilter === sf;
                return (
                  <Pressable
                    key={sf}
                    onPress={() => setSportFilter(sf)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? colors.primary + "20" : colors.muted,
                        borderColor: isActive ? colors.primary : "transparent",
                      },
                    ]}
                  >
                    <Text style={[styles.filterText, { color: isActive ? colors.primary : colors.mutedForeground }]}>
                      {sf}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Type filter */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={[styles.filterScroll, { marginTop: 0 }]}
            >
              {TYPE_FILTERS.map(tf => {
                const isActive = typeFilter === tf;
                return (
                  <Pressable
                    key={tf}
                    onPress={() => setTypeFilter(tf)}
                    style={[
                      styles.filterChip,
                      {
                        backgroundColor: isActive ? colors.coin + "20" : colors.muted,
                        borderColor: isActive ? colors.coin : "transparent",
                      },
                    ]}
                  >
                    <Text style={[styles.filterText, { color: isActive ? colors.coin : colors.mutedForeground }]}>
                      {TYPE_LABELS[tf]}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>

            {/* Preset info + lesson card */}
            <View style={[styles.infoCard, { backgroundColor: accent + "0C", borderColor: accent + "28" }]}>
              <View style={styles.infoTop}>
                <Text style={styles.infoEmoji}>{preset.emoji}</Text>
                <View style={styles.infoText}>
                  <Text style={[styles.infoTitle, { color: colors.foreground }]}>{preset.label}</Text>
                  <Text style={[styles.infoDesc, { color: colors.mutedForeground }]}>{preset.description}</Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: accent }]}>
                  <Text style={styles.countText}>{results.length}</Text>
                </View>
              </View>
              <View style={[styles.lessonBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.lessonRow}>
                  <Feather name="book-open" size={11} color={colors.primary} />
                  <Text style={[styles.lessonTitle, { color: colors.primary }]}>{preset.lessonTitle}</Text>
                </View>
                <Text style={[styles.lessonText, { color: colors.mutedForeground }]}>{preset.lesson}</Text>
              </View>
            </View>

            {results.length > 0 && (
              <Text style={[styles.resultsCount, { color: colors.mutedForeground }]}>
                {results.length} asset{results.length !== 1 ? "s" : ""} match this scan
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => {
          const holding = holdings.find(h => h.assetId === item.id);
          return (
            <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
              <ScanResultCard
                asset={item}
                accentType={preset.accentType}
                colors={colors}
                isWatched={isWatched(item.id)}
                isOwned={!!holding}
                ownedQty={holding?.quantity ?? 0}
                onWatchToggle={handleWatchToggle}
              />
            </View>
          );
        }}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Feather name={emptyPreset.emptyIcon as any} size={38} color={colors.mutedForeground + "60"} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No results
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              {emptyPreset.emptyMessage}
            </Text>
            {activePreset === "watchlist-movers" && (
              <Pressable
                onPress={() => router.push("/(tabs)/market")}
                style={[styles.emptyBtn, { backgroundColor: colors.coin }]}
              >
                <Text style={[styles.emptyBtnText, { color: "#0C0F14" }]}>Browse Market</Text>
              </Pressable>
            )}
            {activePreset === "portfolio-movers" && (
              <Pressable
                onPress={() => router.push("/(tabs)/market")}
                style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>Start Trading</Text>
              </Pressable>
            )}
          </View>
        }
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },

  header: {
    paddingHorizontal: 16,
    paddingBottom: 10,
    borderBottomWidth: 1,
    gap: 2,
  },
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular" },

  educationBanner: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  educationText: {
    flex: 1,
    fontSize: 12,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },

  chipBar: { marginTop: 10 },
  chipScroll: {
    paddingHorizontal: 16,
    gap: 8,
    flexDirection: "row",
    paddingVertical: 2,
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetEmoji: { fontSize: 13 },
  presetLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  filterScroll: {
    paddingHorizontal: 16,
    gap: 6,
    flexDirection: "row",
    paddingVertical: 4,
    marginTop: 6,
  },
  filterChip: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterText: { fontSize: 12, fontFamily: "Inter_500Medium" },

  infoCard: {
    marginHorizontal: 16,
    marginTop: 10,
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  infoTop: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  infoEmoji: { fontSize: 26, lineHeight: 32 },
  infoText: { flex: 1, gap: 3 },
  infoTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  infoDesc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  countBadge: {
    width: 26, height: 26, borderRadius: 13,
    alignItems: "center", justifyContent: "center",
  },
  countText: { fontSize: 11, fontFamily: "Inter_700Bold", color: "#fff" },
  lessonBox: {
    borderRadius: 10, borderWidth: 1,
    padding: 10, gap: 5,
  },
  lessonRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  lessonTitle: {
    fontSize: 10, fontFamily: "Inter_700Bold",
    textTransform: "uppercase", letterSpacing: 0.5,
  },
  lessonText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  resultsCount: {
    marginHorizontal: 18, marginTop: 8, marginBottom: 2,
    fontSize: 12, fontFamily: "Inter_500Medium",
  },

  // Result card
  resultCard: {
    flexDirection: "row",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  cardAccent: { width: 3, alignSelf: "stretch" },
  cardBody: {
    flex: 1,
    paddingVertical: 10,
    paddingRight: 12,
    paddingLeft: 10,
    gap: 7,
  },
  cardTop: { flexDirection: "row", alignItems: "flex-start" },
  cardLeft: { flex: 1, gap: 2 },
  symbolRow: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" },
  symbol: { fontSize: 14, fontFamily: "Inter_700Bold" },
  tagBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  tagText: { fontSize: 9, fontFamily: "Inter_500Medium" },
  assetName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  cardRight: { alignItems: "flex-end", gap: 3 },
  price: { fontSize: 13, fontFamily: "Inter_700Bold" },

  cardBottom: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  riskPill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5,
  },
  riskText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  sentimentPill: {
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5,
  },
  sentimentText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  ownedPill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5,
  },
  ownedText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  changePill: {
    flexDirection: "row", alignItems: "center", gap: 3,
    paddingHorizontal: 6, paddingVertical: 3, borderRadius: 5,
  },
  changeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  watchBtn: { padding: 3 },

  // Empty
  empty: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", textAlign: "center", marginTop: 4 },
  emptyText: {
    fontSize: 13, fontFamily: "Inter_400Regular",
    textAlign: "center", lineHeight: 19,
  },
  emptyBtn: {
    marginTop: 8, paddingHorizontal: 20, paddingVertical: 11, borderRadius: 10,
  },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
});
