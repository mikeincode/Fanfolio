import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
  ScrollView,
  Platform,
  Modal,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useColors } from "@/hooks/useColors";
import { LESSONS, Lesson } from "@/data/mockLessons";

function LessonDetail({ lesson, onClose, colors }: { lesson: Lesson; onClose: () => void; colors: ReturnType<typeof useColors> }) {
  const insets = useSafeAreaInsets();
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;
  const topPad = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={[detailStyles.container, { backgroundColor: colors.background }]}>
      <View style={[detailStyles.navBar, { paddingTop: topPad + 8, borderBottomColor: colors.border }]}>
        <Pressable onPress={onClose} style={detailStyles.backBtn}>
          <Feather name="arrow-left" size={22} color={colors.foreground} />
        </Pressable>
        <View style={[detailStyles.diffBadge, {
          backgroundColor: lesson.difficulty === "Beginner" ? colors.green + "20" : lesson.difficulty === "Intermediate" ? colors.coin + "20" : colors.red + "20"
        }]}>
          <Text style={[detailStyles.diffText, {
            color: lesson.difficulty === "Beginner" ? colors.green : lesson.difficulty === "Intermediate" ? colors.coin : colors.red
          }]}>{lesson.difficulty}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: bottomPad + 40 }} showsVerticalScrollIndicator={false}>
        <Text style={[detailStyles.readTime, { color: colors.mutedForeground }]}>{lesson.readTime} min read</Text>
        <Text style={[detailStyles.title, { color: colors.foreground }]}>{lesson.title}</Text>
        <Text style={[detailStyles.subtitle, { color: colors.primary }]}>{lesson.subtitle}</Text>

        <View style={[detailStyles.section, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[detailStyles.sectionLabel, { color: colors.mutedForeground }]}>The Concept</Text>
          <Text style={[detailStyles.body, { color: colors.foreground }]}>{lesson.concept}</Text>
        </View>

        <View style={[detailStyles.section, { backgroundColor: colors.green + "12", borderColor: colors.green + "30" }]}>
          <View style={detailStyles.sectionRow}>
            <Feather name="zap" size={14} color={colors.green} />
            <Text style={[detailStyles.sectionLabel, { color: colors.green }]}>Sports Angle</Text>
          </View>
          <Text style={[detailStyles.body, { color: colors.foreground }]}>{lesson.sportsAngle}</Text>
        </View>

        <Text style={[detailStyles.keyLabel, { color: colors.foreground }]}>Key Takeaways</Text>
        {lesson.keyTakeaways.map((t, i) => (
          <View key={i} style={detailStyles.takeawayRow}>
            <View style={[detailStyles.bullet, { backgroundColor: colors.primary }]} />
            <Text style={[detailStyles.takeawayText, { color: colors.foreground }]}>{t}</Text>
          </View>
        ))}

        <View style={[detailStyles.relatedSection, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <Text style={[detailStyles.sectionLabel, { color: colors.mutedForeground }]}>Related Asset Types</Text>
          <View style={detailStyles.relatedRow}>
            {lesson.relatedAssetTypes.map(t => (
              <View key={t} style={[detailStyles.relBadge, { backgroundColor: colors.primary + "20" }]}>
                <Text style={[detailStyles.relText, { color: colors.primary }]}>{t}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

export default function LearnScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const [selected, setSelected] = useState<Lesson | null>(null);

  const topPad = Platform.OS === "web" ? 67 : insets.top;
  const bottomPad = Platform.OS === "web" ? 34 : insets.bottom;

  const difficultyColor: Record<string, string> = {
    Beginner: colors.green,
    Intermediate: colors.coin,
    Advanced: colors.red,
  };

  const iconMap: Record<string, keyof typeof Feather.glyphMap> = {
    "bar-chart-2": "bar-chart-2",
    "briefcase": "briefcase",
    "grid": "grid",
    "activity": "activity",
    "trending-up": "trending-up",
    "trending-down": "trending-down",
    "arrow-down-circle": "arrow-down-circle",
    "layers": "layers",
    "zap": "zap",
  };

  return (
    <>
      <FlatList
        data={LESSONS}
        keyExtractor={l => l.id}
        style={{ backgroundColor: colors.background }}
        contentContainerStyle={{ paddingTop: topPad + 16, paddingBottom: bottomPad + 90, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={{ marginBottom: 20 }}>
            <Text style={[styles.title, { color: colors.foreground }]}>Learn</Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>Finance concepts explained through sports</Text>
          </View>
        }
        renderItem={({ item: lesson }) => (
          <Pressable
            key={lesson.id}
            onPress={() => setSelected(lesson)}
            style={({ pressed }) => [
              styles.card,
              { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.85 : 1 },
            ]}
          >
            <View style={[styles.iconBox, { backgroundColor: colors.primary + "15" }]}>
              <Feather name={(iconMap[lesson.icon] ?? "book-open") as keyof typeof Feather.glyphMap} size={22} color={colors.primary} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, { color: colors.foreground }]}>{lesson.title}</Text>
                <View style={[styles.diffBadge, { backgroundColor: difficultyColor[lesson.difficulty] + "20" }]}>
                  <Text style={[styles.diffText, { color: difficultyColor[lesson.difficulty] }]}>{lesson.difficulty}</Text>
                </View>
              </View>
              <Text style={[styles.cardSub, { color: colors.mutedForeground }]} numberOfLines={1}>{lesson.subtitle}</Text>
              <Text style={[styles.readTime, { color: colors.mutedForeground }]}>{lesson.readTime} min read</Text>
            </View>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        )}
      />

      <Modal
        visible={!!selected}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setSelected(null)}
      >
        {selected && (
          <LessonDetail lesson={selected} onClose={() => setSelected(null)} colors={colors} />
        )}
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  title: { fontSize: 28, fontFamily: "Inter_700Bold" },
  subtitle: { fontSize: 14, fontFamily: "Inter_400Regular", marginTop: 4 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cardTop: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 2 },
  cardTitle: { fontSize: 14, fontFamily: "Inter_700Bold", flex: 1 },
  cardSub: { fontSize: 12, fontFamily: "Inter_400Regular" },
  readTime: { fontSize: 11, fontFamily: "Inter_400Regular", marginTop: 2 },
  diffBadge: { paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 },
  diffText: { fontSize: 10, fontFamily: "Inter_600SemiBold" },
});

const detailStyles = StyleSheet.create({
  container: { flex: 1 },
  navBar: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 12, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  diffBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  diffText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
  readTime: { fontSize: 12, fontFamily: "Inter_400Regular", marginBottom: 8 },
  title: { fontSize: 26, fontFamily: "Inter_700Bold", lineHeight: 32, marginBottom: 4 },
  subtitle: { fontSize: 14, fontFamily: "Inter_600SemiBold", marginBottom: 20 },
  section: { borderRadius: 12, borderWidth: 1, padding: 16, marginBottom: 16, gap: 8 },
  sectionRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  sectionLabel: { fontSize: 11, fontFamily: "Inter_600SemiBold", textTransform: "uppercase", letterSpacing: 0.5 },
  body: { fontSize: 15, fontFamily: "Inter_400Regular", lineHeight: 24 },
  keyLabel: { fontSize: 16, fontFamily: "Inter_700Bold", marginBottom: 12 },
  takeawayRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginBottom: 10 },
  bullet: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
  takeawayText: { flex: 1, fontSize: 14, fontFamily: "Inter_400Regular", lineHeight: 22 },
  relatedSection: { borderRadius: 12, borderWidth: 1, padding: 14, marginTop: 8, gap: 8 },
  relatedRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  relBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
  relText: { fontSize: 12, fontFamily: "Inter_600SemiBold" },
});
