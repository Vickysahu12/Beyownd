import React, { useEffect } from "react";
import { Image, StyleSheet, View } from "react-native";

import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";

import { colors } from "@/constants/theme";

import Character from "@/assets/image/profileSetup.png";

const AnimatedImage = Animated.createAnimatedComponent(Image);

export default function CharacterHero() {
  const floatY = useSharedValue(0);
  const glowScale = useSharedValue(1);

  useEffect(() => {
    floatY.value = withRepeat(
      withSequence(
        withTiming(-10, {
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(0, {
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );

    glowScale.value = withRepeat(
      withSequence(
        withTiming(1.08, {
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
        }),
        withTiming(1, {
          duration: 2600,
          easing: Easing.inOut(Easing.ease),
        })
      ),
      -1,
      true
    );
  }, []);

  const imageStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: floatY.value }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    transform: [{ scale: glowScale.value }],
    opacity: 0.22,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.glow, glowStyle]} />

      <View style={styles.shadow} />

      <AnimatedImage
        source={Character}
        resizeMode="contain"
        style={[styles.image, imageStyle]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 20,
    height: 340,
  },

  glow: {
    position: "absolute",
    width: 260,
    height: 260,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  image: {
    width: 340,
    height: 340,
    marginTop:20
  },
});