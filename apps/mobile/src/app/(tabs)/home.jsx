import React, { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useRouter } from "expo-router";

import { HomeThemeProvider, useHomeTheme } from "@/context/ThemeContext";
import HomeHeader from "@/components/ui/home/HomeHeader";
import ReadinessMeter from "@/components/ui/home/ReadinessMeter";
import StatsRow from "@/components/ui/home/StatsRow";
import RealityTaskCard from "@/components/ui/home/RealityTaskCard";
import QuickAccessNotes from "@/components/ui/home/QuickAccessNote";

// 1. ScreenStateWrapper import kiya
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";

function HomeContent() {
  const { colors, isDark, toggleTheme } = useHomeTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  // 2. States setup ki testing ke liye
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [hasData, setHasData] = useState(true);

  // 3. Fake API call (1.5 sec delay to show Skeleton Shimmer)
  const fetchHomeData = () => {
    setLoading(true);
    setError(false);

    setTimeout(() => {
      setLoading(false);
      setHasData(true);
    }, 1500);
  };

  useEffect(() => {
    fetchHomeData();
  }, []);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Sticky header — ScrollView & StateWrapper ke baahar (Hamesha visible) */}
      <View style={[styles.stickyHeader, { backgroundColor: colors.bg, borderBottomColor: colors.divider }]}>
        <HomeHeader
          name="Aarav"
          avatar={require("@/assets/image/avatar.png")}
          streak={12}
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
        {/* 4. ScreenStateWrapper se content wrap kar diya */}
        <ScreenStateWrapper
          loading={loading}
          error={error}
          isEmpty={!hasData}
          onRetry={fetchHomeData}
          skeletonCount={3}
          emptyTitle="No Data Found"
          emptySubtitle="Check back later for updated dashboard stats."
        >
          <Animated.View entering={FadeInDown.springify().damping(16)}>
            <ReadinessMeter percent={68} message="You're making strong progress!" weeklyChange={12} />
            <StatsRow />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(120).springify().damping(16)} style={styles.section}>
            <RealityTaskCard
              title="Build a Personal Portfolio Website"
              description="Create and deploy your own portfolio website to showcase your projects and skills."
              difficulty="Intermediate"
              hours="3-4 hrs"
              onPress={() => router.push("/(tabs)/tasks")}
            />
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(240).springify().damping(16)} style={styles.section}>
            <QuickAccessNotes />
          </Animated.View>
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
  stickyHeader: {
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  scroll: {
    paddingHorizontal: 24,
    paddingTop: 20,
    paddingBottom: 120,
    gap: 4,
  },
  section: { marginTop: 26 },
});