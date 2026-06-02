import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  FlatList,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { useGame } from "@/context/GameContext";
import { Asset } from "@/data/mockAssets";
import { SparklineChart } from "@/components/SparklineChart";

interface ScanPreset {
  id: string;
  label: string;
  emoji: string;
  description: string;
  lesson: string;
  lessonTitle: string;
  filter: (assets: Asset[]) => Asset[];
  sortKey: (a: Asset) => number;
  sortDesc: boolean;
  accentType: "green" | "red" | "yellow" | "primary" | "coin";
}

const SCAN_PRESETS: ScanPreset[] = [
  {
    id: "top-gainers",
    label: "Top Gainers",
    emoji: "🔥",
    description: "Assets with the biggest price increases today.",
    lesson:
      "Momentum traders look for assets already moving up, hoping the trend continues. The risk: late buyers often get stuck if the move reverses.",
    lessonTitle: "What is momentum trading?",
    filter: (assets) => assets.filter((a) => a.dailyChangePercent > 3),
    sortKey: (a) => a.dailyChangePercent,
    sortDesc: true,
    accentType: "green",
  },
  {
    id: "top-losers",
    label: "Top Losers",
    emoji: "📉",
    description: "Assets that have dropped the most today.",
    lesson:
      "Contrarian traders sometimes buy losers expecting a price recovery. But a falling price can keep falling — always understand why an asset dropped before buying.",
    lessonTitle: "What is contrarian investing?",
    filter: (assets) => assets.filter((a) => a.dailyChangePercent < -3),
    sortKey: (a) => a.dailyChangePercent,
    sortDesc: false,
    accentType: "red",
  },
  {
    id: "breakout",
    label: "Breakout Alert",
    emoji: "🚀",
    description: "Assets surging more than 10% — a potential breakout move.",
    lesson:
      "A breakout happens when an asset moves sharply beyond its normal range. Breakouts can signal strong new momentum — but they can also be short-lived spikes that reverse quickly.",
    lessonTitle: "What is a breakout?",
    filter: (assets) => assets.filter((a) => a.dailyChangePercent >= 10),
    sortKey: (a) => a.dailyChangePercent,
    sortDesc: true,
    accentType: "green",
  },
  {
    id: "deep-dip",
    label: "Deep Dip",
    emoji: "❄️",
    description: "Assets down more than 8% — oversold territory.",
    lesson:
      "An 'oversold' asset has dropped sharply and may be due for a bounce. But some drops are justified — check the risk score and recent events before assuming a recovery.",
    lessonTitle: "What does oversold mean?",
    filter: (assets) => assets.filter((a) => a.dailyChangePercent <= -8),
    sortKey: (a) => a.dailyChangePercent,
    sortDesc: false,
    accentType: "red",
  },
  {
    id: "low-risk",
    label: "Low Risk Picks",
    emoji: "🛡️",
    description: "Stable assets with a risk score of 3 or below.",
    lesson:
      "Low-risk assets move slowly but steadily. They rarely deliver huge gains but also rarely crash. These are the foundation of a diversified portfolio — the anchor that protects you during volatile markets.",
    lessonTitle: "Why hold low-risk assets?",
    filter: (assets) => assets.filter((a) => a.riskScore <= 3),
    sortKey: (a) => a.riskScore,
    sortDesc: false,
    accentType: "primary",
  },
  {
    id: "high-volatility",
    label: "High Volatility",
    emoji: "🌊",
    description: "High-risk assets with a risk score of 8 or above.",
    lesson:
      "Volatile assets can deliver massive gains — but also massive losses. The key principle is position sizing: never put a large share of your portfolio into a single high-risk asset.",
    lessonTitle: "Why does volatility matter?",
    filter: (assets) => assets.filter((a) => a.riskScore >= 8),
    sortKey: (a) => a.riskScore,
    sortDesc: true,
    accentType: "yellow",
  },
  {
    id: "steady-climbers",
    label: "Steady Climbers",
    emoji: "💎",
    description: "Bullish assets with moderate risk (score ≤ 5) gaining today.",
    lesson:
      "Steady climbers combine upward momentum with manageable risk. In real markets, these are often called 'quality growth' assets — reliable performers that grow without extreme swings.",
    lessonTitle: "What is quality growth?",
    filter: (assets) =>
      assets.filter((a) => a.bullish && a.riskScore <= 5 && a.dailyChangePercent > 0),
    sortKey: (a) => a.dailyChangePercent,
    sortDesc: true,
    accentType: "green",
  },
  {
    id: "high-momentum",
    label: "High Momentum",
    emoji: "⚡",
    description: "Assets moving more than 8% in either direction today.",
    lesson:
      "Momentum simply means something is moving fast. Traders use momentum signals to catch trends early. The risk: a fast move can reverse just as quickly — stop-losses exist for this reason.",
    lessonTitle: "What is a momentum signal?",
    filter: (assets) =>
      assets.filter((a) => Math.abs(a.dailyChangePercent) >= 8),
    sortKey: (a) => Math.abs(a.dailyChangePercent),
    sortDesc: true,
    accentType: "coin",
  },
];

