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
import { CoinBadge } from "@/components/CoinBadge";

// ── Performance mini-card ─────────────────────────────────────────────────────

function PerformanceCard({
  totalValue,
  portfolioSnapshots,
  colors,
}: {
  totalValue: number;
  portfolioSnapshots: PortfolioSnapshot[];
  colors: ReturnType<typeof useColors>;
}) {
  const snaps = portfolioSnapshots ?? [];
  const INITIAL = 10000;
  const returnPct = ((totalValue - INITIAL) / INITIAL) * 100;
  const returnColor = returnPct >= 0 ? colors.green : colors.red;
  const earliest = snaps.length > 0 ? snaps[snaps.length - 1] : null;
  const changeFromFirst = earliest ? totalValue - earliest.totalPortfolioValue : null;

  const d = snaps.length > 0 ? new Date(snaps[0].timestamp) : null;
  const lastSnap = d
    ? (() => {
        const diffMs = Date.now() - d.getTime();
        const mins = Math.floor(diffMs / 60000);
        if (mins < 1) return "just now";
        if (mins < 60) return `${mins}m ago`;
        const hrs = Math.floor(mins / 60);
        if (hrs < 24) return `${hrs}h ago`;
        return `${Math.floor(hrs / 24)}d ago`;
      })()
    : null;

  return (
    <Pressable
      onPress={() => router.push("/performance")}
      style={({ pressed }) => [
        perfStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[perfStyles.iconWrap, { backgroundColor: returnColor + "18" }]}>
        <Feather name="bar-chart-2" size={18} color={returnColor} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={[perfStyles.title, { color: colors.foreground }]}>Performance History</Text>
        <View style={perfStyles.metaRow}>
          <Text style={[perfStyles.value, { color: returnColor }]}>
            {returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}% return
          </Text>
          {changeFromFirst !== null && (
            <Text style={[perfStyles.sub, { color: colors.mutedForeground }]}>
              {" · "}{changeFromFirst >= 0 ? "+" : ""}{Math.round(changeFromFirst).toLocaleString()} LC since start
            </Text>
          )}
        </View>
        {lastSnap && (
          <Text style={[perfStyles.snap, { color: colors.mutedForeground }]}>
            {snaps.length} snapshot{snaps.length !== 1 ? "s" : ""} · last {lastSnap}
          </Text>
        )}
        {snaps.length === 0 && (
          <Text style={[perfStyles.snap, { color: colors.mutedForeground }]}>
            No history yet — tap to start tracking
          </Text>
        )}
      </View>
      <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
    </Pressable>
  );
}

const perfStyles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 16, borderRadius: 14, borderWidth: 1, padding: 14 },
  iconWrap: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  metaRow: { flexDirection: "row", alignItems: "center", flexWrap: "wrap", marginTop: 1 },
  value: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  snap: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
});

