import React, { useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame, PortfolioSnapshot } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { SparklineChart } from "@/components/SparklineChart";
import { useUserPreferences } from "@/lib/userPreferences";

function formatLC(n: number, compact = false): string {
  if (compact) {
    if (Math.abs(n) >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (Math.abs(n) >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return Math.round(n).toLocaleString();
  }
  return n.toLocaleString(undefined, { maximumFractionDigits: 0 });
}

function formatTime(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return "just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  const diffDays = Math.floor(diffHrs / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function triggerLabel(t: PortfolioSnapshot["trigger"]): string {
  switch (t) {
    case "app_open": return "App opened";
    case "trade": return "Trade";
    case "market_event": return "Market event";
    case "manual": return "Manual";
  }
}

export default function PerformanceScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { portfolioSnapshots, takeSnapshot, holdings, luckyCoinBalance, setChallengeFlag, challengeFlags } = useGame();

  useEffect(() => {
    if (!challengeFlags.includes("hasViewedPerformance")) {
      setChallengeFlag("hasViewedPerformance");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const liveAssets = useLiveAssets();
  const { prefs } = useUserPreferences();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const snaps = portfolioSnapshots ?? [];

  // Current live portfolio value
  const currentHoldingsValue = useMemo(() => {
    return holdings.reduce((sum, h) => {
      const asset = liveAssets.find(a => a.id === h.assetId);
      return sum + (asset ? asset.price * h.quantity : 0);
    }, 0);
  }, [holdings, liveAssets]);

  const currentTotalValue = currentHoldingsValue + luckyCoinBalance;
  const INITIAL = 10000;
  const currentReturnPct = ((currentTotalValue - INITIAL) / INITIAL) * 100;

  // Snapshot stats
  const stats = useMemo(() => {
    if (snaps.length === 0) return null;
    const values = snaps.map(s => s.totalPortfolioValue);
    const highest = Math.max(...values);
    const lowest = Math.min(...values);
    const highestSnap = snaps.find(s => s.totalPortfolioValue === highest)!;
    const lowestSnap = snaps.find(s => s.totalPortfolioValue === lowest)!;
    const earliest = snaps[snaps.length - 1];
    const changeFromFirst = currentTotalValue - earliest.totalPortfolioValue;
    const changeFromFirstPct = earliest.totalPortfolioValue > 0
      ? (changeFromFirst / earliest.totalPortfolioValue) * 100
      : 0;
    const latestSnap = snaps[0];
    const latestChange = latestSnap.dayChangeValue;
    const latestChangePct = latestSnap.dayChangePercent;

    return { highest, lowest, highestSnap, lowestSnap, earliest, changeFromFirst, changeFromFirstPct, latestChange, latestChangePct };
  }, [snaps, currentTotalValue]);

  // Chart data — oldest first
  const chartData = useMemo(() => {
    const vals = [...snaps].reverse().map(s => s.totalPortfolioValue);
    if (vals.length < 2) return [...vals, currentTotalValue];
    return [...vals, currentTotalValue];
  }, [snaps, currentTotalValue]);

  const isPositive = currentTotalValue >= INITIAL;
  const changeColor = currentReturnPct >= 0 ? colors.green : colors.red;

  // Top holding name
  const latestSnap = snaps[0];
  const topHolding = latestSnap?.topHoldingId
    ? (liveAssets.find(a => a.id === latestSnap.topHoldingId) ?? null)
    : null;
  const topMover = latestSnap?.topMoverId
    ? (liveAssets.find(a => a.id === latestSnap.topMoverId) ?? null)
    : null;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: bottomPad + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Nav ─────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Performance</Text>
          <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
            Simulated portfolio history
          </Text>
        </View>
        <Pressable
          onPress={() => takeSnapshot("manual")}
          style={[styles.refreshBtn, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}
        >
          <Feather name="refresh-cw" size={15} color={colors.primary} />
          <Text style={[styles.refreshText, { color: colors.primary }]}>Snapshot</Text>
        </Pressable>
      </View>

      {/* ── Hero ─────────────────────────────────────────── */}
      <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.heroLabel, { color: colors.mutedForeground }]}>Current Portfolio Value</Text>
        <Text style={[styles.heroValue, { color: colors.foreground }]}>
          {formatLC(currentTotalValue)}
        </Text>
        <Text style={[styles.heroUnit, { color: colors.mutedForeground }]}>LuckyCoin</Text>

        <View style={[styles.returnRow, { backgroundColor: changeColor + "15", borderRadius: 8, padding: 8, marginTop: 8 }]}>
          <Feather name={currentReturnPct >= 0 ? "trending-up" : "trending-down"} size={14} color={changeColor} />
          <Text style={[styles.returnText, { color: changeColor }]}>
            {currentReturnPct >= 0 ? "+" : ""}{currentReturnPct.toFixed(2)}% total return
          </Text>
        </View>

        {/* Sparkline */}
        {chartData.length >= 2 && (
          <View style={styles.chartWrap}>
            <SparklineChart
              data={chartData}
              width={280}
              height={44}
              positive={isPositive}
            />
          </View>
        )}

        {snaps.length > 0 && (
          <Text style={[styles.snapCount, { color: colors.mutedForeground }]}>
            {snaps.length} snapshot{snaps.length !== 1 ? "s" : ""} recorded
          </Text>
        )}
      </View>

      {/* ── Breakdown ──────────────────────────────────────── */}
      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Cash</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{formatLC(luckyCoinBalance, true)}</Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>
            {currentTotalValue > 0 ? ((luckyCoinBalance / currentTotalValue) * 100).toFixed(0) : 0}%
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Holdings</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{formatLC(currentHoldingsValue, true)}</Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>
            {currentTotalValue > 0 ? ((currentHoldingsValue / currentTotalValue) * 100).toFixed(0) : 0}%
          </Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: currentReturnPct >= 0 ? colors.green + "40" : colors.red + "40" }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Growth</Text>
          <Text style={[styles.statValue, { color: changeColor }]}>
            {currentReturnPct >= 0 ? "+" : ""}{currentReturnPct.toFixed(1)}%
          </Text>
          <Text style={[styles.statSub, { color: colors.mutedForeground }]}>from start</Text>
        </View>
      </View>

      {/* ── Snapshot stats ─────────────────────────────────── */}
      {stats && (
        <>
          {/* Latest change */}
          {stats.latestChange !== undefined && (
            <View style={[styles.changeCard, {
              backgroundColor: (stats.latestChange ?? 0) >= 0 ? colors.green + "10" : colors.red + "10",
              borderColor: (stats.latestChange ?? 0) >= 0 ? colors.green + "30" : colors.red + "30",
            }]}>
              <View style={styles.changeLeft}>
                <Text style={[styles.changeLabel, { color: colors.mutedForeground }]}>Latest Change</Text>
                <Text style={[styles.changeValue, { color: (stats.latestChange ?? 0) >= 0 ? colors.green : colors.red }]}>
                  {(stats.latestChange ?? 0) >= 0 ? "+" : ""}{formatLC(stats.latestChange ?? 0)} LC
                </Text>
              </View>
              {stats.latestChangePct !== undefined && (
                <Text style={[styles.changePct, { color: (stats.latestChangePct ?? 0) >= 0 ? colors.green : colors.red }]}>
                  {(stats.latestChangePct ?? 0) >= 0 ? "+" : ""}{(stats.latestChangePct ?? 0).toFixed(2)}%
                </Text>
              )}
            </View>
          )}

          {/* Since first snapshot */}
          <View style={[styles.changeCard, {
            backgroundColor: stats.changeFromFirst >= 0 ? colors.green + "10" : colors.red + "10",
            borderColor: stats.changeFromFirst >= 0 ? colors.green + "30" : colors.red + "30",
          }]}>
            <View style={styles.changeLeft}>
              <Text style={[styles.changeLabel, { color: colors.mutedForeground }]}>Since First Snapshot</Text>
              <Text style={[styles.changeValue, { color: stats.changeFromFirst >= 0 ? colors.green : colors.red }]}>
                {stats.changeFromFirst >= 0 ? "+" : ""}{formatLC(stats.changeFromFirst)} LC
              </Text>
            </View>
            <Text style={[styles.changePct, { color: stats.changeFromFirstPct >= 0 ? colors.green : colors.red }]}>
              {stats.changeFromFirstPct >= 0 ? "+" : ""}{stats.changeFromFirstPct.toFixed(2)}%
            </Text>
          </View>

          {/* High / Low */}
          <View style={styles.peekRow}>
            <View style={[styles.peekCard, { backgroundColor: colors.green + "10", borderColor: colors.green + "30" }]}>
              <Feather name="arrow-up-circle" size={16} color={colors.green} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.peekLabel, { color: colors.mutedForeground }]}>All-Time High</Text>
                <Text style={[styles.peekValue, { color: colors.green }]}>{formatLC(stats.highest, true)} LC</Text>
                <Text style={[styles.peekTime, { color: colors.mutedForeground }]}>
                  {formatTime(stats.highestSnap.timestamp)} · {triggerLabel(stats.highestSnap.trigger)}
                </Text>
              </View>
            </View>
            <View style={[styles.peekCard, { backgroundColor: colors.red + "10", borderColor: colors.red + "30" }]}>
              <Feather name="arrow-down-circle" size={16} color={colors.red} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.peekLabel, { color: colors.mutedForeground }]}>All-Time Low</Text>
                <Text style={[styles.peekValue, { color: colors.red }]}>{formatLC(stats.lowest, true)} LC</Text>
                <Text style={[styles.peekTime, { color: colors.mutedForeground }]}>
                  {formatTime(stats.lowestSnap.timestamp)} · {triggerLabel(stats.lowestSnap.trigger)}
                </Text>
              </View>
            </View>
          </View>

          {/* Top holding / top mover */}
          {(topHolding || topMover) && (
            <View style={styles.peekRow}>
              {topHolding && (
                <Pressable
                  onPress={() => router.push({ pathname: "/asset/[id]", params: { id: topHolding.id } })}
                  style={({ pressed }) => [
                    styles.peekCard,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Feather name="award" size={16} color={colors.coin} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.peekLabel, { color: colors.mutedForeground }]}>Top Holding</Text>
                    <Text style={[styles.peekValue, { color: colors.foreground }]}>{topHolding.symbol}</Text>
                    <Text style={[styles.peekTime, { color: colors.mutedForeground }]} numberOfLines={1}>{topHolding.name}</Text>
                  </View>
                </Pressable>
              )}
              {topMover && (
                <Pressable
                  onPress={() => router.push({ pathname: "/asset/[id]", params: { id: topMover.id } })}
                  style={({ pressed }) => [
                    styles.peekCard,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <Feather name="zap" size={16} color={colors.primary} />
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.peekLabel, { color: colors.mutedForeground }]}>Top Mover</Text>
                    <Text style={[styles.peekValue, { color: colors.foreground }]}>{topMover.symbol}</Text>
                    <Text style={[styles.peekTime, { color: colors.mutedForeground }]} numberOfLines={1}>{topMover.name}</Text>
                  </View>
                </Pressable>
              )}
            </View>
          )}
        </>
      )}

      {/* ── Empty state ─────────────────────────────────────── */}
      {snaps.length === 0 && (
        <View style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="clock" size={28} color={colors.mutedForeground} />
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No history yet</Text>
          <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>
            Make a trade or review a Market Pulse to start building your performance history.
          </Text>
          <Pressable
            onPress={() => takeSnapshot("manual")}
            style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
          >
            <Feather name="plus" size={14} color={colors.primaryForeground} />
            <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>Take First Snapshot</Text>
          </Pressable>
        </View>
      )}

      {/* ── Recent snapshots list ──────────────────────────── */}
      {snaps.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Snapshots</Text>
          {snaps.slice(0, 8).map((s, i) => {
            const chg = s.dayChangeValue;
            const chgPct = s.dayChangePercent;
            const chgColor = (chg ?? 0) >= 0 ? colors.green : colors.red;
            return (
              <View key={s.id} style={[styles.snapRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.snapIndex, { backgroundColor: colors.muted }]}>
                  <Text style={[styles.snapIndexText, { color: colors.mutedForeground }]}>{i + 1}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.snapValue, { color: colors.foreground }]}>
                    {formatLC(s.totalPortfolioValue, true)} LC
                  </Text>
                  <Text style={[styles.snapMeta, { color: colors.mutedForeground }]}>
                    {formatTime(s.timestamp)} · {triggerLabel(s.trigger)}
                  </Text>
                </View>
                {chg !== undefined && (
                  <Text style={[styles.snapChange, { color: chgColor }]}>
                    {chg >= 0 ? "+" : ""}{formatLC(chg, true)}
                    {chgPct !== undefined ? `\n${chgPct >= 0 ? "+" : ""}${chgPct.toFixed(1)}%` : ""}
                  </Text>
                )}
              </View>
            );
          })}
        </View>
      )}

      {/* ── Educational card ────────────────────────────────── */}
      <View style={[styles.eduCard, { backgroundColor: colors.primary + "0C", borderColor: colors.primary + "25" }]}>
        <View style={styles.eduRow}>
          <Feather name="info" size={14} color={colors.primary} />
          <Text style={[styles.eduTitle, { color: colors.primary }]}>About Performance History</Text>
        </View>
        <Text style={[styles.eduBody, { color: colors.foreground }]}>
          Performance history shows how simulated trades and market events affect your LuckyCoin portfolio value over time.
        </Text>
        <Text style={[styles.eduDisclaimer, { color: colors.mutedForeground }]}>
          This is not real money. LuckyCoin has no cash value, no cash-out, no deposits, and no prizes. All values are educational simulations only.
        </Text>
      </View>

      {prefs.educationalTipsEnabled && (
        <View style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.tipRow}>
            <Feather name="book-open" size={13} color={colors.mutedForeground} />
            <Text style={[styles.tipLabel, { color: colors.mutedForeground }]}>How this works</Text>
          </View>
          <Text style={[styles.tipBody, { color: colors.foreground }]}>
            A snapshot is a saved record of your portfolio value at a specific moment. Snapshots are taken automatically after trades and market events, and when you open the app. You can also tap Snapshot above to record one manually. Over time, the chart shows how your simulated decisions affected your account value.
          </Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingBottom: 12 },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 20, fontFamily: "Inter_700Bold" },
  navSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
  refreshBtn: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 7, borderRadius: 10, borderWidth: 1 },
  refreshText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  heroCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 12 },
  heroLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  heroValue: { fontSize: 38, fontFamily: "Inter_700Bold", lineHeight: 46, marginTop: 2 },
  heroUnit: { fontSize: 12, fontFamily: "Inter_500Medium" },
  returnRow: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" },
  returnText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  chartWrap: { marginTop: 16, alignItems: "center" },
  snapCount: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 10, textAlign: "right" },

  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, gap: 2, alignItems: "center" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statSub: { fontSize: 10, fontFamily: "Inter_400Regular" },

  changeCard: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", marginBottom: 8 },
  changeLeft: { flex: 1, gap: 3 },
  changeLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  changeValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  changePct: { fontSize: 14, fontFamily: "Inter_600SemiBold", textAlign: "right" },

  peekRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 10 },
  peekCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  peekLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  peekValue: { fontSize: 14, fontFamily: "Inter_700Bold", marginTop: 2 },
  peekTime: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 2 },

  section: { paddingHorizontal: 20, marginTop: 8, marginBottom: 12 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", marginBottom: 10 },
  snapRow: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 6 },
  snapIndex: { width: 26, height: 26, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  snapIndexText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  snapValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  snapMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  snapChange: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "right", lineHeight: 17 },

  emptyCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 28, alignItems: "center", gap: 10, marginBottom: 16 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 19 },
  emptyBtn: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10, marginTop: 4 },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },

  eduCard: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 8, gap: 6 },
  eduRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eduTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  eduBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },
  eduDisclaimer: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17, marginTop: 2 },

  tipCard: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 8, gap: 6 },
  tipRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  tipLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  tipBody: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
