import React, { useState, useEffect, useMemo } from "react";
import { View, Text, Pressable, StyleSheet, TextInput, SectionList } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";

const RAW_NOTES = [
  { id: "html", icon: "code-slash", title: "HTML & CSS Cheatsheet", track: "Web Development", progress: 80 },
  { id: "js", icon: "logo-javascript", title: "JavaScript Fundamentals", track: "Web Development", progress: 65 },
  { id: "react", icon: "logo-react", title: "React Basics You Must Know", track: "Web Development", progress: 30 },
  { id: "dsa", icon: "git-branch-outline", title: "DSA Patterns Quick Guide", track: "Web Development", progress: 40 },
  { id: "uiux", icon: "bulb-outline", title: "UI/UX Design Principles", track: "Design", progress: 70 },
  { id: "figma", icon: "color-palette-outline", title: "Figma Shortcuts & Workflow", track: "Design", progress: 20 },
  { id: "seo", icon: "trending-up-outline", title: "SEO Basics for Beginners", track: "Marketing", progress: 55 },
];

const TRACK_ACCENT = { "Web Development": "accent", Design: "pro", Marketing: "success" };

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function NoteRow({ item, isFirst, isLast, tint, colors, fonts, onPress }) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const borderStyle = {
    borderTopLeftRadius: isFirst ? 20 : 0,
    borderTopRightRadius: isFirst ? 20 : 0,
    borderBottomLeftRadius: isLast ? 20 : 0,
    borderBottomRightRadius: isLast ? 20 : 0,
  };

  return (
    <AnimatedPressable
      style={[styles.rowCard, borderStyle, { backgroundColor: colors.surface || "#18181B" }, animatedStyle]}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        onPress();
      }}
      onPressIn={() => (scale.value = withSpring(0.985, { damping: 15, stiffness: 250 }))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <View style={styles.rowLeft}>
        <View style={[styles.iconBox, { backgroundColor: tint + "18" }]}>
          <Ionicons name={item.icon} size={18} color={tint} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.rowTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]} numberOfLines={1}>
            {item.title}
          </Text>
          <View style={styles.progressWrap}>
            <View style={[styles.trackBg, { backgroundColor: "rgba(255,255,255,0.08)" }]}>
              <View style={[styles.trackFill, { width: `${item.progress}%`, backgroundColor: tint }]} />
            </View>
            <Text style={[styles.progressVal, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
              {item.progress}%
            </Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={16} color="rgba(255,255,255,0.25)" />
      {!isLast && <View style={[styles.separator, { backgroundColor: "rgba(255,255,255,0.06)" }]} />}
    </AnimatedPressable>
  );
}

export default function NotesScreen() {
  const { colors, fonts } = useHomeTheme();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [search, setSearch] = useState("");

  // --- state pattern, Home jaisa ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasData, setHasData] = useState(true);

  const fetchNotes = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
      setHasData(true);
    }, 1500);
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  const sections = useMemo(() => {
    const filtered = RAW_NOTES.filter(
      (n) =>
        n.title.toLowerCase().includes(search.toLowerCase()) ||
        n.track.toLowerCase().includes(search.toLowerCase())
    );
    const map = {};
    const order = [];
    filtered.forEach((n) => {
      if (!map[n.track]) {
        map[n.track] = [];
        order.push(n.track);
      }
      map[n.track].push(n);
    });
    return order.map((track) => ({ title: track, data: map[track] }));
  }, [search]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      {/* Header hamesha visible — Home ke sticky header jaisa */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={[styles.largeTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            Knowledge Notes
          </Text>
          <Pressable style={styles.headerBtn} onPress={() => Haptics.selectionAsync()}>
            <Ionicons name="ellipsis-horizontal-circle-outline" size={26} color={colors.accent || "#FF5722"} />
          </Pressable>
        </View>

        <View style={[styles.searchBar, { backgroundColor: "rgba(255,255,255,0.06)" }]}>
          <Ionicons name="search-outline" size={17} color="#A1A1AA" />
          <TextInput
            placeholder="Search notes, tracks..."
            placeholderTextColor="#71717A"
            style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.body }]}
            value={search}
            onChangeText={setSearch}
          />
          {search ? (
            <Pressable onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={16} color="#71717A" />
            </Pressable>
          ) : null}
        </View>
      </View>

      {/* Content area — loading/error/empty/data switch yahan hota hai */}
      <ScreenStateWrapper
        loading={loading}
        error={error}
        isEmpty={!hasData || sections.length === 0}
        onRetry={fetchNotes}
        skeletonCount={6}
        emptyTitle="No notes found"
        emptySubtitle="Try a different search, or check back soon for new notes."
      >
        <SectionList
          sections={sections}
          keyExtractor={(item) => item.id}
          contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + 100 }]}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={false}
          renderSectionHeader={({ section }) => {
            const tint = colors[TRACK_ACCENT[section.title]] || colors.accent || "#FF5722";
            return (
              <Animated.View entering={FadeInDown.duration(300)} style={styles.sectionHeaderRow}>
                <Text style={[styles.sectionTitle, { color: colors.textMuted, fontFamily: fonts.headingSemi }]}>
                  {section.title}
                </Text>
                <View style={[styles.countBadge, { backgroundColor: tint + "20" }]}>
                  <Text style={[styles.countText, { color: tint, fontFamily: fonts.bodyMedium }]}>
                    {section.data.length}
                  </Text>
                </View>
              </Animated.View>
            );
          }}
          renderItem={({ item, index, section }) => {
            const isFirst = index === 0;
            const isLast = index === section.data.length - 1;
            const tint = colors[TRACK_ACCENT[item.track]] || colors.accent || "#FF5722";
            return (
              <Animated.View entering={FadeInDown.delay(index * 30).springify().damping(20)}>
                <NoteRow
                  item={item}
                  isFirst={isFirst}
                  isLast={isLast}
                  tint={tint}
                  colors={colors}
                  fonts={fonts}
                  onPress={() => router.push(`/note/${item.id}`)}
                />
              </Animated.View>
            );
          }}
        />
      </ScreenStateWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 10, paddingBottom: 12 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 },
  largeTitle: { fontSize: 28, letterSpacing: -0.6 },
  headerBtn: { padding: 4 },
  searchBar: { height: 40, borderRadius: 12, flexDirection: "row", alignItems: "center", paddingHorizontal: 12, gap: 8 },
  searchInput: { flex: 1, fontSize: 14, height: "100%" },
  listContent: { paddingHorizontal: 20 },
  sectionHeaderRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", marginTop: 22, marginBottom: 8, paddingHorizontal: 4 },
  sectionTitle: { fontSize: 13, textTransform: "uppercase", letterSpacing: 0.8 },
  countBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  countText: { fontSize: 11 },
  rowCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 14, position: "relative" },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  iconBox: { width: 38, height: 38, borderRadius: 11, alignItems: "center", justifyContent: "center" },
  textContainer: { flex: 1, paddingRight: 10 },
  rowTitle: { fontSize: 15, letterSpacing: -0.2, marginBottom: 6 },
  progressWrap: { flexDirection: "row", alignItems: "center", gap: 8 },
  trackBg: { flex: 1, height: 4, borderRadius: 2, overflow: "hidden" },
  trackFill: { height: "100%", borderRadius: 2 },
  progressVal: { fontSize: 11 },
  separator: { position: "absolute", bottom: 0, left: 68, right: 0, height: 1 },
});