function ScanResultRow({
  asset,
  accentType,
  colors,
  isWatched,
  onWatchToggle,
}: {
  asset: Asset;
  accentType: ScanPreset["accentType"];
  colors: ReturnType<typeof useColors>;
  isWatched: boolean;
  onWatchToggle: (id: string) => void;
}) {
  const isUp = asset.dailyChangePercent >= 0;
  const changeColor = isUp ? colors.green : colors.red;
  const accentColor =
    accentType === "green"
      ? colors.green
      : accentType === "red"
      ? colors.red
      : accentType === "yellow"
      ? "#F59E0B"
      : accentType === "coin"
      ? colors.coin
      : colors.primary;

  return (
    <Pressable
      onPress={() =>
        router.push({ pathname: "/asset/[id]", params: { id: asset.id } })
      }
      style={[styles.resultRow, { backgroundColor: colors.card, borderColor: colors.border }]}
    >
      <View style={[styles.resultAccent, { backgroundColor: accentColor }]} />
      <View style={styles.resultInfo}>
        <View style={styles.resultNameRow}>
          <Text style={[styles.resultSymbol, { color: colors.foreground }]}>{asset.symbol}</Text>
          <View style={[styles.typeBadge, { backgroundColor: colors.border }]}>
            <Text style={[styles.typeBadgeText, { color: colors.mutedForeground }]}>
              {asset.type === "Sport Index" ? "Index" : asset.type === "Team Stock" ? "Team" : asset.type === "Player Coin" ? "Player" : asset.type === "Meme Coin" ? "Meme" : "Future"}
            </Text>
          </View>
        </View>
        <Text style={[styles.resultName, { color: colors.mutedForeground }]} numberOfLines={1}>
          {asset.name}
        </Text>
      </View>

      <View style={styles.resultChart}>
        <SparklineChart
          data={asset.chartData}
          width={56}
          height={28}
          color={isUp ? colors.green : colors.red}
        />
      </View>

      <View style={styles.resultStats}>
        <Text style={[styles.resultPrice, { color: colors.foreground }]}>
          {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <View style={[styles.changePill, { backgroundColor: changeColor + "18" }]}>
          <Feather
            name={isUp ? "trending-up" : "trending-down"}
            size={10}
            color={changeColor}
          />
          <Text style={[styles.changeText, { color: changeColor }]}>
            {isUp ? "+" : ""}
            {asset.dailyChangePercent.toFixed(2)}%
          </Text>
        </View>
      </View>

      <Pressable
        onPress={() => onWatchToggle(asset.id)}
        style={styles.watchBtn}
        hitSlop={8}
      >
        <Feather
          name={isWatched ? "bookmark" : "bookmark"}
          size={16}
          color={isWatched ? colors.coin : colors.mutedForeground + "80"}
        />
      </Pressable>
    </Pressable>
  );
}

export default function ScannerScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const liveAssets = useLiveAssets();
  const { isWatched, addToWatchlist, removeFromWatchlist } = useGame();

  const [activePreset, setActivePreset] = useState<string>("top-gainers");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const preset = SCAN_PRESETS.find((p) => p.id === activePreset)!;

  const results = useMemo(() => {
    const filtered = preset.filter(liveAssets);
    return [...filtered].sort((a, b) => {
      const diff = preset.sortKey(b) - preset.sortKey(a);
      return preset.sortDesc ? diff : -diff;
    });
  }, [activePreset, liveAssets, preset]);

  const handleWatchToggle = (assetId: string) => {
    if (isWatched(assetId)) {
      removeFromWatchlist(assetId);
    } else {
      addToWatchlist(assetId);
    }
  };

  const accentColor =
    preset.accentType === "green"
      ? colors.green
      : preset.accentType === "red"
      ? colors.red
      : preset.accentType === "yellow"
      ? "#F59E0B"
      : preset.accentType === "coin"
      ? colors.coin
      : colors.primary;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={styles.titleBlock}>
            <Text style={[styles.title, { color: colors.foreground }]}>Market Scanner</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Find assets by condition
            </Text>
          </View>
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.presetScroll}
        style={[styles.presetBar, { borderBottomColor: colors.border }]}
      >
        {SCAN_PRESETS.map((p) => {
          const isActive = p.id === activePreset;
          const pAccent =
            p.accentType === "green"
              ? colors.green
              : p.accentType === "red"
              ? colors.red
              : p.accentType === "yellow"
              ? "#F59E0B"
              : p.accentType === "coin"
              ? colors.coin
              : colors.primary;
          return (
            <Pressable
              key={p.id}
              onPress={() => setActivePreset(p.id)}
              style={[
                styles.presetChip,
                {
                  backgroundColor: isActive ? pAccent + "20" : colors.card,
                  borderColor: isActive ? pAccent : colors.border,
                },
              ]}
            >
              <Text style={styles.presetEmoji}>{p.emoji}</Text>
              <Text
                style={[
                  styles.presetLabel,
                  { color: isActive ? pAccent : colors.mutedForeground },
                ]}
              >
                {p.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <FlatList
        data={results}
        keyExtractor={(a) => a.id}
        contentContainerStyle={{ paddingBottom: bottomPad + 100, paddingTop: 12 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.listHeader}>
            <View
              style={[
                styles.scanInfoCard,
                { backgroundColor: accentColor + "10", borderColor: accentColor + "30" },
              ]}
            >
              <View style={styles.scanInfoTop}>
                <Text style={styles.scanEmoji}>{preset.emoji}</Text>
                <View style={styles.scanInfoText}>
                  <Text style={[styles.scanInfoTitle, { color: colors.foreground }]}>
                    {preset.label}
                  </Text>
                  <Text style={[styles.scanInfoDesc, { color: colors.mutedForeground }]}>
                    {preset.description}
                  </Text>
                </View>
                <View style={[styles.countBadge, { backgroundColor: accentColor }]}>
                  <Text style={styles.countText}>{results.length}</Text>
                </View>
              </View>
              <View style={[styles.lessonBox, { backgroundColor: colors.background + "CC", borderColor: colors.border }]}>
                <View style={styles.lessonHeader}>
                  <Feather name="book-open" size={12} color={colors.primary} />
                  <Text style={[styles.lessonTitle, { color: colors.primary }]}>
                    {preset.lessonTitle}
                  </Text>
                </View>
                <Text style={[styles.lessonText, { color: colors.mutedForeground }]}>
                  {preset.lesson}
                </Text>
              </View>
            </View>

            {results.length > 0 && (
              <Text style={[styles.resultsLabel, { color: colors.mutedForeground }]}>
                {results.length} asset{results.length !== 1 ? "s" : ""} match this scan
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <ScanResultRow
              asset={item}
              accentType={preset.accentType}
              colors={colors}
              isWatched={isWatched(item.id)}
              onWatchToggle={handleWatchToggle}
            />
          </View>
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>
              No assets match right now
            </Text>
            <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
              Apply a market event on the Home screen to trigger price movements and see this scan populate.
            </Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTop: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  backBtn: {
    padding: 4,
  },
  titleBlock: { flex: 1 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 1 },

  presetBar: {
    borderBottomWidth: 1,
    maxHeight: 56,
  },
  presetScroll: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    flexDirection: "row",
  },
  presetChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
  },
  presetEmoji: { fontSize: 14 },
  presetLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  listHeader: {
    paddingHorizontal: 16,
    marginBottom: 4,
    gap: 12,
  },
  scanInfoCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 14,
    gap: 10,
  },
  scanInfoTop: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
  },
  scanEmoji: { fontSize: 28, lineHeight: 34 },
  scanInfoText: { flex: 1, gap: 3 },
  scanInfoTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  scanInfoDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  countBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
  },
  countText: {
    fontSize: 12,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  lessonBox: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    gap: 5,
  },
  lessonHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  lessonTitle: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  lessonText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 18,
  },
  resultsLabel: {
    fontSize: 12,
    fontFamily: "Inter_500Medium",
    marginLeft: 2,
    marginTop: -4,
  },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    paddingRight: 12,
    paddingVertical: 10,
    gap: 10,
  },
  resultAccent: {
    width: 3,
    alignSelf: "stretch",
    borderRadius: 2,
    marginLeft: 0,
  },
  resultInfo: {
    flex: 1,
    paddingLeft: 8,
    gap: 3,
  },
  resultNameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  resultSymbol: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontFamily: "Inter_500Medium",
  },
  resultName: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  resultChart: {
    width: 56,
    alignItems: "center",
  },
  resultStats: {
    alignItems: "flex-end",
    gap: 4,
  },
  resultPrice: {
    fontSize: 14,
    fontFamily: "Inter_700Bold",
  },
  changePill: {
    flexDirection: "row",
    alignItems: "center",
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  changeText: {
    fontSize: 11,
    fontFamily: "Inter_700Bold",
  },
  watchBtn: {
    padding: 4,
  },

  empty: {
    alignItems: "center",
    paddingTop: 40,
    paddingHorizontal: 32,
    gap: 8,
  },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 19,
  },
});
