import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
  interpolate,
} from 'react-native-reanimated';
import { colors, fonts } from '@/constants/theme';
import { useAuthStore } from '@/store/useAuthStore';

const { width } = Dimensions.get('window');

export default function SplashIndex() {
  const router = useRouter();

  // Animation Shared Values
  const progress = useSharedValue(0);
  const maskWidth = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(12);

  useEffect(() => {
    // 1. Smooth Spring Scale & Entrance
    progress.value = withSpring(1, {
      damping: 14,
      stiffness: 100,
      mass: 0.8,
    });

    // 2. Crisp Typographic Mask Reveal
    maskWidth.value = withDelay(
      150,
      withTiming(100, {
        duration: 700,
        easing: Easing.bezier(0.16, 1, 0.3, 1), // LingoLift/Apple Smooth Curve
      })
    );

    // 3. Tagline Fade & Float Up
    taglineOpacity.value = withDelay(650, withTiming(1, { duration: 400 }));
    taglineY.value = withDelay(
      650,
      withSpring(0, { damping: 12, stiffness: 120 })
    );

    // 4. Navigation Logic (Kept intact)
    const timer = setTimeout(() => {
      const { isAuthenticated, hasCompletedOnboarding } = useAuthStore.getState();

      if (!hasCompletedOnboarding) {
        router.replace('/onboarding');
      } else if (!isAuthenticated) {
        router.replace('/login');
      } else {
        router.replace('/(tabs)/home');
      }
    }, 2400);

    return () => clearTimeout(timer);
  }, []);

  // Logo Animation Style (Scale + Subtle Y-translation for cinematic feel)
  const logoStyle = useAnimatedStyle(() => {
    const scale = interpolate(progress.value, [0, 1], [0.85, 1]);
    const translateY = interpolate(progress.value, [0, 1], [15, 0]);
    return {
      opacity: progress.value,
      transform: [{ scale }, { translateY }],
    };
  });

  const maskStyle = useAnimatedStyle(() => ({
    width: `${maskWidth.value}%`,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View style={styles.container}>
      {/* Subtle Background Glow Effect */}
      
      {/* Main Logo Container */}
      <Animated.View style={[styles.logoWrapper, logoStyle]}>
        <View style={styles.maskWrap}>
          <Animated.View style={[styles.maskReveal, maskStyle]}>
            <Text style={styles.logo}>
              Beyownd<Text style={styles.accentDot}>.</Text>
            </Text>
          </Animated.View>
        </View>
      </Animated.View>

      {/* Tagline Pill */}
      <Animated.View style={[styles.taglinePill, taglineStyle]}>
        <Text style={styles.tagline}>REAL WORK • REAL READINESS</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg || '#0B1317',
    position: 'relative',
  },
  logoWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  maskWrap: {
    overflow: 'hidden',
    alignItems: 'center',
  },
  maskReveal: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
  },
  logo: {
    fontFamily: fonts.displayHeavy || 'System',
    fontSize: 58,
    fontWeight: '900',
    color: colors.textPrimary || '#FFFFFF',
    letterSpacing: -1.8,
    textShadowColor: 'rgba(255, 255, 255, 0.15)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
  },
  accentDot: {
    color: colors.primary || '#58CC02',
  },
  taglinePill: {
    marginTop: 20,
    paddingHorizontal: 16,
    paddingVertical: 7,
    borderRadius: 100,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  tagline: {
    fontFamily: fonts.bodyMedium || 'System',
    fontSize: 10,
    fontWeight: '700',
    color: colors.textMuted || '#9CA3AF',
    letterSpacing: 2.8,
  },
});