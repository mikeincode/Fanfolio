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
import { useGame } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";

// ─── pure helpers ─────────────────────────────────────────────────────────────

function computeHealthScore(p: {
  count: number; uniqueSports: number; uniqueTypes: number;
  indexPct: number; memePct: number; avgRisk: number; largestPct: number;
}): number {
  if (p.count === 0) return 0;
  let s = 20;
  s += p.count >= 4 ? 20 : p.count >= 2 ? 10 : 5;
  s += p.uniqueSports >= 4 ? 20 : p.uniqueSports >= 3 ? 15 : p.uniqueSports >= 2 ? 8 : 0;
  s += p.uniqueTypes >= 4 ? 20 : p.uniqueTypes >= 3 ? 15 : p.uniqueTypes >= 2 ? 8 : 0;
  if (p.indexPct > 0) s += 10;
  if (p.largestPct > 80) s -= 25;
  else if (p.largestPct > 60) s -= 15;
  else if (p.largestPct > 40) s -= 8;
  if (p.memePct > 60) s -= 20;
  else if (p.memePct > 40) s -= 10;
  else if (p.memePct > 25) s -= 5;
  if (p.avgRisk > 8.5) s -= 15;
  else if (p.avgRisk > 7) s -= 8;
  return Math.max(5, Math.min(100, s));
}

function getRiskInfo(avg: number) {
  if (avg <= 3) return { label: "Low", short: "Your portfolio is conservative and stable." };
  if (avg <= 5.5) return { label: "Medium", short: "A balanced mix of stable and more active assets." };
  if (avg <= 7.5) return { label: "Medium-High", short: "Leaning toward more volatile assets that can swing quickly." };
  if (avg <= 9) return { label: "High", short: "Significant exposure to volatile assets — big swings are possible in either direction." };
  return { label: "Extreme", short: "Heavy concentration in the most volatile assets in the market. Expect dramatic moves." };
}

function getDivLabel(sports: number, types: number, indexPct: number) {
  if (sports >= 3 && types >= 3 && indexPct > 0) return "Excellent";
  if (sports >= 3 && types >= 2) return "Good";
  if (sports >= 2 || types >= 2) return "Moderate";
  return "Needs Work";
}

function getCoachSummary(p: {
  memePct: number; largestPct: number; indexPct: number;
  avgRisk: number; uniqueSports: number; uniqueTypes: number;
}) {
  if (p.memePct > 50) return "Your portfolio is heavy on meme coins. These assets can spike fast, but they can also crash when hype cools. Adding an index or team stock would help balance things out.";
  if (p.largestPct > 75) return "One asset dominates your portfolio. Spreading your LuckyCoin across more assets teaches real diversification — like building a roster around more than one player.";
  if (p.indexPct === 0 && p.uniqueSports < 2) return "You do not own any indexes or assets across different sports yet. Indexes spread your risk across many assets at once — a great starting move.";
  if (p.avgRisk > 7.5) return "Your risk level is high. Your portfolio can move fast in either direction. Consider mixing in some stable indexes or team stocks to create balance.";
  if (p.uniqueSports >= 3 && p.uniqueTypes >= 3 && p.indexPct > 0) return "Great balance across sports and asset types with index exposure. You are building strong diversification habits — just like a real fund manager.";
  if (p.indexPct === 0) return "You are spread across multiple assets, but have no indexes yet. Indexes can help absorb the impact of a single bad game or a hype crash.";
  return "Keep exploring the market. Adding more asset types and sports teaches real portfolio management strategy.";
}

type Tip = { icon: string; text: string };

