import React, { useState, useEffect, useCallback, useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Share } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import Markdown from "react-native-markdown-display";

import { useHomeTheme } from "@/context/ThemeContext";
import { apiClient } from "@/api/client";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NoteDetailScreen() {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  
  // Custom Theme Hook
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [completedSections, setCompletedSections] = useState({});
  const [copiedCodeId, setCopiedCodeId] = useState(null);

  const buttonScale = useSharedValue(1);

  const syncProgress = useCallback(
    async (percent) => {
      try {
        await apiClient.put(`/notes/${id}/progress`, { progress: percent });
      } catch (err) {
        console.error("Progress sync failed:", err.response?.data || err.message);
      }
    },
    [id]
  );

  const fetchNote = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(false);
    try {
      const res = await apiClient.get(`/notes/${id}`);
      const fetchedNote = res.data?.data || res.data;

      if (!fetchedNote.sections && fetchedNote.content) {
        fetchedNote.sections = [
          {
            id: "sec-1",
            title: "Overview & Content",
            content: fetchedNote.content,
          },
        ];
      }

      setNote(fetchedNote);

      if (fetchedNote?.sections?.length) {
        const doneCount = Math.round(
          ((fetchedNote.progress || 0) / 100) * fetchedNote.sections.length
        );
        const seeded = {};
        fetchedNote.sections.slice(0, doneCount).forEach((sec, i) => {
          seeded[sec.id || `sec-${i}`] = true;
        });
        setCompletedSections(seeded);
      }
    } catch (err) {
      console.error("Note fetch failed:", err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  const totalSections = note?.sections?.length || 0;
  
  const doneCount = useMemo(() => {
    return Object.values(completedSections).filter(Boolean).length;
  }, [completedSections]);

  const currentProgress = useMemo(() => {
    return totalSections > 0 ? Math.round((doneCount / totalSections) * 100) : 0;
  }, [doneCount, totalSections]);

  const isAllCompleted = totalSections > 0 && doneCount === totalSections;

  const toggleSection = useCallback(
    (secId) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

      setCompletedSections((prev) => {
        const nextSections = { ...prev, [secId]: !prev[secId] };
        const newDoneCount = Object.values(nextSections).filter(Boolean).length;
        const newPercent =
          totalSections > 0 ? Math.round((newDoneCount / totalSections) * 100) : 0;

        syncProgress(newPercent);
        return nextSections;
      });
    },
    [totalSections, syncProgress]
  );

  const handleShare = useCallback(async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({
        message: `Check out "${note?.title}" on Beyownd!`,
      });
    } catch (e) {}
  }, [note?.title]);

  const copyCode = useCallback(async (codeText, secId) => {
    await Clipboard.setStringAsync(codeText);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setCopiedCodeId(secId);
    setTimeout(() => setCopiedCodeId(null), 2000);
  }, []);

  const handlePrimaryAction = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (!isAllCompleted && note?.sections) {
      const allDone = {};
      note.sections.forEach((sec, i) => {
        allDone[sec.id || `sec-${i}`] = true;
      });
      setCompletedSections(allDone);
      syncProgress(100);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      router.back();
    }
  }, [isAllCompleted, note?.sections, syncProgress, router]);

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // Dynamic Markdown Styling synced with Theme
  const markdownStyles = useMemo(
    () => ({
      body: {
        color: colors.textPrimary,
        fontSize: 14,
        lineHeight: 22,
      },
      heading1: {
        color: colors.textPrimary,
        fontSize: 20,
        fontWeight: "700",
        marginTop: 12,
        marginBottom: 8,
      },
      heading2: {
        color: colors.textPrimary,
        fontSize: 17,
        fontWeight: "600",
        marginTop: 10,
        marginBottom: 6,
      },
      heading3: {
        color: colors.accent,
        fontSize: 15,
        fontWeight: "600",
        marginTop: 8,
        marginBottom: 4,
      },
      code_inline: {
        backgroundColor: colors.surface,
        color: colors.accent,
        borderRadius: 4,
        paddingHorizontal: 6,
        paddingVertical: 2,
        fontFamily: "monospace",
      },
      code_block: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        color: colors.textPrimary,
        fontFamily: "monospace",
        fontSize: 12,
        marginVertical: 8,
      },
      fence: {
        backgroundColor: colors.surface,
        borderRadius: 12,
        padding: 12,
        color: colors.textPrimary,
        fontFamily: "monospace",
        fontSize: 12,
        marginVertical: 8,
      },
    }),
    [colors]
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg }]}
      edges={["top"]}
    >
      {/* Dynamic Status Bar Icon Color */}
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Top Header */}
      <View style={styles.topBar}>
        <Pressable
          style={[
            styles.iconBtn,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
            },
          ]}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons
            name="chevron-back"
            size={20}
            color={colors.textPrimary}
          />
        </Pressable>

        <Text
          style={[
            styles.topBarTitle,
            {
              color: colors.textMuted,
              fontFamily: fonts.bodyMedium,
            },
          ]}
          numberOfLines={1}
        >
          {note?.track || "Cheatsheet"}
        </Text>

        <View style={{ flexDirection: "row", gap: 8 }}>
          {/* Theme Toggle Button */}
          <Pressable
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={() => {
              Haptics.selectionAsync();
              toggleTheme();
            }}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={18}
              color={colors.accent}
            />
          </Pressable>

          <Pressable
            style={[
              styles.iconBtn,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
              },
            ]}
            onPress={handleShare}
          >
            <Ionicons
              name="share-outline"
              size={18}
              color={colors.textPrimary}
            />
          </Pressable>
        </View>
      </View>

      <ScreenStateWrapper
        loading={loading}
        error={error}
        isEmpty={!loading && !error && !note}
        onRetry={fetchNote}
      >
        {note && (
          <ScrollView
            contentContainerStyle={[
              styles.scrollContent,
              { paddingBottom: insets.bottom + 120 },
            ]}
            showsVerticalScrollIndicator={false}
          >
            {/* Metadata Header */}
            <Animated.View entering={FadeInDown.duration(400)}>
              <View style={styles.badgeRow}>
                <View
                  style={[
                    styles.trackBadge,
                    {
                      backgroundColor: colors.accentSoft,
                      borderColor: colors.borderFocus,
                    },
                  ]}
                >
                  <Ionicons
                    name={note.icon || "code-slash-outline"}
                    size={13}
                    color={colors.accent}
                  />
                  <Text
                    style={[
                      styles.trackBadgeText,
                      {
                        color: colors.accent,
                        fontFamily: fonts.headingSemi,
                      },
                    ]}
                  >
                    {note.track || "General"}
                  </Text>
                </View>
                <View style={styles.timeTag}>
                  <Ionicons
                    name="time-outline"
                    size={13}
                    color={colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.metaTime,
                      {
                        color: colors.textMuted,
                        fontFamily: fonts.body,
                      },
                    ]}
                  >
                    {note.readTime || "5 min read"}
                  </Text>
                </View>
              </View>

              <Text
                style={[
                  styles.mainTitle,
                  {
                    color: colors.textPrimary,
                    fontFamily: fonts.headingBold,
                  },
                ]}
              >
                {note.title}
              </Text>
            </Animated.View>

            {/* Progress Card */}
            {totalSections > 0 && (
              <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={[
                  styles.progressCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={styles.progressHeader}>
                  <View style={styles.progressTitleGroup}>
                    <Ionicons
                      name="sparkles"
                      size={16}
                      color={colors.accent}
                    />
                    <Text
                      style={[
                        styles.progressCardLabel,
                        {
                          color: colors.textPrimary,
                          fontFamily: fonts.headingSemi,
                        },
                      ]}
                    >
                      Topic Completion
                    </Text>
                  </View>
                  <Text
                    style={[
                      styles.progressPercent,
                      {
                        color: colors.accent,
                        fontFamily: fonts.headingBold,
                      },
                    ]}
                  >
                    {currentProgress}%
                  </Text>
                </View>

                <View
                  style={[
                    styles.progressBarTrack,
                    { backgroundColor: colors.divider },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBarFill,
                      {
                        width: `${currentProgress}%`,
                        backgroundColor: colors.accent,
                      },
                    ]}
                  />
                </View>
              </Animated.View>
            )}

            {/* Sections Container */}
            {totalSections > 0 && (
              <View style={styles.sectionsWrapper}>
                <Text
                  style={[
                    styles.sectionGroupHeader,
                    {
                      color: colors.textMuted,
                      fontFamily: fonts.headingSemi,
                    },
                  ]}
                >
                  KEY CONCEPTS ({doneCount}/{totalSections})
                </Text>

                {note.sections.map((sec, idx) => {
                  const secKey = sec.id || `sec-${idx}`;
                  const isDone = !!completedSections[secKey];

                  return (
                    <Animated.View
                      key={secKey}
                      entering={FadeInUp.delay(120 + idx * 50).duration(350)}
                    >
                      <View
                        style={[
                          styles.sectionCard,
                          {
                            backgroundColor: colors.card,
                            borderColor: isDone
                              ? colors.success
                              : colors.border,
                          },
                        ]}
                      >
                        {/* Title Header */}
                        <View style={styles.sectionHeaderRow}>
                          <Pressable
                            style={styles.checkboxTouch}
                            onPress={() => toggleSection(secKey)}
                            hitSlop={8}
                          >
                            <Ionicons
                              name={
                                isDone
                                  ? "checkmark-circle"
                                  : "ellipse-outline"
                              }
                              size={22}
                              color={isDone ? colors.success : colors.textMuted}
                            />
                          </Pressable>

                          <Text
                            style={[
                              styles.sectionTitle,
                              {
                                color: isDone
                                  ? colors.textMuted
                                  : colors.textPrimary,
                                fontFamily: fonts.headingSemi,
                              },
                            ]}
                          >
                            {sec.title}
                          </Text>
                        </View>

                        {/* Markdown Content */}
                        <View style={styles.markdownWrapper}>
                          <Markdown style={markdownStyles}>
                            {sec.content}
                          </Markdown>
                        </View>

                        {/* Code Block Snippet */}
                        {sec.codeSnippet && (
                          <View
                            style={[
                              styles.codeContainer,
                              {
                                backgroundColor: colors.surface,
                                borderColor: colors.border,
                              },
                            ]}
                          >
                            <View style={styles.codeHeader}>
                              <Text
                                style={[
                                  styles.codeLangText,
                                  { color: colors.textMuted },
                                ]}
                              >
                                SNIPPET
                              </Text>
                              <Pressable
                                onPress={() =>
                                  copyCode(sec.codeSnippet, secKey)
                                }
                                style={styles.copyBtn}
                                hitSlop={6}
                              >
                                <Ionicons
                                  name={
                                    copiedCodeId === secKey
                                      ? "checkmark"
                                      : "copy-outline"
                                  }
                                  size={13}
                                  color={colors.textMuted}
                                />
                                <Text
                                  style={[
                                    styles.copyText,
                                    { color: colors.textMuted },
                                  ]}
                                >
                                  {copiedCodeId === secKey ? "Copied" : "Copy"}
                                </Text>
                              </Pressable>
                            </View>
                            <Text
                              style={[
                                styles.codeText,
                                { color: colors.textPrimary },
                              ]}
                            >
                              {sec.codeSnippet}
                            </Text>
                          </View>
                        )}
                      </View>
                    </Animated.View>
                  );
                })}
              </View>
            )}

            {/* Completion Footer Card */}
            {totalSections > 0 && (
              <Animated.View
                entering={FadeInUp.delay(300).duration(400)}
                style={[
                  styles.actionCard,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                  },
                ]}
              >
                <View style={{ gap: 4 }}>
                  <Text
                    style={[
                      styles.actionCardTitle,
                      {
                        color: colors.textPrimary,
                        fontFamily: fonts.headingSemi,
                      },
                    ]}
                  >
                    {isAllCompleted
                      ? "Topic Completed! 🎉"
                      : "Finished reading?"}
                  </Text>
                  <Text
                    style={[
                      styles.actionCardDesc,
                      {
                        color: colors.textMuted,
                        fontFamily: fonts.body,
                      },
                    ]}
                  >
                    {isAllCompleted
                      ? "You have covered all concepts in this cheatsheet."
                      : "Mark all concepts as completed to track your learning progress."}
                  </Text>
                </View>

                <AnimatedPressable
                  style={[
                    styles.submitTriggerBtn,
                    {
                      backgroundColor: isAllCompleted
                        ? colors.success
                        : colors.accent,
                    },
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
                  <Text
                    style={[
                      styles.submitTriggerText,
                      { fontFamily: fonts.headingBold },
                    ]}
                  >
                    {isAllCompleted ? "Completed & Exit" : "Mark All Read"}
                  </Text>
                </AnimatedPressable>
              </Animated.View>
            )}
          </ScrollView>
        )}
      </ScreenStateWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  topBar: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  iconBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  topBarTitle: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.6 },
  scrollContent: { paddingHorizontal: 16, paddingTop: 12 },
  badgeRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  trackBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
  },
  trackBadgeText: { fontSize: 12 },
  timeTag: { flexDirection: "row", alignItems: "center", gap: 4 },
  metaTime: { fontSize: 12 },
  mainTitle: {
    fontSize: 24,
    lineHeight: 32,
    letterSpacing: -0.4,
    marginBottom: 20,
  },
  progressCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  progressTitleGroup: { flexDirection: "row", alignItems: "center", gap: 6 },
  progressCardLabel: { fontSize: 13 },
  progressPercent: { fontSize: 14 },
  progressBarTrack: {
    height: 6,
    borderRadius: 3,
    overflow: "hidden",
  },
  progressBarFill: { height: "100%", borderRadius: 3 },
  sectionsWrapper: { marginBottom: 20 },
  sectionGroupHeader: {
    fontSize: 11,
    letterSpacing: 1,
    textTransform: "uppercase",
    marginBottom: 12,
    paddingLeft: 2,
  },
  sectionCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 12,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  checkboxTouch: { padding: 2 },
  sectionTitle: { fontSize: 16, flex: 1, letterSpacing: -0.2 },
  markdownWrapper: { paddingLeft: 34 },
  codeContainer: {
    marginTop: 14,
    marginLeft: 34,
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
  },
  codeHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  codeLangText: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
  },
  copyBtn: { flexDirection: "row", alignItems: "center", gap: 4 },
  copyText: { fontSize: 11 },
  codeText: {
    fontFamily: "monospace",
    fontSize: 12,
    lineHeight: 18,
  },
  actionCard: { padding: 18, borderRadius: 20, borderWidth: 1, gap: 16 },
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