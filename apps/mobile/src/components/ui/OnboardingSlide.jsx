import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { colors } from '@/constants/theme';

export default function OnboardingSlide({ slide }) {
  return (
    <View style={styles.slide}>
      <Image source={slide.image} style={styles.image} resizeMode="cover" />
    </View>
  );
}

const styles = StyleSheet.create({
  slide: { flex: 1, backgroundColor: colors.bg },
  image: { flex: 1, width: '110%' },
});