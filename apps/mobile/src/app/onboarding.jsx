import React, { useRef, useState } from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import PagerView from 'react-native-pager-view';
import { useRouter } from 'expo-router';
import OnboardingSlide from '@/components/ui/OnboardingSlide';
import { onboardingSlides } from '@/constants/onboarding-data';
import { colors, fonts } from '@/constants/theme';

export default function Onboarding() {
  const router = useRouter();
  const pagerRef = useRef(null);
  const [page, setPage] = useState(0);

  const isLast = page === onboardingSlides.length - 1;

  const goNext = () => {
    if (isLast) router.replace('/signup');
    else pagerRef.current?.setPage(page + 1);
  };

  const skip = () => router.replace('/signup');

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {!isLast && (
        <Pressable style={styles.skipButton} onPress={skip} hitSlop={12}>
          <Text style={styles.skipText}>Skip</Text>
        </Pressable>
      )}

      <PagerView
        ref={pagerRef}
        style={styles.pager}
        initialPage={0}
        onPageSelected={(e) => setPage(e.nativeEvent.position)}
      >
        {onboardingSlides.map((slide) => (
          <View key={slide.id} style={{ flex: 1 }}>
            <OnboardingSlide slide={slide} />
          </View>
        ))}
      </PagerView>

      <View style={styles.bottomRow}>
        <View style={styles.dots}>
          {onboardingSlides.map((slide, i) => (
            <View key={slide.id} style={[styles.dot, i === page && styles.dotActive]} />
          ))}
        </View>
        <Pressable style={styles.nextButton} onPress={goNext}>
          <Text style={styles.nextButtonText}>{isLast ? 'Get Started' : 'Next'}</Text>
          {!isLast && <Text style={styles.arrow}>→</Text>}
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  skipButton: { position: 'absolute', top: 12, right: 20, zIndex: 10 },
  skipText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: colors.textMuted, paddingTop: 30 },
  pager: { flex: 1 },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 28,
    paddingBottom: 24,
    paddingTop: 12,
  },
  dots: { flexDirection: 'row', gap: 6 },
  dot: { width: 7, height: 7, borderRadius: 4, backgroundColor: colors.divider },
  dotActive: { width: 20, backgroundColor: colors.accent },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: colors.textPrimary,
    paddingHorizontal: 22,
    paddingVertical: 13,
    borderRadius: 999,
  },
  nextButtonText: { fontFamily: fonts.bodyMedium, fontSize: 14, color: '#FFFFFF' },
  arrow: { color: '#FFFFFF', fontSize: 15 },
});