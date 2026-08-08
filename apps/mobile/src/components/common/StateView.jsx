import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";

export function ErrorState({
  title = "Something went wrong",
  subtitle = "Please check your network connection and try again.",
  onRetry,
}) {
  const { colors, fonts } = useHomeTheme();

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.centerContainer}>
      <View style={[styles.iconCircle, { backgroundColor: "rgba(239, 68, 68, 0.12)" }]}>
        <Ionicons name="cloud-offline-outline" size={32} color="#EF4444" />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: fonts.body }]}>
        {subtitle}
      </Text>
      {onRetry && (
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            { backgroundColor: colors.accent || "#FF5722", opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            onRetry();
          }}
        >
          <Ionicons name="refresh-outline" size={16} color="#FFFFFF" />
          <Text style={styles.retryText}>Try Again</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

export function EmptyState({
  icon = "folder-open-outline",
  title = "No Data Found",
  subtitle = "There's nothing to display right now.",
  actionLabel,
  onAction,
}) {
  const { colors, fonts } = useHomeTheme();

  return (
    <Animated.View entering={FadeIn.duration(300)} style={styles.centerContainer}>
      <View style={[styles.iconCircle, { backgroundColor: colors.surface || "#18181B" }]}>
        <Ionicons name={icon} size={32} color={colors.textMuted} />
      </View>
      <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
        {title}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: fonts.body }]}>
        {subtitle}
      </Text>
      {actionLabel && onAction && (
        <Pressable
          style={({ pressed }) => [
            styles.retryBtn,
            { backgroundColor: colors.surface, borderWidth: 1, borderColor: colors.border, opacity: pressed ? 0.8 : 1 },
          ]}
          onPress={onAction}
        >
          <Text style={[styles.retryText, { color: colors.textPrimary }]}>{actionLabel}</Text>
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
    gap: 12,
  },
  iconCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 16,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    maxWidth: 260,
  },
  retryBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 8,
  },
  retryText: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "600",
  },
});