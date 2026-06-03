import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { Redirect, router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useGame } from "@/context/GameContext";
import { useColors } from "@/hooks/useColors";

export default function RootIndex() {
  const {
    hasCompletedOnboarding,
    saveHealthStatus,
    saveHealthMessage,
    corruptedSaveBackedUpAt,
    resetCorruptedLocalSave,
    restoreCorruptedBackup,
    cloudUser,
  } = useGame();
  const colors = useColors();
  const insets = useSafeAreaInsets();

  const [restoring, setRestoring] = useState(false);
  const [restoreResult, setRestoreResult] = useState<{ success: boolean; error: string | null } | null>(null);

  if (saveHealthStatus === "corrupted" && restoreResult?.success !== true) {
    const backedUpDate = corruptedSaveBackedUpAt
      ? new Date(corruptedSaveBackedUpAt).toLocaleString("en-US", {
          month: "short",
          day: "numeric",
          hour: "numeric",
          minute: "2-digit",
        })
      : null;

    const handleContinueFresh = () => {
      resetCorruptedLocalSave();
    };

    const handleRestoreBackup = async () => {
      setRestoring(true);
      const result = await restoreCorruptedBackup();
      setRestoreResult(result);
      setRestoring(false);
    };

    return (
      <ScrollView
        style={[styles.container, { backgroundColor: colors.background }]}
        contentContainerStyle={{ paddingTop: insets.top + 24, paddingBottom: 60, paddingHorizontal: 24 }}
      >
        <View style={[styles.iconCircle, { backgroundColor: "#EF444418" }]}>
          <Feather name="alert-triangle" size={32} color="#EF4444" />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Save Recovery
        </Text>
        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          Your local save had an issue, so Fanfolio started safely with a fresh local save.
        </Text>

        <View style={[styles.detailCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.detailLabel, { color: colors.mutedForeground }]}>WHAT HAPPENED</Text>
          <Text style={[styles.detailText, { color: colors.foreground }]}>{saveHealthMessage}</Text>
          {backedUpDate && (
            <Text style={[styles.detailSub, { color: colors.mutedForeground }]}>
              Corrupted save backed up at {backedUpDate}
            </Text>
          )}
        </View>

        <View style={[styles.safeCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
          <Feather name="shield" size={14} color={colors.primary} style={{ marginTop: 2 }} />
          <View style={{ flex: 1, gap: 4 }}>
            <Text style={[styles.safeTitle, { color: colors.primary }]}>Your cloud save is safe</Text>
            <Text style={[styles.safeBody, { color: colors.mutedForeground }]}>
              Cloud save was not deleted.{"\n"}LuckyCoin has no cash value.
            </Text>
          </View>
        </View>

        {restoreResult?.success === false && (
          <View style={[styles.errorRow, { backgroundColor: "#EF444418", borderColor: "#EF444435" }]}>
            <Feather name="alert-circle" size={14} color="#EF4444" />
            <Text style={[styles.errorText, { color: "#EF4444" }]}>
              {restoreResult.error ?? "Could not restore backup."}
            </Text>
          </View>
        )}

        <View style={styles.buttonStack}>
          <Pressable
            onPress={handleContinueFresh}
            style={({ pressed }) => [
              styles.primaryBtn,
              { backgroundColor: colors.primary, opacity: pressed ? 0.8 : 1 },
            ]}
          >
            <Feather name="play" size={16} color="#fff" />
            <Text style={styles.primaryBtnText}>Continue with fresh local save</Text>
          </Pressable>

          {corruptedSaveBackedUpAt !== null && (
            <Pressable
              onPress={handleRestoreBackup}
              disabled={restoring}
              style={({ pressed }) => [
                styles.secondaryBtn,
                { borderColor: colors.border, opacity: pressed || restoring ? 0.7 : 1 },
              ]}
            >
              {restoring ? (
                <ActivityIndicator size="small" color={colors.foreground} />
              ) : (
                <Feather name="refresh-cw" size={15} color={colors.foreground} />
              )}
              <Text style={[styles.secondaryBtnText, { color: colors.foreground }]}>
                {restoring ? "Restoring…" : "Try to restore corrupted backup"}
              </Text>
            </Pressable>
          )}

          <Pressable
            onPress={() => router.push("/cloud-save")}
            style={({ pressed }) => [
              styles.secondaryBtn,
              { borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Feather name="cloud" size={15} color={cloudUser ? colors.primary : colors.foreground} />
            <Text style={[styles.secondaryBtnText, { color: cloudUser ? colors.primary : colors.foreground }]}>
              {cloudUser ? "Open Cloud Save Manager" : "Sign in / Open Cloud Save Manager"}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  if (restoreResult?.success === true) {
    return <Redirect href={hasCompletedOnboarding ? "/(tabs)" : "/onboarding"} />;
  }

  return <Redirect href={hasCompletedOnboarding ? "/(tabs)" : "/onboarding"} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    alignItems: "center",
    justifyContent: "center",
    alignSelf: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontFamily: "Inter_700Bold",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Inter_400Regular",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 24,
  },
  detailCard: {
    borderRadius: 14,
    borderWidth: 1,
    padding: 16,
    gap: 8,
    marginBottom: 14,
  },
  detailLabel: {
    fontSize: 10,
    fontFamily: "Inter_700Bold",
    letterSpacing: 0.6,
  },
  detailText: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  detailSub: {
    fontSize: 11,
    fontFamily: "Inter_400Regular",
    marginTop: 2,
  },
  safeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginBottom: 14,
  },
  safeTitle: {
    fontSize: 13,
    fontFamily: "Inter_700Bold",
  },
  safeBody: {
    fontSize: 13,
    fontFamily: "Inter_400Regular",
    lineHeight: 20,
  },
  errorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
    marginBottom: 8,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    fontFamily: "Inter_400Regular",
  },
  buttonStack: {
    gap: 10,
    marginTop: 6,
  },
  primaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 13,
    height: 54,
  },
  primaryBtnText: {
    fontSize: 16,
    fontFamily: "Inter_700Bold",
    color: "#fff",
  },
  secondaryBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 13,
    height: 50,
    borderWidth: 1.5,
  },
  secondaryBtnText: {
    fontSize: 15,
    fontFamily: "Inter_600SemiBold",
  },
});
