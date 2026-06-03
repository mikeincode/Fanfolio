import React, { useEffect } from "react";
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
import { useTraderIdentity, StyleBars, TRADER_IDENTITIES, TraderIdentityId } from "@/hooks/useTraderIdentity";

const BAR_LABELS: Array<{ key: keyof StyleBars; label: string }> = [
  { key: "momentum",      label: "Momentum"        },
  { key: "dipBuying",     label: "Dip Buying"       },
  { key: "indexBuilding", label: "Index Building"   },
  { key: "memeTrading",   label: "Meme Trading"     },
  { key: "research",      label: "Research"         },
  { key: "diversification", label: "Diversification" },
  { key: "riskAppetite",  label: "Risk Appetite"    },
  { key: "activity",      label: "Activity"         },
];

function StyleBar({
  label,
  value,
  accentColor,
  colors,
}: {
  label: string;
  value: number;
  accentColor: string;
  colors: ReturnType<typeof useColors>;
}) {
  return (
    <View style={barStyles.row}>
      <Text style={[barStyles.label, { color: colors.mutedForeground }]}>{label}</Text>
      <View style={[barStyles.track, { backgroundColor: colors.border }]}>
        <View
          style={[
            barStyles.fill,
            { width: `${Math.max(2, value)}%` as any, backgroundColor: accentColor },
          ]}
        />
      </View>
      <Text style={[barStyles.pct, { color: colors.mutedForeground }]}>{value}</Text>
    </View>
  );
}

function routeAction(route: string) {
  if (route.startsWith("/(tabs)")) {
    router.back();
    router.push(route as any);
  } else {
    router.push(route as any);
  }
}

