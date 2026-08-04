import React from "react";
import { Pressable, Text, StyleSheet } from "react-native";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { colors, fonts } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function SelectPill({ label, selected, onPress }) {
  const scale = useSharedValue(1);
  const checkScale = useSharedValue(selected ? 1 : 0);

  React.useEffect(() => {
    checkScale.value = withSpring(selected ? 1 : 0, { damping: 12, stiffness: 180 });
  }, [selected]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    backgroundColor: withTiming(selected ? colors.accentSoft : colors.card, { duration: 180 }),
    borderColor: withTiming(selected ? colors.accent : colors.divider, { duration: 180 }),
    shadowOpacity: withTiming(selected ? 0.12 : 0.04, { duration: 180 }),
  }));

  const checkStyle = useAnimatedStyle(() => ({
    transform: [{ scale: checkScale.value }],
    opacity: checkScale.value,
  }));

  return (
    <AnimatedPressable
      style={[styles.pill, containerStyle]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 14 }))}
      onPressOut={() => (scale.value = withSpring(1, { damping: 14 }))}
    >
      <Text style={[styles.label, { color: selected ? colors.accent : colors.textPrimary }]}>
        {label}
      </Text>
      <Animated.View style={checkStyle}>
        <Ionicons name="checkmark-circle" size={20} color={colors.accent} />
      </Animated.View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1.5,
    borderRadius: 18,
    paddingVertical: 16,
    paddingHorizontal: 18,
    marginBottom: 10,
    shadowColor: colors.accent,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 2,
  },
  label: {
    fontSize: 15,
    fontFamily: fonts.bodyMedium,
    flex: 1,
  },
});