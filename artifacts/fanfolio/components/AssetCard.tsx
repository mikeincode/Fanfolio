import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useColors } from "@/hooks/useColors";
import { Asset } from "@/data/mockAssets";
import { SparklineChart } from "./SparklineChart";

interface AssetCardProps {
  asset: Asset;
  onPress: () => void;
}

export function AssetCard({ asset, onPress }: AssetCardProps) {
  const colors = useColors();
  const isUp = asset.dailyChangePercent >= 0;
  const changeColor = isUp ? colors.green : colors.red;

  const typeColor: Record<string, string> = {
    "Team Stock": colors.blue,
    "Player Coin": "#A78BFA",
    "Sport Index": colors.green,
    "Meme Coin": "#F97316",
    "Future": "#EC4899",
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          opacity: pressed ? 0.85 : 1,
        },
      ]}
    >
      <View style={styles.left}>
        <View style={styles.topRow}>
          <Text style={[styles.symbol, { color: colors.foreground }]}>{asset.symbol}</Text>
          <View style={[styles.typeBadge, { backgroundColor: typeColor[asset.type] + "20" }]}>
            <Text style={[styles.typeText, { color: typeColor[asset.type] }]}>{asset.type}</Text>
          </View>
        </View>
        <Text style={[styles.name, { color: colors.mutedForeground }]} numberOfLines={1}>{asset.name}</Text>
        <View style={[styles.sentimentBadge, { backgroundColor: isUp ? colors.green + "20" : colors.red + "20" }]}>
          <Text style={[styles.sentimentText, { color: changeColor }]}>
            {asset.bullish ? "Bullish" : "Bearish"}
          </Text>
        </View>
      </View>

      <View style={styles.right}>
        <SparklineChart data={asset.chartData} width={72} height={28} positive={isUp} />
        <Text style={[styles.price, { color: colors.foreground }]}>
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
  left: {
    flex: 1,
    gap: 4,
  },
  right: {
    alignItems: "flex-end",
    gap: 2,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  symbol: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  typeText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  name: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  sentimentBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  sentimentText: {
    fontSize: 10,
    fontFamily: "Inter_600SemiBold",
  },
  price: {
    fontSize: 15,
    fontFamily: "Inter_700Bold",
  },
  change: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
});
