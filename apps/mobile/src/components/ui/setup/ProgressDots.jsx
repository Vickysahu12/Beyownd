import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, { useAnimatedStyle, withTiming } from "react-native-reanimated";
import { colors } from "@/constants/theme";

export default function ProgressBar({ progress }) {
  const style = useAnimatedStyle(() => ({
    width: withTiming(`${progress * 100}%`, { duration: 350 }),
  }));

  return (
    <View style={styles.track}>
      <Animated.View style={[styles.fill, style]} />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    height: 6,
    borderRadius: 999,
    backgroundColor: colors.divider,
    overflow: "hidden",
    marginBottom: 28,
  },
  fill: {
    height: "100%",
    borderRadius: 999,
    backgroundColor: colors.accent,
  },
});