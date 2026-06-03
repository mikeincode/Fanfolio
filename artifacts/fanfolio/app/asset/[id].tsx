import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Platform,
  Alert,
  Modal,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useLiveAsset } from "@/hooks/useLiveAssets";
import { useGame } from "@/context/GameContext";
import { SparklineChart } from "@/components/SparklineChart";
import { RiskBar } from "@/components/RiskBar";
import { CoinBadge } from "@/components/CoinBadge";
import { getNewsForAsset, SENTIMENT_CONFIG } from "@/data/mockNews";

type TradeMode = "buy" | "sell";

function TradeModal({
  mode,
  onClose,
  assetId,
  assetName,
  assetSymbol,
  price,
  colors,
}: {
  mode: TradeMode;
  onClose: () => void;
  assetId: string;
  assetName: string;
  assetSymbol: string;
  price: number;
  colors: ReturnType<typeof useColors>;
}) {
  const { luckyCoinBalance, buyAsset, sellAsset, getHolding } = useGame();
  const [quantity, setQuantity] = useState("1");
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const holding = getHolding(assetId);
  const qty = parseInt(quantity) || 0;
  const total = qty * price;
  const isBuy = mode === "buy";
  const accentColor = isBuy ? colors.green : colors.red;

  const canTrade = isBuy
    ? (qty > 0 && total <= luckyCoinBalance)
    : (qty > 0 && holding && qty <= holding.quantity);

  const handleTrade = () => {
    if (!canTrade) return;
    const result = isBuy
      ? buyAsset(assetId, assetName, assetSymbol, price, qty)
      : sellAsset(assetId, assetName, assetSymbol, price, qty);

    Haptics.notificationAsync(result.success ? Haptics.NotificationFeedbackType.Success : Haptics.NotificationFeedbackType.Error);

    if (result.success) {
      const lesson = isBuy
        ? "Remember: Never invest more than you can afford to lose. Diversify your portfolio!"
        : "Selling locks in your simulated gain or loss. Review your portfolio to see your updated position.";
      onClose();
      setTimeout(() => {
        Alert.alert(isBuy ? "Trade Executed!" : "Sold!", result.message + "\n\n" + lesson, [{ text: "Got it" }]);
      }, 300);
    } else {
      Alert.alert("Trade Failed", result.message);
    }
  };

  const presets = isBuy
    ? [1, 5, 10, Math.floor(luckyCoinBalance / price)].filter(n => n > 0 && n * price <= luckyCoinBalance)
    : [1, Math.floor((holding?.quantity ?? 0) / 2), holding?.quantity ?? 0].filter(n => n > 0);

  return (
    <View style={[tradeStyles.container, { backgroundColor: colors.background }]}>
      <View style={[tradeStyles.header, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Text style={[tradeStyles.title, { color: colors.foreground }]}>{isBuy ? "Buy" : "Sell"} {assetSymbol}</Text>
        <Pressable onPress={onClose}>
          <Feather name="x" size={22} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: bottomPad + 20 }}>
        <View style={[tradeStyles.priceBox, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[tradeStyles.priceLabel, { color: colors.mutedForeground }]}>Current Price</Text>
          <Text style={[tradeStyles.priceValue, { color: colors.foreground }]}>
            {price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LC
          </Text>
        </View>

        <View style={[tradeStyles.balanceBox, { backgroundColor: isBuy ? colors.coin + "12" : colors.primary + "12", borderColor: isBuy ? colors.coin + "40" : colors.primary + "40" }]}>
          {isBuy ? (
            <>
              <Text style={[tradeStyles.balLabel, { color: colors.mutedForeground }]}>Available Balance</Text>
              <CoinBadge amount={luckyCoinBalance} size="md" />
            </>
          ) : (
            <>
              <Text style={[tradeStyles.balLabel, { color: colors.mutedForeground }]}>You own</Text>
              <Text style={[tradeStyles.balValue, { color: colors.foreground }]}>{holding?.quantity ?? 0} shares</Text>
            </>
          )}
        </View>

        <Text style={[tradeStyles.qtyLabel, { color: colors.foreground }]}>Quantity</Text>
        <TextInput
          style={[tradeStyles.qtyInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
          value={quantity}
          onChangeText={v => setQuantity(v.replace(/[^0-9]/g, ""))}
          keyboardType="number-pad"
          placeholder="0"
          placeholderTextColor={colors.mutedForeground}
        />

        <View style={tradeStyles.presets}>
          {presets.slice(0, 4).map(n => (
            <Pressable
              key={n}
              onPress={() => setQuantity(n.toString())}
              style={[tradeStyles.preset, { backgroundColor: colors.card, borderColor: n.toString() === quantity ? accentColor : colors.border }]}
            >
              <Text style={[tradeStyles.presetText, { color: n.toString() === quantity ? accentColor : colors.mutedForeground }]}>
                {isBuy ? n : n === holding?.quantity ? "All" : n}
              </Text>
            </Pressable>
          ))}
        </View>

        {qty > 0 && (
          <View style={[tradeStyles.totalBox, { backgroundColor: accentColor + "12", borderColor: accentColor + "40" }]}>
            <Text style={[tradeStyles.totalLabel, { color: colors.mutedForeground }]}>{isBuy ? "Total Cost" : "You Receive"}</Text>
            <Text style={[tradeStyles.totalValue, { color: accentColor }]}>
              {total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} LC
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleTrade}
          disabled={!canTrade}
          style={({ pressed }) => [
            tradeStyles.tradeBtn,
            { backgroundColor: canTrade ? accentColor : colors.muted, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 },
          ]}
        >
          <Text style={[tradeStyles.tradeBtnText, { color: canTrade ? (isBuy ? "#0C0F14" : "#fff") : colors.mutedForeground }]}>
            {!canTrade && qty === 0 ? "Enter quantity" : !canTrade ? (isBuy ? "Insufficient balance" : "Not enough shares") : `Confirm ${isBuy ? "Buy" : "Sell"}`}
          </Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

export default function AssetDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { getHolding, isWatched, addToWatchlist, removeFromWatchlist } = useGame();
  const [tradeMode, setTradeMode] = useState<TradeMode | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const asset = useLiveAsset(id ?? "");
  const holding = getHolding(id ?? "");
  const watched = id ? isWatched(id) : false;

  const handleWatchToggle = () => {
    if (!id) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (watched) {
      removeFromWatchlist(id);
    } else {
      addToWatchlist(id);
    }
  };

  if (!asset) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, alignItems: "center", justifyContent: "center" }]}>
        <Text style={{ color: colors.foreground }}>Asset not found</Text>
      </View>
    );
  }

  const isUp = asset.dailyChangePercent >= 0;
  const changeColor = isUp ? colors.green : colors.red;

  const typeColor: Record<string, string> = {
    "Team Stock": colors.blue,
    "Player Coin": "#A78BFA",
    "Sport Index": colors.green,
    "Meme Coin": "#F97316",
    "Future": "#EC4899",
  };

  return (
    <>
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: topPad + 8, paddingBottom: bottomPad + 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <View style={[styles.typeBadge, { backgroundColor: typeColor[asset.type] + "20" }]}>
            <Text style={[styles.typeText, { color: typeColor[asset.type] }]}>{asset.type}</Text>
          </View>
        </View>

        <View style={styles.header}>
          <View style={{ flex: 1 }}>
            <Text style={[styles.symbol, { color: colors.foreground }]}>{asset.symbol}</Text>
            <Text style={[styles.assetName, { color: colors.mutedForeground }]}>{asset.name}</Text>
            <Text style={[styles.sport, { color: colors.mutedForeground }]}>{asset.sport}</Text>
          </View>
          <View style={[styles.changeBadge, { backgroundColor: changeColor + "20" }]}>
            <Feather name={isUp ? "trending-up" : "trending-down"} size={14} color={changeColor} />
            <Text style={[styles.changeText, { color: changeColor }]}>
              {isUp ? "+" : ""}{asset.dailyChangePercent.toFixed(2)}%
            </Text>
          </View>
        </View>

        <Text style={[styles.price, { color: colors.foreground }]}>
          {asset.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </Text>
        <Text style={[styles.priceUnit, { color: colors.mutedForeground }]}>LuckyCoin</Text>

        <View style={styles.chartContainer}>
          <SparklineChart data={asset.chartData} width={340} height={80} positive={isUp} />
        </View>

        <View style={{ paddingHorizontal: 20, gap: 14 }}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <RiskBar score={asset.riskScore} />
          </View>

          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Text style={[styles.cardLabel, { color: colors.mutedForeground }]}>About</Text>
            <Text style={[styles.cardBody, { color: colors.foreground }]}>{asset.description}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.green + "10", borderColor: colors.green + "30" }]}>
            <View style={styles.cardRow}>
              <Feather name="zap" size={14} color={colors.green} />
              <Text style={[styles.cardLabel, { color: colors.green }]}>Why It Moved</Text>
            </View>
            <Text style={[styles.cardBody, { color: colors.foreground }]}>{asset.whyItMoved}</Text>
          </View>

          <View style={[styles.card, { backgroundColor: colors.blue + "10", borderColor: colors.blue + "30" }]}>
            <View style={styles.cardRow}>
              <Feather name="book-open" size={14} color={colors.blue} />
              <Text style={[styles.cardLabel, { color: colors.blue }]}>Market Lesson</Text>
            </View>
            <Text style={[styles.cardBody, { color: colors.foreground }]}>{asset.marketLesson}</Text>
          </View>

          {/* ── Related News ────────────────────────── */}
          {(() => {
            const relatedNews = id ? getNewsForAsset(id).slice(0, 2) : [];
            if (!relatedNews.length) return null;
            return (
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, gap: 10 }]}>
                <View style={styles.cardRow}>
                  <Feather name="rss" size={14} color={colors.foreground} />
                  <Text style={[styles.cardLabel, { color: colors.foreground }]}>Related News</Text>
                </View>
                {relatedNews.map(item => {
                  const sentCfg = SENTIMENT_CONFIG[item.sentiment];
                  return (
                    <Pressable
                      key={item.id}
                      onPress={() => router.push("/news")}
                      style={({ pressed }) => [
                        styles.newsItem,
                        { backgroundColor: colors.background, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
                      ]}
                    >
                      <View style={styles.newsItemTop}>
                        <View style={[styles.newsItemCat, { backgroundColor: colors.primary + "15" }]}>
                          <Text style={[styles.newsItemCatText, { color: colors.primary }]}>{item.category}</Text>
                        </View>
                        <View style={[styles.newsItemSent, { backgroundColor: sentCfg.color + "22" }]}>
                          <Text style={[styles.newsItemSentText, { color: sentCfg.color }]}>{sentCfg.label}</Text>
                        </View>
                        <Text style={[styles.newsItemTs, { color: colors.mutedForeground }]}>{item.timestampLabel}</Text>
                      </View>
                      <Text style={[styles.newsItemTitle, { color: colors.foreground }]} numberOfLines={2}>{item.title}</Text>
                      <Text style={[styles.newsItemSummary, { color: colors.mutedForeground }]} numberOfLines={1}>{item.summary}</Text>
                      <View style={styles.newsItemBottom}>
                        <Text style={[styles.newsItemLesson, { color: colors.blue }]}>{item.lessonTitle}</Text>
                        <Feather name="chevron-right" size={13} color={colors.primary} />
                      </View>
                    </Pressable>
                  );
                })}
                <Pressable
                  onPress={() => router.push("/news")}
                  style={({ pressed }) => [styles.newsMoreBtn, { borderColor: colors.border, opacity: pressed ? 0.8 : 1 }]}
                >
                  <Feather name="rss" size={12} color={colors.primary} />
                  <Text style={[styles.newsMoreBtnText, { color: colors.primary }]}>See all market news</Text>
                  <Feather name="arrow-right" size={12} color={colors.primary} />
                </Pressable>
              </View>
            );
          })()}

          {/* Watchlist education card */}
          <View style={[styles.card, { backgroundColor: colors.coin + "10", borderColor: colors.coin + "30" }]}>
            <View style={styles.cardRow}>
              <Feather name="bookmark" size={14} color={colors.coin} />
              <Text style={[styles.cardLabel, { color: colors.coin }]}>Watching This Asset</Text>
            </View>
            <Text style={[styles.cardBody, { color: colors.foreground }]}>
              {watched
                ? "You are watching this asset. You will see it in your Watchlist and the coach will alert you when market events affect it."
                : "Watching an asset means you are following it without buying yet. This is like scouting a player before drafting them onto your roster."}
            </Text>
          </View>

          {holding && (
            <View style={[styles.card, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
              <Text style={[styles.cardLabel, { color: colors.primary }]}>Your Position</Text>
              <View style={styles.positionRow}>
                <View>
                  <Text style={[styles.posLabel, { color: colors.mutedForeground }]}>Shares</Text>
                  <Text style={[styles.posValue, { color: colors.foreground }]}>{holding.quantity}</Text>
                </View>
                <View>
                  <Text style={[styles.posLabel, { color: colors.mutedForeground }]}>Avg Cost</Text>
                  <Text style={[styles.posValue, { color: colors.foreground }]}>
                    {holding.averageCost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Text>
                </View>
                <View>
                  <Text style={[styles.posLabel, { color: colors.mutedForeground }]}>Value</Text>
                  <Text style={[styles.posValue, { color: colors.foreground }]}>
                    {(holding.quantity * asset.price).toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 12, backgroundColor: colors.background, borderTopColor: colors.border }]}>
        {/* Watchlist toggle */}
        <Pressable
          onPress={handleWatchToggle}
          style={({ pressed }) => [
            styles.watchFooterBtn,
            {
              borderColor: watched ? colors.coin : colors.border,
              backgroundColor: watched ? colors.coin + "15" : colors.card,
              opacity: pressed ? 0.85 : 1,
            },
          ]}
        >
          <Feather name="bookmark" size={18} color={watched ? colors.coin : colors.mutedForeground} />
          <Text style={[styles.watchFooterText, { color: watched ? colors.coin : colors.mutedForeground }]}>
            {watched ? "Watching" : "Watch"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setTradeMode("buy")}
          style={({ pressed }) => [styles.tradeBtn, { backgroundColor: colors.green, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 }]}
        >
          <Feather name="arrow-down-left" size={18} color="#0C0F14" />
          <Text style={[styles.tradeBtnText, { color: "#0C0F14" }]}>Buy</Text>
        </Pressable>

        {holding && (
          <Pressable
            onPress={() => setTradeMode("sell")}
            style={({ pressed }) => [styles.tradeBtn, { backgroundColor: colors.red, borderRadius: colors.radius, opacity: pressed ? 0.85 : 1 }]}
          >
            <Feather name="arrow-up-right" size={18} color="#fff" />
            <Text style={[styles.tradeBtnText, { color: "#fff" }]}>Sell</Text>
          </Pressable>
        )}
      </View>

      <Modal visible={!!tradeMode} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setTradeMode(null)}>
        {tradeMode && (
          <TradeModal
            mode={tradeMode}
            onClose={() => setTradeMode(null)}
            assetId={asset.id}
            assetName={asset.name}
            assetSymbol={asset.symbol}
            price={asset.price}
            colors={colors}
          />
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 16 },
  backBtn: { padding: 4 },
  typeBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  typeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingHorizontal: 20, marginBottom: 4 },
  symbol: { fontSize: 28, fontFamily: "Inter_700Bold" },
  assetName: { fontSize: 14, fontFamily: "Inter_400Regular" },
  sport: { fontSize: 12, fontFamily: "Inter_400Regular" },
  changeBadge: { flexDirection: "row", alignItems: "center", gap: 4, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8 },
  changeText: { fontSize: 14, fontFamily: "Inter_700Bold" },
  price: { fontSize: 42, fontFamily: "Inter_700Bold", paddingHorizontal: 20, lineHeight: 50 },
  priceUnit: { fontSize: 12, fontFamily: "Inter_500Medium", paddingHorizontal: 20, marginBottom: 20 },
  chartContainer: { paddingHorizontal: 20, marginBottom: 20 },
  card: { borderRadius: 14, borderWidth: 1, padding: 16, gap: 8 },
  cardLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  cardBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  positionRow: { flexDirection: "row", justifyContent: "space-between" },
  posLabel: { fontSize: 11, fontFamily: "Inter_400Regular" },
  posValue: { fontSize: 16, fontFamily: "Inter_700Bold" },
  footer: { position: "absolute", bottom: 0, left: 0, right: 0, flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingTop: 12, borderTopWidth: 1 },
  watchFooterBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, height: 52, paddingHorizontal: 14, borderRadius: 12, borderWidth: 1.5 },
  watchFooterText: { fontSize: 13, fontFamily: "Inter_700Bold" },
  tradeBtn: { flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, height: 52 },
  tradeBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  newsItem: { borderRadius: 10, borderWidth: 1, padding: 10, gap: 6 },
  newsItemTop: { flexDirection: "row", alignItems: "center", gap: 6, flexWrap: "wrap" as const },
  newsItemCat: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  newsItemCatText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
  newsItemSent: { paddingHorizontal: 7, paddingVertical: 3, borderRadius: 5 },
  newsItemSentText: { fontSize: 10, fontFamily: "Inter_700Bold" },
  newsItemTs: { fontSize: 10, fontFamily: "Inter_400Regular", marginLeft: "auto" as any },
  newsItemTitle: { fontSize: 13, fontFamily: "Inter_700Bold", lineHeight: 20 },
  newsItemSummary: { fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  newsItemBottom: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  newsItemLesson: { fontSize: 11, fontFamily: "Inter_600SemiBold", flex: 1 },
  newsMoreBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 6, borderRadius: 9, borderWidth: 1, paddingVertical: 9 },
  newsMoreBtnText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});

const tradeStyles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, paddingBottom: 16, borderBottomWidth: 1 },
  title: { fontSize: 20, fontFamily: "Inter_700Bold" },
  priceBox: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 12 },
  priceLabel: { fontSize: 11, fontFamily: "Inter_500Medium" },
  priceValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  balanceBox: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  balLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  balValue: { fontSize: 18, fontFamily: "Inter_700Bold" },
  qtyLabel: { fontSize: 13, fontFamily: "Inter_600SemiBold", marginBottom: 8 },
  qtyInput: { height: 52, borderRadius: 10, borderWidth: 1, paddingHorizontal: 16, fontSize: 22, fontFamily: "Inter_700Bold", marginBottom: 12 },
  presets: { flexDirection: "row", gap: 8, marginBottom: 20 },
  preset: { flex: 1, height: 38, borderRadius: 8, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  presetText: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  totalBox: { borderRadius: 12, borderWidth: 1, padding: 14, marginBottom: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  totalLabel: { fontSize: 12, fontFamily: "Inter_500Medium" },
  totalValue: { fontSize: 20, fontFamily: "Inter_700Bold" },
  tradeBtn: { height: 54, alignItems: "center", justifyContent: "center" },
  tradeBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
});
