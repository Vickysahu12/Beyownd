import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeInRight,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";

import { colors, fonts } from "@/constants/theme";

const AnimatedView = Animated.createAnimatedComponent(View);

export default function ProgressItem({
  title,
  status = "pending",
  delay = 0,
}) {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (status === "loading") {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.25, {
            duration: 500,
            easing: Easing.out(Easing.ease),
          }),
          withTiming(1, {
            duration: 500,
            easing: Easing.in(Easing.ease),
          })
        ),
        -1,
        false
      );
    }
  }, [status]);

  const loadingStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const renderIndicator = () => {
    if (status === "done") {
      return (
        <View style={styles.doneCircle}>
          <Ionicons
            name="checkmark"
            size={12}
            color="#FFF"
          />
        </View>
      );
    }

    if (status === "loading") {
      return (
        <AnimatedView
          style={[styles.loadingDot, loadingStyle]}
        />
      );
    }

    return <View style={styles.pendingDot} />;
  };

  return (
    <Animated.View
      entering={FadeInRight.springify().delay(delay)}
      style={styles.container}
    >
      {renderIndicator()}

      <Text
        style={[
          styles.title,
          status === "pending" && styles.pendingText,
        ]}
      >
        {title}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 4,
  },

  title: {
    marginLeft: 14,
    fontSize: 15,
    fontFamily: fonts.bodyMedium,
    color: colors.textPrimary,
    letterSpacing: -0.2,
  },

  pendingText: {
    color: colors.textMuted,
  },

  doneCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },

  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.accent,
    marginHorizontal: 6,
  },

  pendingDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.divider,
    marginHorizontal: 6,
  },
});