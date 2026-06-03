import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { Asset } from "@/data/mockAssets";
import { SparklineChart } from "./SparklineChart";

interface AssetCardProps {
  asset: Asset;
  onPress: () => void;
  isWatched?: boolean;
  onWatchToggle?: (assetId: string) => void;
  compact?: boolean;
}

export function AssetCard({ asset, onPress, isWatched = false, onWatchToggle, compact = false }: AssetCardProps) {
  const colors = useColors();
  const isUp = asset.dailyChangePercent >= 0;
  const changeColor = isUp ? colors.green : colors.red;

  const typeColor: Record<string, string> = {
    "Team Stock": colors.blue,
    "Player Coin": "#A78BFA",
    "Coach Stock": "#06B6D4",
    "Sport Index": colors.green,
    "Meme Coin": "#F97316",
    "Future": "#EC4899",
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        compact && styles.cardCompact,
        {
          backgroundColor: colors.card,
          borderColor: isWatched ? colors.coin + "50" : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.left}>
        <View style={styles.topRow}>
          <Text style={[styles.symbol, compact && styles.symbolCompact, { color: colors.foreground }]}>{asset.symbol}</Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor[asset.type] + "20" }]}>
            <Text style={[styles.typeText, { color: typeColor[asset.type] }]}>{asset.type}</Text>
          </View>
          {isWatched && (
            <View style={[styles.watchingPill, { backgroundColor: colors.coin + "20" }]}>
              <Feather name="bookmark" size={9} color={colors.coin} />
              <Text style={[styles.watchingText, { color: colors.coin }]}>Watching</Text>
            </View>
          )}
        </View>
        <Text style={[styles.name, compact && styles.nameCompact, { color: colors.mutedForeground }]} numberOfLines={1}>{asset.name}</Text>
        {!compact && (
          <View style={[styles.sentimentBadge, { backgroundColor: isUp ? colors.green + "20" : colors.red + "20" }]}>
            <Text style={[styles.sentimentText, { color: changeColor }]}>
              {asset.bullish ? "Bullish" : "Bearish"}
            </Text>
          </View>
        )}
      </View>

      <View style={styles.right}>
        <View style={styles.chartRow}>
          {!compact && (
            <SparklineChart data={asset.chartData} width={62} height={28} positive={isUp} />
          )}
          {onWatchToggle && (
            <Pressable
              onPress={() => onWatchToggle(asset.id)}
              hitSlop={8}
              style={[
                styles.watchBtn,
                {
                  backgroundColor: isWatched ? colors.coin + "20" : colors.muted,
                  borderColor: isWatched ? colors.coin + "40" : colors.border,
                },
              ]}
            >
              <Feather
                name="bookmark"
                size={13}
                color={isWatched ? colors.coin : colors.mutedForeground}
              />
            </Pressable>
          )}
        </View>
        <Text style={[styles.price, compact && styles.priceCompact, { color: colors.foreground }]}>
          {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.change, { color: changeColor }]}>
          {isUp ? "+" : ""}{asset.dailyChangePercent.toFixed(2)}%
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 8,
  },
  cardCompact: {
    paddingVertical: 7,
  },
  left: { flex: 1, gap: 4 },
  right: { alignItems: "flex-end", gap: 2, marginLeft: 8 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  symbol: { fontSize: 15, fontFamily: "Inter_700Bold" },
  symbolCompact: { fontSize: 13 },
  typeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  watchingPill: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  watchingText: { fontSize: 9, fontFamily: "Inter_600SemiBold" },
  name: { fontSize: 12, fontFamily: "Inter_400Regular" },
  nameCompact: { fontSize: 11 },
  sentimentBadge: { alignSelf: "flex-start", paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  sentimentText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  chartRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  watchBtn: { width: 26, height: 26, borderRadius: 6, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  price: { fontSize: 15, fontFamily: "Inter_700Bold" },
  priceCompact: { fontSize: 13 },
  change: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