function buildTips(p: {
  count: number; indexPct: number; memePct: number; largestPct: number;
  uniqueSports: number; avgRisk: number; uniqueTypes: number;
}): Tip[] {
  const tips: Tip[] = [];
  if (p.count === 0) return [{ icon: "shopping-bag", text: "Buy your first asset to start building your portfolio." }];
  if (p.indexPct === 0) tips.push({ icon: "layers", text: "You do not own any indexes yet. Indexes spread risk across multiple assets at once, making your portfolio more stable." });
  if (p.memePct > 40) tips.push({ icon: "alert-triangle", text: "Your portfolio is heavy on meme coins. Meme assets can spike fast, but they can also crash hard when hype cools off." });
  if (p.largestPct > 50) tips.push({ icon: "pie-chart", text: `One asset makes up ${p.largestPct.toFixed(0)}% of your portfolio. That is concentration risk — like building your whole season strategy around a single player.` });
  if (p.uniqueSports === 1) tips.push({ icon: "flag", text: "All your assets are in one sport. Adding assets from another sport teaches real diversification principles." });
  if (p.avgRisk > 7.5) tips.push({ icon: "zap", text: "Your portfolio can move quickly. High risk can produce large simulated gains but also large simulated losses — it is a trade-off worth understanding." });
  if (p.avgRisk <= 4 && p.count >= 2) tips.push({ icon: "shield", text: "Your portfolio is conservative and stable. It may move slower than high-risk portfolios, but it will also hold up better in tough markets." });
  if (p.uniqueSports >= 3 && p.uniqueTypes >= 3 && p.indexPct > 0) tips.push({ icon: "check-circle", text: "You are spread across multiple sports, asset types, and indexes. That is excellent diversification — the kind real investors aim for." });
  if (p.memePct === 0 && p.count >= 2) tips.push({ icon: "star", text: "You have no meme coin exposure. That keeps your portfolio more predictable and easier to analyze." });
  if (tips.length === 0) tips.push({ icon: "trending-up", text: "Keep adding assets across different sports and types to build a more balanced simulated portfolio." });
  return tips.slice(0, 5);
}

// ─── screen ──────────────────────────────────────────────────────────────────

