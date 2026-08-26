import React, { useEffect } from "react";
import { SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import CharacterHero from "@/components/ui/workspace/CharacterHero";
import SetupCard from "@/components/ui/workspace/SetupCard";

import { colors, fonts } from "@/constants/theme";
import { apiClient } from "@/api/client";
import { useAuthStore } from "@/store/useAuthStore";

export default function WorkspaceSetupScreen() {
  const router = useRouter();
  const progressWidth = useSharedValue(0);

  useEffect(() => {
    let isMounted = true;

    // Smooth loading bar animation during 3.5s wait
    progressWidth.value = withTiming(100, {
      duration: 3500,
      easing: Easing.linear,
    });

    const timer = setTimeout(async () => {
      try {
        await Haptics.notificationAsync(
          Haptics.NotificationFeedbackType.Success
        );
      } catch (hapticErr) {
        // Safe fallback if haptics fail on specific devices
      }

      try {
        const { data } = await apiClient.put(
          "/users/complete-workspace-setup"
        );
        if (isMounted) {
          useAuthStore.getState().updateUser(data.data);
        }
      } catch (err) {
        console.error(
          "Workspace setup completion failed:",
          err.response?.data || err.message
        );
      } finally {
        if (isMounted) {
          router.replace("/(tabs)/home");
        }
      }
    }, 3500);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progressWidth.value}%`,
  }));

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.bg || "#000000"}
      />

      {/* Decorative Background Glows */}
      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

      {/* Header Section */}
      <Animated.View
        entering={FadeInUp.springify().delay(100)}
        style={styles.header}
      >
        <Text style={styles.eyebrow}>Welcome To Beyownd!</Text>
        <Text style={styles.subtitle}>Setting up your workspace...</Text>
      </Animated.View>

      {/* Hero Character Section */}
      <Animated.View
        entering={FadeInUp.springify().delay(250)}
        style={styles.hero}
      >
        <CharacterHero />
      </Animated.View>

      {/* Content & Interactive Card */}
      <Animated.View
        entering={FadeInDown.springify().delay(450)}
        style={styles.content}
      >
        <SetupCard />

        {/* Dynamic Progress Bar Bar at bottom */}
        <View style={styles.progressTrack}>
          <Animated.View style={[styles.progressBar, progressStyle]} />
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg || "#0F0F12",
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 22,
    color: colors.accent || "#58CC02",
    fontFamily: fonts.headingBold || fonts.bodyMedium || "System",
    letterSpacing: 0.4,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted || "#9CA3AF",
    fontFamily: fonts.body || "System",
    textAlign: "center",
  },
  hero: {
    flex: 0.4,
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    flex: 0.6,
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  progressTrack: {
    height: 4,
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.08)",
    borderRadius: 2,
    overflow: "hidden",
    marginTop: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.accent || "#58CC02",
    borderRadius: 2,
  },
  glowTop: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.accent || "#58CC02",
    opacity: 0.08,
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.accent || "#58CC02",
    opacity: 0.06,
  },
});