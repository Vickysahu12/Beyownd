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
      <StatusBar barStyle="dark-content" backgroundColor={colors.bg} />

      <View style={styles.glowTop} pointerEvents="none" />
      <View style={styles.glowBottom} pointerEvents="none" />

      <Animated.View
        entering={FadeInUp.springify().delay(100)}
        style={styles.header}
      >
        <View style={styles.badge}>
          <View style={styles.badgeDot} />
          <Text style={styles.badgeText}>SETTING UP</Text>
        </View>
        <Text style={styles.eyebrow}>Welcome To Beyownd!</Text>
        <Text style={styles.subtitle}>Setting up your workspace...</Text>
      </Animated.View>

      <Animated.View
        entering={FadeInUp.springify().delay(250)}
        style={styles.hero}
      >
        <CharacterHero />
      </Animated.View>

      <Animated.View
        entering={FadeInDown.springify().delay(450)}
        style={styles.content}
      >
        <SetupCard />

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
    backgroundColor: colors.bg,
  },
  header: {
    paddingTop: 24,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: colors.accentSoft,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 100,
    marginBottom: 12,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: colors.accent,
  },
  badgeText: {
    fontSize: 10,
    fontFamily: fonts.bodyMedium,
    color: colors.accent,
    letterSpacing: 1,
  },
  eyebrow: {
    fontSize: 24,
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  subtitle: {
    marginTop: 6,
    fontSize: 14,
    color: colors.textMuted,
    fontFamily: fonts.body,
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
    height: 5,
    width: "100%",
    backgroundColor: colors.border,
    borderRadius: 3,
    overflow: "hidden",
    marginTop: 16,
  },
  progressBar: {
    height: "100%",
    backgroundColor: colors.accent,
    borderRadius: 3,
  },
  glowTop: {
    position: "absolute",
    top: -100,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 140,
    backgroundColor: colors.accent,
    opacity: 0.07,
  },
  glowBottom: {
    position: "absolute",
    bottom: -100,
    right: -70,
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: colors.accent,
    opacity: 0.05,
  },
});