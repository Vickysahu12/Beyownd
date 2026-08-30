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
import { useAuthStore } from "@/store/useAuthStore";

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  const logout = useAuthStore((state) => state.logout);

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
            logout();
            router.replace("/login");
          },
        },
      ]
    );
  };

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
            backgroundColor: colors.surface,
            borderColor: colors.border,
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
                  color: isDestructive ? colors.danger : colors.textPrimary,
                  fontFamily: fonts.headingSemi,
                },
              ]}
            >
              {title}
            </Text>
            {subtitle && (
              <Text
                style={[
                  styles.itemSubtitle,
                  { color: colors.textMuted, fontFamily: fonts.body },
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
            trackColor={{ false: colors.border, true: colors.accent }}
            thumbColor="#FFFFFF"
          />
        ) : (
          onPress && (
            <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
          )
        )}
      </Pressable>
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => {
            triggerHaptic();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          SETTINGS
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
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
            iconBg: colors.successSoft,
            iconColor: colors.success,
            title: "Security & Password",
            subtitle: "Manage login preferences",
            onPress: () => router.push("/security"),
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(350)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            PREFERENCES
          </Text>
          {renderSettingItem({
            icon: isDark ? "moon" : "sunny",
            iconBg: colors.accentSoft,
            iconColor: colors.accent,
            title: "Dark Mode",
            subtitle: isDark ? "Dark theme active" : "Light theme active",
            value: isDark,
            onValueChange: toggleTheme,
          })}
          {renderSettingItem({
            icon: "notifications-outline",
            iconBg: colors.accentSoft,
            iconColor: colors.accent,
            title: "Push Notifications",
            subtitle: "Streak alerts and study reminders",
            value: notificationsEnabled,
            onValueChange: setNotificationsEnabled,
          })}
          {renderSettingItem({
            icon: "phone-portrait-outline",
            iconBg: colors.infoSoft,
            iconColor: colors.info,
            title: "Haptic Feedback",
            subtitle: "Vibrations on action taps",
            value: hapticsEnabled,
            onValueChange: setHapticsEnabled,
          })}
          {renderSettingItem({
            icon: "volume-medium-outline",
            iconBg: colors.proSoft,
            iconColor: colors.pro,
            title: "Sound Effects",
            subtitle: "Audio cues on completion",
            value: soundEnabled,
            onValueChange: setSoundEnabled,
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(350)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
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
            iconBg: colors.divider,
            iconColor: colors.textMuted,
            title: "Privacy Policy",
            subtitle: "Data privacy and terms",
            onPress: () => router.push("/privacy-policy"),
          })}
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(300).duration(350)} style={styles.section}>
          {renderSettingItem({
            icon: "log-out-outline",
            iconBg: "rgba(239, 68, 68, 0.15)",
            iconColor: colors.danger,
            title: "Log Out",
            isDestructive: true,
            onPress: handleSignOut,
          })}
        </Animated.View>

        <Text style={[styles.versionText, { color: colors.textMuted, fontFamily: fonts.body }]}>
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
  sectionHeader: { fontSize: 11, letterSpacing: 1, marginLeft: 4, marginBottom: 2 },
  itemRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
  },
  itemLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  iconWrapper: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  textGroup: { flex: 1, gap: 2 },
  itemTitle: { fontSize: 14 },
  itemSubtitle: { fontSize: 11, lineHeight: 15 },
  versionText: { textAlign: "center", fontSize: 12, marginTop: 12 },
});