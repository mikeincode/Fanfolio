import React, { useState, useMemo, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Modal,
  FlatList,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import {
  MOCK_NEWS,
  MockNewsItem,
  NewsCategory,
  NEWS_CATEGORIES,
  CATEGORY_ICONS,
  SENTIMENT_CONFIG,
  getNewsByCategory,
  getNewsForAssets,
} from "@/data/mockNews";

// ─── News Detail Modal ────────────────────────────────────────────────────────

function NewsDetailModal({
  item,
  visible,
  onClose,
  colors,
}: {
  item: MockNewsItem | null;
  visible: boolean;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  if (!item) return null;
  const sent = SENTIMENT_CONFIG[item.sentiment];
  const catIcon = CATEGORY_ICONS[item.category] as any;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[nd.container, { backgroundColor: colors.background }]}>
        <View style={[nd.nav, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[nd.navTitle, { color: colors.foreground }]}>Market News</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={nd.scroll} showsVerticalScrollIndicator={false}>
          {/* Category + sentiment */}
          <View style={nd.metaRow}>
            <View style={[nd.catPill, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "30" }]}>
              <Feather name={catIcon} size={11} color={colors.primary} />
              <Text style={[nd.catText, { color: colors.primary }]}>{item.category}</Text>
            </View>
            <View style={[nd.sentPill, { backgroundColor: sent.color + sent.bgOpacity }]}>
              <Text style={[nd.sentText, { color: sent.color }]}>{sent.label}</Text>
            </View>
            <Text style={[nd.ts, { color: colors.mutedForeground }]}>{item.timestampLabel}</Text>
          </View>

          {/* Title */}
          <Text style={[nd.title, { color: colors.foreground }]}>{item.title}</Text>

          {/* Impact badge */}
          <View style={[nd.impactRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="trending-up" size={13} color={colors.primary} />
            <Text style={[nd.impactLabel, { color: colors.mutedForeground }]}>Simulated Impact:</Text>
            <Text style={[nd.impactVal, { color: colors.foreground }]}>{item.impactLabel}</Text>
          </View>

          {/* Body */}
          <Text style={[nd.body, { color: colors.foreground }]}>{item.body}</Text>

          {/* Related assets */}
          {item.relatedAssetIds.length > 0 && (
            <View style={[nd.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <Text style={[nd.cardLabel, { color: colors.mutedForeground }]}>RELATED ASSETS</Text>
              <View style={nd.symbolsRow}>
                {item.relatedAssetIds.map((id, i) => (
                  <Pressable
                    key={id}
                    onPress={() => { onClose(); setTimeout(() => router.push({ pathname: "/asset/[id]", params: { id } }), 350); }}
                    style={({ pressed }) => [
                      nd.symbolPill,
                      { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30", opacity: pressed ? 0.8 : 1 },
                    ]}
                  >
                    <Text style={[nd.symbolText, { color: colors.primary }]}>{item.relatedAssetSymbols[i]}</Text>
                    <Feather name="arrow-right" size={10} color={colors.primary} />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {/* Lesson */}
          <View style={[nd.lessonCard, { backgroundColor: colors.blue + "0D", borderColor: colors.blue + "28" }]}>
            <View style={nd.lessonHeader}>
              <Feather name="book-open" size={14} color={colors.blue} />
              <Text style={[nd.lessonTitle, { color: colors.blue }]}>{item.lessonTitle}</Text>
            </View>
            <Text style={[nd.lessonBody, { color: colors.foreground }]}>{item.lessonCopy}</Text>
          </View>

          {/* Action buttons */}
          <Text style={[nd.actionsLabel, { color: colors.mutedForeground }]}>EXPLORE</Text>
          <View style={nd.actionsRow}>
            <Pressable
              onPress={() => { onClose(); setTimeout(() => router.push("/(tabs)/market"), 350); }}
              style={({ pressed }) => [nd.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
            >
              <Feather name="trending-up" size={16} color={colors.primary} />
              <Text style={[nd.actionBtnText, { color: colors.foreground }]}>Open Market</Text>
            </Pressable>
            <Pressable
              onPress={() => { onClose(); setTimeout(() => router.push("/(tabs)/scanner"), 350); }}
              style={({ pressed }) => [nd.actionBtn, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 }]}
            >
              <Feather name="filter" size={16} color={colors.primary} />
              <Text style={[nd.actionBtnText, { color: colors.foreground }]}>Open Scanner</Text>
            </Pressable>
          </View>
          {item.relatedAssetIds.length > 0 && (
            <Pressable
              onPress={() => { onClose(); setTimeout(() => router.push({ pathname: "/asset/[id]", params: { id: item.relatedAssetIds[0] } }), 350); }}
              style={({ pressed }) => [nd.viewAssetBtn, { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1 }]}
            >
              <Text style={[nd.viewAssetBtnText, { color: colors.primaryForeground }]}>
                View {item.relatedAssetSymbols[0]}
              </Text>
              <Feather name="arrow-right" size={16} color={colors.primaryForeground} />
            </Pressable>
          )}

          {/* Disclaimer */}
          <Text style={[nd.disclaimer, { color: colors.mutedForeground }]}>
            Simulated headline. LuckyCoin has no cash value. Educational simulator only.
          </Text>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── News Card ────────────────────────────────────────────────────────────────

function NewsCard({
  item,
  onPress,
  colors,
  featured,
}: {
  item: MockNewsItem;
  onPress: () => void;
  colors: ReturnType<typeof useColors>;
  featured?: boolean;
}) {
  const sent = SENTIMENT_CONFIG[item.sentiment];
  const catIcon = CATEGORY_ICONS[item.category] as any;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        nc.card,
        featured && nc.featuredCard,
        {
          backgroundColor: colors.card,
          borderColor: featured ? colors.primary + "35" : colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      {featured && (
        <View style={[nc.featuredBadge, { backgroundColor: colors.primary }]}>
          <Feather name="star" size={10} color={colors.primaryForeground} />
          <Text style={[nc.featuredBadgeText, { color: colors.primaryForeground }]}>Featured</Text>
        </View>
      )}

      <View style={nc.cardTop}>
        <View style={[nc.catPill, { backgroundColor: colors.primary + "15", borderColor: colors.primary + "25" }]}>
          <Feather name={catIcon} size={10} color={colors.primary} />
          <Text style={[nc.catText, { color: colors.primary }]}>{item.category}</Text>
        </View>
        <View style={[nc.sentPill, { backgroundColor: sent.color + "22" }]}>
          <Text style={[nc.sentText, { color: sent.color }]}>{sent.label}</Text>
        </View>
        <Text style={[nc.ts, { color: colors.mutedForeground }]}>{item.timestampLabel}</Text>
      </View>

      <Text style={[nc.title, { color: colors.foreground }, featured && nc.titleLg]}>{item.title}</Text>
      <Text style={[nc.summary, { color: colors.mutedForeground }]} numberOfLines={featured ? 3 : 2}>{item.summary}</Text>

      <View style={nc.bottomRow}>
        <View style={nc.symbols}>
          {item.relatedAssetSymbols.slice(0, 3).map(sym => (
            <View key={sym} style={[nc.symBadge, { backgroundColor: colors.muted + "40" }]}>
              <Text style={[nc.symText, { color: colors.mutedForeground }]}>{sym}</Text>
            </View>
          ))}
          {item.relatedAssetSymbols.length > 3 && (
            <Text style={[nc.moreSyms, { color: colors.mutedForeground }]}>+{item.relatedAssetSymbols.length - 3}</Text>
          )}
        </View>
        <View style={nc.readMore}>
          <Text style={[nc.readMoreText, { color: colors.primary }]}>Read</Text>
          <Feather name="chevron-right" size={13} color={colors.primary} />
        </View>
      </View>
    </Pressable>
  );
}

// ─── Education Card ───────────────────────────────────────────────────────────

function EduCard({ title, copy, icon, colors }: { title: string; copy: string; icon: string; colors: ReturnType<typeof useColors> }) {
  return (
    <View style={[edu.card, { backgroundColor: colors.blue + "0D", borderColor: colors.blue + "28" }]}>
      <View style={edu.header}>
        <Feather name={icon as any} size={14} color={colors.blue} />
        <Text style={[edu.title, { color: colors.blue }]}>{title}</Text>
      </View>
      <Text style={[edu.body, { color: colors.foreground }]}>{copy}</Text>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function NewsScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { watchlist, holdings, appliedEvents, setChallengeFlag } = useGame();
  const [activeCategory, setActiveCategory] = useState<NewsCategory | "All">("All");
  const [selectedNews, setSelectedNews] = useState<MockNewsItem | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  useEffect(() => {
    setChallengeFlag("view_news");
  }, []);

  const filteredNews = useMemo(() => getNewsByCategory(activeCategory), [activeCategory]);
  const featuredItem = filteredNews[0] ?? null;
  const listItems = filteredNews.slice(1);

  const watchlistNews = useMemo(() => {
    if (!watchlist.length) return [];
    return getNewsForAssets(watchlist).slice(0, 3);
  }, [watchlist]);

  const holdingIds = useMemo(() => holdings.map(h => h.assetId), [holdings]);
  const portfolioNews = useMemo(() => {
    if (!holdingIds.length) return [];
    return getNewsForAssets(holdingIds).slice(0, 3);
  }, [holdingIds]);

  // Latest applied event as a news-like item
  const latestEventAsNews = appliedEvents.length > 0 ? appliedEvents[0] : null;

  return (
    <View style={[sc.container, { backgroundColor: colors.background }]}>
      {/* ── Header ───────────────────────────────────── */}
      <View style={[sc.headerWrap, { paddingTop: topPad + 8, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={sc.navRow}>
          <Pressable onPress={() => router.back()} style={sc.backBtn} hitSlop={10}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[sc.title, { color: colors.foreground }]}>Market News</Text>
            <Text style={[sc.subtitle, { color: colors.mutedForeground }]}>Simulated headlines that move the sports market.</Text>
          </View>
          <View style={[sc.simBadge, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[sc.simBadgeText, { color: colors.mutedForeground }]}>Simulated</Text>
          </View>
        </View>

        <FlatList
          horizontal
          data={NEWS_CATEGORIES}
          keyExtractor={c => c}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7, paddingVertical: 10 }}
          renderItem={({ item: cat }) => {
            const active = activeCategory === cat;
            const icon = CATEGORY_ICONS[cat] as any;
            return (
              <Pressable
                onPress={() => setActiveCategory(cat)}
                style={[
                  sc.chip,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Feather name={icon} size={11} color={active ? colors.primaryForeground : colors.mutedForeground} />
                <Text style={[sc.chipText, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>
                  {cat === "All" ? "All" : cat === "Volatility Alert" ? "Volatility" : cat === "Scanner Spotlight" ? "Scanner" : cat === "Portfolio Lesson" ? "Lessons" : cat === "Championship Picture" ? "Champ" : cat.replace(" Watch", "").replace(" Report", "").replace(" Pulse", "")}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: bottomPad + 40 }}>

        {/* ── Latest Market Event (news-like item) ─── */}
        {latestEventAsNews && activeCategory === "All" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={[sc.sectionHeader, { marginBottom: 10 }]}>
              <View style={[sc.liveDot, { backgroundColor: colors.green }]} />
              <Text style={[sc.sectionTitle, { color: colors.foreground }]}>Latest Market Event</Text>
            </View>
            <View style={[sc.eventCard, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28" }]}>
              <View style={sc.eventCardTop}>
                <Text style={sc.eventEmoji}>{latestEventAsNews.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <View style={[sc.eventCatPill, { backgroundColor: colors.primary + "18" }]}>
                    <Text style={[sc.eventCatText, { color: colors.primary }]}>Market Pulse · Just now</Text>
                  </View>
                  <Text style={[sc.eventTitle, { color: colors.foreground }]}>{latestEventAsNews.title}</Text>
                </View>
              </View>
              <Text style={[sc.eventSummary, { color: colors.mutedForeground }]}>{latestEventAsNews.summary}</Text>
              {latestEventAsNews.marketLesson && (
                <View style={[sc.eventLesson, { backgroundColor: colors.blue + "0D", borderColor: colors.blue + "25" }]}>
                  <Feather name="book-open" size={12} color={colors.blue} />
                  <Text style={[sc.eventLessonText, { color: colors.foreground }]}>{latestEventAsNews.marketLesson}</Text>
                </View>
              )}
            </View>
          </View>
        )}

        {/* ── Featured Story ───────────────────────── */}
        {featuredItem && (
          <View style={{ paddingHorizontal: 16, paddingTop: 16 }}>
            <View style={[sc.sectionHeader, { marginBottom: 10 }]}>
              <Text style={[sc.sectionTitle, { color: colors.foreground }]}>
                {activeCategory === "All" ? "Top Story" : activeCategory}
              </Text>
              <Text style={[sc.sectionCount, { color: colors.mutedForeground }]}>
                {filteredNews.length} article{filteredNews.length !== 1 ? "s" : ""}
              </Text>
            </View>
            <NewsCard item={featuredItem} onPress={() => setSelectedNews(featuredItem)} colors={colors} featured />
          </View>
        )}

        {/* ── News List ────────────────────────────── */}
        {listItems.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 12, gap: 10 }}>
            {listItems.map(item => (
              <NewsCard key={item.id} item={item} onPress={() => setSelectedNews(item)} colors={colors} />
            ))}
          </View>
        )}

        {filteredNews.length === 0 && (
          <View style={sc.emptyState}>
            <Feather name="inbox" size={32} color={colors.mutedForeground} />
            <Text style={[sc.emptyTitle, { color: colors.foreground }]}>No headlines in this category</Text>
            <Text style={[sc.emptySub, { color: colors.mutedForeground }]}>Try switching to All or another category.</Text>
          </View>
        )}

        {/* ── Watchlist Headlines ──────────────────── */}
        {activeCategory === "All" && (
          <View style={{ paddingHorizontal: 16, paddingTop: 24, gap: 10 }}>
            <View style={sc.sectionHeader}>
              <Feather name="bookmark" size={15} color={colors.coin} />
              <Text style={[sc.sectionTitle, { color: colors.foreground }]}>Watchlist Headlines</Text>
            </View>

            {watchlist.length === 0 ? (
              <View style={[sc.watchlistEmpty, { backgroundColor: colors.coin + "0E", borderColor: colors.coin + "25" }]}>
                <Feather name="bookmark" size={18} color={colors.coin} />
                <Text style={[sc.watchlistEmptyText, { color: colors.mutedForeground }]}>
                  Add assets to your Watchlist to track headlines connected to them. Following an asset before trading helps you understand how news affects its price.
                </Text>
                <Pressable
                  onPress={() => router.push("/(tabs)/market")}
                  style={({ pressed }) => [sc.watchlistEmptyBtn, { borderColor: colors.coin + "50", opacity: pressed ? 0.85 : 1 }]}
                >
                  <Feather name="trending-up" size={13} color={colors.coin} />
                  <Text style={[sc.watchlistEmptyBtnText, { color: colors.coin }]}>Browse Market</Text>
                </Pressable>
              </View>
            ) : watchlistNews.length === 0 ? (
              <View style={[sc.watchlistEmpty, { backgroundColor: colors.coin + "0E", borderColor: colors.coin + "25" }]}>
                <Text style={[sc.watchlistEmptyText, { color: colors.mutedForeground }]}>
                  No recent simulated headlines for your {watchlist.length} watched asset{watchlist.length !== 1 ? "s" : ""}. Check back after more news articles are added.
                </Text>
              </View>
            ) : (
              watchlistNews.map(item => (
                <NewsCard key={item.id} item={item} onPress={() => setSelectedNews(item)} colors={colors} />
              ))
            )}
          </View>
        )}

        {/* ── Portfolio Headlines ──────────────────── */}
        {activeCategory === "All" && holdingIds.length > 0 && portfolioNews.length > 0 && (
          <View style={{ paddingHorizontal: 16, paddingTop: 24, gap: 10 }}>
            <View style={sc.sectionHeader}>
              <Feather name="briefcase" size={15} color={colors.green} />
              <Text style={[sc.sectionTitle, { color: colors.foreground }]}>Portfolio Headlines</Text>
            </View>
            {portfolioNews.map(item => (
              <NewsCard key={item.id} item={item} onPress={() => setSelectedNews(item)} colors={colors} />
            ))}
          </View>
        )}

        {/* ── Education Cards ──────────────────────── */}
        <View style={{ paddingHorizontal: 16, paddingTop: 24, gap: 10 }}>
          <Text style={[sc.sectionTitle, { color: colors.foreground, marginBottom: 2 }]}>Market Lessons</Text>
          <EduCard
            title="Why headlines move markets"
            copy="Markets react to new information. A headline can change what traders expect, even before results are final. The expectation of a change in value is often what drives a price move — not the change itself."
            icon="activity"
            colors={colors}
          />
          <EduCard
            title="News is not a plan"
            copy="A headline can explain a price move, but it should not be the only reason to act. Check the asset's risk score, recent price movement, and how it fits into your overall portfolio balance before spending LuckyCoin."
            icon="alert-circle"
            colors={colors}
          />
          <EduCard
            title="Watchlist research"
            copy="Following headlines for watched assets helps you build understanding before spending LuckyCoin. Watching an asset — not buying — is how experienced traders do their homework before committing."
            icon="bookmark"
            colors={colors}
          />
        </View>

        {/* ── Disclaimer ───────────────────────────── */}
        <View style={[sc.disclaimer, { backgroundColor: colors.card, borderColor: colors.border, marginHorizontal: 16, marginTop: 24 }]}>
          <Feather name="shield" size={13} color={colors.mutedForeground} />
          <Text style={[sc.disclaimerText, { color: colors.mutedForeground }]}>
            All headlines are simulated for educational purposes. LuckyCoin has no cash value. Fanfolio is not a financial product and provides no financial advice.
          </Text>
        </View>
      </ScrollView>

      <NewsDetailModal
        item={selectedNews}
        visible={!!selectedNews}
        onClose={() => setSelectedNews(null)}
        colors={colors}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sc = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { paddingHorizontal: 16, paddingBottom: 0, borderBottomWidth: 1 },
  navRow: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingBottom: 6 },
  backBtn: { paddingTop: 2 },
  title: { fontSize: 24, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  simBadge: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 8, paddingVertical: 4, marginTop: 4 },
  simBadgeText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  chip: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  chipText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold", flex: 1 },
  sectionCount: { fontSize: 12, fontFamily: "Inter_400Regular" },
  liveDot: { width: 7, height: 7, borderRadius: 4 },
  eventCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  eventCardTop: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  eventEmoji: { fontSize: 28, lineHeight: 34 },
  eventCatPill: { alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginBottom: 4 },
  eventCatText: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  eventTitle: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 22 },
  eventSummary: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  eventLesson: { flexDirection: "row", alignItems: "flex-start", gap: 7, borderRadius: 10, borderWidth: 1, padding: 10 },
  eventLessonText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 19 },
  emptyState: { alignItems: "center", paddingTop: 48, paddingHorizontal: 32, gap: 10 },
  emptyTitle: { fontSize: 16, fontFamily: "Inter_700Bold", textAlign: "center" },
  emptySub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  watchlistEmpty: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  watchlistEmptyText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  watchlistEmptyBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" as const, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 6 },
  watchlistEmptyBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  disclaimer: { borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  disclaimerText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17 },
});

const nc = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  featuredCard: { padding: 16 },
  featuredBadge: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start" as const, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, marginBottom: -2 },
  featuredBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 7, flexWrap: "wrap" as const },
  catPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1 },
  catText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  sentPill: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  sentText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  ts: { fontSize: 10, fontFamily: "Inter_400Regular", marginLeft: "auto" as any },
  title: { fontSize: 15, fontFamily: "Inter_700Bold", lineHeight: 22 },
  titleLg: { fontSize: 17, lineHeight: 25 },
  summary: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bottomRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  symbols: { flexDirection: "row", flexWrap: "wrap" as const, gap: 5 },
  symBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  symText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  moreSyms: { fontSize: 10, fontFamily: "Inter_400Regular", paddingVertical: 3 },
  readMore: { flexDirection: "row", alignItems: "center", gap: 2 },
  readMoreText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});

const edu = StyleSheet.create({
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  header: { flexDirection: "row", alignItems: "center", gap: 7 },
  title: { fontSize: 13, fontFamily: "Inter_700Bold" },
  body: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 21 },
});

const nd = StyleSheet.create({
  container: { flex: 1 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 14, borderBottomWidth: 1 },
  navTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  scroll: { padding: 20, gap: 16, paddingBottom: 56 },
  metaRow: { flexDirection: "row", alignItems: "center", gap: 8, flexWrap: "wrap" as const },
  catPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 7, borderWidth: 1 },
  catText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  sentPill: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  sentText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  ts: { fontSize: 11, fontFamily: "Inter_400Regular", marginLeft: "auto" as any },
  title: { fontSize: 22, fontFamily: "Inter_700Bold", lineHeight: 30 },
  impactRow: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, padding: 10 },
  impactLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  impactVal: { fontSize: 12, fontFamily: "Inter_700Bold", flex: 1 },
  body: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 24 },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  cardLabel: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.7 },
  symbolsRow: { flexDirection: "row", flexWrap: "wrap" as const, gap: 8 },
  symbolPill: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, borderWidth: 1 },
  symbolText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  lessonCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  lessonHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  lessonTitle: { fontSize: 13, fontFamily: "Inter_700Bold", flex: 1 },
  lessonBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  actionsLabel: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.7 },
  actionsRow: { flexDirection: "row", gap: 10 },
  actionBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 7, borderRadius: 12, borderWidth: 1, paddingVertical: 12 },
  actionBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  viewAssetBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, paddingVertical: 14 },
  viewAssetBtnText: { fontSize: 15, fontFamily: "Inter_700Bold" },
  disclaimer: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17, textAlign: "center" as const },
});
