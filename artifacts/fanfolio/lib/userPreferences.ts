import React, { useState, useEffect, useCallback, useContext, createContext } from "react";
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

// ── Context ────────────────────────────────────────────────────

interface UserPreferencesContextValue {
  prefs: UserPreferences;
  prefsLoaded: boolean;
  updatePref: <K extends keyof UserPreferences>(key: K, value: UserPreferences[K]) => Promise<void>;
  resetPreferences: () => Promise<void>;
}

const UserPreferencesContext = createContext<UserPreferencesContextValue | null>(null);

// ── Provider ───────────────────────────────────────────────────

export function UserPreferencesProvider({ children }: { children: React.ReactNode }) {
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
      setPrefs((current) => {
        const next = { ...current, [key]: value };
        AsyncStorage.setItem(PREFS_KEY, JSON.stringify(next));
        return next;
      });
    },
    []
  );

  const resetPreferences = useCallback(async () => {
    setPrefs(defaultPreferences);
    await AsyncStorage.setItem(PREFS_KEY, JSON.stringify(defaultPreferences));
  }, []);

  return React.createElement(
    UserPreferencesContext.Provider,
    { value: { prefs, prefsLoaded, updatePref, resetPreferences } },
    children
  );
}

// ── Hook ───────────────────────────────────────────────────────

export function useUserPreferences(): UserPreferencesContextValue {
  const ctx = useContext(UserPreferencesContext);
  if (!ctx) {
    throw new Error("useUserPreferences must be used inside UserPreferencesProvider");
  }
  return ctx;
}
