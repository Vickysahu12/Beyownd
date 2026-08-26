import React, { useState, useEffect, useCallback } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, StatusBar, RefreshControl } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown, FadeInUp, Layout } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";
import ScreenStateWrapper from "@/components/common/ScreenStateWrapper";
import NotifCardSkeleton from "../components/notifications/NotifCardSkeleton";
import { apiClient } from "@/api/client";
import { mapNotification } from "@/utils/NotificationHelper";

const TABS = ["All", "Unread", "Reminders"];

export default function NotificationScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark } = useHomeTheme();

  const [activeTab, setActiveTab] = useState("All");
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await apiClient.get("/notifications");
      setNotifications(data.data.map(mapNotification));
    } catch (err) {
      console.error("Notifications fetch failed:", err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchNotifications();
    setRefreshing(false);
  };

  const handleMarkAllRead = async () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      await apiClient.patch("/notifications/read-all");
    } catch (err) {
      console.error("Mark all read failed:", err.response?.data || err.message);
    }
  };

  const handleCardPress = async (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      await apiClient.patch(`/notifications/${id}/read`);
    } catch (err) {
      console.error("Mark read failed:", err.response?.data || err.message);
    }
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
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { borderBottomColor: colors.border || colors.divider }]}>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.card, borderColor: colors.border }]}
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
            <Text style={[styles.markReadText, { color: colors.accent, fontFamily: fonts.headingSemi }]}>
              Mark all read
            </Text>
          </Pressable>
        ) : (
          <View style={{ width: 40 }} />
        )}
      </View>

      <Animated.View entering={FadeInDown.duration(350)} style={styles.tabsWrapper}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <Pressable
              key={tab}
              style={[
                styles.tabPill,
                {
                  backgroundColor: isActive ? colors.accent : colors.card,
                  borderColor: isActive ? "transparent" : colors.border,
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

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={colors.accent}
            colors={[colors.accent]}
          />
        }
      >
        <ScreenStateWrapper
          loading={loading}
          error={error}
          isEmpty={!loading && !error && filteredNotifications.length === 0}
          onRetry={fetchNotifications}
          skeletonCount={4}
          renderSkeleton={() => <NotifCardSkeleton />}
          emptyTitle="All Caught Up! 🎉"
          emptySubtitle={`You don't have any ${activeTab.toLowerCase()} notifications right now.`}
          emptyIcon="notifications-off-outline"
        >
          {filteredNotifications.map((item, idx) => (
            <Animated.View key={item.id} entering={FadeInUp.delay(80 * idx).duration(350)} layout={Layout.springify()}>
              <Pressable
                style={[
                  styles.notifCard,
                  {
                    backgroundColor: item.read ? colors.card : colors.accentSoft || colors.card,
                    borderColor: !item.read ? colors.accent + "40" : colors.border,
                  },
                ]}
                onPress={() => handleCardPress(item.id)}
              >
                {!item.read && <View style={[styles.unreadDot, { backgroundColor: colors.accent }]} />}
                <View style={styles.notifCardInner}>
                  <View style={[styles.iconContainer, { backgroundColor: (item.color || colors.accent) + "18" }]}>
                    <Ionicons name={item.icon || "notifications-outline"} size={20} color={item.color || colors.accent} />
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

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
  },
  headerTitle: { fontSize: 14, letterSpacing: 0.8 },
  iconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
  },
  markReadTextBtn: { paddingVertical: 4 },
  markReadText: { fontSize: 12 },
  tabsWrapper: { flexDirection: "row", gap: 8, paddingHorizontal: 20, paddingVertical: 14 },
  tabPill: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, borderWidth: 1 },
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
});