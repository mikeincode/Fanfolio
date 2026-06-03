import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { useGame } from "@/context/GameContext";

export default function AuthScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { signIn, signUp, isCloudReady, fetchCloudState } = useGame();

  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSubmit = async () => {
    setErrorMsg("");
    setSuccessMsg("");
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedPassword = password;

    if (!trimmedEmail || !trimmedPassword) {
      setErrorMsg("Please enter your email and password.");
      return;
    }
    if (trimmedPassword.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      if (mode === "signup") {
        const result = await signUp(trimmedEmail, trimmedPassword);
        if (result.error) {
          setErrorMsg(result.error);
        } else if (result.needsConfirmation) {
          setSuccessMsg("Check your email to confirm your account, then sign in.");
        } else {
          // Signed up and confirmed — go to cloud-save manager
          router.replace("/cloud-save");
        }
      } else {
        const result = await signIn(trimmedEmail, trimmedPassword);
        if (result.error) {
          setErrorMsg(result.error);
        } else {
          // Route to cloud-save manager so user can compare before overwriting anything
          router.replace("/cloud-save");
        }
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isCloudReady) {
    return (
      <View style={[styles.container, { backgroundColor: colors.background, paddingTop: topPad }]}>
        <View style={styles.navBar}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <Feather name="arrow-left" size={22} color={colors.foreground} />
          </Pressable>
          <Text style={[styles.navTitle, { color: colors.foreground }]}>Cloud Save</Text>
          <View style={{ width: 30 }} />
        </View>
        <View style={styles.notConfiguredWrap}>
          <Feather name="cloud-off" size={40} color={colors.mutedForeground} />
          <Text style={[styles.notConfiguredTitle, { color: colors.foreground }]}>Cloud save not configured.</Text>
          <Text style={[styles.notConfiguredBody, { color: colors.mutedForeground }]}>
            Supabase environment variables are not set. The app will continue to work locally.
          </Text>
          <Pressable onPress={() => router.back()} style={[styles.submitBtn, { backgroundColor: colors.primary }]}>
            <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: colors.background }]}
      contentContainerStyle={{ paddingTop: topPad, paddingBottom: bottomPad + 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.navBar}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <Text style={[styles.navTitle, { color: colors.foreground }]}>
          {mode === "signin" ? "Sign In" : "Create Account"}
        </Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        <View style={[styles.iconWrap, { backgroundColor: colors.primary + "18", borderColor: colors.primary + "35" }]}>
          <Feather name="cloud" size={32} color={colors.primary} />
        </View>

        <Text style={[styles.heading, { color: colors.foreground }]}>
          {mode === "signin" ? "Welcome back" : "Save your progress"}
        </Text>
        <Text style={[styles.subheading, { color: colors.mutedForeground }]}>
          {mode === "signin"
            ? "Sign in to compare and sync your simulated portfolio across devices."
            : "Create a free account to back up your Fanfolio progress."}
        </Text>

        <View style={[styles.safetyCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Feather name="shield" size={14} color={colors.primary} />
          <Text style={[styles.safetyText, { color: colors.mutedForeground }]}>
            Cloud save stores simulated Fanfolio progress only. LuckyCoin has no cash value.
          </Text>
        </View>

        <View style={styles.form}>
          <Text style={[styles.label, { color: colors.foreground }]}>Email</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="you@example.com"
            placeholderTextColor={colors.mutedForeground}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="email-address"
            textContentType="emailAddress"
          />

          <Text style={[styles.label, { color: colors.foreground }]}>Password</Text>
          <TextInput
            style={[styles.input, { backgroundColor: colors.card, borderColor: colors.border, color: colors.foreground }]}
            placeholder="Min. 6 characters"
            placeholderTextColor={colors.mutedForeground}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType={mode === "signup" ? "newPassword" : "password"}
          />

          {errorMsg !== "" && (
            <View style={[styles.alertBox, { backgroundColor: "#FF4D4D20", borderColor: "#FF4D4D40" }]}>
              <Feather name="alert-circle" size={14} color="#FF4D4D" />
              <Text style={[styles.alertText, { color: "#FF4D4D" }]}>{errorMsg}</Text>
            </View>
          )}

          {successMsg !== "" && (
            <View style={[styles.alertBox, { backgroundColor: colors.green + "20", borderColor: colors.green + "40" }]}>
              <Feather name="check-circle" size={14} color={colors.green} />
              <Text style={[styles.alertText, { color: colors.green }]}>{successMsg}</Text>
            </View>
          )}

          <Pressable
            onPress={handleSubmit}
            disabled={loading}
            style={({ pressed }) => [
              styles.submitBtn,
              { backgroundColor: colors.primary, opacity: pressed || loading ? 0.8 : 1 },
            ]}
          >
            {loading ? (
              <ActivityIndicator color={colors.primaryForeground} />
            ) : (
              <Text style={[styles.submitBtnText, { color: colors.primaryForeground }]}>
                {mode === "signin" ? "Sign In" : "Create Account"}
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => { setMode(m => m === "signin" ? "signup" : "signin"); setErrorMsg(""); setSuccessMsg(""); }}
            style={styles.switchBtn}
          >
            <Text style={[styles.switchText, { color: colors.mutedForeground }]}>
              {mode === "signin" ? "Don't have an account? " : "Already have an account? "}
              <Text style={{ color: colors.primary, fontFamily: "Inter_600SemiBold" }}>
                {mode === "signin" ? "Create one" : "Sign in"}
              </Text>
            </Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, marginBottom: 24 },
  backBtn: { padding: 4 },
  navTitle: { fontSize: 17, fontFamily: "Inter_600SemiBold" },
  body: { paddingHorizontal: 24, gap: 16 },
  iconWrap: { width: 70, height: 70, borderRadius: 20, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  heading: { fontSize: 26, fontFamily: "Inter_700Bold" },
  subheading: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, marginTop: -8 },
  safetyCard: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 10, borderWidth: 1, padding: 12 },
  safetyText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },
  form: { gap: 10, marginTop: 4 },
  label: { fontSize: 13, fontFamily: "Inter_600SemiBold" },
  input: { height: 48, borderRadius: 10, borderWidth: 1, paddingHorizontal: 14, fontSize: 15, fontFamily: "Inter_400Regular" },
  alertBox: { flexDirection: "row", alignItems: "flex-start", gap: 8, borderRadius: 8, borderWidth: 1, padding: 10 },
  alertText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 18 },
  submitBtn: { height: 50, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 4 },
  submitBtnText: { fontSize: 16, fontFamily: "Inter_700Bold" },
  switchBtn: { alignItems: "center", paddingVertical: 8 },
  switchText: { fontSize: 14, fontFamily: "Inter_400Regular" },
  notConfiguredWrap: { flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 32, gap: 16 },
  notConfiguredTitle: { fontSize: 20, fontFamily: "Inter_700Bold", textAlign: "center" },
  notConfiguredBody: { fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22, textAlign: "center" },
});
