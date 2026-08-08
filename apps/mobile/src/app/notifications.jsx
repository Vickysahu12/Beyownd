import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp, Layout } from "react-native-reanimated";

import { HomeThemeProvider, useHomeTheme } from "@/context/ThemeContext";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";
import NotifCardSkeleton from "../components/notifications/NotifCardSkeleton";
const INITIAL_NOTIFICATIONS = [
  {
    id: "n1", type: "streak", title: "Don't lose your 14-day streak! 🔥",
    message: "Complete 1 quick concept in Web Dev before midnight to keep your fire alive.",
    time: "10 mins ago", read: false, icon: "flame", color: "#FF5722", actionText: "Study Now",
  },
  {
    id: "n2", type: "achievement", title: "New Badge Unlocked: Code Ninja ⚡",
    message: "Congrats! You solved 20 JavaScript tasks this week.",
    time: "2 hours ago", read: false, icon: "trophy", color: "#EAB308",
  },
  {
    id: "n3", type: "reminder", title: "CSS Grid vs Flexbox Quiz is live",
    message: "Test your skills in the quick 3-minute interactive challenge.",
    time: "Yesterday", read: true, icon: "sparkles", color: "#6366F1", actionText: "Take Quiz",
  },
  {
    id: "n4", type: "system", title: "System Update: Dark Mode Improved",
    message: "We've upgraded contrast ratios and added new spring physics across all screens.",
    time: "2 days ago", read: true, icon: "shield-checkmark", color: "#10B981",
  },
];

const TABS = ["All", "Unread", "Reminders"];

function NotificationContent() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark } = useHomeTheme();

  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);

  // --- state pattern, Home jaisa ---
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchNotifications = () => {
    setLoading(true);
    setError(false);
    setTimeout(() => {
      setLoading(false);
    }, 1500);
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleMarkAllRead = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleCardPress = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleTabChange = (tab) => {
    Haptics.selectionAsync();
    setActiveTab(tab);
  };

  const filteredNotifications = notifications.filter((item) => {
    if (activeTab === "Unread") return !item.read;
    if (activeTab === "Reminders") return item.type === "streak" || item.type === "reminder";
    return true;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header — hamesha visible */}
      <View style={[styles.header, { borderBottomColor: colors.border || "rgba(255,255,255,0.08)" }]}>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.surface || "#18181B" }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>

        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          NOTIFICATIONS
        </Text>

        {unreadCount > 0 ? (
          <Pressable onPress={handleMarkAllRead} style={styles.markReadTextBtn}>
            <Text style={[styles.markReadText, { color: colors.accent || "#FF5722", fontFamily: fonts.headingSemi }]}>
              Mark all read
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      {/* Tabs — hamesha visible */}
      <Animated.View entering={FadeInDown.duration(350)} style={styles.tabsWrapper}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isActive ? colors.accent || "#FF5722" : colors.surface || "#18181B",
                  borderColor: isActive ? "transparent" : colors.border || "rgba(255,255,255,0.08)",
                },
              ]}
              onPress={() => handleTabChange(tab)}
            >
              <Text
                style={[
                  styles.tabText,
                  {
                    color: isActive ? "#FFFFFF" : colors.textMuted,
                    fontFamily: isActive ? fonts.headingBold : fonts.bodyMedium,
                  },
                ]}
              >
                {tab} {tab === "Unread" && unreadCount > 0 ? `(${unreadCount})` : ""}
              </Text>
            </Pressable>
          );
        })}
      </Animated.View>

      {/* Content — loading/error/empty/data switch yahan hota hai */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <ScreenStateWrapper
          loading={loading}
          error={error}
          isEmpty={filteredNotifications.length === 0}
          onRetry={fetchNotifications}
          skeletonCount={4}
          renderSkeleton={() => <NotifCardSkeleton />}
          emptyTitle="All Caught Up! 🎉"
          emptySubtitle={`You don't have any ${activeTab.toLowerCase()} notifications right now.`}
          emptyIcon="notifications-off-outline"
        >
          {filteredNotifications.map((item, idx) => (
            <Animated.View
              key={item.id}
              entering={FadeInUp.delay(80 * idx).duration(350)}
              layout={Layout.springify()}
            >
              <Pressable
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: item.read ? colors.surface || "#18181B" : (colors.accent || "#FF5722") + "08",
                    borderColor: !item.read ? (colors.accent || "#FF5722") + "40" : colors.border || "rgba(255,255,255,0.06)",
                  },
                ]}
                onPress={() => handleCardPress(item.id)}
              >
                {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.accent || "#FF5722" }]} />}
                <View style={styles.notifCardInner}>
                  <View style={[styles.iconContainer, { backgroundColor: item.color + "18" }]}>
                    <Ionicons name={item.icon} size={20} color={item.color} />
                  </View>
                  <View style={styles.contentGroup}>
                    <View style={styles.cardHeaderRow}>
                      <Text
                        style={[
                          styles.notifTitle,
                          { color: colors.textPrimary, fontFamily: item.read ? fonts.headingSemi : fonts.headingBold },
                        ]}
                      >
                        {item.title}
                      </Text>
                      <Text style={[styles.timeText, { color: colors.textMuted, fontFamily: fonts.body }]}>
                        {item.time}
                      </Text>
                    </View>
                    <Text style={[styles.notifMessage, { color: colors.textMuted, fontFamily: fonts.body }]}>
                      {item.message}
                    </Text>
                    {item.actionText && (
                      <Pressable
                        style={[styles.inlineActionBtn, { backgroundColor: item.color }]}
                        onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium)}
                      >
                        <Text style={[styles.inlineActionText, { fontFamily: fonts.headingBold }]}>
                          {item.actionText}
                        </Text>
                        <Ionicons name="arrow-forward" size={12} color="#FFF" />
                      </Pressable>
                    )}
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </ScreenStateWrapper>
      </ScrollView>
    </SafeAreaView>
  );
}

export default function NotificationScreen() {
  return (
    <HomeThemeProvider>
      <NotificationContent />
    </HomeThemeProvider>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { height: 52, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 14, letterSpacing: 0.8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  markReadTextBtn: { paddingVertical: 4 },
  markReadText: { fontSize: 12 },
  tabsWrapper: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  tabPill: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, borderWidth: 1 },
  tabText: { fontSize: 12 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 6, gap: 12 },
  notifCard: { padding: 16, borderRadius: 18, borderWidth: 1, position: "relative" },
  unreadDot: { position: "absolute", top: 16, right: 16, width: 8, height: 8, borderRadius: 4 },
  notifCardInner: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  iconContainer: { width: 42, height: 42, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  contentGroup: { flex: 1, gap: 4 },
  cardHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", paddingRight: 12 },
  notifTitle: { fontSize: 14, flex: 1, lineHeight: 19 },
  timeText: { fontSize: 11, marginLeft: 8 },
  notifMessage: { fontSize: 13, lineHeight: 18, marginTop: 2 },
  inlineActionBtn: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginTop: 8 },
  inlineActionText: { color: "#FFFFFF", fontSize: 11 },
});