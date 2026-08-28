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

  const cardBg = colors?.[`${color}Soft`] || colors.accentSoft;
  const mainColor = colors?.[color] || colors.accent;

  return (
    <AnimatedPressable
      style={[styles.card, { backgroundColor: cardBg, borderColor: colors.divider }, style]}
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
        <View style={[styles.track, { backgroundColor: colors.card }]}>
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
    width: 152,
    borderRadius: 18,
    padding: 14,
    marginRight: 12,
    borderWidth: 1,
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