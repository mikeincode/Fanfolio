import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

const FANFOLIO_KEYS = [
  "@fanfolio_game_state_v2",
  "@fanfolio_local_saved_at",
  "@fanfolio_local_backup_v1",
  "@fanfolio_onboarding_complete",
];

type Phase = "idle" | "confirm" | "resetting" | "done" | "error";

export default function DevResetScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signOut, cloudUser } = useGame();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [phase, setPhase] = useState<Phase>("idle");
  const [errorMsg, setErrorMsg] = useState("");

  const handleReset = async () => {
    setPhase("resetting");
    setErrorMsg("");
    try {
      await AsyncStorage.multiRemove(FANFOLIO_KEYS);
      if (cloudUser) {
        await signOut();
      }
      setPhase("done");
      setTimeout(() => {
        router.replace("/");
      }, 1200);
    } catch (e: unknown) {
      setErrorMsg(e instanceof Error ? e.message : "Unknown error");
      setPhase("error");
    }
  };

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: 60 }}
      keyboardShouldPersistTaps="handled"
    >
      {/* Nav */}
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Developer Reset</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        {/* Dev badge */}
        <View style={[styles.devBadge, { backgroundColor: "#F59E0B18", borderColor: "#F59E0B40" }]}>
          <Feather name="tool" size={13} color="#F59E0B" />
          <Text style={[styles.devBadgeText, { color: "#F59E0B" }]}>Development Tool — Not visible to end users</Text>
        </View>

        <Text style={[styles.heading, { color: colors.foreground }]}>Reset Local Save</Text>
        <Text style={[styles.body2, { color: colors.mutedForeground }]}>
          Because Replit Preview persists AsyncStorage between sessions, this tool clears all local Fanfolio data so you can test a fresh install without reinstalling the app.
        </Text>

        {/* Keys that will be cleared */}
        <View style={[styles.keysCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.keysTitle, { color: colors.mutedForeground }]}>ASYNC STORAGE KEYS THAT WILL BE REMOVED</Text>
          {FANFOLIO_KEYS.map(k => (
            <View key={k} style={styles.keyRow}>
              <Feather name="trash-2" size={12} color={colors.mutedForeground} />
              <Text style={[styles.keyText, { color: colors.foreground }]}>{k}</Text>
            </View>
          ))}
        </View>

        {/* What this does NOT do */}
        <View style={[styles.safeCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
          <Feather name="shield" size={14} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.safeTitle, { color: colors.primary }]}>What this does NOT do</Text>
            <Text style={[styles.safeBody, { color: colors.mutedForeground }]}>
              Cloud data in Supabase is NOT deleted — only local device data is cleared. If you are signed in, you will be signed out of this device only. Your cloud save remains intact and you can reload it after signing back in.
            </Text>
          </View>
        </View>

        <View style={[styles.disclaimerCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="info" size={13} color={colors.mutedForeground} />
          <Text style={[styles.disclaimerText, { color: colors.mutedForeground }]}>
            LuckyCoin is simulated currency with no cash value. This reset only affects simulated local progress.
          </Text>
        </View>

        {/* Status messages */}
        {phase === "done" && (
          <View style={[styles.resultRow, { backgroundColor: colors.green + "18", borderColor: colors.green + "35" }]}>
            <Feather name="check-circle" size={15} color={colors.green} />
            <Text style={[styles.resultText, { color: colors.green }]}>Reset complete — returning to onboarding…</Text>
          </View>
        )}
        {phase === "error" && (
          <View style={[styles.resultRow, { backgroundColor: "#EF444418", borderColor: "#EF444435" }]}>
            <Feather name="alert-circle" size={15} color="#EF4444" />
            <Text style={[styles.resultText, { color: "#EF4444" }]}>{errorMsg || "Reset failed. Try again."}</Text>
          </View>
        )}

        {/* Buttons */}
        {phase === "idle" && (
          <Pressable
            onPress={() => setPhase("confirm")}
            style={({ pressed }) => [
              styles.dangerBtn,
              { backgroundColor: "#EF4444", opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="trash-2" size={16} color="#fff" />
            <Text style={styles.dangerBtnText}>Reset Local Fanfolio Save</Text>
          </Pressable>
        )}

        {phase === "confirm" && (
          <View style={[styles.confirmCard, { backgroundColor: "#EF444410", borderColor: "#EF444435" }]}>
            <Text style={[styles.confirmTitle, { color: "#EF4444" }]}>Are you sure?</Text>
            <Text style={[styles.confirmBody, { color: colors.mutedForeground }]}>
              This will permanently delete local game state, onboarding status, saved-at timestamps, and local backups. You will return to onboarding. Cloud data is unaffected.
            </Text>
            <View style={styles.confirmBtns}>
              <Pressable
                onPress={() => setPhase("idle")}
                style={({ pressed }) => [styles.cancelBtn, { borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}
              >
                <Text style={[styles.cancelBtnText, { color: colors.foreground }]}>Cancel</Text>
              </Pressable>
              <Pressable
                onPress={handleReset}
                style={({ pressed }) => [styles.confirmDangerBtn, { backgroundColor: "#EF4444", opacity: pressed ? 0.8 : 1 }]}
              >
                <Text style={styles.confirmDangerBtnText}>Yes, Reset</Text>
              </Pressable>
            </View>
          </View>
        )}

        {phase === "resetting" && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>Clearing local data…</Text>
          </View>
        )}

        {/* How to use this screen */}
        <View style={[styles.howToCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.howToTitle, { color: colors.foreground }]}>How to navigate here</Text>
          <Text style={[styles.howToBody, { color: colors.mutedForeground }]}>
            In Expo Go / web preview, navigate directly to{" "}
            <Text style={{ fontFamily: "Inter_600SemiBold", color: colors.foreground }}>/dev-reset</Text>
            {" "}by typing it in the address bar or by adding a temporary link in your profile screen during development.
            {"\n\n"}
            This route is registered in the app but has no public entry point — it is for developer use only.
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },

  body: { paddingHorizontal: 20, gap: 14 },

  devBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 7,
    alignSelf: "flex-start",
  },
  devBadgeText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },

  heading: { fontSize: 24, fontFamily: "Inter_700Bold" },
  body2: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginTop: -6 },

  keysCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  keysTitle: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.6, marginBottom: 4 },
  keyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  keyText: { fontSize: 12, fontFamily: "Inter_400Regular" },

  safeCard: { borderRadius: 12, borderWidth: 1, padding: 14, flexDirection: "row", gap: 10, alignItems: "flex-start" },
  safeTitle: { fontSize: 13, fontFamily: "Inter_700Bold", marginBottom: 4 },
  safeBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  disclaimerCard: { borderRadius: 10, borderWidth: 1, padding: 11, flexDirection: "row", gap: 8, alignItems: "flex-start" },
  disclaimerText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },

  resultRow: { flexDirection: "row", alignItems: "center", gap: 8, borderRadius: 10, borderWidth: 1, padding: 12 },
  resultText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },

  dangerBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    height: 52,
    marginTop: 4,
  },
  dangerBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },

  confirmCard: { borderRadius: 12, borderWidth: 1, padding: 16, gap: 12 },
  confirmTitle: { fontSize: 17, fontFamily: "Inter_700Bold" },
  confirmBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
  confirmBtns: { flexDirection: "row", gap: 10 },
  cancelBtn: { flex: 1, height: 46, borderRadius: 10, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  cancelBtnText: { fontSize: 15, fontFamily: "Inter_600SemiBold" },
  confirmDangerBtn: { flex: 1, height: 46, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  confirmDangerBtnText: { fontSize: 15, fontFamily: "Inter_700Bold", color: "#fff" },

  loadingRow: { flexDirection: "row", alignItems: "center", gap: 10, justifyContent: "center", paddingVertical: 16 },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },

  howToCard: { borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 6 },
  howToTitle: { fontSize: 14, fontFamily: "Inter_700Bold", marginBottom: 8 },
  howToBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
