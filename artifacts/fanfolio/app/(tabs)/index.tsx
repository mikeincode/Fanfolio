import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame, AppliedEvent } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { MARKET_EVENTS } from "@/data/mockMarketEvents";
import { LESSONS, Lesson } from "@/data/mockLessons";
import { SparklineChart } from "@/components/SparklineChart";
import { CoinBadge } from "@/components/CoinBadge";

function timeAgo(ts: number): string {
  const secs = Math.floor((Date.now() - ts) / 1000);
  if (secs < 60) return "just now";
  if (secs < 3600) return `${Math.floor(secs / 60)}m ago`;
  if (secs < 86400) return `${Math.floor(secs / 3600)}h ago`;
  return `${Math.floor(secs / 86400)}d ago`;
}

/** Maps an event category to the most relevant lesson id. */
function lessonForCategory(category: string): string {
  switch (category) {
    case "Chaos":
    case "Knockout":
      return "what-is-volatility";
    case "Bubble":
    case "Rally":
      return "what-is-a-hype-bubble";
    case "Stability":
      return "what-is-an-index";
    case "Defense":
    case "Championship":
      return "what-is-diversification";
    case "Upset":
    case "Comeback":
    case "Breakout":
    default:
      return "buying-the-dip";
  }
}

/** Phrase describing the action chosen — shown inline after a button tap. */
const ACTION_EXPLANATIONS: Record<string, string> = {
  hold: "Hold means you keep your current position as-is. Traders may hold when they believe the move still has room to run, or when they don't want to react emotionally to short-term noise. Doing nothing is a valid strategy.",
  buy: "Buying more after a big move can increase your gains if the trend continues — but it can also mean chasing hype after the easy money is already made. Ask yourself: is this move driven by real performance or excitement?",
  trim: "Trimming means selling part of a position to lock in simulated gains or reduce your exposure. It's a risk management move. You keep some upside while taking some off the table.",
};

