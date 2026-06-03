import React, { useState, useMemo, useCallback, useEffect } from "react";
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
import { router, useFocusEffect } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame, AppliedEvent, PortfolioSnapshot } from "@/context/GameContext";
import { useLiveAssets } from "@/hooks/useLiveAssets";
import { useChallenges } from "@/hooks/useChallenges";
import { useTraderIdentity } from "@/hooks/useTraderIdentity";
import { MARKET_EVENTS } from "@/data/mockMarketEvents";
import { LESSONS, Lesson } from "@/data/mockLessons";
import { SparklineChart } from "@/components/SparklineChart";
import { CoinBadge } from "@/components/CoinBadge";
import { MOCK_NEWS, SENTIMENT_CONFIG } from "@/data/mockNews";
import { useUserPreferences } from "@/lib/userPreferences";

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
    case "Coach":
    case "Futures":
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
  const { prefs } = useUserPreferences();
  if (!event) return null;
  const isPositive = event.biggestMove.changePercent >= 0;
  const moveColor = isPositive ? colors.green : colors.red;

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <View style={[evtStyles.container, { backgroundColor: colors.background }]}>
        <View style={[evtStyles.header, { borderBottomColor: colors.border }]}>
          <Text style={[evtStyles.headerTitle, { color: colors.foreground }]}>Today's Market Pulse</Text>
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

          {prefs.educationalTipsEnabled && (
            <View style={[evtStyles.lessonCard, { backgroundColor: colors.blue + "10", borderColor: colors.blue + "30" }]}>
              <View style={evtStyles.lessonRow}>
                <Feather name="book-open" size={14} color={colors.blue} />
                <Text style={[evtStyles.lessonLabel, { color: colors.blue }]}>Market Lesson</Text>
              </View>
              <Text style={[evtStyles.lessonText, { color: colors.foreground }]}>{event.marketLesson}</Text>
            </View>
          )}

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
  const { prefs } = useUserPreferences();
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
    if (prefs.hapticsEnabled) Haptics.selectionAsync();
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
            {prefs.educationalTipsEnabled && (
              <View style={[coachStyles.lessonBox, { backgroundColor: colors.blue + "10", borderColor: colors.blue + "30" }]}>
                <View style={coachStyles.lessonRow}>
                  <Feather name="book-open" size={13} color={colors.blue} />
                  <Text style={[coachStyles.lessonLabel, { color: colors.blue }]}>What This Teaches</Text>
                </View>
                <Text style={[coachStyles.lessonText, { color: colors.foreground }]}>{event.marketLesson}</Text>
              </View>
            )}

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
// Portfolio Recap Card (Home)
// ────────────────────────────────────────────────────────────

