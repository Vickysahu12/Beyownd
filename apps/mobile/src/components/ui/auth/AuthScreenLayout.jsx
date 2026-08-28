import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";

import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Animated from "react-native-reanimated";

import AuthHeader from "./AuthHeader";
import { colors } from "@/constants/theme";
import { useRouter } from "expo-router";

export default function AuthScreenLayout({
  icon,
  image,
  title,
  subtitle,
  children,
  footer,
  compact = false,
}) {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          keyboardShouldPersistTaps="handled"
          contentContainerStyle={styles.scroll}
        >
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.back}>
            <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
          </Pressable>

          <Animated.View style={styles.center}>
            <AuthHeader
              icon={icon}
              image={image}
              title={title}
              subtitle={subtitle}
              compact={compact}
            />

            <View>{children}</View>

            {footer && <View style={styles.footer}>{footer}</View>}
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingBottom: 32,
    paddingTop: 8,
  },
  back: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  center: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    marginTop: 16,
    alignItems: "center",
  },
});