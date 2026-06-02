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
import { useGame, Transaction } from "@/context/GameContext";
import { getAssetById } from "@/data/mockAssets";

type KindFilter = "All" | "Buys" | "Sells" | "Team Stock" | "Player Coin" | "Sport Index" | "Meme Coin" | "Future";
type SortOption = "Newest" | "Oldest" | "Largest";

const KIND_FILTERS: KindFilter[] = ["All", "Buys", "Sells", "Team Stock", "Player Coin", "Sport Index", "Meme Coin", "Future"];
const KIND_LABELS: Record<KindFilter, string> = {
  "All": "All",
  "Buys": "Buys",
  "Sells": "Sells",
  "Team Stock": "Teams",
  "Player Coin": "Players",
  "Sport Index": "Indexes",
  "Meme Coin": "Meme",
  "Future": "Futures",
};
const SORT_OPTIONS: SortOption[] = ["Newest", "Oldest", "Largest"];

function formatDate(ts: number): string {
  const d = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - d.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  if (diffDays === 0) {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
  if (diffDays < 7) return `${diffDays}d ago`;
  return d.toLocaleDateString([], { month: "short", day: "numeric" });
}

function formatLC(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k LC`;
  return `${n.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC`;
}

function StatCard({ label, value, sub, accent, colors }: {
  label: string; value: string; sub?: string; accent?: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={[statStyles.card, { backgroundColor: colors.card, borderColor: accent ? accent + "40" : colors.border }]}>
      <Text style={[statStyles.value, { color: accent ?? colors.foreground }]}>{value}</Text>
      <Text style={[statStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
      {sub ? <Text style={[statStyles.sub, { color: colors.mutedForeground }]}>{sub}</Text> : null}
    </View>
  );
}

function TradeRow({ tx, colors }: { tx: Transaction; colors: ReturnType<typeof useColors> }) {
  const isBuy = tx.type === "buy";
  const iconColor = isBuy ? colors.green : colors.primary;
  const asset = getAssetById(tx.assetId);
  const typeLabel = asset
    ? asset.type === "Sport Index" ? "Index"
      : asset.type === "Team Stock" ? "Team"
      : asset.type === "Player Coin" ? "Player"
      : asset.type === "Meme Coin" ? "Meme"
      : "Future"
    : "";

  return (
    <Pressable
      onPress={() => router.push({ pathname: "/asset/[id]", params: { id: tx.assetId } })}
      style={({ pressed }) => [
        rowStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={[rowStyles.iconBox, { backgroundColor: iconColor + "18" }]}>
        <Feather name={isBuy ? "arrow-down-left" : "arrow-up-right"} size={16} color={iconColor} />
      </View>

      <View style={rowStyles.info}>
        <View style={rowStyles.topRow}>
          <Text style={[rowStyles.symbol, { color: colors.foreground }]}>{tx.assetSymbol}</Text>
          {typeLabel ? (
            <View style={[rowStyles.typeBadge, { backgroundColor: colors.border }]}>
              <Text style={[rowStyles.typeText, { color: colors.mutedForeground }]}>{typeLabel}</Text>
            </View>
          ) : null}
          {asset && (
            <View style={[rowStyles.typeBadge, { backgroundColor: colors.border }]}>
              <Text style={[rowStyles.typeText, { color: colors.mutedForeground }]}>{asset.sport}</Text>
            </View>
          )}
        </View>
        <Text style={[rowStyles.name, { color: colors.mutedForeground }]} numberOfLines={1}>
          {tx.assetName}
        </Text>
        <Text style={[rowStyles.detail, { color: colors.mutedForeground }]}>
          {tx.quantity} share{tx.quantity !== 1 ? "s" : ""} · {tx.price.toLocaleString(undefined, { maximumFractionDigits: 2 })} LC/share
        </Text>
      </View>

      <View style={rowStyles.right}>
        <Text style={[rowStyles.actionLabel, { color: isBuy ? colors.green : colors.primary }]}>
          {isBuy ? "Bought" : "Sold"}
        </Text>
        <Text style={[rowStyles.total, { color: colors.foreground }]}>
          {isBuy ? "Spent" : "Received"}
        </Text>
        <Text style={[rowStyles.totalAmount, { color: isBuy ? colors.foreground : colors.green }]}>
          {tx.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC
        </Text>
        <Text style={[rowStyles.date, { color: colors.mutedForeground }]}>{formatDate(tx.timestamp)}</Text>
      </View>
    </Pressable>
  );
}

export default function JournalScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { transactions, setChallengeFlag } = useGame();

  useEffect(() => { setChallengeFlag("view_journal"); }, []);

  const [filter, setFilter] = useState<KindFilter>("All");
  const [sort, setSort] = useState<SortOption>("Newest");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  // ── Augmented transactions with asset info ──────────────────
  const augmented = useMemo(() =>
    transactions.map(tx => ({ ...tx, asset: getAssetById(tx.assetId) })),
    [transactions]
  );

  // ── Stats ───────────────────────────────────────────────────
  const stats = useMemo(() => {
    const buys = augmented.filter(t => t.type === "buy");
    const sells = augmented.filter(t => t.type === "sell");
    const spent = buys.reduce((s, t) => s + t.total, 0);
    const received = sells.reduce((s, t) => s + t.total, 0);
    const biggest = augmented.reduce((max, t) => t.total > max.total ? t : max, augmented[0] ?? null);

    const symbolCount: Record<string, number> = {};
    augmented.forEach(t => { symbolCount[t.assetSymbol] = (symbolCount[t.assetSymbol] ?? 0) + 1; });
    const mostTraded = Object.entries(symbolCount).sort((a, b) => b[1] - a[1])[0];

    const net = received - spent;

    return { buys: buys.length, sells: sells.length, spent, received, biggest, mostTraded, net };
  }, [augmented]);

  // ── Insights ────────────────────────────────────────────────
  const insights = useMemo(() => {
    if (augmented.length < 2) return [];
    const result: string[] = [];

    const typeCounts: Record<string, number> = {};
    augmented.forEach(t => {
      const type = t.asset?.type ?? "Unknown";
      typeCounts[type] = (typeCounts[type] ?? 0) + 1;
    });
    const total = augmented.length;
    const memePct = (typeCounts["Meme Coin"] ?? 0) / total;
    const indexPct = (typeCounts["Sport Index"] ?? 0) / total;
    const buyCount = augmented.filter(t => t.type === "buy").length;
    const sellCount = augmented.filter(t => t.type === "sell").length;

    if (memePct >= 0.5) {
      result.push("You are trading a lot of high-volatility assets. Meme coins can move fast in both directions — exciting, but they can also drop as quickly as they rise.");
    } else if (indexPct >= 0.4) {
      result.push("You are using indexes often. Indexes spread risk across a basket of assets — a solid habit for managing exposure to any single event.");
    }

    if (buyCount >= 3 && sellCount === 0) {
      result.push("You are mostly building positions without selling yet. Selling later is how traders realize gains or cut losses. Try reviewing your holdings to decide when to act.");
    } else if (sellCount >= 2) {
      result.push("You have made sells. That means you have already realized some simulated gains or losses. Real traders review sell decisions to learn their timing habits.");
    }

    if (stats.buys >= 5 && result.length === 0) {
      result.push("You are building trading experience. Real traders review past decisions to spot patterns — like whether they tend to buy at peaks or after dips.");
    }

    return result.slice(0, 2);
  }, [augmented, stats]);

  // ── Filtered + Sorted ───────────────────────────────────────
  const displayed = useMemo(() => {
    let list = [...augmented];

    if (filter === "Buys") list = list.filter(t => t.type === "buy");
    else if (filter === "Sells") list = list.filter(t => t.type === "sell");
    else if (filter !== "All") {
      list = list.filter(t => t.asset?.type === filter);
    }

    switch (sort) {
      case "Newest": list.sort((a, b) => b.timestamp - a.timestamp); break;
      case "Oldest": list.sort((a, b) => a.timestamp - b.timestamp); break;
      case "Largest": list.sort((a, b) => b.total - a.total); break;
    }

    return list;
  }, [augmented, filter, sort]);

  const isEmpty = transactions.length === 0;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={styles.headerTop}>
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>Trading Journal</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              Review your buys and sells to learn your trading habits.
            </Text>
          </View>
        </View>
      </View>

      <FlatList
        data={displayed}
        keyExtractor={t => t.id}
        contentContainerStyle={{ paddingBottom: bottomPad + 40 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Educational intro */}
            <View style={[styles.introCard, { backgroundColor: colors.primary + "0D", borderColor: colors.primary + "30" }]}>
              <View style={styles.introHeader}>
                <Feather name="book-open" size={15} color={colors.primary} />
                <Text style={[styles.introTitle, { color: colors.primary }]}>Why keep a trading journal?</Text>
              </View>
              <Text style={[styles.introText, { color: colors.foreground }]}>
                Real traders review past decisions to spot patterns. Fanfolio shows your simulated trades so you can learn timing, risk, and portfolio habits without real money.
              </Text>
            </View>

            {/* Stats grid */}
            {!isEmpty && (
              <View style={styles.statsSection}>
                <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>OVERVIEW</Text>
                <View style={styles.statsGrid}>
                  <StatCard label="Total Trades" value={transactions.length.toString()} colors={colors} />
                  <StatCard label="Buys" value={stats.buys.toString()} accent={colors.green} colors={colors} />
                  <StatCard label="Sells" value={stats.sells.toString()} accent={colors.primary} colors={colors} />
                  <StatCard
                    label="Net"
                    value={`${stats.net >= 0 ? "+" : ""}${Math.round(stats.net).toLocaleString()} LC`}
                    accent={stats.net >= 0 ? colors.green : colors.red}
                    colors={colors}
                  />
                  <StatCard label="LC Spent" value={formatLC(stats.spent)} sub="on buys" colors={colors} />
                  <StatCard label="LC Received" value={formatLC(stats.received)} sub="from sells" accent={colors.green} colors={colors} />
                  {stats.biggest && (
                    <StatCard
                      label="Biggest Trade"
                      value={formatLC(stats.biggest.total)}
                      sub={stats.biggest.assetSymbol}
                      colors={colors}
                    />
                  )}
                  {stats.mostTraded && (
                    <StatCard
                      label="Most Traded"
                      value={stats.mostTraded[0]}
                      sub={`${stats.mostTraded[1]} trade${stats.mostTraded[1] !== 1 ? "s" : ""}`}
                      colors={colors}
                    />
                  )}
                </View>
              </View>
            )}

            {/* Insights */}
            {insights.length > 0 && (
              <View style={styles.insightSection}>
                <Text style={[styles.sectionLabel, { color: colors.mutedForeground }]}>JOURNAL INSIGHTS</Text>
                {insights.map((insight, i) => (
                  <View key={i} style={[styles.insightCard, { backgroundColor: colors.coin + "0E", borderColor: colors.coin + "30" }]}>
                    <Feather name="zap" size={13} color={colors.coin} />
                    <Text style={[styles.insightText, { color: colors.foreground }]}>{insight}</Text>
                  </View>
                ))}
              </View>
            )}

            {/* Realized vs Unrealized education */}
            <View style={[styles.rvuCard, { backgroundColor: colors.blue + "0D", borderColor: colors.blue + "25" }]}>
              <View style={styles.rvuHeader}>
                <Feather name="info" size={13} color={colors.blue} />
                <Text style={[styles.rvuTitle, { color: colors.blue }]}>Realized vs Unrealized</Text>
              </View>
              <Text style={[styles.rvuText, { color: colors.foreground }]}>
                Unrealized gains or losses are changes in assets you still hold. Realized results happen when you sell. Fanfolio uses LuckyCoin only, with no cash value.
              </Text>
            </View>

            {/* Filter chips */}
            {!isEmpty && (
              <View style={styles.filterSection}>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.filterScroll}
                >
                  {KIND_FILTERS.map(f => {
                    const isActive = filter === f;
                    return (
                      <Pressable
                        key={f}
                        onPress={() => setFilter(f)}
                        style={[
                          styles.filterChip,
                          {
                            backgroundColor: isActive ? colors.primary + "20" : colors.card,
                            borderColor: isActive ? colors.primary : colors.border,
                          },
                        ]}
                      >
                        <Text style={[styles.filterText, { color: isActive ? colors.primary : colors.mutedForeground }]}>
                          {KIND_LABELS[f]}
                        </Text>
                      </Pressable>
                    );
                  })}
                </ScrollView>

                {/* Sort */}
                <View style={styles.sortRow}>
                  {SORT_OPTIONS.map(s => {
                    const isActive = sort === s;
                    return (
                      <Pressable
                        key={s}
                        onPress={() => setSort(s)}
                        style={[
                          styles.sortChip,
                          {
                            backgroundColor: isActive ? colors.foreground + "12" : "transparent",
                            borderColor: isActive ? colors.foreground + "30" : "transparent",
                          },
                        ]}
                      >
                        <Text style={[styles.sortText, { color: isActive ? colors.foreground : colors.mutedForeground }]}>
                          {s}
                        </Text>
                      </Pressable>
                    );
                  })}
                  <Text style={[styles.sortLabel, { color: colors.mutedForeground }]}>Sort</Text>
                </View>
              </View>
            )}

            {!isEmpty && displayed.length > 0 && (
              <Text style={[styles.tradeCount, { color: colors.mutedForeground }]}>
                {displayed.length} trade{displayed.length !== 1 ? "s" : ""}
              </Text>
            )}
          </View>
        }
        renderItem={({ item }) => (
          <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
            <TradeRow tx={item} colors={colors} />
          </View>
        )}
        ListEmptyComponent={
          isEmpty ? (
            <View style={styles.empty}>
              <View style={[styles.emptyIcon, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name="book" size={32} color={colors.mutedForeground} />
              </View>
              <Text style={[styles.emptyTitle, { color: colors.foreground }]}>No trades yet</Text>
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>
                Buy your first asset to start your trading journal.
              </Text>
              <Pressable
                onPress={() => { router.back(); router.push("/(tabs)/market"); }}
                style={[styles.emptyBtn, { backgroundColor: colors.primary, borderRadius: colors.radius - 2 }]}
              >
                <Feather name="trending-up" size={16} color={colors.primaryForeground} />
                <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>Open Market</Text>
              </Pressable>
            </View>
          ) : (
            <View style={styles.empty}>
              <Feather name="filter" size={28} color={colors.mutedForeground + "60"} />
              <Text style={[styles.emptyText, { color: colors.mutedForeground }]}>No trades match this filter.</Text>
            </View>
          )
        }
      />
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  headerTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  backBtn: { padding: 4, marginTop: 2 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  introCard: {
    marginHorizontal: 16, marginTop: 14,
    borderRadius: 14, borderWidth: 1, padding: 14, gap: 8,
  },
  introHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  introTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  introText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },

  statsSection: { paddingHorizontal: 16, marginTop: 16, gap: 8 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 2 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },

  insightSection: { paddingHorizontal: 16, marginTop: 16, gap: 8 },
  insightCard: {
    flexDirection: "row", alignItems: "flex-start",
    gap: 8, borderRadius: 12, borderWidth: 1, padding: 12,
  },
  insightText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 19 },

  rvuCard: {
    marginHorizontal: 16, marginTop: 12,
    borderRadius: 12, borderWidth: 1, padding: 12, gap: 6,
  },
  rvuHeader: { flexDirection: "row", alignItems: "center", gap: 5 },
  rvuTitle: { fontSize: 12, fontFamily: "Inter_700Bold" },
  rvuText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },

  filterSection: { marginTop: 14, gap: 6 },
  filterScroll: { paddingHorizontal: 16, gap: 7, flexDirection: "row" },
  filterChip: {
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: 16, borderWidth: 1,
  },
  filterText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },

  sortRow: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, gap: 4,
  },
  sortLabel: { fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: 4 },
  sortChip: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  sortText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  tradeCount: {
    marginHorizontal: 18, marginTop: 8, marginBottom: 4,
    fontSize: 12, fontFamily: "Inter_500Medium",
  },

  empty: { alignItems: "center", paddingTop: 48, paddingHorizontal: 32, gap: 10 },
  emptyIcon: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", borderWidth: 1 },
  emptyTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  emptyText: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 19 },
  emptyBtn: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 22, paddingVertical: 12, marginTop: 4 },
  emptyBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
});

// ── Stat Card Styles ───────────────────────────────────────────────────────

const statStyles = StyleSheet.create({
  card: {
    width: "47.5%",
    borderRadius: 12,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 14,
    gap: 2,
  },
  value: { fontSize: 18, fontFamily: "Inter_700Bold" },
  label: { fontSize: 11, fontFamily: "Inter_400Regular" },
  sub: { fontSize: 10, fontFamily: "Inter_400Regular" },
});

// ── Trade Row Styles ───────────────────────────────────────────────────────

const rowStyles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
  },
  iconBox: {
    width: 36, height: 36, borderRadius: 10,
    alignItems: "center", justifyContent: "center",
  },
  info: { flex: 1, gap: 2 },
  topRow: { flexDirection: "row", alignItems: "center", gap: 5, flexWrap: "wrap" },
  symbol: { fontSize: 14, fontFamily: "Inter_700Bold" },
  typeBadge: { paddingHorizontal: 5, paddingVertical: 2, borderRadius: 4 },
  typeText: { fontSize: 9, fontFamily: "Inter_500Medium" },
  name: { fontSize: 11, fontFamily: "Inter_400Regular" },
  detail: { fontSize: 11, fontFamily: "Inter_400Regular" },
  right: { alignItems: "flex-end", gap: 1, minWidth: 72 },
  actionLabel: { fontSize: 11, fontFamily: "Inter_700Bold" },
  total: { fontSize: 9, fontFamily: "Inter_400Regular" },
  totalAmount: { fontSize: 13, fontFamily: "Inter_700Bold" },
  date: { fontSize: 10, fontFamily: "Inter_400Regular", marginTop: 1 },
});
