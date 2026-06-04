import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { useChallenges } from "@/hooks/useChallenges";
import { useTraderIdentity } from "@/hooks/useTraderIdentity";
import { ALL_ASSETS } from "@/data/assetUniverse";
import {
  LeaderboardCategory,
  CATEGORIES,
  CategoryDef,
  RivalTrader,
  LeaderboardEntry,
  UserLeaderboardStats,
  buildLeaderboard,
  getBestCategory,
} from "@/data/mockLeaderboard";

// ─── helpers ─────────────────────────────────────────────────────────────────

function rankColor(rank: number, colors: ReturnType<typeof useColors>): string {
  if (rank === 1) return "#FFD700";
  if (rank === 2) return "#C0C0C0";
  if (rank === 3) return "#CD7F32";
  return colors.mutedForeground;
}

function buildUserStats(
  game: ReturnType<typeof useGame>,
  liveAssets: ReturnType<typeof useLiveAssets>,
  badgesCount: number
): UserLeaderboardStats {
  const { holdings, luckyCoinBalance, xp, transactions, challengeFlags, watchlist } = game;

  const portfolioValue = holdings.reduce((s, h) => {
    const a = liveAssets.find(x => x.id === h.assetId);
    return s + (a ? a.price * h.quantity : 0);
  }, 0);
  const totalValue = portfolioValue + luckyCoinBalance;

  let avgRisk = 5;
  if (holdings.length > 0 && portfolioValue > 0) {
    avgRisk = holdings.reduce((s, h) => {
      const a = liveAssets.find(x => x.id === h.assetId);
      const v = a ? a.price * h.quantity : 0;
      return s + (a ? a.riskScore * (v / portfolioValue) : 0);
    }, 0);
  }

  const indexValue = holdings.reduce((s, h) => {
    const a = liveAssets.find(x => x.id === h.assetId);
    return s + (a?.type === "Sport Index" ? a.price * h.quantity : 0);
  }, 0);
  const memeValue = holdings.reduce((s, h) => {
    const a = liveAssets.find(x => x.id === h.assetId);
    return s + (a?.type === "Meme Coin" ? a.price * h.quantity : 0);
  }, 0);
  const indexExposurePct = portfolioValue > 0 ? (indexValue / portfolioValue) * 100 : 0;
  const memeExposurePct = portfolioValue > 0 ? (memeValue / portfolioValue) * 100 : 0;

  const uniqueSports = new Set(
    holdings.map(h => ALL_ASSETS.find(a => a.id === h.assetId)?.sport).filter(Boolean)
  ).size;
  const uniqueTypes = new Set(
    holdings.map(h => ALL_ASSETS.find(a => a.id === h.assetId)?.type).filter(Boolean)
  ).size;
  const largestPct = holdings.length > 0 && portfolioValue > 0
    ? Math.max(...holdings.map(h => {
        const a = liveAssets.find(x => x.id === h.assetId);
        return a ? (a.price * h.quantity / portfolioValue) * 100 : 0;
      }))
    : 0;
  let divScore = 0;
  divScore += Math.min(uniqueSports * 18, 45);
  divScore += Math.min(uniqueTypes * 15, 40);
  if (indexExposurePct > 0) divScore += 15;
  if (largestPct < 50) divScore += 10;
  if (memeExposurePct < 30) divScore += 5;
  const diversificationScore = Math.min(100, divScore);

  const usedScanner = challengeFlags.includes("open_scanner");
  const usedDipWatch = challengeFlags.includes("view_dip_watch");
  const usedMomentum = challengeFlags.includes("view_momentum");
  const viewedJournal = challengeFlags.includes("view_journal");
  const scannerScore = Math.min(100,
    (usedScanner ? 30 : 0) +
    (usedDipWatch ? 18 : 0) +
    (usedMomentum ? 18 : 0) +
    (viewedJournal ? 15 : 0) +
    Math.min(watchlist.length * 5, 19)
  );

  const lowRiskScore = Math.max(0, (10 - avgRisk) * 8 + diversificationScore * 0.3 + indexExposurePct * 0.2);

  const buyTx = transactions.filter(t => t.type === "buy");
  const sellTx = transactions.filter(t => t.type === "sell");
  const weeklyChangePct = transactions.length === 0 ? 0 : Math.min(
    25,
    (buyTx.length * 0.8 + sellTx.length * 1.2 + (xp / 100))
  );

  const comebackScore = transactions.length > 5 ? 45 : 30;

  return {
    totalValue,
    xp,
    weeklyChangePct,
    avgRisk,
    diversificationScore,
    indexExposurePct,
    memeExposurePct,
    tradeCount: transactions.length,
    badgesCount,
    scannerScore,
    comebackScore,
    lowRiskScore,
  };
}

