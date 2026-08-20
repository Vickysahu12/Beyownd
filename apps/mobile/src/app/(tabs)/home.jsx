import React, { useState, useEffect, useCallback } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

import { HomeThemeProvider, useHomeTheme } from "@/context/ThemeContext";
import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";

import HomeHeader from "@/components/ui/home/HomeHeader";
import ReadinessMeter from "@/components/ui/home/ReadinessMeter";
import StatsRow from "@/components/ui/home/StatsRow";
import RealityTaskCard from "@/components/ui/home/RealityTaskCard";
import QuickAccessNotes from "@/components/ui/home/QuickAccessNote";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";

function HomeContent() {
  const { colors, isDark, toggleTheme } = useHomeTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchHomeData = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await apiClient.get("/home");
      setDashboard(data.data);
    } catch (err) {
      console.error("Home fetch failed:", err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHomeData();
  }, [fetchHomeData]);

  const firstName = user?.name?.split(" ")[0] || "there";

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.stickyHeader, { backgroundColor: colors.bg, borderBottomColor: colors.divider }]}>
        <HomeHeader
          name={firstName}
          avatar={require("@/assets/image/avatar.png")}
          streak={dashboard?.streak ?? 0}
          hasNotification
          isDark={isDark}
          onToggleTheme={() => {
            Haptics.selectionAsync();
            toggleTheme();
          }}
          onNotificationPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            router.push("/notifications");
          }}
        />
      </View>

      <ScrollView
        contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 140 }]}
        showsVerticalScrollIndicator={false}
      >
        <ScreenStateWrapper
          loading={loading}
          error={error}
          isEmpty={false}
          onRetry={fetchHomeData}
          skeletonCount={3}
        >
          {dashboard && (
            <>
              <Animated.View entering={FadeInDown.springify().damping(16)}>
                <ReadinessMeter
                  percent={dashboard.readiness}
                  message={dashboard.message}
                  weeklyChange={dashboard.weeklyChange}
                />
                <StatsRow stats={dashboard.stats} />
              </Animated.View>

              {dashboard.featuredTask && (
                <Animated.View entering={FadeInDown.delay(120).springify().damping(16)} style={styles.section}>
                  <RealityTaskCard
                    title={dashboard.featuredTask.title}
                    description={dashboard.featuredTask.description}
                    difficulty={dashboard.featuredTask.difficulty}
                    hours={dashboard.featuredTask.hours}
                    onPress={() => router.push(`/task/${dashboard.featuredTask.id}`)}
                  />
                </Animated.View>
              )}

              <Animated.View entering={FadeInDown.delay(240).springify().damping(16)} style={styles.section}>
                <QuickAccessNotes />
              </Animated.View>
            </>
          )}
        </ScreenStateWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function Home() {
  return (
    <HomeThemeProvider>
      <HomeContent />
    </HomeThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  stickyHeader: { paddingHorizontal: 24, paddingTop: 8, paddingBottom: 14, borderBottomWidth: 1 },
  scroll: { paddingHorizontal: 24, paddingTop: 20, paddingBottom: 120, gap: 4 },
  section: { marginTop: 26 },
});