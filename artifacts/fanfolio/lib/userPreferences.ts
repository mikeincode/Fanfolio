import { useState, useEffect, useCallback } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const PREFS_KEY = "@fanfolio_user_preferences_v1";

export interface UserPreferences {
  hapticsEnabled: boolean;
  educationalTipsEnabled: boolean;
  compactCardsEnabled: boolean;
  showSafetyDisclaimers: boolean;
}

export const defaultPreferences: UserPreferences = {
  hapticsEnabled: true,
  educationalTipsEnabled: true,
  compactCardsEnabled: false,
  showSafetyDisclaimers: true,
};

function parsePreferences(raw: string): UserPreferences {
  try {
    const parsed = JSON.parse(raw) as Partial<UserPreferences>;
    return {
      hapticsEnabled: typeof parsed.hapticsEnabled === "boolean" ? parsed.hapticsEnabled : defaultPreferences.hapticsEnabled,
      educationalTipsEnabled: typeof parsed.educationalTipsEnabled === "boolean" ? parsed.educationalTipsEnabled : defaultPreferences.educationalTipsEnabled,
      compactCardsEnabled: typeof parsed.compactCardsEnabled === "boolean" ? parsed.compactCardsEnabled : defaultPreferences.compactCardsEnabled,
      showSafetyDisclaimers: typeof parsed.showSafetyDisclaimers === "boolean" ? parsed.showSafetyDisclaimers : defaultPreferences.showSafetyDisclaimers,
    };
  } catch {
    return defaultPreferences;
  }
}

export function useUserPreferences() {
  const [prefs, setPrefs] = useState<UserPreferences>(defaultPreferences);
  const [prefsLoaded, setPrefsLoaded] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(PREFS_KEY).then((raw) => {
      if (raw) setPrefs(parsePreferences(raw));
      setPrefsLoaded(true);
    });
  }, []);

  const updatePref = useCallback(
    async <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => {
      const next = { ...prefs, [key]: value };
      setPrefs(next);
      await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
    },
    [prefs]
  );

  const resetPreferences = useCallback(async () => {
    setPrefs(defaultPreferences);
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(defaultPreferences));
  }, []);

  return { prefs, prefsLoaded, updatePref, resetPreferences };
}
