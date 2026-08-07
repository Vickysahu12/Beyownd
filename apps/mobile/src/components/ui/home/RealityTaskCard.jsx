import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from "react-native-reanimated";
import { darkColors as colors } from "@/constants/darkTheme";
import { fonts } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function RealityTaskCard({ title, description, difficulty, hours, onPress }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <View style={styles.cardContainer}>
      <LinearGradient
        colors={["#1E1E24", "#121215"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.card}
      >
        {/* Glow accent border line at the top */}
        <View style={styles.topGlowLine} />

        <View style={styles.badge}>
          <Ionicons name="sparkles" size={12} color="#FF5722" />
          <Text style={[styles.badgeText, { fontFamily: fonts.headingBold }]}>
            FEATURED REALITY TASK
          </Text>
        </View>

        <Text style={[styles.title, { fontFamily: fonts.headingBold }]} numberOfLines={2}>
          {title}
        </Text>
        
        <Text style={[styles.description, { fontFamily: fonts.body }]} numberOfLines={2}>
          {description}
        </Text>

        <View style={styles.metaRow}>
          <View style={styles.metaChip}>
            <Ionicons name="flash-outline" size={13} color="#FF5722" />
            <Text style={[styles.metaText, { fontFamily: fonts.bodyMedium }]}>{difficulty}</Text>
          </View>
          <View style={styles.metaChip}>
            <Ionicons name="time-outline" size={13} color="#A1A1AA" />
            <Text style={[styles.metaText, { fontFamily: fonts.bodyMedium }]}>{hours}</Text>
          </View>
        </View>

        <AnimatedPressable
          style={[styles.cta, style]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
            onPress?.();
          }}
          onPressIn={() => (scale.value = withSpring(0.97, { damping: 12, stiffness: 200 }))}
          onPressOut={() => (scale.value = withSpring(1))}
        >
          <LinearGradient
            colors={["#FF5722", "#E64A19"]}
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
    marginBottom: 16,
    borderRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.4,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 8,
  },
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.08)",
    position: "relative",
    overflow: "hidden",
  },
  topGlowLine: {
    position: "absolute",
    top: 0,
    left: 40,
    right: 40,
    height: 2,
    backgroundColor: "rgba(255, 87, 34, 0.6)",
    borderRadius: 1,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    backgroundColor: "rgba(255, 87, 34, 0.12)",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255, 87, 34, 0.25)",
    marginBottom: 14,
  },
  badgeText: {
    fontSize: 10,
    color: "#FF5722",
    letterSpacing: 0.8,
  },
  title: {
    fontSize: 22,
    lineHeight: 28,
    color: "#FFFFFF",
    marginBottom: 8,
    letterSpacing: -0.4,
  },
  description: {
    fontSize: 13,
    lineHeight: 19,
    color: "#A1A1AA",
  },
  metaRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 18,
    marginBottom: 18,
  },
  metaChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.06)",
  },
  metaText: {
    fontSize: 12,
    color: "#E4E4E7",
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
    height: 50,
    borderRadius: 16,
  },
  ctaText: {
    fontSize: 15,
    color: "#FFFFFF",
    letterSpacing: -0.2,
  },
});