import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

interface RiskBarProps {
  score: number;
  showLabel?: boolean;
}

function getRiskLabel(score: number): string {
  if (score <= 2) return "Very Low";
  if (score <= 4) return "Low";
  if (score <= 6) return "Medium";
  if (score <= 8) return "High";
  return "Extreme";
}

export function RiskBar({ score, showLabel = true }: RiskBarProps) {
  const colors = useColors();

  const riskColor =
    score <= 2 ? colors.green :
    score <= 4 ? "#86EFAC" :
    score <= 6 ? "#FCD34D" :
    score <= 8 ? "#FB923C" :
    colors.red;

  return (
    <View style={styles.container}>
      {showLabel && (
        <View style={styles.labelRow}>
          <Text style={[styles.label, { color: colors.mutedForeground }]}>Risk</Text>
          <Text style={[styles.score, { color: riskColor }]}>{getRiskLabel(score)}</Text>
        </View>
      )}
      <View style={[styles.track, { backgroundColor: colors.border }]}>
        <View style={[styles.fill, { width: `${score * 10}%` as any, backgroundColor: riskColor }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 4,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  label: {
    fontSize: 12,
    fontFamily: "Inter_400Regular",
  },
  score: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  track: {
    height: 4,
    borderRadius: 2,
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 2,
  },
});