// ─── Rival Detail Modal ───────────────────────────────────────────────────────

function RivalModal({
  rival,
  visible,
  onClose,
  colors,
}: {
  rival: RivalTrader | null;
  visible: boolean;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  if (!rival) return null;
  const riskColor = rival.stats.avgRisk <= 4 ? colors.green : rival.stats.avgRisk <= 7 ? colors.coin : colors.red;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[modal.container, { backgroundColor: colors.background }]}>
        <View style={[modal.nav, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[modal.navTitle, { color: colors.foreground }]}>Rival Profile</Text>
          <View style={{ width: 22 }} />
        </View>

        <ScrollView contentContainerStyle={modal.scroll} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={[modal.header, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28" }]}>
            <View style={[modal.avatar, { backgroundColor: colors.primary }]}>
              <Text style={[modal.avatarText, { color: colors.primaryForeground }]}>{rival.initials}</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[modal.name, { color: colors.foreground }]}>{rival.name}</Text>
              <View style={modal.identityRow}>
                <Text style={modal.identityEmoji}>{rival.identityEmoji}</Text>
                <Text style={[modal.identityLabel, { color: colors.mutedForeground }]}>{rival.traderIdentity}</Text>
              </View>
            </View>
          </View>

          {/* Strategy */}
          <View style={[modal.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[modal.cardTitle, { color: colors.mutedForeground }]}>STRATEGY</Text>
            <Text style={[modal.cardBody, { color: colors.foreground }]}>{rival.strategyDesc}</Text>
          </View>

          {/* Stats grid */}
          <View style={modal.statsGrid}>
            {[
              { label: "Portfolio", value: `${(rival.stats.totalValue / 1000).toFixed(0)}K LC`, icon: "layers" as const },
              { label: "XP", value: rival.stats.xp.toLocaleString(), icon: "star" as const },
              { label: "Trades", value: rival.stats.tradeCount.toString(), icon: "repeat" as const },
              { label: "Badges", value: rival.stats.badgesCount.toString(), icon: "award" as const },
              { label: "Avg Risk", value: `${rival.stats.avgRisk.toFixed(1)}/10`, icon: "zap" as const },
              { label: "Div. Score", value: `${rival.stats.diversificationScore}`, icon: "pie-chart" as const },
            ].map(s => (
              <View key={s.label} style={[modal.statCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Feather name={s.icon} size={14} color={colors.primary} />
                <Text style={[modal.statValue, { color: colors.foreground }]}>{s.value}</Text>
                <Text style={[modal.statLabel, { color: colors.mutedForeground }]}>{s.label}</Text>
              </View>
            ))}
          </View>

          {/* Risk bar */}
          <View style={[modal.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[modal.cardTitle, { color: colors.mutedForeground }]}>RISK LEVEL</Text>
            <View style={modal.barRow}>
              <View style={[modal.barTrack, { backgroundColor: colors.border }]}>
                <View style={[modal.barFill, { width: `${rival.stats.avgRisk * 10}%` as any, backgroundColor: riskColor }]} />
              </View>
              <Text style={[modal.barLabel, { color: riskColor }]}>{rival.stats.avgRisk.toFixed(1)}/10</Text>
            </View>
          </View>

          {/* Exposure */}
          <View style={[modal.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[modal.cardTitle, { color: colors.mutedForeground }]}>PORTFOLIO MIX</Text>
            {[
              { label: "Index Exposure", pct: rival.stats.indexExposurePct, color: colors.green },
              { label: "Meme Exposure", pct: rival.stats.memeExposurePct, color: colors.red },
            ].map(bar => (
              <View key={bar.label} style={modal.mixRow}>
                <Text style={[modal.mixLabel, { color: colors.mutedForeground }]}>{bar.label}</Text>
                <View style={[modal.barTrack, { flex: 1, backgroundColor: colors.border }]}>
                  <View style={[modal.barFill, { width: `${Math.max(2, bar.pct)}%` as any, backgroundColor: bar.color }]} />
                </View>
                <Text style={[modal.barLabel, { color: bar.color }]}>{bar.pct.toFixed(0)}%</Text>
              </View>
            ))}
          </View>

          {/* Lesson */}
          <View style={[modal.lessonCard, { backgroundColor: colors.blue + "0E", borderColor: colors.blue + "28" }]}>
            <View style={modal.lessonHeader}>
              <Feather name="book-open" size={14} color={colors.blue} />
              <Text style={[modal.lessonTitle, { color: colors.blue }]}>What This Trader Teaches</Text>
            </View>
            <Text style={[modal.lessonBody, { color: colors.foreground }]}>{rival.marketLesson}</Text>
          </View>

          <Pressable
            onPress={onClose}
            style={[modal.closeBtn, { backgroundColor: colors.primary }]}
          >
            <Text style={[modal.closeBtnText, { color: colors.primaryForeground }]}>Close</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ─── Rank Row ─────────────────────────────────────────────────────────────────

function RankRow({
  entry,
  colors,
  onPress,
}: {
  entry: LeaderboardEntry;
  colors: ReturnType<typeof useColors>;
  onPress: () => void;
}) {
  const rc = rankColor(entry.rank, colors);
  const wc = entry.weeklyChangePct >= 0 ? colors.green : colors.red;

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        row.container,
        {
          backgroundColor: entry.isUser ? colors.primary + "12" : colors.card,
          borderColor: entry.isUser ? colors.primary + "50" : colors.border,
          opacity: pressed ? 0.87 : 1,
        },
      ]}
    >
      <Text style={[row.rank, { color: rc }]}>#{entry.rank}</Text>

      <View style={[
        row.avatar,
        { backgroundColor: entry.isUser ? colors.primary : colors.muted + "80" },
      ]}>
        <Text style={[row.avatarText, { color: entry.isUser ? colors.primaryForeground : colors.mutedForeground }]}>
          {entry.isUser ? entry.displayName.charAt(0).toUpperCase() : (entry.rival?.initials ?? "?")}
        </Text>
      </View>

      <View style={{ flex: 1, gap: 1 }}>
        <View style={row.nameRow}>
          <Text style={[row.name, { color: colors.foreground }]} numberOfLines={1}>
            {entry.displayName}
            {entry.isUser ? " (You)" : ""}
          </Text>
          {entry.rival && (
            <Text style={row.identityEmoji}>{entry.rival.identityEmoji}</Text>
          )}
          {entry.isUser && (
            <View style={[row.youBadge, { backgroundColor: colors.primary + "20" }]}>
              <Text style={[row.youBadgeText, { color: colors.primary }]}>You</Text>
            </View>
          )}
        </View>
        <Text style={[row.secondary, { color: colors.mutedForeground }]} numberOfLines={1}>
          {entry.displaySecondary}
        </Text>
      </View>

      <View style={{ alignItems: "flex-end", gap: 2 }}>
        <Text style={[row.stat, { color: colors.foreground }]}>{entry.displayStat}</Text>
        <Text style={[row.change, { color: wc }]}>
          {entry.weeklyChangePct >= 0 ? "+" : ""}{entry.weeklyChangePct.toFixed(1)}%
        </Text>
      </View>

      {!entry.isUser && (
        <Feather name="chevron-right" size={14} color={colors.mutedForeground} style={{ marginLeft: 2 }} />
      )}
    </Pressable>
  );
}

// ─── Podium ───────────────────────────────────────────────────────────────────

function Podium({
  entries,
  colors,
  onPress,
}: {
  entries: LeaderboardEntry[];
  colors: ReturnType<typeof useColors>;
  onPress: (e: LeaderboardEntry) => void;
}) {
  const top3 = entries.slice(0, 3);
  if (top3.length < 1) return null;

  const podiumOrder = top3.length >= 3
    ? [top3[1], top3[0], top3[2]]
    : top3.length === 2
      ? [top3[1], top3[0]]
      : [top3[0]];

  return (
    <View style={pod.wrap}>
      {podiumOrder.map((entry, i) => {
        const isFirst = entry.rank === 1;
        const rc = rankColor(entry.rank, colors);
        return (
          <Pressable
            key={entry.displayName}
            onPress={() => !entry.isUser && onPress(entry)}
            style={[pod.item, isFirst && pod.itemFirst]}
          >
            {isFirst && <Feather name="award" size={20} color={rc} style={{ marginBottom: 4 }} />}
            <View style={[
              pod.avatar,
              isFirst && pod.avatarLg,
              { backgroundColor: rc + "22", borderColor: rc },
              entry.isUser && { backgroundColor: colors.primary + "22", borderColor: colors.primary },
            ]}>
              <Text style={[pod.avatarText, isFirst && pod.avatarTextLg, { color: entry.isUser ? colors.primary : rc }]}>
                {entry.isUser ? entry.displayName.charAt(0).toUpperCase() : (entry.rival?.initials ?? "?")}
              </Text>
            </View>
            <Text style={[pod.rank, { color: rc }]}>#{entry.rank}</Text>
            <Text style={[pod.name, { color: colors.foreground }]} numberOfLines={1}>
              {entry.displayName}
              {entry.isUser ? " ★" : ""}
            </Text>
            <Text style={[pod.stat, { color: colors.mutedForeground }]}>{entry.displayStat}</Text>
            {entry.rival && (
              <Text style={pod.emoji}>{entry.rival.identityEmoji}</Text>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────

export default function LeaderboardScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const game = useGame();
  const liveAssets = useLiveAssets();
  const { unlockedAchievementCount } = useChallenges();
  const traderIdentity = useTraderIdentity();
  const [activeCategory, setActiveCategory] = useState<LeaderboardCategory>("Overall");
  const [selectedRival, setSelectedRival] = useState<RivalTrader | null>(null);

  useEffect(() => {
    game.setChallengeFlag("view_leaderboard");
  }, []);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const userStats = useMemo(() =>
    buildUserStats(game, liveAssets, unlockedAchievementCount),
    [game, liveAssets, unlockedAchievementCount]
  );

  const username = game.username;

  const entries = useMemo(() =>
    buildLeaderboard(activeCategory, username, userStats),
    [activeCategory, username, userStats]
  );

  const catDef = useMemo(() =>
    CATEGORIES.find(c => c.id === activeCategory)!,
    [activeCategory]
  );

  const userEntry = useMemo(() => entries.find(e => e.isUser), [entries]);
  const top10 = entries.slice(0, 10);
  const userInTop10 = (userEntry?.rank ?? 99) <= 10;

  const top3 = entries.slice(0, 3);
  const listEntries = entries.slice(3, 10);

  const bestCategory = useMemo(() =>
    getBestCategory(username, userStats),
    [username, userStats]
  );
  const bestCatDef = CATEGORIES.find(c => c.id === bestCategory);

  const top10Avg = useMemo(() => {
    const t10 = entries.slice(0, 10).filter(e => !e.isUser);
    if (t10.length === 0) return { value: 0, risk: 5, divScore: 0, xp: 0 };
    const vals = t10.map(e => e.rival?.stats.totalValue ?? 0);
    const risks = t10.map(e => e.rival?.stats.avgRisk ?? 5);
    const divs = t10.map(e => e.rival?.stats.diversificationScore ?? 0);
    const xps = t10.map(e => e.rival?.stats.xp ?? 0);
    return {
      value: vals.reduce((a, b) => a + b, 0) / t10.length,
      risk: risks.reduce((a, b) => a + b, 0) / t10.length,
      divScore: divs.reduce((a, b) => a + b, 0) / t10.length,
      xp: xps.reduce((a, b) => a + b, 0) / t10.length,
    };
  }, [entries]);

  const handleRowPress = useCallback((entry: LeaderboardEntry) => {
    if (entry.rival) setSelectedRival(entry.rival);
  }, []);

  const rankSummaryText = () => {
    const r = userEntry?.rank ?? 99;
    if (r === 1) return `You are #1 in ${catDef.label}. Keep building.`;
    if (r <= 3) return `You are on the podium in ${catDef.label}. Top 3 trader.`;
    if (r <= 10) return `You rank #${r} in ${catDef.label}. Your best category is ${bestCatDef?.label}.`;
    return `You rank #${r} in ${catDef.label}. Your best category is ${bestCatDef?.label}.`;
  };

  return (
    <View style={[sc.container, { backgroundColor: colors.background }]}>
      {/* ── Fixed Header ──────────────────────────────────── */}
      <View style={[sc.headerWrap, { paddingTop: topPad + 12, backgroundColor: colors.background, borderBottomColor: colors.border }]}>
        <View style={sc.titleRow}>
          <View>
            <Text style={[sc.title, { color: colors.foreground }]}>Fanfolio 500</Text>
            <Text style={[sc.subtitle, { color: colors.mutedForeground }]}>
              See how different strategies rank.
            </Text>
          </View>
          <View style={[sc.totalBadge, { backgroundColor: colors.primary + "15" }]}>
            <Feather name="users" size={13} color={colors.primary} />
            <Text style={[sc.totalBadgeText, { color: colors.primary }]}>
              {entries.length} traders
            </Text>
          </View>
        </View>

        <FlatList
          horizontal
          data={CATEGORIES}
          keyExtractor={c => c.id}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 7, paddingVertical: 10, paddingHorizontal: 0 }}
          renderItem={({ item: cat }) => {
            const active = activeCategory === cat.id;
            return (
              <Pressable
                onPress={() => setActiveCategory(cat.id)}
                style={[
                  sc.tab,
                  {
                    backgroundColor: active ? colors.primary : colors.card,
                    borderColor: active ? colors.primary : colors.border,
                  },
                ]}
              >
                <Feather
                  name={cat.icon as any}
                  size={11}
                  color={active ? colors.primaryForeground : colors.mutedForeground}
                />
                <Text style={[sc.tabText, { color: active ? colors.primaryForeground : colors.mutedForeground }]}>
                  {cat.shortLabel}
                </Text>
              </Pressable>
            );
          }}
        />
      </View>

      {/* ── Scrollable Body ───────────────────────────────── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: bottomPad + 90, paddingTop: 8 }}
      >
        {/* ── User Rank Summary ─────────────────────────── */}
        <View style={[sc.userCard, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28" }]}>
          <View style={sc.userCardTop}>
            <View style={[sc.rankBadge, { backgroundColor: colors.primary }]}>
              <Text style={[sc.rankNum, { color: colors.primaryForeground }]}>
                #{userEntry?.rank ?? "–"}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[sc.userCardCat, { color: colors.primary }]}>{catDef.label}</Text>
              <Text style={[sc.userCardStat, { color: colors.foreground }]}>
                {userEntry?.displayStat ?? "–"}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end", gap: 3 }}>
              <View style={[sc.identityPill, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={sc.identityPillEmoji}>{traderIdentity.primary.emoji}</Text>
                <Text style={[sc.identityPillText, { color: colors.foreground }]}>
                  {traderIdentity.primary.title}
                </Text>
              </View>
              <Text style={[sc.userXP, { color: colors.mutedForeground }]}>
                {userStats.xp.toLocaleString()} XP
              </Text>
            </View>
          </View>
          <Text style={[sc.userCardDesc, { color: colors.foreground }]}>{rankSummaryText()}</Text>
          {bestCategory !== activeCategory && (
            <Pressable
              onPress={() => setActiveCategory(bestCategory)}
              style={[sc.bestCatBtn, { borderColor: colors.primary + "40" }]}
            >
              <Feather name="star" size={12} color={colors.primary} />
              <Text style={[sc.bestCatBtnText, { color: colors.primary }]}>
                Switch to your best: {bestCatDef?.label}
              </Text>
            </Pressable>
          )}
        </View>

        {/* ── Podium ───────────────────────────────────── */}
        <Podium entries={top3} colors={colors} onPress={handleRowPress} />

        {/* ── Rank List (#4–#10) ───────────────────────── */}
        <View style={sc.listWrap}>
          {listEntries.map(entry => (
            <RankRow
              key={entry.displayName + entry.rank}
              entry={entry}
              colors={colors}
              onPress={() => handleRowPress(entry)}
            />
          ))}

          {/* User row if outside top 10 */}
          {!userInTop10 && userEntry && (
            <>
              <View style={[sc.separatorWrap, { borderTopColor: colors.border }]}>
                <Text style={[sc.separatorText, { color: colors.mutedForeground }]}>Your Rank</Text>
              </View>
              <RankRow
                entry={userEntry}
                colors={colors}
                onPress={() => {}}
              />
            </>
          )}
        </View>

        {/* ── Category Explanation ──────────────────────── */}
        <View style={[sc.eduCard, { backgroundColor: colors.blue + "0D", borderColor: colors.blue + "25" }]}>
          <View style={sc.eduHeader}>
            <Feather name="book-open" size={14} color={colors.blue} />
            <Text style={[sc.eduTitle, { color: colors.blue }]}>{catDef.educationTitle}</Text>
          </View>
          <Text style={[sc.eduBody, { color: colors.foreground }]}>{catDef.educationCopy}</Text>
        </View>

        {/* ── Compare Yourself ──────────────────────────── */}
        <View style={sc.sectionWrap}>
          <Text style={[sc.sectionTitle, { color: colors.foreground }]}>Compare Yourself</Text>
          <Text style={[sc.sectionSub, { color: colors.mutedForeground }]}>vs. top 10 average</Text>

          {[
            {
              label: "Portfolio Value",
              yours: userStats.totalValue,
              avg: top10Avg.value,
              format: (v: number) => `${(v / 1000).toFixed(0)}K LC`,
              higherBetter: true,
            },
            {
              label: "Average Risk",
              yours: userStats.avgRisk,
              avg: top10Avg.risk,
              format: (v: number) => `${v.toFixed(1)}/10`,
              higherBetter: false,
            },
            {
              label: "Diversification",
              yours: userStats.diversificationScore,
              avg: top10Avg.divScore,
              format: (v: number) => `${Math.round(v)} pts`,
              higherBetter: true,
            },
            {
              label: "XP",
              yours: userStats.xp,
              avg: top10Avg.xp,
              format: (v: number) => `${Math.round(v).toLocaleString()}`,
              higherBetter: true,
            },
          ].map(metric => {
            const isBetter = metric.higherBetter
              ? metric.yours >= metric.avg
              : metric.yours <= metric.avg;
            const diffColor = isBetter ? colors.green : colors.red;
            const maxVal = Math.max(metric.yours, metric.avg, 1);
            const yoursPct = Math.max(4, Math.min(100, (metric.yours / maxVal) * 100));
            const avgPct = Math.max(4, Math.min(100, (metric.avg / maxVal) * 100));

            return (
              <View key={metric.label} style={[sc.compareRow, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <Text style={[sc.compareLabel, { color: colors.mutedForeground }]}>{metric.label}</Text>
                <View style={sc.compareBars}>
                  <View style={sc.compareBarRow}>
                    <Text style={[sc.compareBarLabel, { color: colors.primary }]}>You</Text>
                    <View style={[sc.compareTrack, { backgroundColor: colors.border }]}>
                      <View style={[sc.compareFill, { width: `${yoursPct}%` as any, backgroundColor: colors.primary }]} />
                    </View>
                    <Text style={[sc.compareBarVal, { color: diffColor }]}>{metric.format(metric.yours)}</Text>
                  </View>
                  <View style={sc.compareBarRow}>
                    <Text style={[sc.compareBarLabel, { color: colors.mutedForeground }]}>Top 10</Text>
                    <View style={[sc.compareTrack, { backgroundColor: colors.border }]}>
                      <View style={[sc.compareFill, { width: `${avgPct}%` as any, backgroundColor: colors.mutedForeground + "60" }]} />
                    </View>
                    <Text style={[sc.compareBarVal, { color: colors.mutedForeground }]}>{metric.format(metric.avg)}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </View>

        {/* ── All Categories Quick View ─────────────────── */}
        <View style={sc.sectionWrap}>
          <Text style={[sc.sectionTitle, { color: colors.foreground }]}>Your Rankings</Text>
          <Text style={[sc.sectionSub, { color: colors.mutedForeground }]}>across all categories</Text>
          <View style={sc.allCatsGrid}>
            {CATEGORIES.map(cat => {
              const catEntries = buildLeaderboard(cat.id, username, userStats);
              const uEntry = catEntries.find(e => e.isUser);
              const rank = uEntry?.rank ?? 99;
              const isBest = cat.id === bestCategory;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => setActiveCategory(cat.id)}
                  style={({ pressed }) => [
                    sc.catCard,
                    {
                      backgroundColor: isBest ? colors.primary + "12" : colors.card,
                      borderColor: isBest ? colors.primary + "40" : colors.border,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Feather name={cat.icon as any} size={14} color={isBest ? colors.primary : colors.mutedForeground} />
                  <Text style={[sc.catCardRank, { color: isBest ? colors.primary : colors.foreground }]}>
                    #{rank}
                  </Text>
                  <Text style={[sc.catCardLabel, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {cat.shortLabel}
                  </Text>
                  {isBest && (
                    <View style={[sc.bestDot, { backgroundColor: colors.primary }]} />
                  )}
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* ── Disclaimer ───────────────────────────────────── */}
        <View style={[sc.disclaimer, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="shield" size={13} color={colors.mutedForeground} />
          <Text style={[sc.disclaimerText, { color: colors.mutedForeground }]}>
            All rankings are simulated. LuckyCoin has no cash value. Fanfolio is an educational game.
          </Text>
        </View>
      </ScrollView>

      {/* ── Rival Modal ───────────────────────────────────── */}
      <RivalModal
        rival={selectedRival}
        visible={!!selectedRival}
        onClose={() => setSelectedRival(null)}
        colors={colors}
      />
    </View>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const sc = StyleSheet.create({
  container: { flex: 1 },
  headerWrap: { paddingHorizontal: 16, borderBottomWidth: 1 },
  titleRow: { flexDirection: "row", alignItems: "flex-start", justifyContent: "space-between" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  totalBadge: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20, marginTop: 4 },
  totalBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  tab: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  userCard: { marginHorizontal: 16, marginBottom: 4, borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  userCardTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  rankBadge: { width: 52, height: 52, borderRadius: 26, alignItems: "center", justifyContent: "center" },
  rankNum: { fontSize: 16, fontFamily: "Inter_700Bold" },
  userCardCat: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  userCardStat: { fontSize: 20, fontFamily: "Inter_700Bold" },
  identityPill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  identityPillEmoji: { fontSize: 12 },
  identityPillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  userXP: { fontSize: 11, fontFamily: "Inter_400Regular" },
  userCardDesc: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  bestCatBtn: { flexDirection: "row", alignItems: "center", gap: 6, alignSelf: "flex-start" as const, borderWidth: 1, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  bestCatBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  listWrap: { paddingHorizontal: 16, paddingTop: 4, gap: 8 },
  separatorWrap: { borderTopWidth: 1, paddingTop: 12, marginTop: 4, marginBottom: 4, alignItems: "center" },
  separatorText: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },

  eduCard: { marginHorizontal: 16, marginTop: 16, borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  eduHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  eduTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  eduBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  sectionWrap: { paddingHorizontal: 16, marginTop: 20, gap: 10 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  sectionSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: -6 },

  compareRow: { borderRadius: 12, borderWidth: 1, padding: 12, gap: 8 },
  compareLabel: { fontSize: 12, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.4 },
  compareBars: { gap: 6 },
  compareBarRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  compareBarLabel: { width: 36, fontSize: 11, fontFamily: "Inter_600SemiBold" },
  compareTrack: { flex: 1, height: 7, borderRadius: 4, overflow: "hidden" },
  compareFill: { height: 7, borderRadius: 4 },
  compareBarVal: { width: 60, fontSize: 11, fontFamily: "Inter_700Bold", textAlign: "right" },

  allCatsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  catCard: { width: "30%", alignItems: "center", borderRadius: 12, borderWidth: 1, paddingVertical: 12, paddingHorizontal: 8, gap: 4, position: "relative" as const },
  catCardRank: { fontSize: 16, fontFamily: "Inter_700Bold" },
  catCardLabel: { fontSize: 10, fontFamily: "Inter_500Medium", textAlign: "center" },
  bestDot: { position: "absolute" as const, top: 6, right: 6, width: 7, height: 7, borderRadius: 4 },

  disclaimer: { marginHorizontal: 16, marginTop: 20, borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  disclaimerText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17 },
});

const pod = StyleSheet.create({
  wrap: { flexDirection: "row", justifyContent: "center", alignItems: "flex-end", paddingVertical: 20, paddingHorizontal: 16, gap: 8 },
  item: { flex: 1, alignItems: "center", gap: 4 },
  itemFirst: { flex: 1.2 },
  avatar: { width: 50, height: 50, borderRadius: 25, borderWidth: 2, alignItems: "center", justifyContent: "center" },
  avatarLg: { width: 64, height: 64, borderRadius: 32 },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  avatarTextLg: { fontSize: 20 },
  rank: { fontSize: 11, fontFamily: "Inter_700Bold" },
  name: { fontSize: 11, fontFamily: "Inter_600SemiBold", textAlign: "center", maxWidth: 80 },
  stat: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center" },
  emoji: { fontSize: 14 },
});

const row = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1 },
  rank: { width: 32, fontSize: 13, fontFamily: "Inter_700Bold", textAlign: "center" },
  avatar: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  name: { fontSize: 13, fontFamily: "Inter_600SemiBold", flexShrink: 1 },
  identityEmoji: { fontSize: 14 },
  youBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 },
  youBadgeText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  secondary: { fontSize: 11, fontFamily: "Inter_400Regular" },
  stat: { fontSize: 13, fontFamily: "Inter_700Bold" },
  change: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
});

const modal = StyleSheet.create({
  container: { flex: 1 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 14, borderBottomWidth: 1 },
  navTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  scroll: { padding: 20, gap: 14, paddingBottom: 48 },
  header: { flexDirection: "row", alignItems: "center", gap: 14, borderRadius: 14, borderWidth: 1, padding: 14 },
  avatar: { width: 56, height: 56, borderRadius: 28, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 22, fontFamily: "Inter_700Bold" },
  name: { fontSize: 20, fontFamily: "Inter_700Bold" },
  identityRow: { flexDirection: "row", alignItems: "center", gap: 5, marginTop: 2 },
  identityEmoji: { fontSize: 16 },
  identityLabel: { fontSize: 13, fontFamily: "Inter_400Regular" },
  card: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  cardTitle: { fontSize: 10, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.7 },
  cardBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  statCard: { width: "30%", borderRadius: 12, borderWidth: 1, padding: 10, alignItems: "center", gap: 3 },
  statValue: { fontSize: 14, fontFamily: "Inter_700Bold", textAlign: "center" },
  statLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  barRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  barTrack: { flex: 1, height: 8, borderRadius: 4, overflow: "hidden" },
  barFill: { height: 8, borderRadius: 4 },
  barLabel: { fontSize: 12, fontFamily: "Inter_700Bold", width: 40, textAlign: "right" },
  mixRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 6 },
  mixLabel: { width: 100, fontSize: 12, fontFamily: "Inter_500Medium" },
  lessonCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 8 },
  lessonHeader: { flexDirection: "row", alignItems: "center", gap: 7 },
  lessonTitle: { fontSize: 12, fontFamily: "Inter_700Bold", textTransform: "uppercase", letterSpacing: 0.5 },
  lessonBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  closeBtn: { height: 52, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  closeBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
