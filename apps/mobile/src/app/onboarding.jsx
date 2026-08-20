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

import HeroIllustration from "@/components/ui/onboarding/HeroIllustration";
import GradientGlow from "@/components/ui/onboarding/GradientGlow";

import { colors, fonts } from "@/constants/theme";
import { useAuthStore } from "@/store/useAuthStore";

export default function Onboarding() {
  const router = useRouter();
  const setCompletedOnboarding = useAuthStore((state) => state.setCompletedOnboarding);

  const fade = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(35)).current;
  const scale = useRef(new Animated.Value(0.92)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fade, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),

      Animated.spring(scale, {
        toValue: 1,
        friction: 7,
        useNativeDriver: true,
      }),

      Animated.spring(translateY, {
        toValue: 0,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // NOTE: is stage pe user authenticated NAHI hota (signup/login se pehle
  // hi ye screen aati hai) — isliye ye flag sirf LOCAL rehta hai (AsyncStorage
  // ke through, zustand persist se). Backend ka hasCompletedOnboarding column
  // abhi ke liye is screen se sync nahi hoga — agar future mein interest-tags
  // is screen pe select karwane hain to signup ke baad ek alag sync-step
  // banana padega, jab token available ho.
  const handleStart = () => {
    setCompletedOnboarding(true);
    router.replace("/signup");
  };

  const handleSignIn = () => {
    setCompletedOnboarding(true);
    router.replace("/login");
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="dark-content"
      />

      <GradientGlow />

      {/* Logo */}
      <Animated.Text
        style={[
          styles.logo,
          {
            opacity: fade,
          },
        ]}
      >
        Bey
        <Text style={{ color: colors.accent }}>ownd</Text>
      </Animated.Text>

      {/* Hero */}
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ scale }],
        }}
      >
        <HeroIllustration />
      </Animated.View>

      {/* Text */}
      <Animated.View
        style={{
          opacity: fade,
          transform: [{ translateY }],
        }}
      >
        <Text style={styles.title}>
          Stop{" "}
          <Text style={styles.orange}>
            consuming.
          </Text>
          {"\n"}
          Start{" "}
          <Text style={styles.orange}>
            building.
          </Text>
        </Text>
      </Animated.View>

      <View style={{ flex: 1 }} />

      {/* CTA */}
      <Pressable
        android_ripple={{
          color: "#3d2b22",
        }}
        style={styles.button}
        onPress={handleStart}
      >
        <Text style={styles.buttonText}>
          Start My Journey →
        </Text>
      </Pressable>

      <Pressable onPress={handleSignIn}>
        <Text style={styles.signin}>
          Already have an account?
          <Text style={styles.signAccent}>
            {" "}
            Sign In
          </Text>
        </Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
    paddingHorizontal: 28,
  },

  logo: {
    marginTop: 14,
    fontSize: 28,
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
  },

  title: {
    marginTop: 25,
    fontSize: 42,
    lineHeight: 48,
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
  },

  orange: {
    color: colors.accent,
  },

  subtitle: {
    marginTop: 18,
    fontSize: 17,
    lineHeight: 29,
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
  },

  button: {
    height: 60,
    borderRadius: 18,
    backgroundColor: "#241914",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 10,
    },
    elevation: 10,
  },

  buttonText: {
    color: "#fff",
    fontSize: 17,
    fontFamily: fonts.bodyMedium,
  },

  signin: {
    marginTop: 20,
    marginBottom: 25,
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
    fontSize: 15,
  },

  signAccent: {
    color: colors.accent,
  },
});