import * as Haptics from "expo-haptics";
import { useUserPreferences } from "@/lib/userPreferences";

export function useHaptics() {
  const { prefs } = useUserPreferences();
  return {
    notificationAsync(type: Haptics.NotificationFeedbackType) {
      if (prefs.hapticsEnabled) Haptics.notificationAsync(type);
    },
    impactAsync(style: Haptics.ImpactFeedbackStyle) {
      if (prefs.hapticsEnabled) Haptics.impactAsync(style);
    },
    selectionAsync() {
      if (prefs.hapticsEnabled) Haptics.selectionAsync();
    },
  };
}
