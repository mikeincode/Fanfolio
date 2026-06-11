/**
 * lib/feedback.ts
 *
 * Beta feedback integration via Tally.so.
 * - On web: loads the Tally embed script (once) and opens a popup.
 * - On native / fallback: opens the URL with Linking.
 * - If env vars are missing: dev-only alert, no crash.
 *
 * Hidden fields sent with every submission:
 *   source, screen, build, username
 */

import { Platform, Linking, Alert } from "react-native";

const FEEDBACK_URL: string = process.env.EXPO_PUBLIC_TALLY_FEEDBACK_URL ?? "";
const FORM_ID: string = process.env.EXPO_PUBLIC_TALLY_FORM_ID ?? "";
export const BUILD_TAG = "beta-rc1";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export interface FeedbackOptions {
  source?: string;
  screen?: string;
  username?: string;
}

// ─────────────────────────────────────────────────────────────────────────────
// URL builder
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns the Tally URL with hidden fields appended as query params.
 * Returns empty string if EXPO_PUBLIC_TALLY_FEEDBACK_URL is not set.
 */
export function getFeedbackUrl(options: FeedbackOptions = {}): string {
  if (!FEEDBACK_URL) return "";

  const { source, screen, username } = options;

  try {
    const url = new URL(FEEDBACK_URL);
    url.searchParams.set("build", BUILD_TAG);
    if (source) url.searchParams.set("source", source);
    if (screen) url.searchParams.set("screen", screen);
    if (username) url.searchParams.set("username", username);
    return url.toString();
  } catch {
    return FEEDBACK_URL;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// Safe window accessor — avoids TypeScript cast errors on window
// ─────────────────────────────────────────────────────────────────────────────

function getWindowProp<T>(key: string): T | undefined {
  if (typeof window === "undefined") return undefined;
  return (window as unknown as Record<string, unknown>)[key] as T | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// Tally script loader (web only, injected once)
// ─────────────────────────────────────────────────────────────────────────────

let _tallyScriptLoading = false;
let _tallyScriptReady = false;

function loadTallyScript(): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") { resolve(); return; }

    // Already ready
    if (_tallyScriptReady || getWindowProp("Tally") !== undefined) {
      _tallyScriptReady = true;
      resolve();
      return;
    }

    // Already loading — poll until ready or timeout
    if (_tallyScriptLoading) {
      const check = setInterval(() => {
        if (getWindowProp("Tally") !== undefined) {
          _tallyScriptReady = true;
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => { clearInterval(check); resolve(); }, 4000);
      return;
    }

    // Inject script
    _tallyScriptLoading = true;
    const existing = document.getElementById("tally-js");
    if (existing) {
      const check = setInterval(() => {
        if (getWindowProp("Tally") !== undefined) {
          _tallyScriptReady = true;
          clearInterval(check);
          resolve();
        }
      }, 100);
      setTimeout(() => { clearInterval(check); resolve(); }, 4000);
      return;
    }

    const script = document.createElement("script");
    script.id = "tally-js";
    script.src = "https://tally.so/widgets/embed.js";
    script.async = true;
    script.onload = () => {
      _tallyScriptReady = true;
      _tallyScriptLoading = false;
      resolve();
    };
    script.onerror = () => {
      _tallyScriptLoading = false;
      resolve();
    };
    document.head.appendChild(script);
    setTimeout(() => { resolve(); }, 5000);
  });
}

// ─────────────────────────────────────────────────────────────────────────────
// Main entry point
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Opens the Tally feedback form.
 *
 * @param source    Where feedback was triggered (e.g. "settings", "profile", "home")
 * @param screen    Current screen name (mirrors source for most cases)
 * @param username  Trader display name — appended as a hidden field
 */
export async function openFeedbackForm(
  source?: string,
  screen?: string,
  username?: string,
): Promise<void> {
  if (!FEEDBACK_URL || !FORM_ID) {
    if (__DEV__) {
      Alert.alert(
        "Dev Notice",
        "EXPO_PUBLIC_TALLY_FEEDBACK_URL and EXPO_PUBLIC_TALLY_FORM_ID are not set.\nAdd them to artifacts/fanfolio/.env to enable feedback.",
      );
    }
    return;
  }

  const opts: FeedbackOptions = { source, screen, username };
  const url = getFeedbackUrl(opts);

  if (Platform.OS === "web") {
    try {
      if (typeof window !== "undefined") {
        await loadTallyScript();

        type TallyAPI = { openPopup: (id: string, opts: Record<string, unknown>) => void };
        const tally = getWindowProp<TallyAPI>("Tally");

        if (tally?.openPopup) {
          const popupOptions: Record<string, unknown> = {
            layout: "default",
            width: 700,
            build: BUILD_TAG,
          };
          if (source) popupOptions.source = source;
          if (screen) popupOptions.screen = screen;
          if (username) popupOptions.username = username;

          tally.openPopup(FORM_ID, popupOptions);
          return;
        }

        // Popup unavailable — open in new tab
        window.open(url, "_blank", "noopener,noreferrer");
        return;
      }
    } catch {
      // fall through to Linking
    }
  }

  // Native or final web fallback
  try {
    await Linking.openURL(url);
  } catch {
    if (__DEV__) {
      Alert.alert("Feedback", "Could not open feedback form. URL: " + url);
    }
  }
}
