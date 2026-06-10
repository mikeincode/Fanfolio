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
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { isSupabaseConfigured } from "@/lib/supabase";
import {
  getMarketDatabaseCounts,
  getMarketDatabasePreview,
  getIndexMemberSummary,
  type MarketDbCounts,
  type MarketDbPreview,
  type IndexMemberSummary,
} from "@/lib/marketRepository";

const EXPECTED: Partial<Record<keyof MarketDbCounts, number>> = {
  generic_teams: 32,
  generic_player_roles: 160,
  assets: 208,
  asset_price_history: 208,
  index_definitions: 4,
  index_members: 96,
};

const COUNT_ROWS: { key: keyof MarketDbCounts; label: string }[] = [
  { key: "sports", label: "sports" },
  { key: "leagues", label: "leagues" },
  { key: "generic_teams", label: "generic_teams" },
  { key: "generic_player_roles", label: "generic_player_roles" },
  { key: "coach_roles", label: "coach_roles" },
  { key: "assets", label: "assets" },
  { key: "asset_price_history", label: "asset_price_history" },
  { key: "futures_markets", label: "futures_markets" },
  { key: "index_definitions", label: "index_definitions" },
  { key: "index_members", label: "index_members" },
];

type CheckPhase = "idle" | "loading" | "success" | "error";

interface CheckResult {
  counts: MarketDbCounts;
  preview: MarketDbPreview;
  indexSummary: IndexMemberSummary[];
}

function CountCard({
  label,
  count,
  expected,
  colors,
}: {
  label: string;
  count: number;
  expected?: number;
  colors: ReturnType<typeof useColors>;
}) {
  const hasExpected = expected !== undefined;
  const matches = !hasExpected || count === expected;
  const accent = matches ? colors.green : "#EF4444";
  const bg = matches ? colors.green + "15" : "#EF444415";
  const border = matches ? colors.green + "30" : "#EF444430";

  return (
    <View style={[styles.countCard, { backgroundColor: bg, borderColor: border }]}>
      <Text style={[styles.countLabel, { color: colors.mutedForeground }]} numberOfLines={1}>
        {label}
      </Text>
      <View style={styles.countValueRow}>
        {hasExpected && (
          <Feather name={matches ? "check" : "x"} size={13} color={accent} />
        )}
        <Text style={[styles.countValue, { color: accent }]}>{count}</Text>
      </View>
      {hasExpected && !matches && (
        <Text style={[styles.countExpected, { color: colors.mutedForeground }]}>
          exp {expected}
        </Text>
      )}
    </View>
  );
}

