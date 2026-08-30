import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  StatusBar,
  RefreshControl,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";
import { apiClient } from "@/api/client";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";
import InviteCard from "@/components/ui/profile/InviteCard";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function StatCard({ icon, val, label, color, softColor, index }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(150 + index * 40).duration(350)}
      style={styles.gridItemWrapper}
    >
      <AnimatedPressable
        style={[styles.statCard, { backgroundColor: softColor }, animatedStyle]}
        onPressIn={() => (scale.value = withSpring(0.96))}
        onPressOut={() => (scale.value = withSpring(1))}
        onPress={() => Haptics.selectionAsync()}
      >
        <View style={styles.statHeader}>
          <View style={[styles.statIconBadge, { backgroundColor: color }]}>
            <Ionicons name={icon} size={18} color="#FFFFFF" />
          </View>
          <Text style={[styles.statValue, { color }]}>{val}</Text>
        </View>
        <Text style={[styles.statLabel, { color }]}>{label}</Text>
      </AnimatedPressable>
    </Animated.View>
  );
}

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const [meRes, homeRes] = await Promise.all([
        apiClient.get("/users/me"),
        apiClient.get("/home"),
      ]);
      setProfile(meRes.data.data);
      setDashboard(homeRes.data.data);
    } catch (err) {
      console.error("Profile fetch failed:", err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          Profile
        </Text>
        <Pressable
          style={[styles.settingsBtn, { backgroundColor: colors.card, borderColor: colors.divider }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.push("/settings");
          }}
        >
          <Ionicons name="settings-outline" size={18} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <ScreenStateWrapper loading={loading} error={error} isEmpty={false} onRetry={fetchData} skeletonCount={3}>
          {profile && dashboard && (
            <>
              <Animated.View
                entering={FadeInDown.duration(400)}
                style={[styles.userCard, { backgroundColor: colors.card, borderColor: colors.divider }]}
              >
                <View style={[styles.avatarWrapper, { borderColor: colors.accentSoft }]}>
                  <View style={[styles.avatarBody, { backgroundColor: colors.accentSoft }]}>
                    <Text style={[styles.avatarText, { color: colors.accent, fontFamily: fonts.headingBold }]}>
                      {profile.name?.charAt(0)?.toUpperCase() || "U"}
                    </Text>
                  </View>
                </View>

                <View style={styles.userInfo}>
                  <Text
                    style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}
                    numberOfLines={1}
                  >
                    {profile.name}
                  </Text>
                  <Text
                    style={[styles.userHandle, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}
                    numberOfLines={1}
                  >
                    {profile.email}
                  </Text>

                  <View style={[styles.streakPill, { backgroundColor: colors.accentSoft }]}>
                    <Ionicons name="flame" size={14} color={colors.accent} />
                    <Text style={[styles.streakPillText, { color: colors.accent, fontFamily: fonts.headingBold }]}>
                      {dashboard.streak || 0} DAY STREAK
                    </Text>
                  </View>
                </View>
              </Animated.View>

              <Animated.View
                entering={FadeInDown.delay(100).duration(400)}
                style={[styles.xpCard, { backgroundColor: colors.card, borderColor: colors.divider }]}
              >
                <View style={styles.xpHeader}>
                  <View style={styles.xpHeaderLeft}>
                    <Ionicons name="flash-outline" size={18} color={colors.accent} />
                    <Text style={[styles.xpLabel, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                      CAREER READINESS
                    </Text>
                  </View>
                  <Text style={[styles.xpValue, { color: colors.accent, fontFamily: fonts.headingBold }]}>
                    {dashboard.readiness || 0}%
                  </Text>
                </View>

                <View style={[styles.xpBarTrack, { backgroundColor: colors.divider }]}>
                  <View
                    style={[
                      styles.xpBarFill,
                      { width: `${dashboard.readiness || 0}%`, backgroundColor: colors.accent },
                    ]}
                  />
                </View>
              </Animated.View>

              <Text style={[styles.sectionHeaderTitle, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
                STATISTICS
              </Text>

              <View style={styles.statsGrid}>
                {[
                  {
                    icon: "checkmark-done-outline",
                    val: dashboard.stats?.tasksDone || 0,
                    label: "Tasks Done",
                    color: colors.success,
                    softColor: colors.successSoft,
                  },
                  {
                    icon: "book-outline",
                    val: dashboard.stats?.notesRead || 0,
                    label: "Notes Read",
                    color: colors.pro,
                    softColor: colors.proSoft,
                  },
                  {
                    icon: "flame-outline",
                    val: dashboard.streak || 0,
                    label: "Day Streak",
                    color: colors.accent,
                    softColor: colors.accentSoft,
                  },
                  {
                    icon: "trending-up-outline",
                    val: `+${dashboard.weeklyChange || 0}%`,
                    label: "This Week",
                    color: colors.info,
                    softColor: colors.infoSoft,
                  },
                ].map((stat, i) => (
                  <StatCard
                    key={i}
                    index={i}
                    icon={stat.icon}
                    val={stat.val}
                    label={stat.label}
                    color={stat.color}
                    softColor={stat.softColor}
                  />
                ))}
              </View>

              <InviteCard />

              <Animated.View
                entering={FadeInDown.delay(200).duration(400)}
                style={[styles.preferencesCard, { backgroundColor: colors.card, borderColor: colors.divider }]}
              >
                <Text style={[styles.sectionTitle, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
                  PREFERENCES
                </Text>

                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <View style={[styles.settingIconBox, { backgroundColor: colors.bg }]}>
                      <Ionicons name="moon-outline" size={18} color={colors.textPrimary} />
                    </View>
                    <Text style={[styles.settingText, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                      Dark Mode
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={() => {
                      Haptics.selectionAsync();
                      toggleTheme();
                    }}
                    trackColor={{ false: colors.divider, true: colors.accent }}
                    thumbColor="#FFFFFF"
                  />
                </View>
              </Animated.View>
            </>
          )}
        </ScreenStateWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 20, letterSpacing: -0.4 },
  settingsBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  userCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    marginBottom: 16,
    gap: 14,
  },
  avatarWrapper: {
    width: 68,
    height: 68,
    borderRadius: 34,
    borderWidth: 2,
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarBody: {
    width: "100%",
    height: "100%",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: { fontSize: 26 },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: 20, letterSpacing: -0.3 },
  userHandle: { fontSize: 13, marginBottom: 4 },
  streakPill: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  streakPillText: { fontSize: 11 },

  xpCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  xpHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  xpHeaderLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  xpLabel: { fontSize: 13, letterSpacing: 0.5 },
  xpValue: { fontSize: 16 },
  xpBarTrack: { height: 8, borderRadius: 4, overflow: "hidden" },
  xpBarFill: { height: "100%", borderRadius: 4 },

  sectionHeaderTitle: {
    fontSize: 13,
    letterSpacing: 0.8,
    marginBottom: 12,
  },
  statsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 12,
    marginBottom: 20,
  },
  gridItemWrapper: { width: "48%" },
  statCard: {
    padding: 14,
    borderRadius: 18,
    gap: 8,
  },
  statHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  statIconBadge: {
    width: 30,
    height: 30,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  statValue: { fontSize: 20, fontWeight: "800" },
  statLabel: { fontSize: 12, fontWeight: "600" },

  preferencesCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 20,
  },
  sectionTitle: { fontSize: 12, letterSpacing: 0.8, marginBottom: 10 },
  settingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingIconBox: {
    width: 32,
    height: 32,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  settingText: { fontSize: 15 },
});