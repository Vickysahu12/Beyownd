import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RealityTaskCard({
  title,
  description,
  difficulty,
  hours,
  onPress,
}) {
  const { colors, fonts, isDark } = useHomeTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const bgGradient = isDark
    ? ["#1E1E24", "#121215"]
    : ["#FFFFFF", "#F4F4F5"];

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={bgGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { borderColor: colors.divider }]}
      >
        {/* Glow accent border line at top */}
        <View
          style={[styles.topGlowLine, { backgroundColor: colors.accent }]}
        />

        <View
          style={[
            styles.badge,
            {
              backgroundColor: colors.accentSoft || "rgba(255, 87, 34, 0.12)",
              borderColor: colors.accent,
            },
          ]}
        >
          <Ionicons name="sparkles" size={12} color={colors.accent} />
          <Text
            style={[
              styles.badgeText,
              { color: colors.accent, fontFamily: fonts.headingBold },
            ]}
          >
            FEATURED REALITY TASK
          </Text>
        </View>

        <Text
          style={[
            styles.title,
            { color: colors.textPrimary, fontFamily: fonts.headingBold },
          ]}
          numberOfLines={2}
        >
          {title}
        </Text>

        <Text
          style={[
            styles.description,
            { color: colors.textMuted, fontFamily: fonts.body },
          ]}
          numberOfLines={2}
        >
          {description}
        </Text>

        <View style={styles.metaRow}>
          <View
            style={[
              styles.metaChip,
              {
                backgroundColor: colors.card,
                borderColor: colors.divider,
              },
            ]}
          >
            <Ionicons name="flash-outline" size={13} color={colors.accent} />
            <Text
              style={[
                styles.metaText,
                { color: colors.textPrimary, fontFamily: fonts.bodyMedium },
              ]}
            >
              {difficulty}
            </Text>
          </View>

          <View
            style={[
              styles.metaChip,
              {
                backgroundColor: colors.card,
                borderColor: colors.divider,
              },
            ]}
          >
            <Ionicons name="time-outline" size={13} color={colors.textMuted} />
            <Text
              style={[
                styles.metaText,
                { color: colors.textMuted, fontFamily: fonts.bodyMedium },
              ]}
            >
              {hours}
            </Text>
          </View>
        </View>

        <AnimatedPressable
          style={[styles.cta, style]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress?.();
          }}
          onPressIn={() =>
            (scale.value = withSpring(0.97, { damping: 12, stiffness: 200 }))
          }
          onPressOut={() => (scale.value = withSpring(1))}
        >
          <LinearGradient
            colors={[colors.accent || "#FF5722", colors.accent || "#E64A19"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.ctaGradient}
          >
            <Text style={[styles.ctaText, { fontFamily: fonts.headingBold }]}>
              View Task Details
            </Text>
            <Ionicons name="arrow-forward" size={16} color="#FFFFFF" />
          </LinearGradient>
        </AnimatedPressable>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    marginBottom: 8,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    position: "relative",
    overflow: "hidden",
  },
  topGlowLine: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
    height: 2,
    borderRadius: 1,
    opacity: 0.8,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 10,
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 20,
    lineHeight: 26,
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 16,
    marginBottom: 18,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
  },
  metaText: {
    fontSize: 12,
  },
  cta: {
    borderRadius: 16,
    overflow: "hidden",
  },
  ctaGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    height: 48,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});