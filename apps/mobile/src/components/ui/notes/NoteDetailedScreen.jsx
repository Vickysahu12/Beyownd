import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Share,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";

const NOTES_DATA = {
  html: {
    id: "html",
    title: "HTML & CSS Cheatsheet",
    track: "Web Development",
    icon: "code-slash",
    progress: 80,
    readTime: "5 min read",
    lastUpdated: "Updated yesterday",
    sections: [
      {
        id: "s1",
        title: "Flexbox Layout Essentials",
        content:
          "Flexbox provides an efficient way to layout, align, and distribute space among items in a container, even when their size is unknown or dynamic.",
        codeSnippet: `/* Perfect Center Trick */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`,
      },
      {
        id: "s2",
        title: "CSS Grid vs Flexbox",
        content:
          "Use Flexbox for 1D layouts (either row or column) and CSS Grid for 2D layouts (both rows and columns simultaneously).",
      },
      {
        id: "s3",
        title: "Semantic HTML Elements",
        content:
          "Always prefer <main>, <header>, <article>, and <section> over generic <div> elements for better accessibility and SEO ranking.",
      },
    ],
  },
  js: {
    id: "js",
    title: "JavaScript Fundamentals",
    track: "Web Development",
    icon: "logo-javascript",
    progress: 65,
    readTime: "8 min read",
    lastUpdated: "2 days ago",
    sections: [
      {
        id: "s1",
        title: "Closures & Scope Chain",
        content:
          "A closure gives you access to an outer function's scope from an inner function, even after the outer function has closed.",
        codeSnippet: `function makeCounter() {\n  let count = 0;\n  return () => ++count;\n}\nconst counter = makeCounter();`,
      },
    ],
  },
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts } = useHomeTheme();

  const note = NOTES_DATA[id] || NOTES_DATA.html;

  const [completedSections, setCompletedSections] = useState({ s1: true });
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  // Dynamic Progress Calculation
  const totalSections = note.sections.length;
  const doneCount = Object.values(completedSections).filter(Boolean).length;
  const currentProgress = Math.round((doneCount / totalSections) * 100);
  const isAllCompleted = doneCount === totalSections;

  // TaskDetail-style Spring Physics for Button
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const toggleSection = (secId) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedSections((prev) => ({ ...prev, [secId]: !prev[secId] }));
  };

  const handleShare = async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({
        message: `Check out these notes on "${note.title}" in Beyownd!`,
      });
    } catch (e) {
      // Handle share error silently
    }
  };

  const copyCode = (secId) => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedCodeId(secId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  };

  // TaskDetail-style Primary Action Trigger
  const handlePrimaryAction = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!isAllCompleted) {
      // Mark all concepts as done
      const allDone = {};
      note.sections.forEach((sec) => {
        allDone[sec.id] = true;
      });
      setCompletedSections(allDone);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      // Back to previous screen
      router.back();
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.surface || "#18181B" }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Text style={[styles.topBarTitle, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]} numberOfLines={1}>
          {note.track}
        </Text>

        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.surface || "#18181B" }]}
          onPress={handleShare}
        >
          <Ionicons name="share-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 110 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Title Section */}
        <Animated.View entering={FadeInDown.duration(400)}>
          <View style={styles.badgeRow}>
            <View style={[styles.trackBadge, { backgroundColor: (colors.accent || "#FF5722") + "18" }]}>
              <Ionicons name={note.icon} size={14} color={colors.accent || "#FF5722"} />
              <Text style={[styles.trackBadgeText, { color: colors.accent || "#FF5722", fontFamily: fonts.headingSemi }]}>
                {note.track}
              </Text>
            </View>
            <Text style={[styles.metaTime, { color: colors.textMuted, fontFamily: fonts.body }]}>
              {note.readTime}
            </Text>
          </View>

          <Text style={[styles.mainTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            {note.title}
          </Text>

          <Text style={[styles.updatedText, { color: colors.textMuted, fontFamily: fonts.body }]}>
            {note.lastUpdated}
          </Text>
        </Animated.View>

        {/* Progress Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.progressCard, { backgroundColor: colors.surface || "#18181B" }]}>
          <View style={styles.progressHeader}>
            <View style={styles.progressTitleGroup}>
              <Ionicons name="checkmark-done-circle" size={18} color={colors.accent || "#FF5722"} />
              <Text style={[styles.progressCardLabel, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                Topic Completion
              </Text>
            </View>
            <Text style={[styles.progressPercent, { color: colors.accent || "#FF5722", fontFamily: fonts.headingBold }]}>
              {currentProgress}%
            </Text>
          </View>

          <View style={styles.progressBarTrack}>
            <View
              style={[
                styles.progressBarFill,
                { width: `${currentProgress}%`, backgroundColor: colors.accent || "#FF5722" },
              ]}
            />
          </View>
        </Animated.View>

        {/* Key Concepts List */}
        <View style={styles.sectionsWrapper}>
          <Text style={[styles.sectionGroupHeader, { color: colors.textMuted, fontFamily: fonts.headingSemi }]}>
            KEY CONCEPTS ({doneCount}/{totalSections})
          </Text>

          {note.sections.map((sec, idx) => {
            const isDone = !!completedSections[sec.id];
            const isFirst = idx === 0;
            const isLast = idx === note.sections.length - 1;

            return (
              <Animated.View key={sec.id} entering={FadeInUp.delay(120 + idx * 50).duration(350)}>
                <View
                  style={[
                    styles.sectionCard,
                    {
                      backgroundColor: colors.surface || "#18181B",
                      borderTopLeftRadius: isFirst ? 20 : 0,
                      borderTopRightRadius: isFirst ? 20 : 0,
                      borderBottomLeftRadius: isLast ? 20 : 0,
                      borderBottomRightRadius: isLast ? 20 : 0,
                    },
                  ]}
                >
                  <View style={styles.sectionHeaderRow}>
                    <Pressable style={styles.checkboxTouch} onPress={() => toggleSection(sec.id)}>
                      <Ionicons
                        name={isDone ? "checkbox" : "square-outline"}
                        size={22}
                        color={isDone ? colors.accent || "#FF5722" : colors.textMuted}
                      />
                    </Pressable>

                    <Text
                      style={[
                        styles.sectionTitle,
                        {
                          color: isDone ? colors.textMuted : colors.textPrimary,
                          textDecorationLine: isDone ? "line-through" : "none",
                          fontFamily: fonts.headingSemi,
                        },
                      ]}
                    >
                      {sec.title}
                    </Text>
                  </View>

                  <Text style={[styles.sectionBody, { color: colors.textMuted, fontFamily: fonts.body }]}>
                    {sec.content}
                  </Text>

                  {sec.codeSnippet && (
                    <View style={styles.codeContainer}>
                      <View style={styles.codeHeader}>
                        <Text style={styles.codeLangText}>SNIPPET</Text>
                        <Pressable onPress={() => copyCode(sec.id)} style={styles.copyBtn}>
                          <Ionicons
                            name={copiedCodeId === sec.id ? "checkmark" : "copy-outline"}
                            size={14}
                            color="#A1A1AA"
                          />
                          <Text style={styles.copyText}>{copiedCodeId === sec.id ? "Copied" : "Copy"}</Text>
                        </Pressable>
                      </View>
                      <Text style={styles.codeText}>{sec.codeSnippet}</Text>
                    </View>
                  )}

                  {!isLast && <View style={styles.rowDivider} />}
                </View>
              </Animated.View>
            );
          })}
        </View>

        {/* --- TASK DETAIL SCREEN STYLE ACTION CARD (INLINE AT BOTTOM) --- */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={[styles.actionCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
          <View style={{ gap: 4 }}>
            <Text style={[styles.actionCardTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
              {isAllCompleted ? "Topic Completed! 🎉" : "Finished reading?"}
            </Text>
            <Text style={[styles.actionCardDesc, { color: colors.textMuted, fontFamily: fonts.body }]}>
              {isAllCompleted
                ? "You have covered all concepts in this cheatsheet."
                : "Mark all concepts as completed to track your learning progress."}
            </Text>
          </View>

          <AnimatedPressable
            style={[
              styles.submitTriggerBtn,
              { backgroundColor: isAllCompleted ? "#22C55E" : colors.accent || "#FF5722" },
              animatedButtonStyle,
            ]}
            onPress={handlePrimaryAction}
            onPressIn={() => (buttonScale.value = withSpring(0.96))}
            onPressOut={() => (buttonScale.value = withSpring(1))}
          >
            <Ionicons
              name={isAllCompleted ? "checkmark-circle" : "sparkles"}
              size={18}
              color="#FFFFFF"
            />
            <Text style={[styles.submitTriggerText, { fontFamily: fonts.headingBold }]}>
              {isAllCompleted ? "Completed & Exit" : "Mark All Read"}
            </Text>
          </AnimatedPressable>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },

  topBar: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: "center",
    justifyContent: "center",
  },
  topBarTitle: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.5 },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  badgeRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginBottom: 12 },
  trackBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  trackBadgeText: { fontSize: 12 },
  metaTime: { fontSize: 12 },

  mainTitle: { fontSize: 26, lineHeight: 32, letterSpacing: -0.5, marginBottom: 6 },
  updatedText: { fontSize: 12, marginBottom: 20 },

  progressCard: {
    padding: 16,
    borderRadius: 18,
    marginBottom: 24,
  },
  progressHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  progressTitleGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  progressCardLabel: { fontSize: 13 },
  progressPercent: { fontSize: 14 },
  progressBarTrack: { height: 5, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 3, overflow: "hidden" },
  progressBarFill: { height: "100%", borderRadius: 3 },

  sectionsWrapper: { gap: 0, marginBottom: 24 },
  sectionGroupHeader: { fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 10, paddingLeft: 4 },

  sectionCard: {
    padding: 16,
    position: "relative",
  },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 8 },
  checkboxTouch: { padding: 2 },
  sectionTitle: { fontSize: 16, flex: 1, letterSpacing: -0.2 },
  sectionBody: { fontSize: 14, lineHeight: 21, paddingLeft: 34 },

  codeContainer: {
    marginTop: 12,
    marginLeft: 34,
    backgroundColor: "#09090B",
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  codeHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  codeLangText: { fontSize: 10, color: "#71717A", fontWeight: "700", letterSpacing: 1 },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyText: { fontSize: 11, color: "#A1A1AA" },
  codeText: { fontFamily: "monospace", fontSize: 12, color: "#E4E4E7", lineHeight: 18 },

  rowDivider: {
    position: "absolute",
    bottom: 0,
    left: 50,
    right: 0,
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
  },

  /* TaskDetail Style Action Card (Inline inside ScrollView) */
  actionCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  actionCardTitle: { fontSize: 16 },
  actionCardDesc: { fontSize: 12, lineHeight: 18 },
  submitTriggerBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  submitTriggerText: { color: "#FFFFFF", fontSize: 14 },
});