export default function StrategyProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { setChallengeFlag, transactions, holdings, watchlist } = useGame();
  const identity = useTraderIdentity();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    setChallengeFlag("view_trader_identity");
  }, []);

  const { primary, secondaryTraits, confidenceLabel, styleBars, isLowActivity } = identity;

  const accentColor = primary.id === "rookie_learner"
    ? colors.mutedForeground
    : primary.id === "meme_hunter" || primary.id === "high_risk_playmaker"
      ? colors.red
      : primary.id === "index_builder" || primary.id === "diversified_captain"
        ? colors.green
        : primary.id === "scanner_scout" || primary.id === "active_trader"
          ? colors.blue
          : colors.primary;

  const hasActivity = transactions.length > 0 || holdings.length > 0 || watchlist.length >= 2;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: bottomPad + 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Nav ─────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Trader Identity</Text>
          <Text style={[styles.navSub, { color: colors.mutedForeground }]}>
            Discover your sports-market trading style.
          </Text>
        </View>
      </View>

      {/* ── Low Activity Empty State ─────────────────────── */}
      {!hasActivity ? (
        <View style={styles.emptyWrap}>
          <View style={[styles.emptyRing, { backgroundColor: accentColor + "18", borderColor: accentColor + "30" }]}>
            <Text style={styles.emptyEmoji}>🎯</Text>
          </View>
          <Text style={[styles.emptyTitle, { color: colors.foreground }]}>Not enough activity yet</Text>
          <Text style={[styles.emptyBody, { color: colors.mutedForeground }]}>
            Make a few trades, add assets to your watchlist, and use the Scanner. Fanfolio will build your trader identity as you play.
          </Text>
          <View style={styles.emptyBtns}>
            <Pressable
              onPress={() => routeAction("/(tabs)/market")}
              style={[styles.emptyBtn, { backgroundColor: colors.primary }]}
            >
              <Feather name="trending-up" size={15} color={colors.primaryForeground} />
              <Text style={[styles.emptyBtnText, { color: colors.primaryForeground }]}>Open Market</Text>
            </Pressable>
            <Pressable
              onPress={() => routeAction("/(tabs)/scanner")}
              style={[styles.emptyBtnOutline, { borderColor: colors.border }]}
            >
              <Feather name="filter" size={15} color={colors.foreground} />
              <Text style={[styles.emptyBtnOutlineText, { color: colors.foreground }]}>Open Scanner</Text>
            </Pressable>
          </View>
        </View>
      ) : (
        <>
          {/* ── Identity Header ─────────────────────────── */}
          <View style={[styles.headerCard, { backgroundColor: accentColor + "0E", borderColor: accentColor + "28" }]}>
            <View style={styles.headerTop}>
              <View style={[styles.emojiRing, { backgroundColor: accentColor + "20", borderColor: accentColor + "40" }]}>
                <Text style={styles.emojiText}>{primary.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <View style={[styles.confidencePill, { backgroundColor: accentColor + "20" }]}>
                  <Text style={[styles.confidenceText, { color: accentColor }]}>{confidenceLabel}</Text>
                </View>
                <Text style={[styles.identityTitle, { color: colors.foreground }]}>{primary.title}</Text>
              </View>
            </View>
            <Text style={[styles.identityDesc, { color: colors.foreground }]}>{primary.shortDesc}</Text>

            {/* Secondary traits */}
            {secondaryTraits.length > 0 && (
              <View style={styles.secondaryRow}>
                <Text style={[styles.secondaryLabel, { color: colors.mutedForeground }]}>Also showing traits of</Text>
                <View style={styles.traitPills}>
                  {secondaryTraits.map(t => (
                    <View key={t.id} style={[styles.traitPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                      <Text style={styles.traitEmoji}>{t.emoji}</Text>
                      <Text style={[styles.traitTitle, { color: colors.foreground }]}>{t.title}</Text>
                    </View>
                  ))}
                </View>
              </View>
            )}
          </View>

          {/* ── Style Score Breakdown ─────────────────────── */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, { backgroundColor: colors.primary + "15" }]}>
                <Feather name="bar-chart-2" size={16} color={colors.primary} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>Style Score Breakdown</Text>
            </View>
            <View style={styles.barsWrap}>
              {BAR_LABELS.map(({ key, label }) => (
                <StyleBar
                  key={key}
                  label={label}
                  value={styleBars[key]}
                  accentColor={accentColor}
                  colors={colors}
                />
              ))}
            </View>
          </View>

          {/* ── Strengths ───────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, { backgroundColor: colors.green + "15" }]}>
                <Feather name="check-circle" size={16} color={colors.green} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>Strengths</Text>
            </View>
            {primary.strengths.map((s, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: colors.green }]} />
                <Text style={[styles.bulletText, { color: colors.foreground }]}>{s}</Text>
              </View>
            ))}
          </View>

          {/* ── Risks ───────────────────────────────────── */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, { backgroundColor: colors.red + "15" }]}>
                <Feather name="alert-triangle" size={16} color={colors.red} />
              </View>
              <Text style={[styles.cardTitle, { color: colors.foreground }]}>Risks to Watch</Text>
            </View>
            {primary.risks.map((r, i) => (
              <View key={i} style={styles.bulletRow}>
                <View style={[styles.bullet, { backgroundColor: colors.red }]} />
                <Text style={[styles.bulletText, { color: colors.foreground }]}>{r}</Text>
              </View>
            ))}
          </View>

          {/* ── Market Lesson ────────────────────────────── */}
          <View style={[styles.lessonCard, { backgroundColor: colors.blue + "0E", borderColor: colors.blue + "28" }]}>
            <View style={styles.cardHeader}>
              <Feather name="book-open" size={14} color={colors.blue} />
              <Text style={[styles.lessonLabel, { color: colors.blue }]}>What This Style Teaches</Text>
            </View>
            <Text style={[styles.lessonText, { color: colors.foreground }]}>{primary.marketLesson}</Text>
          </View>

          {/* ── Suggested Next Moves ─────────────────────── */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Suggested Next Moves</Text>
            <View style={styles.actionsGrid}>
              {primary.suggestedMoves.map(move => (
                <Pressable
                  key={move.label}
                  onPress={() => routeAction(move.route)}
                  style={({ pressed }) => [
                    styles.actionBtn,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
                  ]}
                >
                  <Feather name={move.icon as any} size={18} color={colors.primary} />
                  <Text style={[styles.actionLabel, { color: colors.foreground }]}>{move.label}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          {/* ── All Identities Reference ─────────────────── */}
          <View style={styles.sectionWrap}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>All Trader Identities</Text>
            {(Object.values(TRADER_IDENTITIES) as typeof TRADER_IDENTITIES[TraderIdentityId][]).map(id => {
              const isActive = id.id === primary.id;
              return (
                <View
                  key={id.id}
                  style={[
                    styles.identityRow,
                    {
                      backgroundColor: isActive ? accentColor + "10" : colors.card,
                      borderColor: isActive ? accentColor + "40" : colors.border,
                    },
                  ]}
                >
                  <Text style={styles.rowEmoji}>{id.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.rowTitle, { color: colors.foreground }]}>{id.title}</Text>
                    <Text style={[styles.rowDesc, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {id.shortDesc}
                    </Text>
                  </View>
                  {isActive && (
                    <View style={[styles.youBadge, { backgroundColor: accentColor }]}>
                      <Text style={[styles.youBadgeText, { color: "#fff" }]}>You</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* ── Educational Card ─────────────────────────── */}
          <View style={[styles.eduCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={styles.cardHeader}>
              <Feather name="info" size={14} color={colors.mutedForeground} />
              <Text style={[styles.eduTitle, { color: colors.foreground }]}>Your identity changes as you play</Text>
            </View>
            <Text style={[styles.eduBody, { color: colors.mutedForeground }]}>
              Fanfolio uses your simulated trades, watchlist, scanner use, and portfolio mix to help you understand your style. As your habits change, your identity updates. There is no right or wrong style — just patterns worth understanding.
            </Text>
          </View>

          {/* ── Disclaimer ───────────────────────────────── */}
          <View style={[styles.disclaimerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="shield" size={14} color={colors.mutedForeground} />
            <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
              Fanfolio is a fake-money educational simulator. All trades use LuckyCoin — no cash value, no real investments.
            </Text>
          </View>
        </>
      )}
    </ScrollView>
  );
}

const barStyles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 10 },
  label: { fontSize: 12, fontFamily: "Inter_500Medium", width: 110 },
  track: { flex: 1, height: 7, borderRadius: 4, overflow: "hidden" },
  fill: { height: 7, borderRadius: 4 },
  pct: { fontSize: 11, fontFamily: "Inter_600SemiBold", width: 28, textAlign: "right" },
});

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  navSub: { fontSize: 12, fontFamily: "Inter_400Regular" },

  emptyWrap: { alignItems: "center", paddingHorizontal: 32, paddingTop: 40, gap: 16 },
  emptyRing: { width: 88, height: 88, borderRadius: 44, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  emptyEmoji: { fontSize: 40 },
  emptyTitle: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptyBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, textAlign: "center" },
  emptyBtns: { flexDirection: "row", gap: 10, marginTop: 8 },
  emptyBtn: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10 },
  emptyBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  emptyBtnOutline: { flexDirection: "row", alignItems: "center", gap: 7, paddingHorizontal: 18, paddingVertical: 11, borderRadius: 10, borderWidth: 1 },
  emptyBtnOutlineText: { fontSize: 14, fontFamily: "Inter_600SemiBold" },

  headerCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 18, marginBottom: 16, gap: 12 },
  headerTop: { flexDirection: "row", alignItems: "center", gap: 14 },
  emojiRing: { width: 68, height: 68, borderRadius: 34, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  emojiText: { fontSize: 36 },
  confidencePill: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 4 },
  confidenceText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  identityTitle: { fontSize: 22, fontFamily: "Inter_700Bold" },
  identityDesc: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  secondaryRow: { gap: 6 },
  secondaryLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  traitPills: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  traitPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8, borderWidth: 1 },
  traitEmoji: { fontSize: 14 },
  traitTitle: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  card: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12, gap: 12 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 8 },
  cardIconWrap: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  barsWrap: { gap: 0 },
  bulletRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 6 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  bulletText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },

  lessonCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12, gap: 8 },
  lessonLabel: { fontSize: 11, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  lessonText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },

  sectionWrap: { paddingHorizontal: 20, marginBottom: 20 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", marginBottom: 12 },
  actionsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  actionBtn: { width: "47%", alignItems: "center", justifyContent: "center", paddingVertical: 14, borderRadius: 12, borderWidth: 1, gap: 6 },
  actionLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textAlign: "center" },

  identityRow: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 12, borderWidth: 1, padding: 12, marginBottom: 8 },
  rowEmoji: { fontSize: 24 },
  rowTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  rowDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  youBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  youBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },

  eduCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, marginBottom: 12, gap: 8 },
  eduTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", flex: 1 },
  eduBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  disclaimerCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start", marginBottom: 4 },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
});
