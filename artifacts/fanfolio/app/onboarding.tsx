import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

const STEPS = [
  {
    id: "welcome",
    icon: "trending-up" as const,
    title: "Welcome to Fanfolio",
    subtitle: "The sports market simulator",
    body: "Trade simulated sports assets, build your portfolio, and learn real market concepts — all with LuckyCoin. No real money. No gambling. Pure sports market fun.",
  },
  {
    id: "luckcoin",
    icon: "dollar-sign" as const,
    title: "Meet LuckyCoin",
    subtitle: "Your virtual trading currency",
    body: "You start with 10,000 LuckyCoin to build your portfolio. Claim 1,000 more every day. LuckyCoin has no cash value — this is an educational simulation only.",
  },
  {
    id: "market",
    icon: "activity" as const,
    title: "The Market",
    subtitle: "Stocks, coins, indexes, and futures",
    body: "Browse Team Stocks, Player Coins, Sport Indexes, Meme Coins, and Futures. Each asset has a Risk Score from 1 (safe) to 10 (extreme chaos). You decide how to balance your portfolio.",
  },
  {
    id: "learn",
    icon: "book-open" as const,
    title: "Learn as You Play",
    subtitle: "Finance concepts explained with sports",
    body: "Every trade teaches you something. Volatility, diversification, buying the dip, hype bubbles — all explained through sports examples you already understand.",
  },
  {
    id: "disclaimer",
    icon: "shield" as const,
    title: "Important Disclaimer",
    subtitle: "Educational simulation only",
    body: "Fanfolio is a fake-money educational sports market simulator. LuckyCoin has no cash value. No real money, gambling, deposits, withdrawals, or cash prizes are involved.",
  },
];

export default function OnboardingScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { completeOnboarding } = useGame();
  const [step, setStep] = useState(0);
  const [username, setUsername] = useState("");

  const isLast = step === STEPS.length - 1;
  const current = STEPS[step];

  const handleNext = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    if (isLast) {
      const name = username.trim() || "TraderFan";
      completeOnboarding(name);
      router.replace("/(tabs)");
    } else {
      setStep(s => s + 1);
    }
  };

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  return (
    <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
      <ScrollView contentContainerStyle={[styles.content, { paddingBottom: bottomPad + 100 }]} showsVerticalScrollIndicator={false}>
        <View style={styles.stepIndicator}>
          {STEPS.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                {
                  backgroundColor: i === step ? colors.primary : colors.border,
                  width: i === step ? 24 : 8,
                },
              ]}
            />
          ))}
        </View>

        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "20", borderColor: colors.primary + "40" }]}>
          <Feather name={current.icon} size={36} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>{current.title}</Text>
        <Text style={[styles.subtitle, { color: colors.primary }]}>{current.subtitle}</Text>
        <Text style={[styles.body, { color: colors.mutedForeground }]}>{current.body}</Text>

        {isLast && (
          <View style={styles.usernameSection}>
            <Text style={[styles.usernameLabel, { color: colors.foreground }]}>Choose your trader name</Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  color: colors.foreground,
                  fontFamily: "Inter_500Medium",
                },
              ]}
              placeholder="e.g. MarketMVP"
              placeholderTextColor={colors.mutedForeground}
              value={username}
              onChangeText={setUsername}
              maxLength={20}
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>
        )}

        {step === 1 && (
          <View style={[styles.rewardCard, { backgroundColor: colors.coin + "15", borderColor: colors.coin + "40" }]}>
            <Feather name="dollar-sign" size={20} color={colors.coin} />
            <View style={styles.rewardText}>
              <Text style={[styles.rewardTitle, { color: colors.coin }]}>Starting Bonus</Text>
              <Text style={[styles.rewardValue, { color: colors.foreground }]}>10,000 LuckyCoin</Text>
            </View>
          </View>
        )}
      </ScrollView>

      <View style={[styles.footer, { paddingBottom: bottomPad + 12, backgroundColor: colors.background }]}>
        <Pressable
          onPress={handleNext}
          style={({ pressed }) => [
            styles.button,
            {
              backgroundColor: colors.primary,
              opacity: pressed ? 0.85 : 1,
              borderRadius: colors.radius,
            },
          ]}
        >
          <Text style={[styles.buttonText, { color: colors.primaryForeground }]}>
            {isLast ? "Start Trading" : "Next"}
          </Text>
          <Feather name={isLast ? "zap" : "arrow-right"} size={18} color={colors.primaryForeground} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    gap: 20,
  },
  stepIndicator: {
    flexDirection: "row",
    gap: 6,
    marginBottom: 8,
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
  iconWrap: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontFamily: "Inter_700Bold",
    lineHeight: 34,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
    marginTop: -8,
  },
  body: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    lineHeight: 24,
  },
  usernameSection: {
    gap: 10,
    marginTop: 8,
  },
  usernameLabel: {
    fontSize: 14,
    fontFamily: "Inter_600SemiBold",
  },
  input: {
    height: 48,
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    fontSize: 15,
  },
  rewardCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  rewardText: {
    gap: 2,
  },
  rewardTitle: {
    fontSize: 12,
    fontFamily: "Inter_600SemiBold",
  },
  rewardValue: {
    fontSize: 18,
    fontFamily: "Inter_700Bold",
  },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 52,
  },
  buttonText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
  },
});
