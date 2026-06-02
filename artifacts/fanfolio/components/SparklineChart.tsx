import React, { useMemo } from "react";
import { View, StyleSheet } from "react-native";
import { useColors } from "@/hooks/useColors";

interface SparklineChartProps {
  data: number[];
  width?: number;
  height?: number;
  positive?: boolean;
}

export function SparklineChart({ data, width = 80, height = 32, positive }: SparklineChartProps) {
  const colors = useColors();
  const color = positive === undefined
    ? (data[data.length - 1] >= data[0] ? colors.green : colors.red)
    : (positive ? colors.green : colors.red);

  const bars = useMemo(() => {
    if (!data || data.length === 0) return [];
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    return data.map(v => Math.max(0.08, (v - min) / range));
  }, [data]);

  const barWidth = Math.floor(width / bars.length) - 1;

  return (
    <View style={[styles.container, { width, height }]}>
      {bars.map((ratio, i) => (
        <View
          key={i}
          style={[
            styles.bar,
            {
              width: barWidth,
              height: ratio * height,
              backgroundColor: color,
              opacity: 0.7 + ratio * 0.3,
            },
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: 1,
  },
  bar: {
    borderRadius: 2,
  },
});
