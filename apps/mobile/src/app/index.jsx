import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { colors, fonts } from '@/constants/theme';

export default function SplashIntro() {
  const router = useRouter();

  const logoOpacity = useSharedValue(0);
  const logoScale = useSharedValue(0.88);
  const lineWidth = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(10);

  useEffect(() => {
    logoOpacity.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });
    logoScale.value = withTiming(1, { duration: 650, easing: Easing.out(Easing.cubic) });

    lineWidth.value = withDelay(
      500,
      withTiming(56, { duration: 450, easing: Easing.out(Easing.cubic) })
    );

    taglineOpacity.value = withDelay(750, withTiming(1, { duration: 450 }));
    taglineY.value = withDelay(750, withTiming(0, { duration: 450 }));

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2400);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: logoOpacity.value,
    transform: [{ scale: logoScale.value }],
  }));

  const lineStyle = useAnimatedStyle(() => ({
    width: lineWidth.value,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <LinearGradient colors={[colors.bg, '#F6E6D4']} style={styles.container}>
      <Animated.Text style={[styles.logo, logoStyle]}>Beyownd</Animated.Text>
      <Animated.View style={[styles.accentLine, lineStyle]} />
      <Animated.Text style={[styles.tagline, taglineStyle]}>
        Real work. Real readiness.
      </Animated.Text>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  logo: {
    fontFamily: fonts.display,
    fontSize: 42,
    color: colors.textPrimary,
    letterSpacing: 0.3,
  },
  accentLine: {
    height: 3,
    borderRadius: 2,
    backgroundColor: colors.accent,
    marginTop: 14,
  },
  tagline: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textMuted,
    marginTop: 12,
    letterSpacing: 0.5,
  },
});