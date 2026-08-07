import React, { useEffect } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import Animated, {
  FadeInDown,
  FadeInUp,
} from "react-native-reanimated";

import CharacterHero from "@/components/ui/workspace/CharacterHero";
import SetupCard from "@/components/ui/workspace/SetupCard";

import { colors, fonts } from "@/constants/theme";

export default function WorkspaceSetupScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(async () => {
      await Haptics.notificationAsync(
        Haptics.NotificationFeedbackType.Success
      );

      router.replace("/home");
    }, 7000); // testing

    return () => clearTimeout(timer);
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={colors.bg}
      />

      {/* Background Glow */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* Header */}
      <Animated.View
        entering={FadeInUp.springify().delay(100)}
        style={styles.header}
      >
        <Text style={styles.eyebrow}>
          Welcome To Beyownd!
        </Text>
      </Animated.View>

      {/* Hero */}
      <Animated.View
        entering={FadeInUp.springify().delay(250)}
        style={styles.hero}
      >
        <CharacterHero />
      </Animated.View>

      {/* Setup Status */}
      <Animated.View
        entering={FadeInDown.springify().delay(450)}
        style={styles.content}
      >
        <SetupCard />
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
    paddingTop: 20,
    paddingHorizontal: 32,
    alignItems: "center",
  },
  eyebrow: {
    fontSize: 20,
    color: colors.accent,
    fontFamily: fonts.bodyMedium,
    letterSpacing: 0.3,
    marginBottom: 6,
    marginTop:20
  },

  subtitle: {
    marginTop: 10,
    fontSize: 16,
    lineHeight: 25,
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: fonts.body,
    paddingHorizontal: 10,
  },

  hero: {
    flex: 0.36,
    justifyContent: "center",
    alignItems: "center",
  },

  content: {
    flex: 0.64,
    justifyContent: "flex-start",
  },

  glowTop: {
    position: "absolute",
    top: -130,
    left: -80,
    width: 280,
    height: 280,
    borderRadius: 999,
    backgroundColor: colors.accent,
    opacity: 0.05,
  },

  glowBottom: {
    position: "absolute",
    bottom: -120,
    right: -70,
    width: 250,
    height: 250,
    borderRadius: 999,
    backgroundColor: colors.accent,
    opacity: 0.04,
  },
});