export default function PortfolioCoachScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { holdings, setChallengeFlag } = useGame();
  const liveAssets = useLiveAssets();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    setChallengeFlag("view_portfolio_coach");
  }, []);

  const enriched = useMemo(() => (
    holdings
      .map(h => {
        const asset = liveAssets.find(a => a.id === h.assetId);
        if (!asset) return null;
        return { ...h, asset, currentValue: asset.price * h.quantity };
      })
      .filter(Boolean) as Array<{
        assetId: string; quantity: number; averageCost: number; totalInvested: number;
        asset: ReturnType<typeof useLiveAssets>[0]; currentValue: number;
      }>
  ), [holdings, liveAssets]);

  const portfolioValue = useMemo(
    () => enriched.reduce((s, e) => s + e.currentValue, 0),
    [enriched]
  );

  const sportMap = useMemo(() => {
    const m: Record<string, number> = {};
    enriched.forEach(e => { m[e.asset.sport] = (m[e.asset.sport] ?? 0) + e.currentValue; });
    return m;
  }, [enriched]);

  const typeMap = useMemo(() => {
    const m: Record<string, number> = {};
    enriched.forEach(e => { m[e.asset.type] = (m[e.asset.type] ?? 0) + e.currentValue; });
    return m;
  }, [enriched]);

  const report = useMemo(() => {
    if (portfolioValue === 0) return null;
    const uniqueSports = new Set(enriched.map(e => e.asset.sport)).size;
    const uniqueTypes = new Set(enriched.map(e => e.asset.type)).size;
    const largestPct = enriched.length > 0
      ? Math.max(...enriched.map(e => (e.currentValue / portfolioValue) * 100))
      : 0;
    const indexValue = enriched
      .filter(e => e.asset.type === "Sport Index")
      .reduce((s, e) => s + e.currentValue, 0);
    const indexPct = (indexValue / portfolioValue) * 100;
    const memeValue = enriched
      .filter(e => e.asset.type === "Meme Coin")
      .reduce((s, e) => s + e.currentValue, 0);
    const memePct = (memeValue / portfolioValue) * 100;
    const avgRisk = enriched.reduce(
      (s, e) => s + e.asset.riskScore * (e.currentValue / portfolioValue),
      0
    );
    const healthScore = computeHealthScore({ count: enriched.length, uniqueSports, uniqueTypes, indexPct, memePct, avgRisk, largestPct });
    const riskInfo = getRiskInfo(avgRisk);
    const divLabel = getDivLabel(uniqueSports, uniqueTypes, indexPct);
    const coachText = getCoachSummary({ memePct, largestPct, indexPct, avgRisk, uniqueSports, uniqueTypes });
    const tips = buildTips({ count: enriched.length, indexPct, memePct, largestPct, uniqueSports, avgRisk, uniqueTypes });
    return { uniqueSports, uniqueTypes, largestPct, indexPct, memePct, avgRisk, healthScore, riskInfo, divLabel, coachText, tips };
  }, [enriched, portfolioValue]);

  const scoreColor = report
    ? report.healthScore >= 70 ? colors.green
    : report.healthScore >= 50 ? colors.coin
    : colors.red
    : colors.mutedForeground;

  const riskColor = report
    ? report.avgRisk <= 4 ? colors.green
    : report.avgRisk <= 6.5 ? colors.coin
    : colors.red
    : colors.mutedForeground;

  const typeColor = (type: string) => {
    if (type === "Sport Index") return colors.green;
    if (type === "Meme Coin") return colors.red;
    if (type === "Future") return colors.coin;
    return colors.primary;
  };

  const isEmpty = holdings.length === 0;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: bottomPad + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Nav ───────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Portfolio Coach</Text>
          <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
            Understand your risk, balance, and strategy.
          </Text>
        </View>
      </View>

      {/* ── Empty state ───────────────────────────────────── */}
      {isEmpty ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyRing, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "30" }]}>
            <Feather name="activity" size={36} color={colors.primary} />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No portfolio to coach yet</Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            Buy your first asset to unlock a full risk report. Fanfolio will help you understand how your portfolio is balanced.
          </Text>
          <View style={styles.emptyBtns}>
            <Pressable
              onPress={() => { router.back(); router.push("/(tabs)/market"); }}
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="shopping-bag" size={15} color={colors.primaryForeground} />
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>Open Market</Text>
            </Pressable>
            <Pressable
              onPress={() => { router.back(); router.push("/(tabs)/scanner"); }}
              style={[styles.emptyBtnOutline, { borderColor: colors.border }]}
            >
              <Feather name="filter" size={15} color={colors.foreground} />
              <Text style={[styles.emptyBtnTextOutline, { color: colors.foreground }]}>Open Scanner</Text>
            </Pressable>
          </View>
        </View>
      ) : report ? (
        <>
          {/* ── Coach Summary ─────────────────────────────── */}
          <View style={[styles.summaryCard, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "25" }]}>
            <View style={styles.summaryTop}>
              <View style={[styles.scoreDial, { borderColor: scoreColor + "70", backgroundColor: scoreColor + "14" }]}>
                <Text style={[styles.scoreNum, { color: scoreColor }]}>{report.healthScore}</Text>
                <Text style={[styles.scoreOf, { color: scoreColor + "AA" }]}>/100</Text>
              </View>
              <View style={{ flex: 1, gap: 6 }}>
                <Text style={[styles.summaryLabel, { color: colors.mutedForeground }]}>Portfolio Health</Text>
                <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap" }}>
                  <View style={[styles.badge, { backgroundColor: riskColor + "20", borderColor: riskColor + "40" }]}>
                    <Text style={[styles.badgeText, { color: riskColor }]}>⚡ {report.riskInfo.label} Risk</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30" }]}>
                    <Text style={[styles.badgeText, { color: colors.primary }]}>◎ {report.divLabel}</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={[styles.coachQuote, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Feather name="message-circle" size={14} color={colors.primary} style={{ marginTop: 2 }} />
              <Text style={[styles.coachQuoteText, { color: colors.foreground }]}>{report.coachText}</Text>
            </View>
          </View>

          {/* ── Risk Report ───────────────────────────────── */}
          <View style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.reportHeader}>
              <View style={[styles.reportIcon, { backgroundColor: riskColor + "18" }]}>
                <Feather name="zap" size={16} color={riskColor} />
              </View>
              <Text style={[styles.reportTitle, { color: colors.foreground }]}>Risk Report</Text>
              <View style={[styles.badge, { backgroundColor: riskColor + "20", borderColor: riskColor + "40", marginLeft: "auto" as any }]}>
                <Text style={[styles.badgeText, { color: riskColor }]}>{report.riskInfo.label}</Text>
              </View>
            </View>

            <View style={styles.riskScoreRow}>
              <Text style={[styles.riskBig, { color: riskColor }]}>{report.avgRisk.toFixed(1)}</Text>
              <Text style={[styles.riskSmall, { color: colors.mutedForeground }]}>/10 avg risk</Text>
            </View>

            <View style={[styles.track, { backgroundColor: colors.border }]}>
              <View style={[styles.fill, { width: `${report.avgRisk * 10}%` as any, backgroundColor: riskColor }]} />
            </View>

            <Text style={[styles.reportBody, { color: colors.mutedForeground }]}>
              {report.riskInfo.short}
              {report.memePct > 20
                ? ` Your meme coin exposure (${report.memePct.toFixed(0)}%) contributes significantly to this score.`
                : ""}
            </Text>
          </View>

          {/* ── Diversification Report ────────────────────── */}
          <View style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.reportHeader}>
              <View style={[styles.reportIcon, { backgroundColor: colors.primary + "18" }]}>
                <Feather name="pie-chart" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.reportTitle, { color: colors.foreground }]}>Diversification</Text>
              <View style={[styles.badge, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30", marginLeft: "auto" as any }]}>
                <Text style={[styles.badgeText, { color: colors.primary }]}>{report.divLabel}</Text>
              </View>
            </View>

            {[
              { label: "Sports owned",      value: `${report.uniqueSports}`,          sub: report.uniqueSports >= 3 ? "Great variety" : report.uniqueSports >= 2 ? "Good start" : "Needs work" },
              { label: "Asset types",        value: `${report.uniqueTypes}`,           sub: report.uniqueTypes >= 3 ? "Well spread" : report.uniqueTypes >= 2 ? "Decent mix" : "Add more types" },
              { label: "Largest holding",    value: `${report.largestPct.toFixed(0)}%`, sub: report.largestPct > 60 ? "Concentration risk" : report.largestPct > 40 ? "Moderate" : "Well spread" },
              { label: "Index exposure",     value: `${report.indexPct.toFixed(0)}%`,  sub: report.indexPct > 0 ? "Good — adds stability" : "None — consider adding" },
              { label: "Meme coin exposure", value: `${report.memePct.toFixed(0)}%`,   sub: report.memePct > 40 ? "High — volatile" : report.memePct > 0 ? "Manageable" : "None — very stable" },
            ].map((row, idx, arr) => (
              <View
                key={row.label}
                style={[styles.divRow, { borderBottomColor: colors.border, borderBottomWidth: idx < arr.length - 1 ? 1 : 0 }]}
              >
                <Text style={[styles.divLabel, { color: colors.mutedForeground }]}>{row.label}</Text>
                <Text style={[styles.divValue, { color: colors.foreground }]}>{row.value}</Text>
                <Text style={[styles.divSub, { color: colors.mutedForeground }]}>{row.sub}</Text>
              </View>
            ))}
          </View>

          {/* ── Sport Allocation ──────────────────────────── */}
          <View style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.reportHeader}>
              <View style={[styles.reportIcon, { backgroundColor: colors.coin + "18" }]}>
                <Feather name="flag" size={16} color={colors.coin} />
              </View>
              <Text style={[styles.reportTitle, { color: colors.foreground }]}>Sport Allocation</Text>
            </View>
            {Object.entries(sportMap)
              .sort((a, b) => b[1] - a[1])
              .map(([sport, val]) => {
                const pct = portfolioValue > 0 ? (val / portfolioValue) * 100 : 0;
                return (
                  <View key={sport} style={styles.allocRow}>
                    <Text style={[styles.allocLabel, { color: colors.foreground }]}>{sport}</Text>
                    <View style={[styles.allocTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.allocFill, { width: `${pct}%` as any, backgroundColor: colors.coin }]} />
                    </View>
                    <Text style={[styles.allocPct, { color: colors.mutedForeground }]}>{pct.toFixed(0)}%</Text>
                  </View>
                );
              })}
          </View>

          {/* ── Asset Type Allocation ─────────────────────── */}
          <View style={[styles.reportCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.reportHeader}>
              <View style={[styles.reportIcon, { backgroundColor: colors.green + "18" }]}>
                <Feather name="layers" size={16} color={colors.green} />
              </View>
              <Text style={[styles.reportTitle, { color: colors.foreground }]}>Asset Type Allocation</Text>
            </View>
            {Object.entries(typeMap)
              .sort((a, b) => b[1] - a[1])
              .map(([type, val]) => {
                const pct = portfolioValue > 0 ? (val / portfolioValue) * 100 : 0;
                return (
                  <View key={type} style={styles.allocRow}>
                    <Text style={[styles.allocLabel, { color: colors.foreground }]}>{type}</Text>
                    <View style={[styles.allocTrack, { backgroundColor: colors.border }]}>
                      <View style={[styles.allocFill, { width: `${pct}%` as any, backgroundColor: typeColor(type) }]} />
                    </View>
                    <Text style={[styles.allocPct, { color: colors.mutedForeground }]}>{pct.toFixed(0)}%</Text>
                  </View>
                );
              })}
          </View>

          {/* ── Coach Tips ────────────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Coach Tips</Text>
            {report.tips.map((tip, i) => (
              <View key={i} style={[styles.tipCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.tipIcon, { backgroundColor: colors.primary + "15" }]}>
                  <Feather name={tip.icon as any} size={16} color={colors.primary} />
                </View>
                <Text style={[styles.tipText, { color: colors.foreground }]}>{tip.text}</Text>
              </View>
            ))}
          </View>

          {/* ── Recommended Actions ───────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recommended Actions</Text>
            <View style={styles.actionsGrid}>
              {([
                { icon: "layers",     label: "Browse Indexes",        action: () => { router.back(); router.push("/(tabs)/market"); } },
                { icon: "filter",     label: "Open Scanner",          action: () => { router.back(); router.push("/(tabs)/scanner"); } },
                { icon: "bookmark",   label: "View Watchlist",        action: () => { router.back(); router.push("/(tabs)/market"); } },
                { icon: "book",       label: "Trading Journal",       action: () => router.push("/journal") },
                { icon: "book-open",  label: "Learn Diversification", action: () => { router.back(); router.push("/(tabs)/learn"); } },
                { icon: "activity",   label: "Learn Volatility",      action: () => { router.back(); router.push("/(tabs)/learn"); } },
              ] as const).map(a => (
                <Pressable
                  key={a.label}
                  onPress={a.action}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Feather name={a.icon} size={18} color={colors.primary} />
                  <Text style={[styles.actionLabel, { color: colors.foreground }]}>{a.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── Education Cards ───────────────────────────── */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Learn the Concepts</Text>
            {[
              {
                icon: "alert-circle",
                title: "What is concentration risk?",
                body: "Concentration risk means too much of your portfolio depends on one asset, sport, or idea. In sports terms, it is like building a roster around only one player.",
              },
              {
                icon: "layers",
                title: "Why indexes help",
                body: "An index is a basket of assets. It usually moves less wildly because one bad asset does not ruin the whole basket. One bad game does not sink the whole index.",
              },
              {
                icon: "zap",
                title: "Risk is not bad",
                body: "Risk is not always bad. It just means bigger swings are possible. The goal is knowing how much risk you are taking — not eliminating it entirely.",
              },
            ].map(card => (
              <View key={card.title} style={[styles.eduCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={styles.eduTop}>
                  <View style={[styles.eduIcon, { backgroundColor: colors.primary + "15" }]}>
                    <Feather name={card.icon as any} size={15} color={colors.primary} />
                  </View>
                  <Text style={[styles.eduTitle, { color: colors.foreground }]}>{card.title}</Text>
                </View>
                <Text style={[styles.eduBody, { color: colors.mutedForeground }]}>{card.body}</Text>
              </View>
            ))}
          </View>

          {/* ── Disclaimer ────────────────────────────────── */}
          <Text style={[styles.disclaimer, { color: colors.mutedForeground }]}>
            All analysis is based on simulated LuckyCoin portfolios for educational purposes only. No real money, deposits, withdrawals, or financial advice. Fanfolio is an educational simulator with no cash value.
          </Text>
        </>
      ) : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  navBar: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { paddingTop: 3 },
  navTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  navSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  emptyWrap: { paddingHorizontal: 32, paddingTop: 40, alignItems: "center", gap: 16 },
  emptyRing: { width: 80, height: 80, borderRadius: 40, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyBody: { fontSize: 14, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 22 },
  emptyBtns: { flexDirection: "row", gap: 10, marginTop: 8 },
  emptyBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12 },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  emptyBtnOutline: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 12, borderWidth: 1 },
  emptyBtnTextOutline: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  summaryCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, gap: 14, marginBottom: 12 },
  summaryTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  scoreDial: { width: 76, height: 76, borderRadius: 38, borderWidth: 3, alignItems: "center", justifyContent: "center" },
  scoreNum: { fontSize: 28, fontFamily: "Inter_700Bold", lineHeight: 32 },
  scoreOf: { fontSize: 10, fontFamily: "Inter_500Medium" },
  summaryLabel: { fontSize: 11, fontFamily: "Inter_500Medium", marginBottom: 2 },
  badge: { flexDirection: "row", alignItems: "center", borderWidth: 1, borderRadius: 20, paddingHorizontal: 9, paddingVertical: 4 },
  badgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  coachQuote: { flexDirection: "row", gap: 8, borderRadius: 10, borderWidth: 1, padding: 12, alignItems: "flex-start" },
  coachQuoteText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  reportCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, gap: 12, marginBottom: 12 },
  reportHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  reportIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  reportTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  reportBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  riskScoreRow: { flexDirection: "row", alignItems: "baseline", gap: 4 },
  riskBig: { fontSize: 38, fontFamily: "Inter_700Bold", lineHeight: 44 },
  riskSmall: { fontSize: 13, fontFamily: "Inter_400Regular" },
  track: { height: 7, borderRadius: 4, overflow: "hidden" },
  fill: { height: 7, borderRadius: 4 },

  divRow: { flexDirection: "row", alignItems: "center", paddingVertical: 9, gap: 8 },
  divLabel: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular" },
  divValue: { fontSize: 14, fontFamily: "Inter_700Bold", minWidth: 38, textAlign: "right" },
  divSub: { fontSize: 11, fontFamily: "Inter_500Medium", minWidth: 100, textAlign: "right" },

  allocRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 10 },
  allocLabel: { width: 92, fontSize: 12, fontFamily: "Inter_500Medium" },
  allocTrack: { flex: 1, height: 7, borderRadius: 4, overflow: "hidden" },
  allocFill: { height: 7, borderRadius: 4 },
  allocPct: { width: 34, fontSize: 12, fontFamily: "Inter_500Medium", textAlign: "right" },

  section: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },

  tipCard: { flexDirection: "row", alignItems: "flex-start", gap: 12, borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 8 },
  tipIcon: { width: 32, height: 32, borderRadius: 8, alignItems: "center", justifyContent: "center", flexShrink: 0 },
  tipText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionBtn: { width: "47%", borderRadius: 12, borderWidth: 1, padding: 14, gap: 8, alignItems: "center" },
  actionLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },

  eduCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 10, gap: 8 },
  eduTop: { flexDirection: "row", alignItems: "center", gap: 10 },
  eduIcon: { width: 28, height: 28, borderRadius: 7, alignItems: "center", justifyContent: "center" },
  eduTitle: { fontSize: 13, fontFamily: "Inter_700Bold", flex: 1 },
  eduBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  disclaimer: { fontSize: 11, fontFamily: "Inter_400Regular", textAlign: "center", paddingHorizontal: 24, paddingBottom: 8, lineHeight: 18 },
});