// ────────────────────────────────────────────────────────────
// Lesson mini-modal
// ────────────────────────────────────────────────────────────
function LessonModal({
  lesson,
  visible,
  onClose,
  colors,
}: {
  lesson: Lesson | null;
  visible: boolean;
  onClose: () => void;
  colors: ReturnType<typeof useColors>;
}) {
  if (!lesson) return null;
  const diffColor =
    lesson.difficulty === "Beginner"
      ? colors.green
      : lesson.difficulty === "Intermediate"
        ? colors.coin
        : colors.red;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[lsStyles.container, { backgroundColor: colors.background }]}>
        <View style={[lsStyles.nav, { borderBottomColor: colors.border }]}>
          <Pressable onPress={onClose} style={lsStyles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={[lsStyles.diffBadge, { backgroundColor: diffColor + "20" }]}>
            <Text style={[lsStyles.diffText, { color: diffColor }]}>{lesson.difficulty}</Text>
          </View>
        </View>

        <ScrollView contentContainerStyle={lsStyles.scroll} showsVerticalScrollIndicator={false}>
          <Text style={[lsStyles.readTime, { color: colors.mutedForeground }]}>{lesson.readTime} min read</Text>
          <Text style={[lsStyles.title, { color: colors.foreground }]}>{lesson.title}</Text>
          <Text style={[lsStyles.subtitle, { color: colors.primary }]}>{lesson.subtitle}</Text>

          <View style={[lsStyles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[lsStyles.sectionLabel, { color: colors.mutedForeground }]}>The Concept</Text>
            <Text style={[lsStyles.body, { color: colors.foreground }]}>{lesson.concept}</Text>
          </View>

          <View style={[lsStyles.section, { backgroundColor: colors.green + "12", borderColor: colors.green + "30" }]}>
            <View style={lsStyles.sectionRow}>
              <Feather name="zap" size={14} color={colors.green} />
              <Text style={[lsStyles.sectionLabel, { color: colors.green }]}>Sports Angle</Text>
            </View>
            <Text style={[lsStyles.body, { color: colors.foreground }]}>{lesson.sportsAngle}</Text>
          </View>

          <Text style={[lsStyles.keyLabel, { color: colors.foreground }]}>Key Takeaways</Text>
          {lesson.keyTakeaways.map((t, i) => (
            <View key={i} style={lsStyles.takeawayRow}>
              <View style={[lsStyles.bullet, { backgroundColor: colors.primary }]} />
              <Text style={[lsStyles.takeawayText, { color: colors.foreground }]}>{t}</Text>
            </View>
          ))}

          <Pressable
            onPress={onClose}
            style={[lsStyles.doneBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          >
            <Text style={[lsStyles.doneBtnText, { color: colors.primaryForeground }]}>Got it</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────
// Event Result Modal
// ────────────────────────────────────────────────────────────
function EventResultModal({
  visible,
  onClose,
  event,
  colors,
}: {
  visible: boolean;
  onClose: () => void;
  event: AppliedEvent | null;
  colors: ReturnType<typeof useColors>;
}) {
  if (!event) return null;
  const isPositive = event.biggestMove.changePercent >= 0;
  const moveColor = isPositive ? colors.green : colors.red;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[evtStyles.container, { backgroundColor: colors.background }]}>
        <View style={[evtStyles.header, { borderBottomColor: colors.border }]}>
          <Text style={[evtStyles.headerTitle, { color: colors.foreground }]}>Market Event Fired</Text>
          <Pressable onPress={onClose} hitSlop={12}>
            <Feather name="x" size={22} color={colors.foreground} />
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ padding: 24, gap: 16 }} showsVerticalScrollIndicator={false}>
          {/* Emoji + title — flex: 1 on the text column so long titles wrap instead of clipping */}
          <View style={evtStyles.emojiRow}>
            <Text style={evtStyles.emoji}>{event.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={[evtStyles.eventTitle, { color: colors.foreground }]}>{event.title}</Text>
              <View style={[evtStyles.categoryBadge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[evtStyles.categoryText, { color: colors.primary }]}>{event.category}</Text>
              </View>
            </View>
          </View>

          <Text style={[evtStyles.summary, { color: colors.foreground }]}>{event.summary}</Text>

          <View style={[evtStyles.bigMoveCard, { backgroundColor: moveColor + "12", borderColor: moveColor + "30" }]}>
            <Text style={[evtStyles.bigMoveLabel, { color: colors.mutedForeground }]}>Biggest Move</Text>
            <Text style={[evtStyles.bigMoveSymbol, { color: moveColor }]}>{event.biggestMove.symbol}</Text>
            <Text style={[evtStyles.bigMovePct, { color: moveColor }]}>
              {isPositive ? "+" : ""}{event.biggestMove.changePercent.toFixed(1)}%
            </Text>
          </View>

          <View style={[evtStyles.lessonCard, { backgroundColor: colors.blue + "10", borderColor: colors.blue + "30" }]}>
            <View style={evtStyles.lessonRow}>
              <Feather name="book-open" size={14} color={colors.blue} />
              <Text style={[evtStyles.lessonLabel, { color: colors.blue }]}>Market Lesson</Text>
            </View>
            <Text style={[evtStyles.lessonText, { color: colors.foreground }]}>{event.marketLesson}</Text>
          </View>

          <Pressable
            onPress={onClose}
            style={[evtStyles.doneBtn, { backgroundColor: colors.primary, borderRadius: colors.radius }]}
          >
            <Text style={[evtStyles.doneBtnText, { color: colors.primaryForeground }]}>Got it</Text>
          </Pressable>
        </ScrollView>
      </View>
    </Modal>
  );
}

// ────────────────────────────────────────────────────────────
// Market Decision Coach Card
// ────────────────────────────────────────────────────────────
interface AffectedHolding {
  assetId: string;
  symbol: string;
  name: string;
  quantity: number;
  impactPercent: number;
  impactLC: number;
}

interface AffectedWatchlistAsset {
  assetId: string;
  symbol: string;
  name: string;
  impactPercent: number;
  currentPrice: number;
}

function DecisionCoachCard({
  event,
  colors,
  onDismiss,
}: {
  event: AppliedEvent;
  colors: ReturnType<typeof useColors>;
  onDismiss: () => void;
}) {
  const { holdings, priceOverrides, watchlist } = useGame();
  const liveAssets = useLiveAssets();
  const [chosenAction, setChosenAction] = useState<"hold" | "buy" | "trim" | null>(null);
  const [lessonVisible, setLessonVisible] = useState(false);

  const marketEvent = useMemo(() => MARKET_EVENTS.find(e => e.id === event.eventId), [event.eventId]);
  const lessonId = lessonForCategory(event.category);
  const lesson = LESSONS.find(l => l.id === lessonId) ?? null;

  const affectedHoldings: AffectedHolding[] = useMemo(() => {
    if (!marketEvent) return [];
    const affected: AffectedHolding[] = [];
    for (const impact of marketEvent.impacts) {
      const holding = holdings.find(h => h.assetId === impact.assetId);
      if (!holding) continue;
      const override = priceOverrides[impact.assetId];
      const newPrice = override?.price ?? 0;
      const prevPrice = override?.previousPrice ?? newPrice;
      const impactLC = (newPrice - prevPrice) * holding.quantity;
      const asset = liveAssets.find(a => a.id === impact.assetId);
      affected.push({
        assetId: impact.assetId,
        symbol: impact.symbol,
        name: asset?.name ?? impact.symbol,
        quantity: holding.quantity,
        impactPercent: impact.impactPercent,
        impactLC,
      });
    }
    return affected.sort((a, b) => Math.abs(b.impactLC) - Math.abs(a.impactLC));
  }, [marketEvent, holdings, priceOverrides, liveAssets]);

  const affectedWatchlist: AffectedWatchlistAsset[] = useMemo(() => {
    if (!marketEvent) return [];
    const result: AffectedWatchlistAsset[] = [];
    for (const impact of marketEvent.impacts) {
      if (!watchlist.includes(impact.assetId)) continue;
      const alreadyHeld = holdings.some(h => h.assetId === impact.assetId);
      if (alreadyHeld) continue;
      const asset = liveAssets.find(a => a.id === impact.assetId);
      result.push({
        assetId: impact.assetId,
        symbol: impact.symbol,
        name: asset?.name ?? impact.symbol,
        impactPercent: impact.impactPercent,
        currentPrice: asset?.price ?? 0,
      });
    }
    return result.sort((a, b) => Math.abs(b.impactPercent) - Math.abs(a.impactPercent));
  }, [marketEvent, watchlist, holdings, liveAssets]);

  const totalImpactLC = affectedHoldings.reduce((s, h) => s + h.impactLC, 0);
  const impactIsPositive = totalImpactLC >= 0;
  const impactColor = impactIsPositive ? colors.green : colors.red;
  const biggestHolding = affectedHoldings[0];
  const hasHoldings = affectedHoldings.length > 0;
  const hasWatchlist = affectedWatchlist.length > 0;

  const handleAction = (action: "hold" | "buy" | "trim") => {
    Haptics.selectionAsync();
    if (chosenAction === action) {
      setChosenAction(null);
    } else {
      setChosenAction(action);
    }
  };

  const handleNavigateAsset = () => {
    if (!biggestHolding) return;
    router.push({ pathname: "/asset/[id]", params: { id: biggestHolding.assetId } });
  };

  return (
    <>
      <View style={[coachStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        {/* Header */}
        <View style={coachStyles.header}>
          <View style={coachStyles.headerLeft}>
            <View style={[coachStyles.icon, { backgroundColor: colors.coin + "20" }]}>
              <Feather name="compass" size={16} color={colors.coin} />
            </View>
            <View>
              <Text style={[coachStyles.title, { color: colors.foreground }]}>Market Decision Coach</Text>
              <Text style={[coachStyles.subtitle, { color: colors.mutedForeground }]} numberOfLines={1}>
                {event.emoji} {event.title}
              </Text>
            </View>
          </View>
          <Pressable onPress={onDismiss} hitSlop={12}>
            <Feather name="x" size={18} color={colors.mutedForeground} />
          </Pressable>
        </View>

        <View style={[coachStyles.divider, { backgroundColor: colors.border }]} />

        {!hasHoldings && !hasWatchlist ? (
          /* Nothing affected at all */
          <View style={[coachStyles.noHoldingsCard, { backgroundColor: colors.muted + "30", borderColor: colors.border }]}>
            <Feather name="info" size={16} color={colors.mutedForeground} />
            <Text style={[coachStyles.noHoldingsText, { color: colors.mutedForeground }]}>
              None of your current holdings or watched assets were directly affected. This is why diversification and a watchlist matter — tracking assets across multiple sectors means you are never fully left out when an area moves.
            </Text>
          </View>
        ) : (
          <>
            {/* Affected Holdings */}
            {hasHoldings && (
              <View style={coachStyles.section}>
                <Text style={[coachStyles.sectionLabel, { color: colors.mutedForeground }]}>AFFECTED HOLDINGS</Text>
                {affectedHoldings.map(h => {
                  const isUp = h.impactPercent >= 0;
                  const c = isUp ? colors.green : colors.red;
                  return (
                    <View key={h.assetId} style={coachStyles.holdingRow}>
                      <Text style={[coachStyles.holdingSymbol, { color: colors.foreground }]}>{h.symbol}</Text>
                      <Text style={[coachStyles.holdingQty, { color: colors.mutedForeground }]}>{h.quantity} shares</Text>
                      <View style={{ flex: 1 }} />
                      <View style={[coachStyles.changePill, { backgroundColor: c + "20" }]}>
                        <Text style={[coachStyles.changePillText, { color: c }]}>
                          {isUp ? "+" : ""}{h.impactPercent.toFixed(0)}%
                        </Text>
                      </View>
                      <Text style={[coachStyles.impactLC, { color: c }]}>
                        {h.impactLC >= 0 ? "+" : ""}{h.impactLC.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC
                      </Text>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Watchlist assets affected — show even when user owns none */}
            {hasWatchlist && (
              <View style={coachStyles.section}>
                <Text style={[coachStyles.sectionLabel, { color: colors.coin }]}>WATCHLIST MOVED</Text>
                {!hasHoldings && (
                  <View style={[coachStyles.watchlistNote, { backgroundColor: colors.coin + "10", borderColor: colors.coin + "25" }]}>
                    <Feather name="bookmark" size={13} color={colors.coin} />
                    <Text style={[coachStyles.watchlistNoteText, { color: colors.foreground }]}>
                      None of your holdings were affected, but assets on your watchlist moved. This is why tracking assets before trading helps — you learn how prices behave before spending LuckyCoin.
                    </Text>
                  </View>
                )}
                {affectedWatchlist.map(w => {
                  const isUp = w.impactPercent >= 0;
                  const c = isUp ? colors.green : colors.red;
                  return (
                    <Pressable
                      key={w.assetId}
                      onPress={() => router.push({ pathname: "/asset/[id]", params: { id: w.assetId } })}
                      style={coachStyles.holdingRow}
                    >
                      <Feather name="bookmark" size={11} color={colors.coin} />
                      <Text style={[coachStyles.holdingSymbol, { color: colors.foreground }]}>{w.symbol}</Text>
                      <Text style={[coachStyles.holdingQty, { color: colors.mutedForeground }]}>{w.currentPrice.toFixed(2)} LC</Text>
                      <View style={{ flex: 1 }} />
                      <View style={[coachStyles.changePill, { backgroundColor: c + "20" }]}>
                        <Text style={[coachStyles.changePillText, { color: c }]}>
                          {isUp ? "+" : ""}{w.impactPercent.toFixed(0)}%
                        </Text>
                      </View>
                      <Feather name="chevron-right" size={12} color={colors.mutedForeground} />
                    </Pressable>
                  );
                })}
              </View>
            )}

            {/* Portfolio Impact — only when holdings are affected */}
            {hasHoldings && (
              <View style={[coachStyles.impactBox, { backgroundColor: impactColor + "10", borderColor: impactColor + "30" }]}>
                <View style={coachStyles.impactRow}>
                  <Feather name={impactIsPositive ? "trending-up" : "trending-down"} size={14} color={impactColor} />
                  <Text style={[coachStyles.impactLabel, { color: colors.mutedForeground }]}>Portfolio Impact</Text>
                </View>
                <Text style={[coachStyles.impactValue, { color: impactColor }]}>
                  {impactIsPositive ? "+" : ""}{totalImpactLC.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC
                </Text>
                <Text style={[coachStyles.impactNote, { color: colors.mutedForeground }]}>
                  {impactIsPositive
                    ? "Your holdings gained value from this event. Simulated gains — no cash value."
                    : "Your holdings lost value from this event. Simulated loss — no cash value."}
                </Text>
              </View>
            )}

            {/* Market Lesson */}
            <View style={[coachStyles.lessonBox, { backgroundColor: colors.blue + "10", borderColor: colors.blue + "30" }]}>
              <View style={coachStyles.lessonRow}>
                <Feather name="book-open" size={13} color={colors.blue} />
                <Text style={[coachStyles.lessonLabel, { color: colors.blue }]}>What This Teaches</Text>
              </View>
              <Text style={[coachStyles.lessonText, { color: colors.foreground }]}>{event.marketLesson}</Text>
            </View>

            {/* Action Buttons — only shown when user has affected holdings */}
            {hasHoldings && (
              <View style={coachStyles.section}>
                <Text style={[coachStyles.sectionLabel, { color: colors.mutedForeground }]}>WHAT WOULD YOU DO?</Text>
                <View style={coachStyles.actionRow}>
                  <Pressable
                    onPress={() => handleAction("hold")}
                    style={[
                      coachStyles.actionBtn,
                      {
                        borderColor: chosenAction === "hold" ? colors.primary : colors.border,
                        backgroundColor: chosenAction === "hold" ? colors.primary + "15" : colors.background,
                      },
                    ]}
                  >
                    <Feather name="anchor" size={14} color={chosenAction === "hold" ? colors.primary : colors.mutedForeground} />
                    <Text style={[coachStyles.actionBtnText, { color: chosenAction === "hold" ? colors.primary : colors.foreground }]}>Hold</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleAction("buy")}
                    style={[
                      coachStyles.actionBtn,
                      {
                        borderColor: chosenAction === "buy" ? colors.green : colors.border,
                        backgroundColor: chosenAction === "buy" ? colors.green + "15" : colors.background,
                      },
                    ]}
                  >
                    <Feather name="plus-circle" size={14} color={chosenAction === "buy" ? colors.green : colors.mutedForeground} />
                    <Text style={[coachStyles.actionBtnText, { color: chosenAction === "buy" ? colors.green : colors.foreground }]}>Buy More</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => handleAction("trim")}
                    style={[
                      coachStyles.actionBtn,
                      {
                        borderColor: chosenAction === "trim" ? colors.red : colors.border,
                        backgroundColor: chosenAction === "trim" ? colors.red + "15" : colors.background,
                      },
                    ]}
                  >
                    <Feather name="scissors" size={14} color={chosenAction === "trim" ? colors.red : colors.mutedForeground} />
                    <Text style={[coachStyles.actionBtnText, { color: chosenAction === "trim" ? colors.red : colors.foreground }]}>Trim</Text>
                  </Pressable>

                  <Pressable
                    onPress={() => setLessonVisible(true)}
                    style={[coachStyles.actionBtn, { borderColor: colors.blue + "60", backgroundColor: colors.blue + "10" }]}
                  >
                    <Feather name="book" size={14} color={colors.blue} />
                    <Text style={[coachStyles.actionBtnText, { color: colors.blue }]}>Lesson</Text>
                  </Pressable>
                </View>

                {/* Inline explanation when an action is chosen */}
                {chosenAction && (
                  <View style={[coachStyles.explainBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
                    <Text style={[coachStyles.explainText, { color: colors.foreground }]}>
                      {ACTION_EXPLANATIONS[chosenAction]}
                    </Text>
                    {(chosenAction === "buy" || chosenAction === "trim") && biggestHolding && (
                      <Pressable
                        onPress={handleNavigateAsset}
                        style={[coachStyles.goToAssetBtn, { backgroundColor: chosenAction === "buy" ? colors.green : colors.red, borderRadius: colors.radius - 4 }]}
                      >
                        <Text style={[coachStyles.goToAssetText, { color: chosenAction === "buy" ? "#0C0F14" : "#fff" }]}>
                          Go to {biggestHolding.symbol} →
                        </Text>
                      </Pressable>
                    )}
                  </View>
                )}
              </View>
            )}
          </>
        )}
      </View>

      <LessonModal
        lesson={lesson}
        visible={lessonVisible}
        onClose={() => setLessonVisible(false)}
        colors={colors}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Home Screen
// ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { luckyCoinBalance, holdings, username, canClaimDaily, claimDaily, transactions, applyMarketEvent, latestEvent, appliedEvents, watchlist } = useGame();
  const liveAssets = useLiveAssets();
  const [simulating, setSimulating] = useState(false);
  const [showEventModal, setShowEventModal] = useState(false);
  const [coachDismissedId, setCoachDismissedId] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const portfolioValue = holdings.reduce((sum, h) => {
    const asset = liveAssets.find(a => a.id === h.assetId);
    return sum + (asset ? asset.price * h.quantity : 0);
  }, 0);
  const totalValue = luckyCoinBalance + portfolioValue;

  const topMovers = useMemo(() =>
    [...liveAssets]
      .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent))
      .slice(0, 5),
    [liveAssets]
  );

  const watchlistMovers = useMemo(() =>
    [...liveAssets]
      .filter(a => watchlist.includes(a.id))
      .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent))
      .slice(0, 5),
    [liveAssets, watchlist]
  );

  const showCoachCard =
    showCoach &&
    !!latestEvent &&
    latestEvent.eventId !== coachDismissedId;

  const handleClaim = () => {
    const result = claimDaily();
    Haptics.notificationAsync(result.success ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    Alert.alert(result.success ? "Daily Claim!" : "Already Claimed", result.message);
  };

  const handleSimulateEvent = () => {
    setSimulating(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setTimeout(() => {
      const result = applyMarketEvent();
      setSimulating(false);
      if (result.success) {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setShowCoach(false);
        setShowEventModal(true);
      }
    }, 600);
  };

  const handleEventModalClose = () => {
    setShowEventModal(false);
    setShowCoach(true);
  };

  const recentTx = transactions.slice(0, 3);
  const recentEvents = appliedEvents.slice(0, 5);

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 90 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ────────────────────────────────────── */}
        <View style={styles.header}>
          <View>
            <Text style={[styles.greeting, { color: colors.mutedForeground }]}>Hey, {username}</Text>
            <Text style={[styles.subGreeting, { color: colors.foreground }]}>Your Dashboard</Text>
          </View>
          <Pressable
            onPress={() => router.push("/profile")}
            style={[styles.avatar, { backgroundColor: colors.primary }]}
          >
            <Text style={[styles.avatarText, { color: colors.primaryForeground }]}>
              {username.charAt(0).toUpperCase()}
            </Text>
          </Pressable>
        </View>

        {/* ── Portfolio Card ───────────────────────────── */}
        <View style={[styles.portfolioCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.portfolioLabel, { color: colors.mutedForeground }]}>Total Value</Text>
          <Text style={[styles.portfolioValue, { color: colors.foreground }]}>
            {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text style={[styles.lcLabel, { color: colors.mutedForeground }]}>LuckyCoin</Text>
          <View style={[styles.divider, { backgroundColor: colors.border }]} />
          <View style={styles.statsRow}>
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Portfolio</Text>
              <CoinBadge amount={portfolioValue} size="md" showLabel={false} />
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Available</Text>
              <CoinBadge amount={luckyCoinBalance} size="md" showLabel={false} />
            </View>
            <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
            <View style={styles.stat}>
              <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Holdings</Text>
              <Text style={[styles.statValue, { color: colors.foreground }]}>{holdings.length}</Text>
            </View>
          </View>
        </View>

        {/* ── Daily Claim ──────────────────────────────── */}
        <Pressable
          onPress={handleClaim}
          disabled={!canClaimDaily}
          style={({ pressed }) => [
            styles.claimCard,
            {
              backgroundColor: canClaimDaily ? colors.coin + "18" : colors.card,
              borderColor: canClaimDaily ? colors.coin + "60" : colors.border,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <View style={styles.claimLeft}>
            <View style={[styles.claimIcon, { backgroundColor: canClaimDaily ? colors.coin + "30" : colors.muted }]}>
              <Feather name="gift" size={20} color={canClaimDaily ? colors.coin : colors.mutedForeground} />
            </View>
            <View>
              <Text style={[styles.claimTitle, { color: canClaimDaily ? colors.coin : colors.mutedForeground }]}>
                {canClaimDaily ? "Daily Claim Available!" : "Daily Claim"}
              </Text>
              <Text style={[styles.claimSub, { color: colors.mutedForeground }]}>
                {canClaimDaily ? "+1,000 LuckyCoin free" : "Come back tomorrow"}
              </Text>
            </View>
          </View>
          {canClaimDaily && (
            <View style={[styles.claimBtn, { backgroundColor: colors.coin }]}>
              <Text style={[styles.claimBtnText, { color: "#0C0F14" }]}>Claim</Text>
            </View>
          )}
        </Pressable>

        {/* ── Market Pulse ─────────────────────────────── */}
        <View style={[styles.pulseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={styles.pulseHeader}>
            <View style={styles.pulseLeft}>
              <View style={[styles.pulseDot, { backgroundColor: colors.green }]} />
              <Text style={[styles.pulseTitle, { color: colors.foreground }]}>Market Pulse</Text>
            </View>
            <Text style={[styles.pulseCount, { color: colors.mutedForeground }]}>
              {appliedEvents.length} event{appliedEvents.length !== 1 ? "s" : ""} simulated
            </Text>
          </View>

          {latestEvent ? (
            <View style={styles.pulseEventBody}>
              <View style={styles.pulseEventRow}>
                <Text style={styles.pulseEmoji}>{latestEvent.emoji}</Text>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.pulseEventTitle, { color: colors.foreground }]}>{latestEvent.title}</Text>
                  <Text style={[styles.pulseEventSport, { color: colors.mutedForeground }]}>
                    {latestEvent.sport} · {timeAgo(latestEvent.appliedAt)}
                  </Text>
                </View>
                <View style={[
                  styles.moveBadge,
                  { backgroundColor: (latestEvent.biggestMove.changePercent >= 0 ? colors.green : colors.red) + "20" },
                ]}>
                  <Text style={[styles.moveBadgeText, { color: latestEvent.biggestMove.changePercent >= 0 ? colors.green : colors.red }]}>
                    {latestEvent.biggestMove.symbol} {latestEvent.biggestMove.changePercent >= 0 ? "+" : ""}{latestEvent.biggestMove.changePercent.toFixed(0)}%
                  </Text>
                </View>
              </View>
              <Text style={[styles.pulseSummary, { color: colors.mutedForeground }]} numberOfLines={2}>
                {latestEvent.summary}
              </Text>
            </View>
          ) : (
            <View style={styles.pulseEmptyRow}>
              <Feather name="activity" size={18} color={colors.mutedForeground} />
              <Text style={[styles.pulseEmptyText, { color: colors.mutedForeground }]}>
                No events yet — simulate your first market event below
              </Text>
            </View>
          )}

          <Pressable
            onPress={handleSimulateEvent}
            disabled={simulating}
            style={({ pressed }) => [
              styles.simulateBtn,
              {
                backgroundColor: simulating ? colors.muted : colors.primary,
                borderRadius: colors.radius - 2,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            {simulating ? (
              <>
                <ActivityIndicator size="small" color={colors.mutedForeground} />
                <Text style={[styles.simulateBtnText, { color: colors.mutedForeground }]}>Simulating...</Text>
              </>
            ) : (
              <>
                <Feather name="zap" size={16} color={colors.primaryForeground} />
                <Text style={[styles.simulateBtnText, { color: colors.primaryForeground }]}>Simulate Market Event</Text>
              </>
            )}
          </Pressable>
        </View>

        {/* ── Market Decision Coach ─────────────────────── */}
        {showCoachCard && latestEvent && (
          <View style={styles.coachWrapper}>
            <DecisionCoachCard
              event={latestEvent}
              colors={colors}
              onDismiss={() => setCoachDismissedId(latestEvent.eventId)}
            />
          </View>
        )}

        {/* ── Watchlist Movers ──────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.watchlistSectionLeft}>
              <Feather name="bookmark" size={15} color={colors.coin} />
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Watchlist</Text>
            </View>
            <Pressable onPress={() => router.push("/(tabs)/market")}>
              <Text style={[styles.seeAll, { color: colors.coin }]}>Manage</Text>
            </Pressable>
          </View>

          {watchlistMovers.length === 0 ? (
            <View style={[styles.watchlistEmpty, { backgroundColor: colors.coin + "10", borderColor: colors.coin + "25" }]}>
              <Feather name="bookmark" size={28} color={colors.coin} />
              <Text style={[styles.watchlistEmptyTitle, { color: colors.foreground }]}>
                Watch assets before you trade
              </Text>
              <Text style={[styles.watchlistEmptyText, { color: colors.mutedForeground }]}>
                Following an asset helps you learn how prices move before spending LuckyCoin. Like scouting a player before drafting them.
              </Text>
              <Pressable
                onPress={() => router.push("/(tabs)/market")}
                style={[styles.watchlistEmptyBtn, { backgroundColor: colors.coin }]}
              >
                <Text style={[styles.watchlistEmptyBtnText, { color: "#0C0F14" }]}>Browse Market</Text>
              </Pressable>
            </View>
          ) : (
            watchlistMovers.map(asset => {
              const isUp = asset.dailyChangePercent >= 0;
              const changeColor = isUp ? colors.green : colors.red;
              return (
                <Pressable
                  key={asset.id}
                  onPress={() => router.push({ pathname: "/asset/[id]", params: { id: asset.id } })}
                  style={({ pressed }) => [
                    styles.moverCard,
                    { backgroundColor: colors.card, borderColor: colors.coin + "30", opacity: pressed ? 0.85 : 1 },
                  ]}
                >
                  <View style={styles.moverLeft}>
                    <View style={styles.watchlistMoverSymbolRow}>
                      <Text style={[styles.moverSymbol, { color: colors.foreground }]}>{asset.symbol}</Text>
                      <Feather name="bookmark" size={10} color={colors.coin} />
                    </View>
                    <Text style={[styles.moverName, { color: colors.mutedForeground }]} numberOfLines={1}>{asset.name}</Text>
                  </View>
                  <SparklineChart data={asset.chartData} width={60} height={24} positive={isUp} />
                  <View style={styles.moverRight}>
                    <Text style={[styles.moverPrice, { color: colors.foreground }]}>
                      {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Text>
                    <View style={[styles.changeBadge, { backgroundColor: changeColor + "20" }]}>
                      <Text style={[styles.changeText, { color: changeColor }]}>
                        {isUp ? "+" : ""}{asset.dailyChangePercent.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                </Pressable>
              );
            })
          )}
        </View>

        {/* ── Top Movers ───────────────────────────────── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Top Movers</Text>
            <Pressable onPress={() => router.push("/(tabs)/market")}>
              <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
            </Pressable>
          </View>
          {topMovers.map(asset => {
            const isUp = asset.dailyChangePercent >= 0;
            const changeColor = isUp ? colors.green : colors.red;
            return (
              <Pressable
                key={asset.id}
                onPress={() => router.push({ pathname: "/asset/[id]", params: { id: asset.id } })}
                style={({ pressed }) => [
                  styles.moverCard,
                  { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                ]}
              >
                <View style={styles.moverLeft}>
                  <Text style={[styles.moverSymbol, { color: colors.foreground }]}>{asset.symbol}</Text>
                  <Text style={[styles.moverName, { color: colors.mutedForeground }]} numberOfLines={1}>{asset.name}</Text>
                </View>
                <SparklineChart data={asset.chartData} width={60} height={24} positive={isUp} />
                <View style={styles.moverRight}>
                  <Text style={[styles.moverPrice, { color: colors.foreground }]}>
                    {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                  <View style={[styles.changeBadge, { backgroundColor: changeColor + "20" }]}>
                    <Text style={[styles.changeText, { color: changeColor }]}>
                      {isUp ? "+" : ""}{asset.dailyChangePercent.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </Pressable>
            );
          })}
        </View>

        {/* ── Event History ─────────────────────────────── */}
        {recentEvents.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Event History</Text>
            {recentEvents.map((ev, i) => {
              const isPos = ev.biggestMove.changePercent >= 0;
              const mc = isPos ? colors.green : colors.red;
              return (
                <View
                  key={ev.eventId + i}
                  style={[styles.historyCard, { backgroundColor: colors.card, borderColor: colors.border }]}
                >
                  <Text style={styles.historyEmoji}>{ev.emoji}</Text>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.historyTitle, { color: colors.foreground }]}>{ev.title}</Text>
                    <Text style={[styles.historySport, { color: colors.mutedForeground }]}>
                      {ev.sport} · {timeAgo(ev.appliedAt)}
                    </Text>
                  </View>
                  <View style={[styles.historyBadge, { backgroundColor: mc + "20" }]}>
                    <Text style={[styles.historyBadgeText, { color: mc }]}>
                      {ev.biggestMove.symbol} {isPos ? "+" : ""}{ev.biggestMove.changePercent.toFixed(0)}%
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {/* ── Recent Trades ──────────────────────────────── */}
        {recentTx.length > 0 && (
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Trades</Text>
            {recentTx.map(tx => {
              const isBuy = tx.type === "buy";
              return (
                <View key={tx.id} style={[styles.txCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
                  <View style={[styles.txIcon, { backgroundColor: (isBuy ? colors.green : colors.primary) + "20" }]}>
                    <Feather
                      name={isBuy ? "arrow-down-left" : "arrow-up-right"}
                      size={16}
                      color={isBuy ? colors.green : colors.primary}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={[styles.txTitle, { color: colors.foreground }]}>
                      {isBuy ? "Bought" : "Sold"} {tx.assetSymbol}
                    </Text>
                    <Text style={[styles.txSub, { color: colors.mutedForeground }]}>
                      {tx.quantity} share{tx.quantity !== 1 ? "s" : ""} @ {tx.price.toLocaleString(undefined, { maximumFractionDigits: 2 })} LC
                    </Text>
                  </View>
                  <View style={styles.txRight}>
                    <Text style={[styles.txAmountLabel, { color: colors.mutedForeground }]}>
                      {isBuy ? "Spent" : "Received"}
                    </Text>
                    <Text style={[styles.txAmount, { color: colors.foreground }]}>
                      {tx.total.toLocaleString(undefined, { maximumFractionDigits: 0 })} LC
                    </Text>
                  </View>
                </View>
              );
            })}
          </View>
        )}

        {holdings.length === 0 && (
          <Pressable
            onPress={() => router.push("/(tabs)/market")}
            style={({ pressed }) => [
              styles.ctaCard,
              { backgroundColor: colors.primary + "15", borderColor: colors.primary + "40", opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="trending-up" size={24} color={colors.primary} />
            <Text style={[styles.ctaTitle, { color: colors.primary }]}>Start your first trade</Text>
            <Text style={[styles.ctaSub, { color: colors.mutedForeground }]}>Browse the market and buy your first asset</Text>
            <Feather name="arrow-right" size={18} color={colors.primary} />
          </Pressable>
        )}
      </ScrollView>

      <EventResultModal
        visible={showEventModal}
        onClose={handleEventModalClose}
        event={latestEvent}
        colors={colors}
      />
    </>
  );
}

// ────────────────────────────────────────────────────────────
// Styles
// ────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, marginBottom: 20 },
  greeting: { fontSize: 13, fontFamily: "Inter_400Regular" },
  subGreeting: { fontSize: 22, fontFamily: "Inter_700Bold" },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center" },
  avatarText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  portfolioCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 20, marginBottom: 12 },
  portfolioLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  portfolioValue: { fontSize: 42, fontFamily: "Inter_700Bold", lineHeight: 50 },
  lcLabel: { fontSize: 12, fontFamily: "Inter_500Medium", marginTop: -4 },
  divider: { height: 1, marginVertical: 16 },
  statsRow: { flexDirection: "row", alignItems: "center" },
  stat: { flex: 1, alignItems: "center", gap: 4 },
  statLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  statValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  statDivider: { width: 1, height: 32 },
  claimCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 16 },
  claimLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  claimIcon: { width: 40, height: 40, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  claimTitle: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  claimSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  claimBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  claimBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  // Market Pulse
  pulseCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16, gap: 14 },
  pulseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pulseLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  pulseTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  pulseCount: { fontSize: 11, fontFamily: "Inter_400Regular" },
  pulseEventBody: { gap: 8 },
  pulseEventRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  pulseEmoji: { fontSize: 28 },
  pulseEventTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  pulseEventSport: { fontSize: 11, fontFamily: "Inter_400Regular" },
  moveBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  moveBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  pulseSummary: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  pulseEmptyRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingVertical: 4 },
  pulseEmptyText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  simulateBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 44 },
  simulateBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  // Coach wrapper
  coachWrapper: { marginHorizontal: 20, marginBottom: 16 },
  // Sections
  section: { paddingHorizontal: 20, marginBottom: 24 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  seeAll: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  // Movers
  moverCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  moverLeft: { flex: 1 },
  moverSymbol: { fontSize: 14, fontFamily: "Inter_700Bold" },
  moverName: { fontSize: 11, fontFamily: "Inter_400Regular" },
  moverRight: { alignItems: "flex-end", gap: 2, marginLeft: 12 },
  moverPrice: { fontSize: 14, fontFamily: "Inter_700Bold" },
  changeBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  changeText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  // Event history
  historyCard: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  historyEmoji: { fontSize: 22 },
  historyTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  historySport: { fontSize: 11, fontFamily: "Inter_400Regular" },
  historyBadge: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 },
  historyBadgeText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  // Trades — new layout
  txCard: { flexDirection: "row", alignItems: "center", gap: 12, padding: 12, borderRadius: 12, borderWidth: 1, marginBottom: 8 },
  txIcon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  txTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  txSub: { fontSize: 11, fontFamily: "Inter_400Regular" },
  txRight: { alignItems: "flex-end" },
  txAmountLabel: { fontSize: 10, fontFamily: "Inter_400Regular" },
  txAmount: { fontSize: 13, fontFamily: "Inter_700Bold" },
  // CTA
  ctaCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 20, gap: 6, alignItems: "center", marginBottom: 12 },
  ctaTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  ctaSub: { fontSize: 13, fontFamily: "Inter_400Regular", textAlign: "center" },
  // Watchlist section
  watchlistSectionLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  watchlistEmpty: { borderRadius: 14, borderWidth: 1, padding: 20, gap: 8, alignItems: "center" },
  watchlistEmptyTitle: { fontSize: 15, fontFamily: "Inter_700Bold", textAlign: "center" },
  watchlistEmptyText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20, textAlign: "center" },
  watchlistEmptyBtn: { marginTop: 4, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 10 },
  watchlistEmptyBtnText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  watchlistMoverSymbolRow: { flexDirection: "row", alignItems: "center", gap: 5 },
});

// ── Event Modal Styles ──────────────────────────────────────
const evtStyles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 24, paddingBottom: 16, borderBottomWidth: 1 },
  headerTitle: { fontSize: 18, fontFamily: "Inter_700Bold" },
  // Title column gets flex:1 so long event names wrap instead of clipping
  emojiRow: { flexDirection: "row", alignItems: "flex-start", gap: 14 },
  emoji: { fontSize: 48, lineHeight: 56 },
  eventTitle: { fontSize: 20, fontFamily: "Inter_700Bold", marginBottom: 6, flexShrink: 1 },
  categoryBadge: { alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 3, borderRadius: 6 },
  categoryText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  summary: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 23 },
  bigMoveCard: { borderRadius: 12, borderWidth: 1, padding: 16, alignItems: "center", gap: 2 },
  bigMoveLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  bigMoveSymbol: { fontSize: 24, fontFamily: "Inter_700Bold" },
  bigMovePct: { fontSize: 28, fontFamily: "Inter_700Bold" },
  lessonCard: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 8 },
  lessonRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  lessonLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  lessonText: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  doneBtn: { height: 52, alignItems: "center", justifyContent: "center", marginTop: 8 },
  doneBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});

// ── Coach Card Styles ───────────────────────────────────────
const coachStyles = StyleSheet.create({
  card: { borderRadius: 16, borderWidth: 1, padding: 16, gap: 14 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  headerLeft: { flexDirection: "row", alignItems: "center", gap: 10, flex: 1 },
  icon: { width: 34, height: 34, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 11, fontFamily: "Inter_400Regular" },
  divider: { height: 1 },
  section: { gap: 8 },
  sectionLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase" },
  holdingRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  holdingSymbol: { fontSize: 13, fontFamily: "Inter_700Bold", width: 52 },
  holdingQty: { fontSize: 11, fontFamily: "Inter_400Regular" },
  changePill: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  changePillText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  impactLC: { fontSize: 12, fontFamily: "Inter_600SemiBold", minWidth: 70, textAlign: "right" },
  impactBox: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 4 },
  impactRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  impactLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  impactValue: { fontSize: 24, fontFamily: "Inter_700Bold" },
  impactNote: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17 },
  lessonBox: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 6 },
  lessonRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  lessonLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.8, textTransform: "uppercase" },
  lessonText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  actionRow: { flexDirection: "row", gap: 6 },
  actionBtn: { flex: 1, alignItems: "center", justifyContent: "center", paddingVertical: 10, borderRadius: 10, borderWidth: 1.5, gap: 4 },
  actionBtnText: { fontSize: 11, fontFamily: "Inter_600SemiBold" },
  explainBox: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 10 },
  explainText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  goToAssetBtn: { paddingHorizontal: 14, paddingVertical: 9, alignSelf: "flex-start" },
  goToAssetText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  watchlistNote: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 10, borderWidth: 1, padding: 12 },
  watchlistNoteText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  noHoldingsCard: { borderRadius: 12, borderWidth: 1, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  noHoldingsText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});

// ── Lesson Modal Styles ─────────────────────────────────────
const lsStyles = StyleSheet.create({
  container: { flex: 1 },
  nav: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingTop: 56, paddingBottom: 16, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  diffText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  scroll: { padding: 24, paddingBottom: 60, gap: 16 },
  readTime: { fontSize: 12, fontFamily: "Inter_400Regular" },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", lineHeight: 34 },
  subtitle: { fontSize: 15, fontFamily: "Inter_400Regular" },
  section: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 8 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  body: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  keyLabel: { fontSize: 17, fontFamily: "Inter_700Bold" },
  takeawayRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 8 },
  takeawayText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  doneBtn: { height: 52, alignItems: "center", justifyContent: "center" },
  doneBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
