import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withDelay,
  Easing,
} from 'react-native-reanimated';
import { colors, fonts } from '@/constants/theme';

export default function SplashIntro() {
  const router = useRouter();

  const scale = useSharedValue(0.55);
  const opacity = useSharedValue(0);
  const maskWidth = useSharedValue(0);
  const taglineOpacity = useSharedValue(0);
  const taglineY = useSharedValue(8);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 200 });
    scale.value = withSpring(1, { damping: 8, stiffness: 140, mass: 0.9 });

    maskWidth.value = withDelay(
      120,
      withTiming(100, { duration: 550, easing: Easing.out(Easing.cubic) })
    );

    taglineOpacity.value = withDelay(700, withTiming(1, { duration: 400 }));
    taglineY.value = withDelay(700, withTiming(0, { duration: 400 }));

    const timer = setTimeout(() => {
      router.replace('/onboarding');
    }, 2200);
    return () => clearTimeout(timer);
  }, []);

  const logoStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  const maskStyle = useAnimatedStyle(() => ({
    width: `${maskWidth.value}%`,
  }));

  const taglineStyle = useAnimatedStyle(() => ({
    opacity: taglineOpacity.value,
    transform: [{ translateY: taglineY.value }],
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={logoStyle}>
        <View style={styles.maskWrap}>
          <Animated.View style={[styles.maskReveal, maskStyle]}>
            <Text style={styles.logo}>Beyownd</Text>
          </Animated.View>
        </View>
      </Animated.View>

      <Animated.Text style={[styles.tagline, taglineStyle]}>
        REAL WORK. REAL READINESS.
      </Animated.Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.bg,
  },
  maskWrap: { overflow: 'hidden' },
  maskReveal: { overflow: 'hidden' },
  logo: {
    fontFamily: fonts.displayHeavy,
    fontSize: 56,
    color: colors.textPrimary,
    letterSpacing: -1.2,
  },
  tagline: {
    fontFamily: fonts.bodyMedium,
    fontSize: 11,
    color: colors.textMuted,
    marginTop: 16,
    letterSpacing: 2.5,
  },
});