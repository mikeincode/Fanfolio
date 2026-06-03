import React from "react";
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
import { useUserPreferences } from "@/lib/userPreferences";

interface Step {
  num: number;
  emoji: string;
  title: string;
  what: string;
  why: string;
  actionLabel: string;
  onAction: () => void;
}

export default function RookiePlaybookScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const {
    challengeFlags,
    watchlist,
    transactions,
    holdings,
    appliedEvents,
    lessonsOpened,
    lastDailyClaim,
  } = useGame();
  const { prefs } = useUserPreferences();

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const steps: Step[] = [
    {
      num: 1,
      emoji: "🪙",
      title: "Claim Your LuckyCoin",
      what: "Tap the Daily Claim card on Home to collect free LuckyCoin — your simulated learning currency.",
      why: "LuckyCoin has no cash value. It's the chip you practice with. Think of it like practice credits at a sports training camp.",
      actionLabel: "Go to Home",
      onAction: () => { router.back(); },
    },
    {
      num: 2,
      emoji: "🔭",
      title: "Scout the Market",
      what: "Open the Market or Scanner tab and add an asset to your Watchlist by tapping the bookmark icon on any asset.",
      why: "In real investing, watching before buying helps you learn an asset's rhythm. Scouts observe before they commit.",
      actionLabel: "Go to Market",
      onAction: () => { router.push("/(tabs)/market"); },
    },
    {
      num: 3,
      emoji: "💰",
      title: "Buy a Small Position",
      what: "Open any asset and tap Buy. Start small — try 1–5 units to keep your risk low while you learn.",
      why: "Your first trade is about learning the mechanics, not chasing big gains. Every pro started with a small first buy.",
      actionLabel: "Go to Market",
      onAction: () => { router.push("/(tabs)/market"); },
    },
    {
      num: 4,
      emoji: "⚡",
      title: "React to a Market Pulse",
      what: "On the Home screen, find the Today's Market Pulse card and tap Review Pulse. Fanfolio prepares a daily market storyline for you — see how a sports news story moves prices across your assets.",
      why: "Markets move when something real happens. Understanding why prices change is the most important skill you can build here.",
      actionLabel: "Go to Home",
      onAction: () => { router.back(); },
    },
    {
      num: 5,
      emoji: "📊",
      title: "Review Your Portfolio",
      what: "Open the Portfolio tab to see your holdings, profit/loss, and diversification score.",
      why: "Checking your portfolio regularly — not obsessively — is a healthy habit. Know what you own and why.",
      actionLabel: "Go to Portfolio",
      onAction: () => { router.push("/(tabs)/portfolio"); },
    },
    {
      num: 6,
      emoji: "📈",
      title: "Open Performance History",
      what: "Tap Performance History in the Portfolio tab. It shows how your total value has changed over time as a chart.",
      why: "Seeing your performance over time teaches you that short-term noise is normal. Zoom out to see the real story.",
      actionLabel: "Go to Portfolio",
      onAction: () => { router.push("/(tabs)/portfolio"); },
    },
    {
      num: 7,
      emoji: "📚",
      title: "Complete One Lesson",
      what: "Open the Learn tab and read any lesson. They take 1–3 minutes and cover key market concepts through a sports lens.",
      why: "Understanding why markets move is more valuable than any single trade. Knowledge compounds just like returns do.",
      actionLabel: "Go to Learn",
      onAction: () => { router.push("/(tabs)/learn"); },
    },
  ];

  function isDone(step: Step): boolean {
    switch (step.num) {
      case 1: return lastDailyClaim !== null;
      case 2: return watchlist.length > 0;
      case 3: return transactions.some(t => t.type === "buy") || holdings.length > 0;
      case 4: return appliedEvents.length > 0;
      case 5: return challengeFlags.includes("hasViewedPortfolio");
      case 6: return challengeFlags.includes("hasViewedPerformance");
      case 7: return lessonsOpened > 0;
      default: return false;
    }
  }

  const completedCount = steps.filter(isDone).length;
  const allDone = completedCount === steps.length;

  return (
    <ScrollView
      style={[s.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 40 }}
      showsVerticalScrollIndicator={false}
    >
      {/* Header */}
      <View style={s.header}>
        <Pressable onPress={() => router.back()} style={s.backBtn} hitSlop={12}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={{ flex: 1 }}>
          <Text style={[s.title, { color: colors.foreground }]}>Rookie Playbook</Text>
          <Text style={[s.subtitle, { color: colors.mutedForeground }]}>
            Your beginner guide to Fanfolio
          </Text>
        </View>
      </View>

      {/* Progress */}
      <View style={[s.progressCard, { backgroundColor: allDone ? colors.green + "12" : colors.card, borderColor: allDone ? colors.green + "40" : colors.border }]}>
        <View style={s.progressTop}>
          <Text style={{ fontSize: 24 }}>{allDone ? "🏆" : "🏈"}</Text>
          <View style={{ flex: 1 }}>
            <Text style={[s.progressTitle, { color: allDone ? colors.green : colors.foreground }]}>
              {allDone ? "Rookie Playbook Complete!" : `${completedCount} of ${steps.length} steps done`}
            </Text>
            <Text style={[s.progressSub, { color: colors.mutedForeground }]}>
              {allDone
                ? "You know the basics. Keep trading and learning!"
                : "Work through these steps to learn how Fanfolio works."}
            </Text>
          </View>
        </View>
        <View style={[s.track, { backgroundColor: colors.border }]}>
          <View
            style={[
              s.fill,
              {
                backgroundColor: allDone ? colors.green : colors.primary,
                width: `${(completedCount / steps.length) * 100}%` as any,
              },
            ]}
          />
        </View>
      </View>

      {/* Safety blurb */}
      {prefs.educationalTipsEnabled && (
        <View style={[s.safetyCard, { backgroundColor: colors.blue + "0E", borderColor: colors.blue + "25" }]}>
          <View style={s.safetyRow}>
            <Feather name="shield" size={13} color={colors.blue} />
            <Text style={[s.safetyLabel, { color: colors.blue }]}>Learning Environment</Text>
          </View>
          <Text style={[s.safetyText, { color: colors.foreground }]}>
            LuckyCoin is a simulated learning currency with no real-world cash value. No real money is ever involved — no deposits, no withdrawals, no prizes.
          </Text>
        </View>
      )}

      {/* Steps */}
      {steps.map((step) => {
        const done = isDone(step);
        return (
          <View
            key={step.num}
            style={[
              s.stepCard,
              {
                backgroundColor: done ? colors.card : colors.card,
                borderColor: done ? colors.green + "30" : colors.border,
                opacity: done ? 0.75 : 1,
              },
            ]}
          >
            {/* Step header */}
            <View style={s.stepHeader}>
              <View style={[s.stepNumBadge, { backgroundColor: done ? colors.green + "20" : colors.primary + "15" }]}>
                {done ? (
                  <Feather name="check" size={14} color={colors.green} />
                ) : (
                  <Text style={[s.stepNum, { color: colors.primary }]}>{step.num}</Text>
                )}
              </View>
              <View style={{ flex: 1 }}>
                <View style={s.stepTitleRow}>
                  <Text style={{ fontSize: 16 }}>{step.emoji}</Text>
                  <Text style={[s.stepTitle, { color: done ? colors.mutedForeground : colors.foreground }]}>
                    {step.title}
                  </Text>
                </View>
                {done && (
                  <Text style={[s.doneLabel, { color: colors.green }]}>Completed</Text>
                )}
              </View>
            </View>

            {/* Body — always show even if done */}
            <Text style={[s.stepWhat, { color: colors.foreground }]}>{step.what}</Text>

            {prefs.educationalTipsEnabled && !done && (
              <View style={[s.whyBox, { backgroundColor: colors.primary + "08", borderColor: colors.primary + "20" }]}>
                <View style={s.whyRow}>
                  <Feather name="zap" size={11} color={colors.primary} />
                  <Text style={[s.whyLabel, { color: colors.primary }]}>Coach says</Text>
                </View>
                <Text style={[s.whyText, { color: colors.foreground }]}>{step.why}</Text>
              </View>
            )}

            {!done && (
              <Pressable
                onPress={step.onAction}
                style={({ pressed }) => [
                  s.goBtn,
                  { backgroundColor: colors.primary, opacity: pressed ? 0.85 : 1, borderRadius: colors.radius },
                ]}
              >
                <Text style={[s.goBtnText, { color: colors.primaryForeground }]}>{step.actionLabel}</Text>
                <Feather name="arrow-right" size={14} color={colors.primaryForeground} />
              </Pressable>
            )}
          </View>
        );
      })}

      {/* Footer note */}
      <View style={[s.footerCard, { backgroundColor: colors.muted, borderColor: colors.border }]}>
        <Feather name="info" size={13} color={colors.mutedForeground} />
        <Text style={[s.footerText, { color: colors.mutedForeground }]}>
          Fanfolio prepares a daily Market Pulse storyline for you. In a future release, these pulses will draw from real sports news as it breaks — injuries, signings, championships, and more.
        </Text>
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, marginBottom: 20 },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 22, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 13, fontFamily: "Inter_400Regular", marginTop: 2 },
  progressCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, marginBottom: 16 },
  progressTop: { flexDirection: "row", alignItems: "center", gap: 12 },
  progressTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  progressSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  track: { height: 6, borderRadius: 3, overflow: "hidden" },
  fill: { height: 6, borderRadius: 3 },
  safetyCard: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, padding: 12, gap: 6, marginBottom: 16 },
  safetyRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  safetyLabel: { fontSize: 11, fontFamily: "Inter_700Bold" },
  safetyText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  stepCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 16, gap: 12, marginBottom: 12 },
  stepHeader: { flexDirection: "row", alignItems: "flex-start", gap: 12 },
  stepNumBadge: { width: 28, height: 28, borderRadius: 8, alignItems: "center", justifyContent: "center", marginTop: 1 },
  stepNum: { fontSize: 13, fontFamily: "Inter_700Bold" },
  stepTitleRow: { flexDirection: "row", alignItems: "center", gap: 7 },
  stepTitle: { fontSize: 15, fontFamily: "Inter_700Bold", flex: 1, flexShrink: 1 },
  doneLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  stepWhat: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  whyBox: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 4 },
  whyRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  whyLabel: { fontSize: 11, fontFamily: "Inter_700Bold" },
  whyText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  goBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, paddingVertical: 11, paddingHorizontal: 18 },
  goBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  footerCard: { marginHorizontal: 20, borderRadius: 12, borderWidth: 1, padding: 12, flexDirection: "row", gap: 8, alignItems: "flex-start", marginTop: 4 },
  footerText: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18, flex: 1 },
});
