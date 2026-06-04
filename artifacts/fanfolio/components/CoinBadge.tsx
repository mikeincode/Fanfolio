import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";

interface CoinBadgeProps {
  amount: number;
  size?: "sm" | "md" | "lg";
  showLabel?: boolean;
}

export function CoinBadge({ amount, size = "md", showLabel = true }: CoinBadgeProps) {
  const colors = useColors();

  const fontSize = size === "sm" ? 12 : size === "lg" ? 20 : 15;
  const iconSize = size === "sm" ? 11 : size === "lg" ? 18 : 14;

  return (
    <View style={styles.row}>
      <Feather name="zap" size={iconSize} color={colors.coin} />
      <Text style={[styles.amount, { fontSize, color: colors.coin, fontFamily: "Inter_600SemiBold" }]}>
        {amount.toLocaleString(undefined, { maximumFractionDigits: 0 })}
      </Text>
      {showLabel && (
        <Text style={[styles.label, { fontSize: fontSize - 3, color: colors.mutedForeground }]}>
          LC
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  amount: {
    fontWeight: "600",
  },
  label: {
    marginLeft: 1,
  },
});