function PortfolioRecapCard({
  totalValue,
  portfolioSnapshots,
  latestEvent,
  colors,
  educationalTipsEnabled,
}: {
  totalValue: number;
  portfolioSnapshots: PortfolioSnapshot[];
  latestEvent: AppliedEvent | null;
  colors: ReturnType<typeof useColors>;
  educationalTipsEnabled: boolean;
}) {
  const snaps = portfolioSnapshots ?? [];
  const INITIAL = 10000;
  const returnPct = ((totalValue - INITIAL) / INITIAL) * 100;
  const returnColor = returnPct >= 0 ? colors.green : colors.red;

  const latestSnap = snaps[0];
  const latestChange = latestSnap?.dayChangeValue;
  const latestChangePct = latestSnap?.dayChangePercent;
  const changeColor = latestChange !== undefined
    ? latestChange >= 0 ? colors.green : colors.red
    : returnColor;

  return (
    <Pressable
      onPress={() => router.push("/performance")}
      style={({ pressed }) => [
        recapStyles.card,
        { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      <View style={recapStyles.header}>
        <View style={[recapStyles.icon, { backgroundColor: returnColor + "18" }]}>
          <Feather name="bar-chart-2" size={16} color={returnColor} />
        </View>
        <Text style={[recapStyles.title, { color: colors.foreground }]}>Portfolio Recap</Text>
        <Feather name="chevron-right" size={14} color={colors.mutedForeground} style={{ marginLeft: "auto" as any }} />
      </View>

      <View style={recapStyles.row}>
        <View style={recapStyles.col}>
          <Text style={[recapStyles.label, { color: colors.mutedForeground }]}>Total Value</Text>
          <Text style={[recapStyles.big, { color: colors.foreground }]}>
            {totalValue.toLocaleString(undefined, { maximumFractionDigits: 0 })}
          </Text>
          <Text style={[recapStyles.unit, { color: colors.mutedForeground }]}>LC</Text>
        </View>
        <View style={recapStyles.divider} />
        <View style={recapStyles.col}>
          <Text style={[recapStyles.label, { color: colors.mutedForeground }]}>Total Return</Text>
          <Text style={[recapStyles.big, { color: returnColor }]}>
            {returnPct >= 0 ? "+" : ""}{returnPct.toFixed(2)}%
          </Text>
        </View>
        {latestChange !== undefined && (
          <>
            <View style={recapStyles.divider} />
            <View style={recapStyles.col}>
              <Text style={[recapStyles.label, { color: colors.mutedForeground }]}>Since Last</Text>
              <Text style={[recapStyles.big, { color: changeColor }]}>
                {latestChange >= 0 ? "+" : ""}{latestChangePct !== undefined ? `${latestChangePct.toFixed(1)}%` : "—"}
              </Text>
            </View>
          </>
        )}
      </View>

      {latestEvent && (
        <View style={[recapStyles.eventRow, { backgroundColor: colors.muted + "60", borderRadius: 8, padding: 8 }]}>
          <Text style={recapStyles.eventEmoji}>{latestEvent.emoji}</Text>
          <Text style={[recapStyles.eventText, { color: colors.mutedForeground }]} numberOfLines={1}>
            {latestEvent.biggestMove.symbol} {latestEvent.biggestMove.changePercent >= 0 ? "+" : ""}{latestEvent.biggestMove.changePercent.toFixed(0)}% · {latestEvent.title}
          </Text>
        </View>
      )}

      {educationalTipsEnabled && snaps.length === 0 && (
        <Text style={[recapStyles.hint, { color: colors.mutedForeground }]}>
          Make a trade or review a Market Pulse to start tracking performance history.
        </Text>
      )}
    </Pressable>
  );
}

const recapStyles = StyleSheet.create({
  card: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, gap: 12, marginBottom: 12 },
  header: { flexDirection: "row", alignItems: "center", gap: 8 },
  icon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  title: { fontSize: 14, fontFamily: "Inter_600SemiBold" },
  row: { flexDirection: "row", alignItems: "stretch", gap: 0 },
  col: { flex: 1, alignItems: "center", gap: 2 },
  divider: { width: 1, backgroundColor: "rgba(128,128,128,0.2)", marginHorizontal: 4 },
  label: { fontSize: 10, fontFamily: "Inter_400Regular" },
  big: { fontSize: 18, fontFamily: "Inter_700Bold" },
  unit: { fontSize: 10, fontFamily: "Inter_400Regular" },
  eventRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  eventEmoji: { fontSize: 14 },
  eventText: { flex: 1, fontSize: 11, fontFamily: "Inter_400Regular" },
  hint: { fontSize: 11, fontFamily: "Inter_400Regular", lineHeight: 16 },
});

// ────────────────────────────────────────────────────────────
// Rookie Playbook Card
// ────────────────────────────────────────────────────────────
interface PlaybookStepDef {
  id: string;
  emoji: string;
  title: string;
  desc: string;
  done: boolean;
  actionLabel: string;
  onAction: () => void;
}

function RookiePlaybookCard({
  colors,
  steps,
  allDone,
  onDismiss,
  educationalTipsEnabled,
  rewardClaimed,
}: {
  colors: ReturnType<typeof useColors>;
  steps: PlaybookStepDef[];
  allDone: boolean;
  onDismiss: () => void;
  educationalTipsEnabled: boolean;
  rewardClaimed: boolean;
}) {
  const completedCount = steps.filter(s => s.done).length;

  if (allDone) {
    return (
      <View style={[rpStyles.completedCard, { backgroundColor: colors.green + "12", borderColor: colors.green + "35" }]}>
        <Text style={{ fontSize: 22 }}>🏆</Text>
        <View style={{ flex: 1 }}>
          <Text style={[rpStyles.completedTitle, { color: colors.green }]}>Rookie Playbook Complete!</Text>
          {rewardClaimed ? (
            <Text style={[rpStyles.completedSub, { color: colors.mutedForeground }]}>
              Reward claimed. Keep trading and learning!
            </Text>
          ) : (
            <Pressable
              onPress={() => router.push("/challenges")}
              style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
            >
              <Text style={[rpStyles.claimPrompt, { color: colors.coin }]}>
                🎁 Claim 250 LC + 150 XP in Challenges →
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable onPress={onDismiss} hitSlop={12}>
          <Feather name="x" size={17} color={colors.mutedForeground} />
        </Pressable>
      </View>
    );
  }

  return (
    <View style={[rpStyles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
      {/* Header */}
      <View style={rpStyles.cardHeader}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Text style={{ fontSize: 18 }}>🏈</Text>
          <View>
            <Text style={[rpStyles.cardTitle, { color: colors.foreground }]}>Rookie Playbook</Text>
            <Text style={[rpStyles.cardSubtitle, { color: colors.mutedForeground }]}>
              {completedCount} of {steps.length} steps done
            </Text>
          </View>
        </View>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <Pressable onPress={() => router.push("/rookie-playbook")} hitSlop={8}>
            <Text style={[rpStyles.guideLink, { color: colors.primary }]}>Full Guide</Text>
          </Pressable>
          <Pressable onPress={onDismiss} hitSlop={12}>
            <Feather name="x" size={16} color={colors.mutedForeground} />
          </Pressable>
        </View>
      </View>

      {/* Progress bar */}
      <View style={[rpStyles.progressTrack, { backgroundColor: colors.border }]}>
        <View
          style={[
            rpStyles.progressFill,
            { backgroundColor: colors.primary, width: `${(completedCount / steps.length) * 100}%` as any },
          ]}
        />
      </View>

      {/* Safety blurb (tips) */}
      {educationalTipsEnabled && (
        <View style={[rpStyles.tipRow, { backgroundColor: colors.blue + "0D", borderColor: colors.blue + "22" }]}>
          <Feather name="shield" size={11} color={colors.blue} />
          <Text style={[rpStyles.tipText, { color: colors.blue }]}>
            LuckyCoin is a simulated learning currency — no real money, no cash value.
          </Text>
        </View>
      )}

      {/* Steps */}
      {steps.map((step, i) => (
        <View
          key={step.id}
          style={[
            rpStyles.stepRow,
            i < steps.length - 1 && { borderBottomWidth: 1, borderBottomColor: colors.border },
          ]}
        >
          <View style={[rpStyles.stepIcon, { backgroundColor: step.done ? colors.green + "1A" : colors.muted }]}>
            {step.done ? (
              <Feather name="check" size={12} color={colors.green} />
            ) : (
              <Text style={{ fontSize: 13 }}>{step.emoji}</Text>
            )}
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={[
                rpStyles.stepTitle,
                {
                  color: step.done ? colors.mutedForeground : colors.foreground,
                  textDecorationLine: step.done ? "line-through" : "none",
                },
              ]}
            >
              {step.title}
            </Text>
            {!step.done && (
              <Text style={[rpStyles.stepDesc, { color: colors.mutedForeground }]} numberOfLines={2}>
                {step.desc}
              </Text>
            )}
          </View>
          {!step.done && (
            <Pressable
              onPress={step.onAction}
              style={({ pressed }) => [
                rpStyles.goBtn,
                { backgroundColor: colors.primary + "15", borderColor: colors.primary + "30", opacity: pressed ? 0.75 : 1 },
              ]}
            >
              <Text style={[rpStyles.goBtnText, { color: colors.primary }]}>{step.actionLabel}</Text>
            </Pressable>
          )}
        </View>
      ))}
    </View>
  );
}

// ────────────────────────────────────────────────────────────
// Home Screen
// ────────────────────────────────────────────────────────────
export default function HomeScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { luckyCoinBalance, holdings, username, canClaimDaily, claimDaily, transactions, prepareDailyPulse, reviewDailyPulse, pendingPulseId, pendingGeneratedPulse, isLoaded, latestEvent, appliedEvents, watchlist, portfolioSnapshots, challengeFlags, lessonsOpened, lastDailyClaim, setChallengeFlag, claimedChallenges } = useGame();
  const liveAssets = useLiveAssets();
  const { nextChallenge, xpInfo, claimedCount } = useChallenges();
  const traderIdentity = useTraderIdentity();
  const { prefs } = useUserPreferences();

  const coachTip = useMemo(() => {
    if (holdings.length === 0) return null;
    const pv = holdings.reduce((s, h) => {
      const a = liveAssets.find(x => x.id === h.assetId);
      return s + (a ? a.price * h.quantity : 0);
    }, 0);
    if (pv === 0) return null;
    const memePct = holdings.reduce((s, h) => {
      const a = liveAssets.find(x => x.id === h.assetId);
      return s + (a?.type === "Meme Coin" ? a.price * h.quantity : 0);
    }, 0) / pv * 100;
    const hasIndex = holdings.some(h => liveAssets.find(x => x.id === h.assetId)?.type === "Sport Index");
    const sports = new Set(holdings.map(h => liveAssets.find(x => x.id === h.assetId)?.sport).filter(Boolean)).size;
    if (!hasIndex) return "You own no indexes yet. Indexes can help spread risk across many assets.";
    if (memePct > 50) return `Your portfolio is ${memePct.toFixed(0)}% meme coins. Expect bigger simulated swings.`;
    if (sports >= 3) return `Nice diversification — you own assets across ${sports} sports.`;
    if (sports === 1) return "All your assets are in one sport. Adding another sport builds real portfolio habits.";
    return "Check your full Portfolio Coach report for a detailed breakdown.";
  }, [holdings, liveAssets]);
  const [showEventModal, setShowEventModal] = useState(false);
  const [coachDismissedId, setCoachDismissedId] = useState<string | null>(null);
  const [showCoach, setShowCoach] = useState(false);

  const handleDismissPlaybook = useCallback(() => {
    setChallengeFlag("rookiePlaybookDismissed");
  }, [setChallengeFlag]);

  const playbookDismissed = challengeFlags.includes("rookiePlaybookDismissed");

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

  const scannerPick = useMemo(() => {
    const wlMover = [...liveAssets]
      .filter(a => watchlist.includes(a.id) && Math.abs(a.dailyChangePercent) > 5)
      .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent))[0];
    if (wlMover) return { asset: wlMover, scanLabel: "Watchlist Mover", scanEmoji: "👁️", isUp: wlMover.dailyChangePercent >= 0 };

    const momentum = [...liveAssets]
      .filter(a => a.dailyChangePercent > 10)
      .sort((a, b) => b.dailyChangePercent - a.dailyChangePercent)[0];
    if (momentum) return { asset: momentum, scanLabel: "Momentum Leader", scanEmoji: "🚀", isUp: true };

    const dip = [...liveAssets]
      .filter(a => a.dailyChangePercent < -10)
      .sort((a, b) => a.dailyChangePercent - b.dailyChangePercent)[0];
    if (dip) return { asset: dip, scanLabel: "Dip Watch", scanEmoji: "📉", isUp: false };

    const highVol = [...liveAssets]
      .filter(a => a.riskScore >= 8)
      .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent))[0];
    if (highVol) return { asset: highVol, scanLabel: "High Volatility", scanEmoji: "🌊", isUp: highVol.dailyChangePercent >= 0 };

    const biggest = [...liveAssets]
      .sort((a, b) => Math.abs(b.dailyChangePercent) - Math.abs(a.dailyChangePercent))[0];
    return biggest ? { asset: biggest, scanLabel: "Biggest Mover", scanEmoji: "⚡", isUp: biggest.dailyChangePercent >= 0 } : null;
  }, [liveAssets, watchlist]);

  const showCoachCard =
    showCoach &&
    !!latestEvent &&
    latestEvent.eventId !== coachDismissedId;

  const handleClaim = () => {
    const result = claimDaily();
    if (prefs.hapticsEnabled) Haptics.notificationAsync(result.success ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Warning);
    Alert.alert(result.success ? "Daily Claim!" : "Already Claimed", result.message);
  };

  const handleEventModalClose = () => {
    setShowEventModal(false);
    setShowCoach(true);
  };

  const handleReviewPulse = useCallback(() => {
    if (prefs.hapticsEnabled) Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const result = reviewDailyPulse();
    if (result.success) {
      if (prefs.hapticsEnabled) Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      setShowCoach(false);
      setShowEventModal(true);
    }
  }, [reviewDailyPulse, prefs.hapticsEnabled]);

  useFocusEffect(
    useCallback(() => {
      if (isLoaded) {
        prepareDailyPulse();
      }
    }, [isLoaded, prepareDailyPulse])
  );

  const pendingEvent = useMemo(() => {
    if (!pendingPulseId) return null;
    // Curated events live in MARKET_EVENTS; generated pulses use pendingGeneratedPulse
    return MARKET_EVENTS.find(e => e.id === pendingPulseId) ?? pendingGeneratedPulse ?? null;
  }, [pendingPulseId, pendingGeneratedPulse]);

  const pulseReviewedToday = !!(
    latestEvent &&
    !pendingPulseId &&
    new Date().toDateString() === (latestEvent ? new Date(latestEvent.appliedAt).toDateString() : null)
  );

  const playbookSteps = useMemo<PlaybookStepDef[]>(() => [
    {
      id: "claim",
      emoji: "🪙",
      title: "Claim your LuckyCoin",
      desc: "Tap the Daily Claim card to collect free LuckyCoin — your simulated learning currency.",
      done: lastDailyClaim !== null,
      actionLabel: "Claim",
      onAction: () => {},
    },
    {
      id: "watch",
      emoji: "🔭",
      title: "Watch an asset",
      desc: "Open Market or Scanner and bookmark an asset to add it to your Watchlist.",
      done: watchlist.length > 0,
      actionLabel: "Market",
      onAction: () => router.push("/(tabs)/market"),
    },
    {
      id: "buy",
      emoji: "💰",
      title: "Buy your first asset",
      desc: "Open any asset and tap Buy. Start small — 1–5 units is plenty to learn the mechanics.",
      done: transactions.some(t => t.type === "buy") || holdings.length > 0,
      actionLabel: "Market",
      onAction: () => router.push("/(tabs)/market"),
    },
    {
      id: "event",
      emoji: "⚡",
      title: "React to a Market Pulse",
      desc: "Fanfolio prepares a daily market storyline for you. Tap 'Review Pulse' on the Home screen to see how sports news moves prices.",
      done: appliedEvents.length > 0,
      actionLabel: pendingPulseId ? "Review Pulse" : "Home",
      onAction: pendingPulseId ? handleReviewPulse : () => {},
    },
    {
      id: "portfolio",
      emoji: "📊",
      title: "Check your portfolio",
      desc: "Open the Portfolio tab to see your holdings and how they're performing.",
      done: challengeFlags.includes("hasViewedPortfolio"),
      actionLabel: "Portfolio",
      onAction: () => router.push("/(tabs)/portfolio"),
    },
    {
      id: "performance",
      emoji: "📈",
      title: "Open Performance History",
      desc: "In Portfolio, tap Performance History to see how your total value has changed over time.",
      done: challengeFlags.includes("hasViewedPerformance"),
      actionLabel: "Portfolio",
      onAction: () => router.push("/(tabs)/portfolio"),
    },
    {
      id: "lesson",
      emoji: "📚",
      title: "Complete one lesson",
      desc: "Open the Learn tab and read any lesson to understand why markets move.",
      done: lessonsOpened > 0,
      actionLabel: "Learn",
      onAction: () => router.push("/(tabs)/learn"),
    },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], [lastDailyClaim, watchlist.length, transactions, holdings.length, appliedEvents.length, challengeFlags, lessonsOpened]);

  const playbookAllDone = playbookSteps.every(s => s.done);

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

        {/* ── Rookie Playbook ──────────────────────────── */}
        {!playbookDismissed && (
          <View style={styles.section}>
            <RookiePlaybookCard
              colors={colors}
              steps={playbookSteps}
              allDone={playbookAllDone}
              onDismiss={handleDismissPlaybook}
              educationalTipsEnabled={prefs.educationalTipsEnabled}
              rewardClaimed={claimedChallenges.includes("rookie_playbook_complete")}
            />
          </View>
        )}

        {/* ── Next Challenge ───────────────────────────── */}
        {nextChallenge && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <Feather name="target" size={15} color={colors.coin} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>
                  {nextChallenge.isComplete ? "Reward Ready!" : "Next Challenge"}
                </Text>
              </View>
              <Pressable onPress={() => router.push("/challenges")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>All Challenges</Text>
              </Pressable>
            </View>

            <Pressable
              onPress={() => router.push("/challenges")}
              style={({ pressed }) => [
                styles.challengeCard,
                {
                  backgroundColor: colors.card,
                  borderColor: nextChallenge.isComplete ? colors.coin + "60" : colors.border,
                  opacity: pressed ? 0.88 : 1,
                },
              ]}
            >
              {nextChallenge.isComplete && (
                <View style={[styles.challengeReadyStripe, { backgroundColor: colors.coin + "18" }]}>
                  <Feather name="gift" size={12} color={colors.coin} />
                  <Text style={[styles.challengeReadyText, { color: colors.coin }]}>Tap to claim your reward</Text>
                </View>
              )}
              <View style={styles.challengeCardBody}>
                <View style={[styles.challengeIcon, { backgroundColor: (nextChallenge.isComplete ? colors.coin : colors.primary) + "18" }]}>
                  <Feather name={nextChallenge.icon as any} size={18} color={nextChallenge.isComplete ? colors.coin : colors.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[styles.challengeTitle, { color: colors.foreground }]}>{nextChallenge.title}</Text>
                  <Text style={[styles.challengeDesc, { color: colors.mutedForeground }]} numberOfLines={1}>
                    {nextChallenge.description}
                  </Text>
                </View>
                <View style={styles.challengeRewardCol}>
                  {nextChallenge.xpReward > 0 && (
                    <Text style={[styles.challengeRewardText, { color: colors.primary }]}>+{nextChallenge.xpReward} XP</Text>
                  )}
                  {nextChallenge.lcReward > 0 && (
                    <Text style={[styles.challengeRewardText, { color: colors.coin }]}>+{nextChallenge.lcReward} LC</Text>
                  )}
                </View>
              </View>
              <View style={styles.challengeProgressRow}>
                <View style={[styles.challengeTrack, { backgroundColor: colors.border }]}>
                  <View style={[
                    styles.challengeFill,
                    {
                      width: `${Math.min(100, (nextChallenge.current / nextChallenge.total) * 100)}%` as any,
                      backgroundColor: nextChallenge.isComplete ? colors.coin : colors.primary,
                    },
                  ]} />
                </View>
                <Text style={[styles.challengeProgressLabel, { color: colors.mutedForeground }]}>
                  {nextChallenge.current}/{nextChallenge.total}
                </Text>
              </View>

              {/* XP level mini row */}
              <View style={[styles.challengeLevelRow, { borderTopColor: colors.border }]}>
                <Text style={[styles.challengeLevelText, { color: colors.mutedForeground }]}>
                  Lv.{xpInfo.level} {xpInfo.levelTitle}
                </Text>
                <Text style={[styles.challengeLevelText, { color: colors.mutedForeground }]}>
                  {xpInfo.totalXP} XP · {claimedCount} done
                </Text>
              </View>
            </Pressable>
          </View>
        )}

        {/* ── Coach Tip ────────────────────────────────── */}
        {coachTip && prefs.educationalTipsEnabled && (
          <View style={styles.section}>
            <View style={[styles.coachTipCard, { backgroundColor: colors.primary + "0E", borderColor: colors.primary + "28" }]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 7 }}>
                <Feather name="activity" size={13} color={colors.primary} />
                <Text style={[styles.coachTipLabel, { color: colors.primary }]}>Coach Tip</Text>
              </View>
              <Text style={[styles.coachTipText, { color: colors.foreground }]}>{coachTip}</Text>
              <Pressable
                onPress={() => router.push("/portfolio-coach")}
                style={[styles.coachTipBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={[styles.coachTipBtnText, { color: colors.primaryForeground }]}>View Report</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── Portfolio Recap ───────────────────────────── */}
        <PortfolioRecapCard
          totalValue={totalValue}
          portfolioSnapshots={portfolioSnapshots ?? []}
          latestEvent={latestEvent}
          colors={colors}
          educationalTipsEnabled={prefs.educationalTipsEnabled}
        />

        {/* ── Your Trader Style ─────────────────────────── */}
        {(transactions.length > 0 || holdings.length > 0 || watchlist.length >= 2) && (
          <View style={styles.section}>
            <Pressable
              onPress={() => router.push("/strategy-profile")}
              style={({ pressed }) => [
                styles.styleCard,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <View style={[styles.styleIconWrap, { backgroundColor: colors.primary + "15" }]}>
                <Text style={styles.styleEmoji}>{traderIdentity.primary.emoji}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.styleLabel, { color: colors.mutedForeground }]}>Your Trader Style</Text>
                <Text style={[styles.styleTitle, { color: colors.foreground }]}>{traderIdentity.primary.title}</Text>
                <Text style={[styles.styleSub, { color: colors.mutedForeground }]} numberOfLines={1}>
                  {traderIdentity.confidenceLabel} · Tap to view full profile
                </Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>
        )}

        {/* ── Today's Market Pulse ──────────────────────── */}
        <View style={[styles.pulseCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          {/* Header */}
          <View style={styles.pulseHeader}>
            <View style={styles.pulseLeft}>
              <View style={[styles.pulseDot, { backgroundColor: pulseReviewedToday ? colors.green : colors.coin }]} />
              <Text style={[styles.pulseTitle, { color: colors.foreground }]}>Today's Market Pulse</Text>
            </View>
            {pulseReviewedToday ? (
              <View style={[styles.pulseReviewedBadge, { backgroundColor: colors.green + "20" }]}>
                <Feather name="check" size={10} color={colors.green} />
                <Text style={[styles.pulseReviewedText, { color: colors.green }]}>Reviewed</Text>
              </View>
            ) : pendingEvent ? (
              <View style={[styles.pulseReviewedBadge, { backgroundColor: colors.coin + "20" }]}>
                <View style={[styles.pulseLiveDot, { backgroundColor: colors.coin }]} />
                <Text style={[styles.pulseReviewedText, { color: colors.coin }]}>Ready</Text>
              </View>
            ) : null}
          </View>

          {/* Sub-label */}
          <Text style={[styles.pulseSubLabel, { color: colors.mutedForeground }]}>
            {pulseReviewedToday
              ? `${appliedEvents.length} market event${appliedEvents.length !== 1 ? "s" : ""} reviewed this season`
              : "Fanfolio has prepared today's market storyline."}
          </Text>

          {/* Pending pulse teaser */}
          {pendingEvent && !pulseReviewedToday && (
            <View style={[styles.pulseTeaserCard, { backgroundColor: colors.coin + "0D", borderColor: colors.coin + "30" }]}>
              <Text style={styles.pulseTeaserEmoji}>{pendingEvent.emoji}</Text>
              <View style={{ flex: 1 }}>
                <Text style={[styles.pulseTeaserTitle, { color: colors.foreground }]}>{pendingEvent.title}</Text>
                <Text style={[styles.pulseTeaserMeta, { color: colors.mutedForeground }]}>
                  {pendingEvent.sport} · {pendingEvent.category}
                </Text>
              </View>
              <Feather name="lock" size={14} color={colors.mutedForeground} />
            </View>
          )}

          {/* Latest reviewed event (after review or on subsequent opens) */}
          {pulseReviewedToday && latestEvent && (
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
          )}

          {/* No events yet */}
          {!pendingEvent && !pulseReviewedToday && !latestEvent && (
            <View style={styles.pulseEmptyRow}>
              <Feather name="activity" size={18} color={colors.mutedForeground} />
              <Text style={[styles.pulseEmptyText, { color: colors.mutedForeground }]}>
                Preparing today's pulse…
              </Text>
            </View>
          )}

          {/* Action button */}
          {!pulseReviewedToday && pendingEvent ? (
            <Pressable
              onPress={handleReviewPulse}
              style={({ pressed }) => [
                styles.simulateBtn,
                { backgroundColor: colors.coin, borderRadius: colors.radius - 2, opacity: pressed ? 0.85 : 1 },
              ]}
            >
              <Feather name="zap" size={16} color="#0C0F14" />
              <Text style={[styles.simulateBtnText, { color: "#0C0F14" }]}>Review Pulse</Text>
            </Pressable>
          ) : pulseReviewedToday ? (
            <View style={[styles.simulateBtn, { backgroundColor: colors.green + "15", borderRadius: colors.radius - 2 }]}>
              <Feather name="check-circle" size={16} color={colors.green} />
              <Text style={[styles.simulateBtnText, { color: colors.green }]}>Pulse Reviewed</Text>
            </View>
          ) : null}
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

        {/* ── Scanner Pick ──────────────────────────────── */}
        {scannerPick && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <View style={styles.watchlistSectionLeft}>
                <Feather name="filter" size={15} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Scanner Pick</Text>
              </View>
              <Pressable onPress={() => router.push("/(tabs)/scanner")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>Open Scanner</Text>
              </Pressable>
            </View>
            <Pressable
              onPress={() => router.push({ pathname: "/asset/[id]", params: { id: scannerPick.asset.id } })}
              style={({ pressed }) => [
                styles.scanPickCard,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  opacity: pressed ? 0.85 : 1,
                },
              ]}
            >
              <View style={[styles.scanPickAccent, { backgroundColor: scannerPick.isUp ? colors.green : colors.red }]} />
              <View style={styles.scanPickBody}>
                <View style={styles.scanPickTop}>
                  <View style={[styles.scanPickLabelRow, { backgroundColor: colors.primary + "15" }]}>
                    <Text style={styles.scanPickLabelEmoji}>{scannerPick.scanEmoji}</Text>
                    <Text style={[styles.scanPickLabel, { color: colors.primary }]}>{scannerPick.scanLabel}</Text>
                  </View>
                  <View style={[styles.scanPickChange, { backgroundColor: (scannerPick.isUp ? colors.green : colors.red) + "18" }]}>
                    <Text style={[styles.scanPickChangeTxt, { color: scannerPick.isUp ? colors.green : colors.red }]}>
                      {scannerPick.isUp ? "+" : ""}{scannerPick.asset.dailyChangePercent.toFixed(2)}%
                    </Text>
                  </View>
                </View>
                <View style={styles.scanPickMain}>
                  <View style={styles.scanPickInfo}>
                    <Text style={[styles.scanPickSymbol, { color: colors.foreground }]}>{scannerPick.asset.symbol}</Text>
                    <Text style={[styles.scanPickName, { color: colors.mutedForeground }]} numberOfLines={1}>
                      {scannerPick.asset.name}
                    </Text>
                    <Text style={[styles.scanPickPrice, { color: colors.foreground }]}>
                      {scannerPick.asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LC
                    </Text>
                  </View>
                  <SparklineChart
                    data={scannerPick.asset.chartData}
                    width={80}
                    height={36}
                    positive={scannerPick.isUp}
                  />
                </View>
              </View>
            </Pressable>
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
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTitle, { color: colors.foreground }]}>Recent Trades</Text>
              <Pressable onPress={() => router.push("/journal")}>
                <Text style={[styles.seeAll, { color: colors.primary }]}>See all</Text>
              </Pressable>
            </View>
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

        {/* ── Market News ───────────────────────────── */}
        <View style={styles.newsSection}>
          <View style={styles.newsSectionHeader}>
            <View style={styles.newsSectionLeft}>
              <Feather name="rss" size={15} color={colors.foreground} />
              <Text style={[styles.newsSectionTitle, { color: colors.foreground }]}>Market News</Text>
            </View>
            <Pressable
              onPress={() => router.push("/news")}
              style={({ pressed }) => [styles.newsViewAll, { opacity: pressed ? 0.7 : 1 }]}
            >
              <Text style={[styles.newsViewAllText, { color: colors.primary }]}>View All</Text>
              <Feather name="chevron-right" size={13} color={colors.primary} />
            </Pressable>
          </View>
          <Text style={[styles.newsSectionSub, { color: colors.mutedForeground }]}>Simulated headlines that move the market.</Text>
          <View style={styles.newsCards}>
            {MOCK_NEWS.slice(0, 3).map(item => {
              const sent = SENTIMENT_CONFIG[item.sentiment];
              return (
                <Pressable
                  key={item.id}
                  onPress={() => router.push("/news")}
                  style={({ pressed }) => [
                    styles.newsCard,
                    { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.88 : 1 },
                  ]}
                >
                  <View style={styles.newsCardTop}>
                    <View style={[styles.newsCardCat, { backgroundColor: colors.primary + "15" }]}>
                      <Text style={[styles.newsCardCatText, { color: colors.primary }]}>{item.category}</Text>
                    </View>
                    <View style={[styles.newsCardSent, { backgroundColor: sent.color + "20" }]}>
                      <Text style={[styles.newsCardSentText, { color: sent.color }]}>{sent.label}</Text>
                    </View>
                    <Text style={[styles.newsCardTs, { color: colors.mutedForeground }]}>{item.timestampLabel}</Text>
                  </View>
                  <Text style={[styles.newsCardTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                  <Text style={[styles.newsCardSummary, { color: colors.mutedForeground }]} numberOfLines={1}>{item.summary}</Text>
                  <View style={styles.newsCardSymbols}>
                    {item.relatedAssetSymbols.slice(0, 3).map(sym => (
                      <View key={sym} style={[styles.newsCardSym, { backgroundColor: colors.muted + "50" }]}>
                        <Text style={[styles.newsCardSymText, { color: colors.mutedForeground }]}>{sym}</Text>
                      </View>
                    ))}
                  </View>
                </Pressable>
              );
            })}
          </View>
          <Pressable
            onPress={() => router.push("/news")}
            style={({ pressed }) => [
              styles.newsAllBtn,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <Feather name="rss" size={14} color={colors.primary} />
            <Text style={[styles.newsAllBtnText, { color: colors.primary }]}>View All {MOCK_NEWS.length} Headlines</Text>
            <Feather name="arrow-right" size={14} color={colors.primary} />
          </Pressable>
        </View>
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
  pulseCard: { marginHorizontal: 20, borderRadius: 16, borderWidth: 1, padding: 16, marginBottom: 16, gap: 12 },
  pulseHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  pulseLeft: { flexDirection: "row", alignItems: "center", gap: 8 },
  pulseDot: { width: 8, height: 8, borderRadius: 4 },
  pulseLiveDot: { width: 6, height: 6, borderRadius: 3 },
  pulseTitle: { fontSize: 16, fontFamily: "Inter_700Bold" },
  pulseCount: { fontSize: 11, fontFamily: "Inter_400Regular" },
  pulseSubLabel: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 17, marginTop: -4 },
  pulseReviewedBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  pulseReviewedText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  pulseTeaserCard: { flexDirection: "row", alignItems: "center", gap: 10, borderRadius: 12, borderWidth: 1, padding: 12 },
  pulseTeaserEmoji: { fontSize: 24 },
  pulseTeaserTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  pulseTeaserMeta: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
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
  // Next Challenge card
  challengeCard: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  challengeReadyStripe: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 7 },
  challengeReadyText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  challengeCardBody: { flexDirection: "row", alignItems: "center", gap: 10, padding: 12 },
  challengeIcon: { width: 38, height: 38, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  challengeTitle: { fontSize: 13, fontFamily: "Inter_700Bold" },
  challengeDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  challengeRewardCol: { alignItems: "flex-end", gap: 2 },
  challengeRewardText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  challengeProgressRow: { flexDirection: "row", alignItems: "center", gap: 8, paddingHorizontal: 12, paddingBottom: 10 },
  challengeTrack: { flex: 1, height: 5, borderRadius: 3, overflow: "hidden" },
  challengeFill: { height: 5, borderRadius: 3 },
  challengeProgressLabel: { fontSize: 11, fontFamily: "Inter_500Medium", minWidth: 30, textAlign: "right" },
  challengeLevelRow: { flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, paddingVertical: 8, borderTopWidth: 1 },
  challengeLevelText: { fontSize: 10, fontFamily: "Inter_400Regular" },
  // Coach Tip card
  coachTipCard: { borderRadius: 14, borderWidth: 1, padding: 14, gap: 10 },
  coachTipLabel: { fontSize: 11, fontFamily: "Inter_700Bold" },
  coachTipText: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  coachTipBtn: { alignSelf: "flex-start" as const, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  coachTipBtnText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  // Trader Style card
  styleCard: { flexDirection: "row", alignItems: "center", gap: 12, borderRadius: 14, borderWidth: 1, padding: 14 },
  styleIconWrap: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  styleEmoji: { fontSize: 24 },
  styleLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  styleTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  styleSub: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  // Scanner Pick card
  scanPickCard: { flexDirection: "row", borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  scanPickAccent: { width: 3, alignSelf: "stretch" },
  scanPickBody: { flex: 1, padding: 14, gap: 8 },
  scanPickTop: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scanPickLabelRow: { flexDirection: "row", alignItems: "center", gap: 5, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scanPickLabelEmoji: { fontSize: 12 },
  scanPickLabel: { fontSize: 11, fontFamily: "Inter_700Bold" },
  scanPickChange: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  scanPickChangeTxt: { fontSize: 12, fontFamily: "Inter_700Bold" },
  scanPickMain: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  scanPickInfo: { gap: 2 },
  scanPickSymbol: { fontSize: 18, fontFamily: "Inter_700Bold" },
  scanPickName: { fontSize: 12, fontFamily: "Inter_400Regular" },
  scanPickPrice: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginTop: 2 },
  // News section
  newsSection: { marginHorizontal: 20, marginBottom: 24, marginTop: 16, gap: 12 },
  newsSectionHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  newsSectionLeft: { flexDirection: "row", alignItems: "center", gap: 7 },
  newsSectionTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  newsSectionSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: -6 },
  newsViewAll: { flexDirection: "row", alignItems: "center", gap: 3 },
  newsViewAllText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  newsCards: { gap: 10 },
  newsCard: { borderRadius: 14, borderWidth: 1, padding: 12, gap: 8 },
  newsCardTop: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" as const },
  newsCardCat: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  newsCardCatText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  newsCardSent: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  newsCardSentText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  newsCardTs: { fontSize: 10, fontFamily: "Inter_400Regular", marginLeft: "auto" as any },
  newsCardTitle: { fontSize: 14, fontFamily: "Inter_700Bold", lineHeight: 21 },
  newsCardSummary: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  newsCardSymbols: { flexDirection: "row", gap: 5, flexWrap: "wrap" as const },
  newsCardSym: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
  newsCardSymText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  newsAllBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, borderRadius: 12, borderWidth: 1, paddingVertical: 12 },
  newsAllBtnText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
});

// ── Rookie Playbook Styles ──────────────────────────────────
const rpStyles = StyleSheet.create({
  completedCard: { marginHorizontal: 20, borderRadius: 14, borderWidth: 1, padding: 14, flexDirection: "row", alignItems: "center", gap: 10 },
  completedTitle: { fontSize: 14, fontFamily: "Inter_700Bold" },
  completedSub: { fontSize: 12, fontFamily: "Inter_400Regular", marginTop: 2 },
  card: { borderRadius: 14, borderWidth: 1, overflow: "hidden" },
  cardHeader: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 14 },
  cardTitle: { fontSize: 15, fontFamily: "Inter_700Bold" },
  cardSubtitle: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 1 },
  guideLink: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  progressTrack: { height: 4, marginHorizontal: 14, marginBottom: 10, borderRadius: 2, overflow: "hidden" },
  progressFill: { height: 4, borderRadius: 2 },
  tipRow: { flexDirection: "row", alignItems: "center", gap: 6, marginHorizontal: 14, marginBottom: 8, borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 7 },
  tipText: { fontSize: 11, fontFamily: "Inter_400Regular", flex: 1 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingVertical: 11 },
  stepIcon: { width: 30, height: 30, borderRadius: 8, alignItems: "center", justifyContent: "center" },
  stepTitle: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  stepDesc: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2, lineHeight: 16 },
  goBtn: { borderRadius: 8, borderWidth: 1, paddingHorizontal: 10, paddingVertical: 6 },
  goBtnText: { fontSize: 11, fontFamily: "Inter_700Bold" },
  claimPrompt: { fontSize: 12, fontFamily: "Inter_700Bold", marginTop: 3 },
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
