import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NoteCard({ icon, color = "accent", title, progress = 0, onPress }) {
  const { colors, fonts } = useHomeTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  // Dynamic Theme Colors Fallback Handling
  const cardBg = colors?.[`${color}Soft`] || colors?.cardDark || "rgba(255, 255, 255, 0.05)";
  const mainColor = colors?.[color] || colors?.accent || "#FF5722";

  return (
    <AnimatedPressable
      style={[styles.card, { backgroundColor: cardBg }, style]}
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      onPressIn={() => (scale.value = withSpring(0.96))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <View style={styles.top}>
        <View style={[styles.iconBox, { backgroundColor: mainColor }]}>
          <Ionicons name={icon || "document-text-outline"} size={20} color="#fff" />
        </View>
        <Ionicons name="bookmark" size={16} color={mainColor} />
      </View>

      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]} numberOfLines={2}>
        {title}
      </Text>

      <View style={styles.progressRow}>
        <View style={styles.track}>
          <View style={[styles.fill, { width: `${progress}%`, backgroundColor: mainColor }]} />
        </View>
        <Text style={[styles.percent, { color: mainColor, fontFamily: fonts.bodyMedium }]}>
          {progress}%
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  card: {
    width: 148,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
  },
  top: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 10,
  },
  progressRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  track: {
    flex: 1,
    height: 4,
    borderRadius: 999,
    backgroundColor: "rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  percent: {
    fontSize: 11,
  },
});