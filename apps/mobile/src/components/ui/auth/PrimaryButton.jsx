import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { Pressable } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { colors, fonts } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function AuthButton({ label, onPress, loading = false, disabled = false }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  return (
    <AnimatedPressable
      style={[style, disabled && { opacity: 0.5 }]}
      disabled={disabled || loading}
      onPress={() => {
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        onPress?.();
      }}
      onPressIn={() => (scale.value = withSpring(0.96))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <LinearGradient
        colors={["#1E3527", colors.accent]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.button}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <View style={styles.content}>
            <Text style={styles.label}>{label}</Text>
            <Ionicons name="arrow-forward" size={18} color="#fff" />
          </View>
        )}
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    borderRadius: 18,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: colors.accent,
    shadowOpacity: 0.25,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 6,
  },
  content: { flexDirection: "row", alignItems: "center", gap: 8 },
  label: { fontSize: 16, color: "#fff", fontFamily: fonts.bodyMedium, letterSpacing: -0.2 },
});