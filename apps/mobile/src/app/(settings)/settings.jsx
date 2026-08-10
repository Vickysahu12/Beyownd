import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";
// 1. Auth Store import kiya
import { useAuthStore } from "@/store/useAuthStore";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  // 2. Logout function store se nikala
  const logout = useAuthStore((state) => state.logout);

  // Settings State
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [soundEnabled, setSoundEnabled] = useState(false);

  const triggerHaptic = () => {
    if (hapticsEnabled) {
      Haptics.selectionAsync();
    }
  };

  const handleSignOut = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    Alert.alert(
      "Sign Out",
      "Are you sure you want to log out of your account?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Log Out",
          style: "destructive",
          onPress: () => {
            // 3. Pehle store clear (isAuthenticated: false & token wipe)
            logout();
            // 4. Login screen par redirect
            router.replace("/login");
          },
        },
      ]
    );
  };

  // Helper render component for row items
  const renderSettingItem = ({
    icon,
    iconBg = colors.surface,
    iconColor = colors.textPrimary,
    title,
    subtitle,
    value,
    onValueChange,
    onPress,
    isDestructive = false,
  }) => {
    const isToggle = value !== undefined && onValueChange !== undefined;

    return (
      <Pressable
        style={({ pressed }) => [
          styles.itemRow,
          {
            backgroundColor: colors.surface || "#18181B",
            borderColor: colors.border || "rgba(255,255,255,0.06)",
            opacity: pressed && onPress ? 0.7 : 1,
          },
        ]}
        onPress={
          onPress
            ? () => {
                triggerHaptic();
                onPress();
              }
            : undefined
        }
        disabled={!onPress && !isToggle}
      >
        <View style={styles.itemLeft}>
          <View style={[styles.iconWrapper, { backgroundColor: iconBg }]}>
            <Ionicons name={icon} size={18} color={iconColor} />
          </View>
          <View style={styles.textGroup}>
            <Text
              style={[
                styles.itemTitle,
                {
                  color: isDestructive
                    ? "#EF4444"
                    : colors.textPrimary || "#FFFFFF",
                  fontFamily: fonts.headingSemi || "Sora_600SemiBold",
                },
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.itemSubtitle,
                  {
                    color: colors.textMuted || "#A1A1AA",
                    fontFamily: fonts.body || "Inter_400Regular",
                  },
                ]}
              >
                {subtitle}
              </Text>
            )}
          </View>
        </View>

        {isToggle ? (
          <Switch
            value={value}
            onValueChange={(val) => {
              triggerHaptic();
              onValueChange(val);
            }}
            trackColor={{ false: "#27272A", true: colors.accent || "#FF5722" }}
            thumbColor="#FFFFFF"
          />
        ) : (
          onPress && (
            <Ionicons
              name="chevron-forward"
              size={18}
              color={colors.textMuted || "#A1A1AA"}
            />
          )
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: colors.bg || "#09090B" }]}
      edges={["top"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Navigation Header */}
      <View
        style={[
          styles.header,
          { borderBottomColor: colors.border || "rgba(255,255,255,0.08)" },
        ]}
      >
        <Pressable
          style={[
            styles.backBtn,
            { backgroundColor: colors.surface || "#18181B" },
          ]}
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text
          style={[
            styles.headerTitle,
            {
              color: colors.textPrimary || "#FFFFFF",
              fontFamily: fonts.headingBold || "Sora_700Bold",
            },
          ]}
        >
          SETTINGS
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 40 },
        ]}
      >
        {/* Account Section */}
        <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.textMuted || "#A1A1AA",
                fontFamily: fonts.headingBold || "Sora_700Bold",
              },
            ]}
          >
            ACCOUNT
          </Text>
          {renderSettingItem({
            icon: "person-outline",
            iconBg: "rgba(99, 102, 241, 0.15)",
            iconColor: "#6366F1",
            title: "Edit Profile",
            subtitle: "Name, avatar and bio settings",
            onPress: () => router.push("/profile"),
          })}
          {renderSettingItem({
            icon: "key-outline",
            iconBg: "rgba(16, 185, 129, 0.15)",
            iconColor: "#10B981",
            title: "Security & Password",
            subtitle: "Manage login preferences",
            onPress: () => router.push("/security"),
          })}
        </Animated.View>

        {/* Preferences Section */}
        <Animated.View
          entering={FadeInDown.delay(100).duration(350)}
          style={styles.section}
        >
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.textMuted || "#A1A1AA",
                fontFamily: fonts.headingBold || "Sora_700Bold",
              },
            ]}
          >
            PREFERENCES
          </Text>
          {renderSettingItem({
            icon: isDark ? "moon" : "sunny",
            iconBg: "rgba(234, 179, 8, 0.15)",
            iconColor: "#EAB308",
            title: "Dark Mode",
            subtitle: isDark ? "Dark theme active" : "Light theme active",
            value: isDark,
            onValueChange: toggleTheme,
          })}
          {renderSettingItem({
            icon: "notifications-outline",
            iconBg: "rgba(255, 87, 34, 0.15)",
            iconColor: "#FF5722",
            title: "Push Notifications",
            subtitle: "Streak alerts and study reminders",
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
          })}
          {renderSettingItem({
            icon: "phone-portrait-outline",
            iconBg: "rgba(14, 165, 233, 0.15)",
            iconColor: "#0EA5E9",
            title: "Haptic Feedback",
            subtitle: "Vibrations on action taps",
            value: hapticsEnabled,
            onValueChange: setHapticsEnabled,
          })}
          {renderSettingItem({
            icon: "volume-medium-outline",
            iconBg: "rgba(168, 85, 247, 0.15)",
            iconColor: "#A855F7",
            title: "Sound Effects",
            subtitle: "Audio cues on completion",
            value: soundEnabled,
            onValueChange: setSoundEnabled,
          })}
        </Animated.View>

        {/* Support & Legal */}
        <Animated.View
          entering={FadeInDown.delay(200).duration(350)}
          style={styles.section}
        >
          <Text
            style={[
              styles.sectionHeader,
              {
                color: colors.textMuted || "#A1A1AA",
                fontFamily: fonts.headingBold || "Sora_700Bold",
              },
            ]}
          >
            SUPPORT & MORE
          </Text>
          {renderSettingItem({
            icon: "help-circle-outline",
            iconBg: "rgba(236, 72, 153, 0.15)",
            iconColor: "#EC4899",
            title: "Help & Support",
            subtitle: "FAQs and contact support",
            onPress: () => router.push("/help-support"),
          })}
          {renderSettingItem({
            icon: "document-text-outline",
            iconBg: "rgba(107, 114, 128, 0.15)",
            iconColor: "#9CA3AF",
            title: "Privacy Policy",
            subtitle: "Data privacy and terms",
            onPress: () => router.push("/privacy-policy"),
          })}
        </Animated.View>

        {/* Sign Out */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(350)}
          style={styles.section}
        >
          {renderSettingItem({
            icon: "log-out-outline",
            iconBg: "rgba(239, 68, 68, 0.15)",
            iconColor: "#EF4444",
            title: "Log Out",
            isDestructive: true,
            onPress: handleSignOut,
          })}
        </Animated.View>

        <Text
          style={[
            styles.versionText,
            {
              color: colors.textMuted || "#71717A",
              fontFamily: fonts.body || "Inter_400Regular",
            },
          ]}
        >
          Beyownd App v1.0.0
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 52,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 14, letterSpacing: 0.8 },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, gap: 24 },
  section: { gap: 10 },
  sectionHeader: {
    fontSize: 11,
    letterSpacing: 1,
    marginLeft: 4,
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  itemLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
  },
  textGroup: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 14 },
  itemSubtitle: { fontSize: 11, lineHeight: 15 },
  versionText: {
    textAlign: "center",
    fontSize: 12,
    marginTop: 12,
  },
});