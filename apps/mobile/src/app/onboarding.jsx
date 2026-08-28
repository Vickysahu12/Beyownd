import { useEffect, useRef } from "react";
import {
  Animated,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import HeroIllustration from "@/components/ui/onboarding/HeroIllustration";
import GradientGlow from "@/components/ui/onboarding/GradientGlow";

import { colors, fonts } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

export default function Onboarding() {
  const router = useRouter();
  const setCompletedOnboarding = useAuthStore(
    (state) => state.setCompletedOnboarding
  );

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(25)).current;
  const scale = useRef(new Animated.Value(0.95)).current;
  const buttonPressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 650,
        useNativeDriver: true,
      }),
      Animated.spring(scale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        tension: 45,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleStart = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCompletedOnboarding(true);
    router.replace("/signup");
  };

  const handleSignIn = () => {
    setCompletedOnboarding(true);
    router.replace("/login");
  };

  const onPressIn = () => {
    Animated.spring(buttonPressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonPressAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const buttonTranslate = buttonPressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <GradientGlow />

      <Animated.View style={[styles.headerRow, { opacity: fade }]}>
        <Text style={styles.logo}>
          Bey<Text style={{ color: colors.accent }}>ownd</Text>
        </Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>REAL WORK</Text>
        </View>
      </Animated.View>

      <Animated.View
        style={[
          styles.heroWrapper,
          {
            opacity: fade,
            transform: [{ scale }],
          },
        ]}
      >
        <HeroIllustration />
      </Animated.View>

      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY }],
        }}
      >
        <Text style={styles.title}>
          Stop <Text style={styles.accentText}>consuming.</Text>
          {"\n"}
          Start <Text style={styles.accentText}>building.</Text>
        </Text>
        <Text style={styles.subtitle}>
          Turn theory into industry-ready proof of work.
        </Text>
      </Animated.View>

      <View style={{ flex: 1 }} />

      <View style={styles.buttonShadowContainer}>
        <Animated.View
          style={{
            transform: [{ translateY: buttonTranslate }],
          }}
        >
          <Pressable
            onPressIn={onPressIn}
            onPressOut={onPressOut}
            onPress={handleStart}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
            <Text style={styles.buttonArrow}>→</Text>
          </Pressable>
        </Animated.View>
      </View>

      <Pressable onPress={handleSignIn} style={styles.signinWrapper}>
        <Text style={styles.signin}>
          I already have an account{" "}
          <Text style={styles.signAccent}>• Sign In</Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 24,
  },
  headerRow: {
    marginTop: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logo: {
    fontSize: 26,
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.5,
  },
  badge: {
    backgroundColor: "rgba(0,0,0,0.04)",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.06)",
  },
  badgeText: {
    fontSize: 9,
    fontFamily: fonts.headingBold,
    color: colors.textMuted,
    letterSpacing: 1.2,
  },
  heroWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 18,
  },
  title: {
    fontSize: 38,
    lineHeight: 44,
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.8,
  },
  accentText: {
    color: colors.accent,
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
  },
  buttonShadowContainer: {
    width: "100%",
    height: 58,
    backgroundColor: colors.taskDarkAlt,
    borderRadius: 18,
  },
  button: {
    height: 54,
    borderRadius: 18,
    backgroundColor: colors.accent,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: fonts.headingBold,
    letterSpacing: 0.3,
  },
  buttonArrow: {
    color: "#fff",
    fontSize: 18,
    fontFamily: fonts.headingBold,
    marginLeft: 8,
    opacity: 0.85,
  },
  signinWrapper: {
    paddingVertical: 16,
    alignItems: "center",
  },
  signin: {
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 14,
  },
  signAccent: {
    color: colors.accent,
    fontFamily: fonts.headingBold,
  },
});