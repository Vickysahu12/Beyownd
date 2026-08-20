import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Switch, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";
import { apiClient } from "@/api/client";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";
import InviteCard from "@/components/ui/profile/InviteCard";

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  const [profile, setProfile] = useState(null);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.border || "rgba(255,255,255,0.08)" }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          MY PROFILE
        </Text>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.surface || "#18181B" }]}
          onPress={() => { Haptics.selectionAsync(); router.push("/settings"); }}
        >
          <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        <ScreenStateWrapper loading={loading} error={error} isEmpty={false} onRetry={fetchData} skeletonCount={3}>
          {profile && dashboard && (
            <>
              <Animated.View entering={FadeInDown.duration(400)} style={styles.userCard}>
                <View style={[styles.avatarPlaceholder, { backgroundColor: colors.accentSoft || "rgba(255,87,34,0.15)" }]}>
                  <Text style={[styles.avatarInitial, { color: colors.accent || "#FF5722", fontFamily: fonts.headingBold }]}>
                    {profile.name?.charAt(0)?.toUpperCase() || "U"}
                  </Text>
                </View>

                <View style={styles.userInfo}>
                  <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                    {profile.name}
                  </Text>
                  <Text style={[styles.userHandle, { color: colors.textMuted, fontFamily: fonts.body }]}>
                    {profile.email}
                  </Text>
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.xpCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
                <View style={styles.xpHeader}>
                  <Text style={[styles.xpLabel, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
                    CAREER READINESS
                  </Text>
                  <Text style={[styles.xpValue, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                    {dashboard.readiness}%
                  </Text>
                </View>
                <View style={styles.xpBarTrack}>
                  <View style={[styles.xpBarFill, { width: `${dashboard.readiness}%`, backgroundColor: colors.accent || "#FF5722" }]} />
                </View>
              </Animated.View>

              <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.statsGrid}>
                {[
                  { icon: "checkbox-outline", val: dashboard.stats.tasksDone, label: "Tasks Done", color: "#6366F1" },
                  { icon: "book-outline", val: dashboard.stats.notesRead, label: "Notes Read", color: "#EC4899" },
                  { icon: "flame-outline", val: dashboard.streak, label: "Day Streak", color: "#FF5722" },
                  { icon: "trending-up-outline", val: `+${dashboard.weeklyChange}%`, label: "This Week", color: "#10B981" },
                ].map((stat, i) => (
                  <View key={i} style={[styles.statBox, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
                    <Ionicons name={stat.icon} size={20} color={stat.color} />
                    <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                      {stat.val}
                    </Text>
                    <Text style={[styles.statLabel, { color: colors.textMuted, fontFamily: fonts.body }]}>{stat.label}</Text>
                  </View>
                ))}
              </Animated.View>

              <InviteCard />

              <Animated.View entering={FadeInDown.delay(200).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
                <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi, marginBottom: 12 }]}>
                  PREFERENCES
                </Text>
                <View style={styles.settingRow}>
                  <View style={styles.settingLeft}>
                    <Ionicons name="moon-outline" size={20} color={colors.textPrimary} />
                    <Text style={[styles.settingText, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>
                      Dark Mode
                    </Text>
                  </View>
                  <Switch
                    value={isDark}
                    onValueChange={() => { Haptics.selectionAsync(); toggleTheme(); }}
                    trackColor={{ false: "#3F3F46", true: colors.accent || "#FF5722" }}
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
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 15, letterSpacing: 0.8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },
  userCard: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 14 },
  avatarPlaceholder: { width: 66, height: 66, borderRadius: 33, alignItems: "center", justifyContent: "center" },
  avatarInitial: { fontSize: 26 },
  userInfo: { flex: 1 },
  userName: { fontSize: 19, letterSpacing: -0.3 },
  userHandle: { fontSize: 13, marginTop: 2 },
  xpCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  xpHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  xpLabel: { fontSize: 12, letterSpacing: 0.5 },
  xpValue: { fontSize: 14 },
  xpBarTrack: { height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" },
  xpBarFill: { height: "100%", borderRadius: 4 },
  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statBox: { width: "48%", padding: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  statValue: { fontSize: 18, marginTop: 4 },
  statLabel: { fontSize: 12 },
  sectionCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  sectionTitle: { fontSize: 13, letterSpacing: 0.5 },
  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingText: { fontSize: 14 },
});