import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";
import { useChallenges, ChallengeWithProgress } from "@/hooks/useChallenges";
import { CHALLENGE_CATEGORIES } from "@/data/challenges";

function ProgressBar({ progress, color, height = 6 }: { progress: number; color: string; height?: number }) {
  return (
    <View style={[barStyles.track, { height, backgroundColor: color + "22" }]}>
      <View style={[barStyles.fill, { width: `${Math.min(100, progress * 100)}%` as any, backgroundColor: color, height }]} />
    </View>
  );
}

function ChallengeCard({
  challenge,
  colors,
  onClaim,
}: {
  challenge: ChallengeWithProgress;
  colors: ReturnType<typeof useColors>;
  onClaim: (c: ChallengeWithProgress) => void;
}) {
  const isClaimed = challenge.isClaimed;
  const isReady = challenge.isComplete && !isClaimed;
  const progress = challenge.total > 0 ? challenge.current / challenge.total : 0;

  const accentColor = isClaimed
    ? colors.mutedForeground
    : isReady
    ? colors.coin
    : colors.primary;

  return (
    <View
      style={[
        cardStyles.card,
        {
          backgroundColor: colors.card,
          borderColor: isReady
            ? colors.coin + "60"
            : isClaimed
            ? colors.border + "80"
            : colors.border,
          opacity: isClaimed ? 0.65 : 1,
        },
      ]}
    >
      <View style={cardStyles.top}>
        <View style={[cardStyles.iconBox, { backgroundColor: accentColor + "18" }]}>
          <Feather name={challenge.icon as any} size={18} color={accentColor} />
        </View>
        <View style={{ flex: 1 }}>
          <View style={cardStyles.titleRow}>
            <Text style={[cardStyles.title, { color: colors.foreground }]} numberOfLines={1}>
              {challenge.title}
            </Text>
            {isReady && (
              <View style={[cardStyles.readyBadge, { backgroundColor: colors.coin + "22" }]}>
                <Text style={[cardStyles.readyText, { color: colors.coin }]}>Ready!</Text>
              </View>
            )}
            {isClaimed && (
              <View style={[cardStyles.readyBadge, { backgroundColor: colors.green + "18" }]}>
                <Feather name="check" size={10} color={colors.green} />
                <Text style={[cardStyles.readyText, { color: colors.green }]}>Done</Text>
              </View>
            )}
          </View>
          <Text style={[cardStyles.desc, { color: colors.mutedForeground }]} numberOfLines={2}>
            {challenge.description}
          </Text>
        </View>
      </View>

      <ProgressBar progress={progress} color={accentColor} />

      <View style={cardStyles.bottom}>
        <Text style={[cardStyles.progressText, { color: colors.mutedForeground }]}>
          {challenge.current}/{challenge.total}
        </Text>
        <View style={cardStyles.rewardRow}>
          {challenge.xpReward > 0 && (
            <View style={[cardStyles.rewardBadge, { backgroundColor: colors.primary + "15" }]}>
              <Text style={[cardStyles.rewardText, { color: colors.primary }]}>+{challenge.xpReward} XP</Text>
            </View>
          )}
          {challenge.lcReward > 0 && (
            <View style={[cardStyles.rewardBadge, { backgroundColor: colors.coin + "15" }]}>
              <Text style={[cardStyles.rewardText, { color: colors.coin }]}>+{challenge.lcReward} LC</Text>
            </View>
          )}
        </View>
      </View>

      {challenge.total > 1 && !isClaimed && (
        <Text style={[cardStyles.tip, { color: colors.mutedForeground, borderTopColor: colors.border }]}>
          💡 {challenge.tip}
        </Text>
      )}

      {isReady && (
        <Pressable
          onPress={() => onClaim(challenge)}
          style={({ pressed }) => [
            cardStyles.claimBtn,
            { backgroundColor: colors.coin, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Feather name="gift" size={15} color="#0C0F14" />
          <Text style={cardStyles.claimBtnText}>
            Claim Reward
            {challenge.lcReward > 0 ? ` · +${challenge.lcReward} LC` : ""}
            {` · +${challenge.xpReward} XP`}
          </Text>
        </Pressable>
      )}
    </View>
  );
}

export default function ChallengesScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { claimChallengeReward } = useGame();
  const { challengesWithProgress, achievementsWithStatus, xpInfo, claimedCount, claimableCount } = useChallenges();

  const [showClaimed, setShowClaimed] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  function handleClaim(challenge: ChallengeWithProgress) {
    const result = claimChallengeReward(challenge.id, challenge.xpReward, challenge.lcReward);
    if (result.success) {
      const msgs: string[] = [`+${challenge.xpReward} XP earned`];
      if (challenge.lcReward > 0) msgs.push(`+${challenge.lcReward} LuckyCoin added (no cash value)`);
      if (challenge.achievementId) msgs.push("New achievement unlocked!");
      Alert.alert("Reward Claimed!", msgs.join("\n"));
    }
  }

  const unlockedCount = achievementsWithStatus.filter(a => a.unlocked).length;

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 12, paddingBottom: bottomPad + 48 }}
      showsVerticalScrollIndicator={false}
    >
      {/* ── Nav ──────────────────────────────────────────── */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={8}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View>
          <Text style={[styles.title, { color: colors.foreground }]}>Challenges</Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Complete market missions to learn trading habits.</Text>
        </View>
      </View>

      {/* ── XP / Level hero ──────────────────────────────── */}
      <View style={[styles.xpCard, { backgroundColor: colors.primary + "14", borderColor: colors.primary + "30" }]}>
        <View style={styles.xpTop}>
          <View>
            <Text style={[styles.levelBadge, { color: colors.primary }]}>
              Level {xpInfo.level} · {xpInfo.levelTitle}
            </Text>
            <Text style={[styles.xpAmount, { color: colors.foreground }]}>
              {xpInfo.totalXP.toLocaleString()} XP
            </Text>
          </View>
          <View style={[styles.levelCircle, { backgroundColor: colors.primary }]}>
            <Text style={[styles.levelNum, { color: colors.primaryForeground }]}>{xpInfo.level}</Text>
          </View>
        </View>
        <ProgressBar progress={xpInfo.progressInLevel} color={colors.primary} height={8} />
        <View style={styles.xpFooter}>
          <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>
            {xpInfo.isMaxLevel ? "Max level reached!" : `${xpInfo.levelXPStart} XP`}
          </Text>
          {!xpInfo.isMaxLevel && (
            <Text style={[styles.xpLabel, { color: colors.mutedForeground }]}>
              {xpInfo.levelXPEnd} XP
            </Text>
          )}
        </View>

        {/* Summary pills */}
        <View style={styles.pillRow}>
          <View style={[styles.pill, { backgroundColor: colors.green + "18" }]}>
            <Feather name="check-circle" size={12} color={colors.green} />
            <Text style={[styles.pillText, { color: colors.green }]}>{claimedCount} completed</Text>
          </View>
          <View style={[styles.pill, { backgroundColor: colors.coin + "18" }]}>
            <Text style={[styles.pillText, { color: colors.coin }]}>🏅 {unlockedCount}/{achievementsWithStatus.length} achievements</Text>
          </View>
          {claimableCount > 0 && (
            <View style={[styles.pill, { backgroundColor: colors.coin + "25" }]}>
              <Text style={[styles.pillText, { color: colors.coin }]}>⚡ {claimableCount} ready to claim!</Text>
            </View>
          )}
        </View>
      </View>

      {/* ── Claimable first ──────────────────────────────── */}
      {claimableCount > 0 && (
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="gift" size={14} color={colors.coin} />
            <Text style={[styles.sectionTitle, { color: colors.coin }]}>Ready to Claim ({claimableCount})</Text>
          </View>
          {challengesWithProgress
            .filter(c => c.isComplete && !c.isClaimed)
            .map(c => (
              <ChallengeCard key={c.id} challenge={c} colors={colors} onClaim={handleClaim} />
            ))}
        </View>
      )}

      {/* ── Active challenges by category ────────────────── */}
      {CHALLENGE_CATEGORIES.map(cat => {
        const active = challengesWithProgress.filter(
          c => c.category === cat && !c.isComplete && !c.isClaimed
        );
        if (active.length === 0) return null;
        return (
          <View key={cat} style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{cat}</Text>
              <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
                {challengesWithProgress.filter(c => c.category === cat && c.isClaimed).length}/
                {challengesWithProgress.filter(c => c.category === cat).length}
              </Text>
            </View>
            {active.map(c => (
              <ChallengeCard key={c.id} challenge={c} colors={colors} onClaim={handleClaim} />
            ))}
          </View>
        );
      })}

      {/* ── Completed / Claimed ──────────────────────────── */}
      {claimedCount > 0 && (
        <View style={styles.section}>
          <Pressable style={styles.sectionHeader} onPress={() => setShowClaimed(v => !v)}>
            <View style={[styles.pill, { backgroundColor: colors.green + "18" }]}>
              <Feather name="check" size={12} color={colors.green} />
              <Text style={[styles.pillText, { color: colors.green }]}>Completed ({claimedCount})</Text>
            </View>
            <Feather name={showClaimed ? "chevron-up" : "chevron-down"} size={16} color={colors.mutedForeground} />
          </Pressable>
          {showClaimed &&
            challengesWithProgress
              .filter(c => c.isClaimed)
              .map(c => (
                <ChallengeCard key={c.id} challenge={c} colors={colors} onClaim={handleClaim} />
              ))}
        </View>
      )}

      {/* ── Achievements grid ────────────────────────────── */}
      <View style={styles.section}>
        <View style={styles.sectionHeader}>
          <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Achievements</Text>
          <Text style={[styles.sectionCount, { color: colors.mutedForeground }]}>
            {unlockedCount}/{achievementsWithStatus.length} unlocked
          </Text>
        </View>
        <View style={styles.achievementGrid}>
          {achievementsWithStatus.map(a => (
            <View
              key={a.id}
              style={[
                styles.achievementCard,
                {
                  backgroundColor: a.unlocked ? colors.card : colors.card + "80",
                  borderColor: a.unlocked ? colors.coin + "50" : colors.border,
                  opacity: a.unlocked ? 1 : 0.45,
                },
              ]}
            >
              <Text style={styles.achievementEmoji}>{a.emoji}</Text>
              <Text style={[styles.achievementTitle, { color: colors.foreground }]} numberOfLines={2}>
                {a.title}
              </Text>
              <Text style={[styles.achievementDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {a.description}
              </Text>
              {a.unlocked && (
                <View style={[styles.unlockedBadge, { backgroundColor: colors.coin + "20" }]}>
                  <Text style={[styles.unlockedText, { color: colors.coin }]}>Unlocked</Text>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>

      {/* ── Safety disclaimer ────────────────────────────── */}
      <View style={[styles.disclaimer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Feather name="shield" size={13} color={colors.mutedForeground} />
        <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
          XP and LuckyCoin rewards have no cash value. Fanfolio is a simulated market for learning only.
        </Text>
      </View>
    </ScrollView>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "flex-start", gap: 12, paddingHorizontal: 16, marginBottom: 16 },
  backBtn: { padding: 4, marginTop: 3 },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },

  xpCard: {
    marginHorizontal: 16, borderRadius: 16, borderWidth: 1,
    padding: 16, marginBottom: 20, gap: 10,
  },
  xpTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  levelBadge: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  xpAmount: { fontSize: 24, fontFamily: "Inter_700Bold" },
  levelCircle: { width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  levelNum: { fontSize: 22, fontFamily: "Inter_700Bold" },
  xpFooter: { flexDirection: "row", justifyContent: "space-between" },
  xpLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  pillRow: { flexDirection: "row", flexWrap: "wrap", gap: 6, marginTop: 2 },
  pill: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  pillText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },

  section: { paddingHorizontal: 16, marginBottom: 20, gap: 8 },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  sectionTitle: { fontSize: 15, fontFamily: "Inter_700Bold", flex: 1 },
  sectionCount: { fontSize: 12, fontFamily: "Inter_400Regular" },

  achievementGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  achievementCard: {
    width: "47%", borderRadius: 14, borderWidth: 1,
    padding: 12, alignItems: "center", gap: 4,
  },
  achievementEmoji: { fontSize: 28 },
  achievementTitle: { fontSize: 12, fontFamily: "Inter_700Bold", textAlign: "center" },
  achievementDesc: { fontSize: 10, fontFamily: "Inter_400Regular", textAlign: "center", lineHeight: 14 },
  unlockedBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, marginTop: 2 },
  unlockedText: { fontSize: 9, fontFamily: "Inter_700Bold" },

  disclaimer: {
    marginHorizontal: 16, borderRadius: 12, borderWidth: 1,
    padding: 12, flexDirection: "row", alignItems: "flex-start", gap: 8,
  },
  disclaimerText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
});

const barStyles = StyleSheet.create({
  track: { borderRadius: 4, overflow: "hidden" },
  fill: { borderRadius: 4 },
});

const cardStyles = StyleSheet.create({
  card: {
    borderRadius: 14, borderWidth: 1,
    padding: 14, gap: 10, marginBottom: 2,
  },
  top: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  iconBox: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  titleRow: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" },
  title: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1 },
  desc: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17, marginTop: 2 },
  readyBadge: { flexDirection: "row", alignItems: "center", gap: 3, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 },
  readyText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  bottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  progressText: { fontSize: 11, fontFamily: "Inter_500Medium" },
  rewardRow: { flexDirection: "row", gap: 5 },
  rewardBadge: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 },
  rewardText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  tip: {
    fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 17,
    paddingTop: 8, borderTopWidth: 1,
  },
  claimBtn: {
    flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 7, borderRadius: 10, paddingVertical: 11,
  },
  claimBtnText: { fontSize: 13, fontFamily: "Inter_700Bold", color: "#0C0F14" },
});
