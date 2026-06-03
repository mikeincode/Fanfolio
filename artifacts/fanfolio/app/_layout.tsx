import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  useFonts,
} from "@expo-google-fonts/inter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-safe-area-context";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GameProvider } from "@/context/GameContext";
import { UserPreferencesProvider } from "@/lib/userPreferences";

SplashScreen.preventAutoHideAsync();

const queryClient = new QueryClient();

function RootLayoutNav() {
  return (
    <Stack screenOptions={{ headerBackTitle: "Back", headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="onboarding" options={{ headerShown: false, gestureEnabled: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="asset/[id]" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="profile" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="auth" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="cloud-save" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="news" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="journal" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="challenges" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="portfolio-coach" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="strategy-profile" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="dev-reset" options={{ headerShown: false, presentation: "card" }} />
      <Stack.Screen name="settings" options={{ headerShown: false, presentation: "card" }} />
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  if (!fontsLoaded && !fontError) return null;

  return (
    <SafeAreaProvider>
      <ErrorBoundary>
        <QueryClientProvider client={queryClient}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <KeyboardProvider>
              <UserPreferencesProvider>
                <GameProvider>
                  <RootLayoutNav />
                </GameProvider>
              </UserPreferencesProvider>
            </KeyboardProvider>
          </GestureHandlerRootView>
        </QueryClientProvider>
      </ErrorBoundary>
    </SafeAreaProvider>
  );
}
