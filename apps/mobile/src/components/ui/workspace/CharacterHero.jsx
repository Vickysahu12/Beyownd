import React, { useEffect } from "react";
import { Image, StyleSheet, View, Dimensions } from "react-native";

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

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
// Chhote screens (<700px height) pe hero ko compact rakhte hain
const IS_SMALL_SCREEN = SCREEN_HEIGHT < 700;

const HERO_SIZE = IS_SMALL_SCREEN ? 220 : 300;
const GLOW_SIZE = IS_SMALL_SCREEN ? 180 : 240;
const CONTAINER_HEIGHT = IS_SMALL_SCREEN ? 240 : 320;

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
    height: CONTAINER_HEIGHT,
  },

  glow: {
    position: "absolute",
    width: GLOW_SIZE,
    height: GLOW_SIZE,
    borderRadius: 999,
    backgroundColor: colors.accent,
  },

  image: {
    width: HERO_SIZE,
    height: HERO_SIZE,
  },
});