export default function PortfolioScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { holdings, luckyCoinBalance, portfolioSnapshots, setChallengeFlag, challengeFlags } = useGame();
  const liveAssets = useLiveAssets();

  useEffect(() => {
    if (!challengeFlags.includes("hasViewedPortfolio")) {
      setChallengeFlag("hasViewedPortfolio");
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const enriched = useMemo(() => {
    return holdings.map(h => {
      const asset = liveAssets.find(a => a.id === h.assetId);
      if (!asset) return null;
      const currentValue = asset.price * h.quantity;
      const profitLoss = currentValue - h.totalInvested;
      const profitLossPercent = h.totalInvested > 0 ? (profitLoss / h.totalInvested) * 100 : 0;
      return { ...h, asset, currentValue, profitLoss, profitLossPercent };
    }).filter(Boolean) as Array<{
      assetId: string; quantity: number; averageCost: number; totalInvested: number;
      asset: ReturnType<typeof useLiveAssets>[0]; currentValue: number; profitLoss: number; profitLossPercent: number;
    }>;
  }, [holdings, liveAssets]);

  // Holdings whose assetId is not in the active catalog (stale saves from a
  // different data-source mode). Data is preserved; rows show "Unknown Asset".
  const staleHoldings = useMemo(
    () => holdings.filter(h => !liveAssets.find(a => a.id === h.assetId)),
    [holdings, liveAssets]
  );

  const portfolioValue = enriched.reduce((s, e) => s + e.currentValue, 0);
  const totalInvested = enriched.reduce((s, e) => s + e.totalInvested, 0);
  const totalPL = portfolioValue - totalInvested;
  const totalPLPct = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0;
  const totalValue = portfolioValue + luckyCoinBalance;

  const best = enriched.length > 0 ? enriched.reduce((a, b) => a.profitLossPercent > b.profitLossPercent ? a : b) : null;
  const worst = enriched.length > 0 ? enriched.reduce((a, b) => a.profitLossPercent < b.profitLossPercent ? a : b) : null;

  const sportMap: Record<string, number> = {};
  enriched.forEach(e => { sportMap[e.asset.sport] = (sportMap[e.asset.sport] ?? 0) + e.currentValue; });

  const sportTypes = new Set(enriched.map(e => e.asset.type));
  const diversificationScore = Math.min(10, Math.round((sportTypes.size / 5) * 10));
  const avgRisk = enriched.length > 0 ? enriched.reduce((s, e) => s + e.asset.riskScore * (e.currentValue / Math.max(portfolioValue, 1)), 0) : 0;
  const plColor = totalPL >= 0 ? colors.green : colors.red;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.title, { color: colors.foreground }]}>Portfolio</Text>

      <View style={[styles.heroCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Text style={[styles.heroLabel, { color: colors.mutedForeground }]}>Total Value</Text>
        <Text style={[styles.heroValue, { color: colors.foreground }]}>
          {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
        </Text>
        <Text style={[styles.heroUnit, { color: colors.mutedForeground }]}>LuckyCoin</Text>
        {totalInvested > 0 && (
          <View style={[styles.plRow, { backgroundColor: plColor + "15", borderRadius: 8, padding: 8, marginTop: 8 }]}>
            <Feather name={totalPL >= 0 ? "trending-up" : "trending-down"} size={14} color={plColor} />
            <Text style={[styles.plText, { color: plColor }]}>
              {totalPL >= 0 ? "+" : ""}{totalPL.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC
              ({totalPLPct >= 0 ? "+" : ""}{totalPLPct.toFixed(2)}%)
            </Text>
          </View>
        )}
      </View>

      <View style={styles.statsRow}>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Available</Text>
          <CoinBadge amount={luckyCoinBalance} size="md" showLabel={false} />
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Invested</Text>
          <CoinBadge amount={totalInvested} size="md" showLabel={false} />
        </View>
        <View style={[styles.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Holdings</Text>
          <Text style={[styles.statValue, { color: colors.foreground }]}>{enriched.length}</Text>
        </View>
      </View>

      {enriched.length > 0 && (
        <View style={styles.scoreRow}>
          <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Diversification</Text>
            <Text style={[styles.scoreValue, { color: diversificationScore >= 5 ? colors.green : colors.red }]}>{diversificationScore}/10</Text>
          </View>
          <View style={[styles.scoreCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.scoreLabel, { color: colors.mutedForeground }]}>Avg Risk</Text>
            <Text style={[styles.scoreValue, { color: avgRisk <= 4 ? colors.green : avgRisk <= 7 ? colors.coin : colors.red }]}>
              {avgRisk.toFixed(1)}/10
            </Text>
          </View>
        </View>
      )}

      {(best || worst) && best !== worst && (
        <View style={styles.peekRow}>
          {best && (
            <View style={[styles.peekCard, { backgroundColor: colors.green + "12", borderColor: colors.green + "30" }]}>
              <Feather name="award" size={14} color={colors.green} />
              <View>
                <Text style={[styles.peekLabel, { color: colors.mutedForeground }]}>Best</Text>
                <Text style={[styles.peekSym, { color: colors.green }]}>{best.asset.symbol}</Text>
                <Text style={[styles.peekPct, { color: colors.green }]}>+{best.profitLossPercent.toFixed(1)}%</Text>
              </View>
            </View>
          )}
          {worst && (
            <View style={[styles.peekCard, { backgroundColor: colors.red + "12", borderColor: colors.red + "30" }]}>
              <Feather name="trending-down" size={14} color={colors.red} />
              <View>
                <Text style={[styles.peekLabel, { color: colors.mutedForeground }]}>Worst</Text>
                <Text style={[styles.peekSym, { color: colors.red }]}>{worst.asset.symbol}</Text>
                <Text style={[styles.peekPct, { color: colors.red }]}>{worst.profitLossPercent.toFixed(1)}%</Text>
              </View>
            </View>
          )}
        </View>
      )}

      <Pressable
        onPress={() => router.push("/portfolio-coach")}
        style={({ pressed }) => [
          styles.journalBtn,
          { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28", opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.journalIcon, { backgroundColor: colors.primary + "20" }]}>
          <Feather name="activity" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.journalTitle, { color: colors.foreground }]}>Portfolio Coach</Text>
          <Text style={[styles.journalSub, { color: colors.mutedForeground }]}>Review your risk and diversification</Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </Pressable>

      <PerformanceCard
        totalValue={totalValue}
        portfolioSnapshots={portfolioSnapshots}
        colors={colors}
      />

      <Pressable
        onPress={() => router.push("/journal")}
        style={({ pressed }) => [
          styles.journalBtn,
          { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
        ]}
      >
        <View style={[styles.journalIcon, { backgroundColor: colors.primary + "15" }]}>
          <Feather name="book" size={18} color={colors.primary} />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={[styles.journalTitle, { color: colors.foreground }]}>Trading Journal</Text>
          <Text style={[styles.journalSub, { color: colors.mutedForeground }]}>Review your buys and sells</Text>
        </View>
        <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
      </Pressable>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Holdings</Text>

        {enriched.length === 0 ? (
          <Pressable
            onPress={() => router.push("/(tabs)/market")}
            style={[styles.emptyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
          >
            <Feather name="shopping-bag" size={28} color={colors.mutedForeground} />
            <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No holdings yet</Text>
            <Text style={[styles.emptySub, { color: colors.mutedForeground }]}>Head to the market to make your first trade</Text>
            <Text style={[styles.emptyAction, { color: colors.primary }]}>Go to Market</Text>
          </Pressable>
        ) : (
          <>
            {enriched.map(e => {
              const isUp = e.profitLoss >= 0;
              const plColor = isUp ? colors.green : colors.red;
              return (
                <Pressable
                  key={e.assetId}
                  onPress={() => router.push({ pathname: "/asset/[id]", params: { id: e.assetId } })}
                  style={({ pressed }) => [
                    styles.holdingCard,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <View style={styles.holdingLeft}>
                    <Text style={[styles.holdingSym, { color: colors.foreground }]}>{e.asset.symbol}</Text>
                    <Text style={[styles.holdingName, { color: colors.mutedForeground }]} numberOfLines={1}>{e.asset.name}</Text>
                    <Text style={[styles.holdingQty, { color: colors.mutedForeground }]}>{e.quantity} shares</Text>
                  </View>
                  <SparklineChart data={e.asset.chartData} width={52} height={22} positive={isUp} />
                  <View style={styles.holdingRight}>
                    <Text style={[styles.holdingValue, { color: colors.foreground }]}>
                      {e.currentValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </Text>
                    <Text style={[styles.holdingPL, { color: plColor }]}>
                      {isUp ? "+" : ""}{e.profitLoss.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC
                    </Text>
                    <Text style={[styles.holdingPLPct, { color: plColor }]}>
                      {isUp ? "+" : ""}{e.profitLossPercent.toFixed(2)}%
                    </Text>
                  </View>
                </Pressable>
              );
            })}
            {staleHoldings.map(h => (
              <View
                key={"stale-" + h.assetId}
                style={[styles.holdingCard, { backgroundColor: colors.card, borderColor: colors.border, opacity: 0.4 }]}
              >
                <View style={styles.holdingLeft}>
                  <Text style={[styles.holdingSym, { color: colors.mutedForeground }]}>—</Text>
                  <Text style={[styles.holdingName, { color: colors.mutedForeground }]}>Unknown Asset</Text>
                  <Text style={[styles.holdingQty, { color: colors.mutedForeground }]}>
                    {h.quantity} share{h.quantity !== 1 ? "s" : ""} · data unavailable
                  </Text>
                </View>
                <View style={styles.holdingRight}>
                  <Text style={[styles.holdingValue, { color: colors.mutedForeground }]}>—</Text>
                  <Text style={[styles.holdingPL, { color: colors.mutedForeground }]}>—</Text>
                </View>
              </View>
            ))}
          </>
        )}
      </View>

      {Object.keys(sportMap).length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Sport Allocation</Text>
          {Object.entries(sportMap).map(([sport, value]) => {
            const pct = portfolioValue > 0 ? (value / portfolioValue) * 100 : 0;
            const sportLabel = sport === "All Sports" ? "Broad Market" : sport;
            return (
              <View key={sport} style={styles.allocationRow}>
                <Text style={[styles.allocationLabel, { color: colors.foreground }]}>{sportLabel}</Text>
                <View style={[styles.allocationTrack, { backgroundColor: colors.border }]}>
                  <View style={[styles.allocationFill, { width: `${pct}%` as any, backgroundColor: colors.primary }]} />
                </View>
                <Text style={[styles.allocationPct, { color: colors.mutedForeground }]}>{pct.toFixed(0)}%</Text>
              </View>
            );
          })}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  title: { fontSize: 28, fontFamily: "Inter_700Bold", paddingHorizontal: 20, marginBottom: 16 },
  heroCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 12 },
  heroLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  heroValue: { fontSize: 42, fontFamily: "Inter_700Bold", lineHeight: 50 },
  heroUnit: { fontSize: 12, fontFamily: "Inter_500Medium" },
  plRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  plText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  statsRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 8 },
  statCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, gap: 4, alignItems: "center" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  statValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  scoreRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 12 },
  scoreCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 14, gap: 4, alignItems: "center" },
  scoreLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  scoreValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  peekRow: { flexDirection: "row", gap: 8, paddingHorizontal: 20, marginBottom: 16 },
  peekCard: { flex: 1, borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", gap: 8, alignItems: "center" },
  peekLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  peekSym: { fontSize: 14, fontFamily: "Inter_700Bold" },
  peekPct: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  emptyCard: { borderRadius: 14, borderWidth: 1, padding: 28, alignItems: "center", gap: 8 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  emptyAction: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginTop: 4 },
  holdingCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  holdingLeft: { flex: 1 },
  holdingSym: { fontSize: 14, fontFamily: "Inter_700Bold" },
  holdingName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  holdingQty: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  holdingRight: { alignItems: "flex-end", marginLeft: 12 },
  holdingValue: { fontSize: 14, fontFamily: "Inter_700Bold" },
  holdingPL: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  holdingPLPct: { fontSize: 11, fontFamily: "Inter_500Medium" },
  allocationRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  allocationLabel: { width: 90, fontSize: 12, fontFamily: "Inter_500Medium" },
  allocationTrack: { flex: 1, height: 6, borderRadius: 3, overflow: "hidden" },
  allocationFill: { height: "100%", borderRadius: 3 },
  allocationPct: { width: 34, fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "right" },
  journalBtn: { flexDirection: "row", alignItems: "center", gap: 12, marginHorizontal: 20, marginBottom: 16, borderRadius: 14, borderWidth: 1, padding: 14 },
  journalIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  journalTitle: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  journalSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 1 },
});
