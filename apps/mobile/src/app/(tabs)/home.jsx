import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { StatusBar } from "expo-status-bar";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { HomeThemeProvider, useHomeTheme } from "@/context/ThemeContext";
import HomeHeader from "@/components/ui/home/HomeHeader";
import ReadinessMeter from "@/components/ui/home/ReadinessMeter";
import StatsRow from "@/components/ui/home/StatsRow";
import RealityTaskCard from "@/components/ui/home/RealityTaskCard";
import QuickAccessNotes from "@/components/ui/home/QuickAccessNote";

function HomeContent() {
  const { colors, isDark, toggleTheme } = useHomeTheme();
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Sticky header — ScrollView ke bahar */}
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
        />
      </View>

      <ScrollView
  contentContainerStyle={[styles.scroll, { paddingBottom: insets.bottom + 140 }]}
  showsVerticalScrollIndicator={false}
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
            onPress={() => {}}
          />
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(240).springify().damping(16)} style={styles.section}>
          <QuickAccessNotes />
        </Animated.View>
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