export default function DevMarketDbScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  const [phase, setPhase] = useState<CheckPhase>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [result, setResult] = useState<CheckResult | null>(null);

  const handleRun = async () => {
    setPhase("loading");
    setErrorMsg("");
    setResult(null);
    try {
      const [counts, preview, indexSummary] = await Promise.all([
        getMarketDatabaseCounts(),
        getMarketDatabasePreview(),
        getIndexMemberSummary(),
      ]);

      if (!counts || !preview || !indexSummary) {
        setErrorMsg("One or more queries returned null. Check console for details.");
        setPhase("error");
        return;
      }

      setResult({ counts, preview, indexSummary });
      setPhase("success");
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
        <Text style={[styles.navTitle, { color: colors.foreground }]}>Market DB Check</Text>
        <View style={{ width: 30 }} />
      </View>

      <View style={styles.body}>
        {/* Dev badge */}
        <View style={[styles.devBadge, { backgroundColor: "#F59E0B18", borderColor: "#F59E0B40" }]}>
          <Feather name="database" size={13} color="#F59E0B" />
          <Text style={[styles.devBadgeText, { color: "#F59E0B" }]}>
            Development Tool — Read-only Supabase sanity check
          </Text>
        </View>

        <Text style={[styles.heading, { color: colors.foreground }]}>Market DB Check</Text>
        <Text style={[styles.body2, { color: colors.mutedForeground }]}>
          Confirms the Expo app can read the Supabase market database. Compares live row counts
          against expected seed values and shows a small preview of each key table.
          No app behavior is changed — local mock data remains active.
        </Text>

        {/* Config status */}
        {!isSupabaseConfigured ? (
          <View style={[styles.warnCard, { backgroundColor: "#F59E0B18", borderColor: "#F59E0B35" }]}>
            <Feather name="alert-triangle" size={15} color="#F59E0B" />
            <Text style={[styles.warnText, { color: "#F59E0B" }]}>
              Market database is not available in this build.{"\n"}
              EXPO_PUBLIC_SUPABASE_URL and/or EXPO_PUBLIC_SUPABASE_ANON_KEY are missing.{"\n"}
              Local mock data is still active.
            </Text>
          </View>
        ) : (
          <View style={[styles.infoCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name="check-circle" size={13} color={colors.green} />
            <Text style={[styles.infoText, { color: colors.mutedForeground }]}>
              Supabase client is configured. Queries will use anon key — public tables only.
            </Text>
          </View>
        )}

        {/* Tables checked */}
        <View style={[styles.keysCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[styles.keysTitle, { color: colors.mutedForeground }]}>TABLES CHECKED</Text>
          {COUNT_ROWS.map(({ key, label }) => (
            <View key={key} style={styles.keyRow}>
              <Feather name="table" size={11} color={colors.mutedForeground} />
              <Text style={[styles.keyText, { color: colors.foreground }]}>
                {label}
                {EXPECTED[key] !== undefined
                  ? `  (expected ${EXPECTED[key]})`
                  : ""}
              </Text>
            </View>
          ))}
        </View>

        {/* Run button */}
        {phase === "idle" && (
          <Pressable
            onPress={handleRun}
            disabled={!isSupabaseConfigured}
            style={({ pressed }) => [
              styles.runBtn,
              {
                backgroundColor: isSupabaseConfigured ? "#0284C7" : colors.mutedForeground,
                opacity: pressed ? 0.82 : 1,
              },
            ]}
          >
            <Feather name="play" size={16} color="#fff" />
            <Text style={styles.runBtnText}>Run Supabase Market Check</Text>
          </Pressable>
        )}

        {phase === "loading" && (
          <View style={styles.loadingRow}>
            <ActivityIndicator color={colors.primary} />
            <Text style={[styles.loadingText, { color: colors.mutedForeground }]}>
              Querying Supabase…
            </Text>
          </View>
        )}

        {phase === "error" && (
          <>
            <View style={[styles.resultRow, { backgroundColor: "#EF444418", borderColor: "#EF444435" }]}>
              <Feather name="alert-circle" size={15} color="#EF4444" />
              <Text style={[styles.resultText, { color: "#EF4444" }]}>
                {errorMsg || "Check failed. See console for details."}
              </Text>
            </View>
            <Pressable
              onPress={() => setPhase("idle")}
              style={({ pressed }) => [
                styles.runBtn,
                { backgroundColor: "#0284C7", opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Feather name="refresh-cw" size={14} color="#fff" />
              <Text style={styles.runBtnText}>Try Again</Text>
            </Pressable>
          </>
        )}

        {/* ── Results ─────────────────────────────────────────────────── */}
        {phase === "success" && result && (
          <>
            <View style={[styles.resultRow, { backgroundColor: colors.green + "18", borderColor: colors.green + "35" }]}>
              <Feather name="check-circle" size={15} color={colors.green} />
              <Text style={[styles.resultText, { color: colors.green }]}>
                All queries succeeded. Counts below.
              </Text>
            </View>

            {/* Count cards */}
            <View style={[styles.sectionHeader, { borderTopColor: colors.border }]}>
              <Feather name="bar-chart-2" size={14} color={colors.mutedForeground} />
              <Text style={[styles.sectionHeaderText, { color: colors.mutedForeground }]}>
                Row Counts
              </Text>
            </View>

            <View style={styles.countGrid}>
              {COUNT_ROWS.map(({ key, label }) => (
                <CountCard
                  key={key}
                  label={label}
                  count={result.counts[key]}
                  expected={EXPECTED[key]}
                  colors={colors}
                />
              ))}
            </View>

            {/* Index member summary */}
            <View style={[styles.sectionHeader, { borderTopColor: colors.border }]}>
              <Feather name="layers" size={14} color={colors.mutedForeground} />
              <Text style={[styles.sectionHeaderText, { color: colors.mutedForeground }]}>
                Index Member Summary
              </Text>
            </View>

            <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 2 }]}>INDEX</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1, textAlign: "center" }]}>MEMBERS</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1, textAlign: "right" }]}>TOTAL WT</Text>
              </View>
              {result.indexSummary.map((s) => {
                const weightOk = Math.abs(s.total_weight - 100) < 0.01;
                return (
                  <View key={s.index_id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                    <Text style={[styles.tableCell, { color: colors.foreground, flex: 2 }]} numberOfLines={1}>
                      {s.index_name}
                    </Text>
                    <Text style={[styles.tableCell, { color: colors.foreground, flex: 1, textAlign: "center" }]}>
                      {s.member_count}
                    </Text>
                    <Text
                      style={[
                        styles.tableCell,
                        { flex: 1, textAlign: "right", color: weightOk ? colors.green : "#EF4444" },
                      ]}
                    >
                      {s.total_weight.toFixed(3)}%
                    </Text>
                  </View>
                );
              })}
            </View>

            {/* Asset preview */}
            <View style={[styles.sectionHeader, { borderTopColor: colors.border }]}>
              <Feather name="trending-up" size={14} color={colors.mutedForeground} />
              <Text style={[styles.sectionHeaderText, { color: colors.mutedForeground }]}>
                First 5 Assets (by symbol)
              </Text>
            </View>

            <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1 }]}>SYMBOL</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 2 }]}>NAME</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1 }]}>TYPE</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1, textAlign: "right" }]}>PRICE</Text>
              </View>
              {result.preview.assets.map((a) => (
                <View key={a.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1, fontFamily: "Inter_600SemiBold" }]}>
                    {a.symbol}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 2 }]} numberOfLines={1}>
                    {a.public_name}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.mutedForeground, flex: 1, fontSize: 11 }]}>
                    {a.asset_type.replace("_", " ")}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1, textAlign: "right" }]}>
                    {a.current_price.toFixed(2)}
                  </Text>
                </View>
              ))}
            </View>

            {/* Index definitions preview */}
            <View style={[styles.sectionHeader, { borderTopColor: colors.border }]}>
              <Feather name="list" size={14} color={colors.mutedForeground} />
              <Text style={[styles.sectionHeaderText, { color: colors.mutedForeground }]}>
                Index Definitions (all 4)
              </Text>
            </View>

            <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 2 }]}>NAME</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1, textAlign: "right" }]}>WEIGHTING</Text>
              </View>
              {result.preview.index_definitions.map((d) => (
                <View key={d.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 2 }]} numberOfLines={1}>
                    {d.name}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.mutedForeground, flex: 1, textAlign: "right" }]}>
                    {d.weighting_method}
                  </Text>
                </View>
              ))}
            </View>

            {/* Generic teams preview */}
            <View style={[styles.sectionHeader, { borderTopColor: colors.border }]}>
              <Feather name="users" size={14} color={colors.mutedForeground} />
              <Text style={[styles.sectionHeaderText, { color: colors.mutedForeground }]}>
                First 5 Generic Teams (by city)
              </Text>
            </View>

            <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1 }]}>PREFIX</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1 }]}>CITY</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 2 }]}>PUBLIC NAME</Text>
              </View>
              {result.preview.generic_teams.map((t) => (
                <View key={t.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1, fontFamily: "Inter_600SemiBold" }]}>
                    {t.symbol_prefix}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1 }]}>
                    {t.city}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.mutedForeground, flex: 2 }]} numberOfLines={1}>
                    {t.public_name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Player roles preview */}
            <View style={[styles.sectionHeader, { borderTopColor: colors.border }]}>
              <Feather name="user" size={14} color={colors.mutedForeground} />
              <Text style={[styles.sectionHeaderText, { color: colors.mutedForeground }]}>
                First 5 Player Roles (by symbol)
              </Text>
            </View>

            <View style={[styles.tableCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
              <View style={[styles.tableRow, styles.tableHeaderRow, { borderBottomColor: colors.border }]}>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1 }]}>SYMBOL</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 1 }]}>ROLE</Text>
                <Text style={[styles.tableHeader, { color: colors.mutedForeground, flex: 2 }]}>PUBLIC NAME</Text>
              </View>
              {result.preview.generic_player_roles.map((r) => (
                <View key={r.id} style={[styles.tableRow, { borderBottomColor: colors.border }]}>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 11 }]}>
                    {r.asset_symbol}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.mutedForeground, flex: 1 }]}>
                    {r.public_role}
                  </Text>
                  <Text style={[styles.tableCell, { color: colors.foreground, flex: 2 }]} numberOfLines={1}>
                    {r.public_name}
                  </Text>
                </View>
              ))}
            </View>

            {/* Run again */}
            <Pressable
              onPress={() => { setPhase("idle"); setResult(null); }}
              style={({ pressed }) => [
                styles.runBtn,
                { backgroundColor: "#0284C780", opacity: pressed ? 0.82 : 1 },
              ]}
            >
              <Feather name="refresh-cw" size={14} color="#fff" />
              <Text style={styles.runBtnText}>Run Again</Text>
            </Pressable>
          </>
        )}

        {/* Safety note */}
        <View style={[styles.safeCard, { backgroundColor: colors.primary + "10", borderColor: colors.primary + "30" }]}>
          <Feather name="shield" size={14} color={colors.primary} />
          <View style={{ flex: 1 }}>
            <Text style={[styles.safeTitle, { color: colors.primary }]}>What this does NOT do</Text>
            <Text style={[styles.safeBody, { color: colors.mutedForeground }]}>
              Does not query private_entity_aliases. Does not write to any table. Does not change
              local mock data or app behavior. Market, Scanner, and News screens continue to use
              local data until EXPO_PUBLIC_MARKET_DATA_SOURCE=supabase is set.
            </Text>
          </View>
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

  warnCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
  },
  warnText: { flex: 1, fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },

  infoCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 11,
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  infoText: { flex: 1, fontSize: 12, fontFamily: "Inter_400Regular", lineHeight: 18 },

  keysCard: { borderRadius: 12, borderWidth: 1, padding: 14, gap: 8 },
  keysTitle: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.6, marginBottom: 4 },
  keyRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  keyText: { fontSize: 12, fontFamily: "Inter_400Regular" },

  runBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    borderRadius: 12,
    height: 52,
    marginTop: 4,
  },
  runBtnText: { fontSize: 16, fontFamily: "Inter_700Bold", color: "#fff" },

  loadingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    justifyContent: "center",
    paddingVertical: 16,
  },
  loadingText: { fontSize: 14, fontFamily: "Inter_400Regular" },

  resultRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 10,
    borderWidth: 1,
    padding: 12,
  },
  resultText: { flex: 1, fontSize: 13, fontFamily: "Inter_500Medium" },

  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 7,
    borderTopWidth: 1,
    paddingTop: 16,
    marginTop: 6,
  },
  sectionHeaderText: { fontSize: 12, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },

  countGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  countCard: {
    borderRadius: 10,
    borderWidth: 1,
    padding: 10,
    minWidth: "46%",
    flex: 1,
    gap: 3,
  },
  countLabel: { fontSize: 10, fontFamily: "Inter_600SemiBold", letterSpacing: 0.3 },
  countValueRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  countValue: { fontSize: 22, fontFamily: "Inter_700Bold" },
  countExpected: { fontSize: 10, fontFamily: "Inter_400Regular" },

  tableCard: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 9,
    borderBottomWidth: StyleSheet.hairlineWidth,
    gap: 8,
  },
  tableHeaderRow: { paddingVertical: 7 },
  tableHeader: { fontSize: 10, fontFamily: "Inter_700Bold", letterSpacing: 0.5 },
  tableCell: { fontSize: 12, fontFamily: "Inter_400Regular" },

  safeCard: {
    borderRadius: 12,
    borderWidth: 1,
    padding: 14,
    flexDirection: "row",
    gap: 10,
    alignItems: "flex-start",
    marginTop: 6,
  },
  safeTitle: { fontSize: 13, fontFamily: "Inter_700Bold", marginBottom: 4 },
  safeBody: { fontSize: 13, fontFamily: "Inter_400Regular", lineHeight: 20 },
});
