import React, { useEffect } from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";

export default function HomeHeader({ name, avatar, streak, hasNotification, isDark, onToggleTheme }) {
  const { colors, fonts } = useHomeTheme();

  const dotOpacity = useSharedValue(1);
  const bellScale = useSharedValue(1);
  const streakScale = useSharedValue(1);
  const themeScale = useSharedValue(1);

  useEffect(() => {
    if (hasNotification) {
      dotOpacity.value = withRepeat(
        withSequence(withTiming(0.3, { duration: 800 }), withTiming(1, { duration: 800 })),
        -1,
        true
      );
    }
  }, [hasNotification]);

  const dotStyle = useAnimatedStyle(() => ({ opacity: dotOpacity.value }));
  const bellStyle = useAnimatedStyle(() => ({ transform: [{ scale: bellScale.value }] }));
  const streakStyle = useAnimatedStyle(() => ({ transform: [{ scale: streakScale.value }] }));
  const themeStyle = useAnimatedStyle(() => ({ transform: [{ scale: themeScale.value }] }));

  return (
    <View style={styles.row}>
      <View style={styles.left}>
        <Image source={avatar} style={[styles.avatar, { backgroundColor: colors.accentSoft }]} />
        <View>
          <Text style={[styles.greeting, { color: colors.textMuted, fontFamily: fonts.body }]}>
            Good morning,
          </Text>
          <Text style={[styles.name, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            {name} 👋
          </Text>
        </View>
      </View>

      <View style={styles.actions}>
        <Animated.View style={bellStyle}>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.divider }]}
            onPress={() => {
              Haptics.selectionAsync();
              bellScale.value = withSpring(0.9, {}, () => {
                bellScale.value = withSpring(1);
              });
            }}
          >
            <Ionicons name="notifications-outline" size={20} color={colors.textPrimary} />
            {hasNotification && (
              <Animated.View style={[styles.dot, { backgroundColor: colors.danger }, dotStyle]} />
            )}
          </Pressable>
        </Animated.View>

        <Animated.View style={themeStyle}>
          <Pressable
            style={[styles.iconButton, { backgroundColor: colors.card, borderColor: colors.divider }]}
            onPress={() => {
              Haptics.selectionAsync();
              themeScale.value = withSpring(0.9, {}, () => {
                themeScale.value = withSpring(1);
              });
              onToggleTheme();
            }}
            hitSlop={10}
          >
            <Ionicons
              name={isDark ? "sunny-outline" : "moon-outline"}
              size={18}
              color={colors.textPrimary}
            />
          </Pressable>
        </Animated.View>

        <Animated.View style={streakStyle}>
          <Pressable
            style={[styles.streakBadge, { backgroundColor: colors.card, borderColor: colors.divider }]}
            onPress={() => {
              Haptics.selectionAsync();
              streakScale.value = withSpring(0.9, {}, () => {
                streakScale.value = withSpring(1);
              });
            }}
          >
            <Ionicons name="flame" size={16} color={colors.accent} />
            <Text style={[styles.streakText, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>
              {streak}
            </Text>
          </Pressable>
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  left: { flexDirection: "row", flex: 1, gap: 12, alignItems: "center" },
  avatar: { width: 52, height: 52, borderRadius: 26 },
  greeting: { fontSize: 13 },
  name: { fontSize: 20, marginTop: 1 },
  actions: { flexDirection: "row", gap: 8, alignItems: "center" },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  dot: { position: "absolute", top: 9, right: 10, width: 7, height: 7, borderRadius: 4 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    height: 42,
    borderRadius: 21,
    borderWidth: 1,
  },
  streakText: { fontSize: 14 },
});