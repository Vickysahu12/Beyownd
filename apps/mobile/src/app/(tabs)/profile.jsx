import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
  Switch,
  Modal,
  TextInput,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  FadeInDown,
  FadeInUp,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const INITIAL_USER_DATA = {
  name: "Alex Rivera",
  username: "@alex_builds",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=500&q=80",
  level: "Lvl 12 • Code Alchemist",
  xp: 3450,
  nextLevelXp: 5000,
  streakDays: 14,
  stats: {
    tasksCompleted: 42,
    notesRead: 128,
    studyHours: "38.5 hrs",
    accuracy: "94%",
  },
  achievements: [
    { id: "1", title: "7-Day Streak", icon: "flame", color: "#FF5722", unlocked: true, desc: "Learned 7 days in a row without missing a single day." },
    { id: "2", title: "Code Ninja", icon: "code-slash", color: "#6366F1", unlocked: true, desc: "Completed 20 complex JavaScript challenges." },
    { id: "3", title: "Night Owl", icon: "moon", color: "#EC4899", unlocked: true, desc: "Completed study sessions past 12 AM midnight." },
    { id: "4", title: "Speed Demon", icon: "thunderstorm", color: "#EAB308", unlocked: false, desc: "Finish 5 tasks in under 1 hour." },
  ],
  weeklyActivity: [
    { day: "M", hours: 2.5, active: true },
    { day: "T", hours: 4.0, active: true },
    { day: "W", hours: 1.5, active: true },
    { day: "T", hours: 3.2, active: true },
    { day: "F", hours: 5.0, active: true },
    { day: "S", hours: 0.8, active: true },
    { day: "S", hours: 0.0, active: false },
  ],
};

export default function ProfileScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  // Dynamic User State
  const [userData, setUserData] = useState(INITIAL_USER_DATA);

  // Edit Profile States
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editName, setEditName] = useState(userData.name);
  const [editUsername, setEditUsername] = useState(userData.username);
  const [editAvatar, setEditAvatar] = useState(userData.avatar);

  const [selectedDay, setSelectedDay] = useState(userData.weeklyActivity[4]); // Friday active
  const [activeBadgeModal, setActiveBadgeModal] = useState(null);

  // Animations Shared Values
  const flameScale = useSharedValue(1);
  const editBtnScale = useSharedValue(1);

  const flameAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: flameScale.value }],
  }));

  const editBtnStyle = useAnimatedStyle(() => ({
    transform: [{ scale: editBtnScale.value }],
  }));

  const xpProgressPercent = Math.round((userData.xp / userData.nextLevelXp) * 100);

  // Handlers
  const handleFlamePress = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    flameScale.value = withSequence(
      withSpring(1.35, { damping: 4 }),
      withSpring(1)
    );
  };

  const handleBarTap = (item) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedDay(item);
  };

  const handleBadgePress = (badge) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setActiveBadgeModal(badge);
  };

  // Open Edit Profile Modal
  const handleOpenEditModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setEditName(userData.name);
    setEditUsername(userData.username);
    setEditAvatar(userData.avatar);
    setIsEditModalOpen(true);
  };

  // Save Edit Profile Changes
  const handleSaveProfile = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    setUserData((prev) => ({
      ...prev,
      name: editName.trim() || prev.name,
      username: editUsername.trim() || prev.username,
      avatar: editAvatar.trim() || prev.avatar,
    }));
    setIsEditModalOpen(false);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Top Header */}
      <View style={[styles.header, { borderBottomColor: colors.border || "rgba(255,255,255,0.08)" }]}>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          MY PROFILE
        </Text>
        <Pressable
          style={[styles.iconBtn, { backgroundColor: colors.surface || "#18181B" }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.push("/settings"); // ← NAVIGATE TO SETTINGS
          }}
        >
          <Ionicons name="settings-outline" size={20} color={colors.textPrimary} />
        </Pressable>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}
      >
        {/* Interactive Avatar & Flame Streak */}
        <Animated.View entering={FadeInDown.duration(400)} style={styles.userCard}>
          <View style={styles.avatarWrapper}>
            <Image source={{ uri: userData.avatar }} style={styles.avatarImage} />
            <AnimatedPressable
              style={[styles.streakBadgeOnAvatar, { backgroundColor: "#FF5722" }, flameAnimatedStyle]}
              onPress={handleFlamePress}
            >
              <Ionicons name="flame" size={12} color="#FFF" />
              <Text style={styles.streakAvatarText}>{userData.streakDays}</Text>
            </AnimatedPressable>
          </View>

          <View style={styles.userInfo}>
            <Text style={[styles.userName, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              {userData.name}
            </Text>
            <Text style={[styles.userHandle, { color: colors.textMuted, fontFamily: fonts.body }]}>
              {userData.username}
            </Text>

            <View style={[styles.levelTag, { backgroundColor: (colors.accent || "#FF5722") + "18" }]}>
              <Ionicons name="sparkles" size={12} color={colors.accent || "#FF5722"} />
              <Text style={[styles.levelTagText, { color: colors.accent || "#FF5722", fontFamily: fonts.headingSemi }]}>
                {userData.level}
              </Text>
            </View>
          </View>

          {/* EDIT PROFILE BUTTON */}
          <AnimatedPressable
            style={[styles.editBtn, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.1)" }, editBtnStyle]}
            onPress={handleOpenEditModal}
            onPressIn={() => (editBtnScale.value = withSpring(0.9))}
            onPressOut={() => (editBtnScale.value = withSpring(1))}
          >
            <Ionicons name="pencil" size={16} color={colors.textPrimary} />
          </AnimatedPressable>
        </Animated.View>

        {/* XP Progress Card */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)} style={[styles.xpCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
          <View style={styles.xpHeader}>
            <Text style={[styles.xpLabel, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
              LEVEL PROGRESS
            </Text>
            <Text style={[styles.xpValue, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              {userData.xp} <Text style={{ fontSize: 12, color: colors.textMuted }}>/ {userData.nextLevelXp} XP</Text>
            </Text>
          </View>

          <View style={styles.xpBarTrack}>
            <View style={[styles.xpBarFill, { width: `${xpProgressPercent}%`, backgroundColor: colors.accent || "#FF5722" }]} />
          </View>
        </Animated.View>

        {/* Interactive Quick Stats Grid */}
        <Animated.View entering={FadeInDown.delay(150).duration(400)} style={styles.statsGrid}>
          {[
            { icon: "checkbox-outline", val: userData.stats.tasksCompleted, label: "Tasks Done", color: "#6366F1" },
            { icon: "book-outline", val: userData.stats.notesRead, label: "Notes Read", color: "#EC4899" },
            { icon: "time-outline", val: userData.stats.studyHours, label: "Study Time", color: "#10B981" },
            { icon: "trophy-outline", val: userData.stats.accuracy, label: "Accuracy", color: "#EAB308" },
          ].map((stat, i) => (
            <Pressable
              key={i}
              style={[styles.statBox, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}
              onPress={() => Haptics.selectionAsync()}
            >
              <Ionicons name={stat.icon} size={20} color={stat.color} />
              <Text style={[styles.statValue, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                {stat.val}
              </Text>
              <Text style={[styles.statLabel, { color: colors.textMuted, fontFamily: fonts.body }]}>{stat.label}</Text>
            </Pressable>
          ))}
        </Animated.View>

        {/* Interactive Weekly Activity Chart */}
        <Animated.View entering={FadeInUp.delay(200).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
          <View style={styles.sectionHeaderRow}>
            <View>
              <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                WEEKLY ACTIVITY ⚡
              </Text>
              <Text style={[styles.sectionSub, { color: colors.accent || "#FF5722", fontFamily: fonts.bodyMedium }]}>
                {selectedDay ? `${selectedDay.hours} hrs on ${selectedDay.day}` : "Tap bar to inspect"}
              </Text>
            </View>
          </View>

          <View style={styles.barsContainer}>
            {userData.weeklyActivity.map((item, idx) => {
              const isSelected = selectedDay?.day === item.day;
              const maxHours = 5;
              const heightPercent = Math.min((item.hours / maxHours) * 100, 100);

              return (
                <Pressable key={idx} style={styles.barColumn} onPress={() => handleBarTap(item)}>
                  <View style={[styles.barTrack, isSelected && styles.selectedBarTrack]}>
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${heightPercent}%`,
                          backgroundColor: isSelected
                            ? colors.accent || "#FF5722"
                            : item.active
                            ? "rgba(255,87,34,0.4)"
                            : "rgba(255,255,255,0.08)",
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayText, { color: isSelected ? colors.textPrimary : colors.textMuted, fontFamily: isSelected ? fonts.headingBold : fonts.bodyMedium }]}>
                    {item.day}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </Animated.View>

        {/* Gamified Achievements Section with Popups */}
        <Animated.View entering={FadeInUp.delay(250).duration(400)} style={styles.achievementsWrapper}>
          <Text style={[styles.sectionTitleHeader, { color: colors.textMuted, fontFamily: fonts.headingSemi }]}>
            BADGES & UNLOCKS ({userData.achievements.filter((a) => a.unlocked).length}/{userData.achievements.length})
          </Text>

          <View style={styles.badgesGrid}>
            {userData.achievements.map((item) => (
              <Pressable
                key={item.id}
                style={[
                  styles.badgeCard,
                  {
                    backgroundColor: colors.surface || "#18181B",
                    borderColor: item.unlocked ? item.color + "60" : "rgba(255,255,255,0.05)",
                    opacity: item.unlocked ? 1 : 0.4,
                  },
                ]}
                onPress={() => handleBadgePress(item)}
              >
                <View style={[styles.badgeIconCircle, { backgroundColor: item.color + "20" }]}>
                  <Ionicons name={item.icon} size={22} color={item.color} />
                </View>
                <Text style={[styles.badgeTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={[styles.badgeDesc, { color: colors.textMuted, fontFamily: fonts.body }]} numberOfLines={1}>
                  {item.unlocked ? "Unlocked" : "Locked"}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* Preferences */}
        <Animated.View entering={FadeInUp.delay(300).duration(400)} style={[styles.sectionCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
          <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi, marginBottom: 12 }]}>
            PREFERENCES
          </Text>

          <View style={styles.settingRow}>
            <View style={styles.settingLeft}>
              <Ionicons name="moon-outline" size={20} color={colors.textPrimary} />
              <Text style={[styles.settingText, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>
                Dark Mode
              </Text>
            </View>
            <Switch
              value={isDark}
              onValueChange={() => {
                Haptics.selectionAsync();
                toggleTheme();
              }}
              trackColor={{ false: "#3F3F46", true: colors.accent || "#FF5722" }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Animated.View>
      </ScrollView>

      {/* EDIT PROFILE MODAL */}
      <Modal visible={isEditModalOpen} transparent animationType="slide">
        <Pressable style={styles.modalOverlay} onPress={() => setIsEditModalOpen(false)}>
          <Pressable style={[styles.editModalContent, { backgroundColor: colors.surface || "#18181B" }]}>
            <View style={styles.editModalHeader}>
              <Text style={[styles.editModalTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                EDIT PROFILE
              </Text>
              <Pressable onPress={() => setIsEditModalOpen(false)}>
                <Ionicons name="close-circle-outline" size={24} color={colors.textMuted} />
              </Pressable>
            </View>

            {/* Input Name */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
                Full Name
              </Text>
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border || "rgba(255,255,255,0.15)" }]}
                value={editName}
                onChangeText={setEditName}
                placeholder="Enter full name"
                placeholderTextColor="#71717A"
              />
            </View>

            {/* Input Handle */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
                Username / Handle
              </Text>
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border || "rgba(255,255,255,0.15)" }]}
                value={editUsername}
                onChangeText={setEditUsername}
                placeholder="@username"
                placeholderTextColor="#71717A"
              />
            </View>

            {/* Input Avatar URL */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
                Avatar Image URL
              </Text>
              <TextInput
                style={[styles.textInput, { color: colors.textPrimary, borderColor: colors.border || "rgba(255,255,255,0.15)" }]}
                value={editAvatar}
                onChangeText={setEditAvatar}
                placeholder="https://..."
                placeholderTextColor="#71717A"
              />
            </View>

            {/* Save Action Button */}
            <Pressable
              style={[styles.saveBtn, { backgroundColor: colors.accent || "#FF5722" }]}
              onPress={handleSaveProfile}
            >
              <Text style={[styles.saveBtnText, { fontFamily: fonts.headingBold }]}>
                Save Changes
              </Text>
            </Pressable>
          </Pressable>
        </Pressable>
      </Modal>

      {/* Badge Details Modal Popup */}
      {activeBadgeModal && (
        <Modal transparent animationType="fade" visible={!!activeBadgeModal}>
          <Pressable style={styles.modalOverlay} onPress={() => setActiveBadgeModal(null)}>
            <View style={[styles.modalContent, { backgroundColor: colors.surface || "#18181B" }]}>
              <View style={[styles.modalBadgeCircle, { backgroundColor: activeBadgeModal.color + "20" }]}>
                <Ionicons name={activeBadgeModal.icon} size={40} color={activeBadgeModal.color} />
              </View>

              <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                {activeBadgeModal.title}
              </Text>
              <Text style={[styles.modalDesc, { color: colors.textMuted, fontFamily: fonts.body }]}>
                {activeBadgeModal.desc}
              </Text>

              <View style={[styles.statusPill, { backgroundColor: activeBadgeModal.unlocked ? "#22C55E20" : "rgba(255,255,255,0.08)" }]}>
                <Ionicons
                  name={activeBadgeModal.unlocked ? "checkmark-circle" : "lock-closed"}
                  size={14}
                  color={activeBadgeModal.unlocked ? "#22C55E" : colors.textMuted}
                />
                <Text style={{ color: activeBadgeModal.unlocked ? "#22C55E" : colors.textMuted, fontSize: 12, fontFamily: fonts.headingSemi }}>
                  {activeBadgeModal.unlocked ? "UNLOCKED" : "LOCKED"}
                </Text>
              </View>
            </View>
          </Pressable>
        </Modal>
      )}
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
  headerTitle: { fontSize: 15, letterSpacing: 0.8 },
  iconBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },

  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  userCard: { flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 14 },
  avatarWrapper: { position: "relative" },
  avatarImage: { width: 66, height: 66, borderRadius: 33 },
  streakBadgeOnAvatar: {
    position: "absolute",
    bottom: -2,
    right: -2,
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#09090B",
  },
  streakAvatarText: { color: "#FFF", fontSize: 10, fontWeight: "800" },
  userInfo: { flex: 1 },
  userName: { fontSize: 19, letterSpacing: -0.3 },
  userHandle: { fontSize: 13, marginBottom: 6 },
  levelTag: { flexDirection: "row", alignItems: "center", gap: 4, alignSelf: "flex-start", paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  levelTagText: { fontSize: 11 },
  editBtn: { width: 36, height: 36, borderRadius: 12, borderWidth: 1, alignItems: "center", justifyContent: "center" },

  xpCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 16 },
  xpHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  xpLabel: { fontSize: 12, letterSpacing: 0.5 },
  xpValue: { fontSize: 14 },
  xpBarTrack: { height: 8, backgroundColor: "rgba(255,255,255,0.08)", borderRadius: 4, overflow: "hidden" },
  xpBarFill: { height: "100%", borderRadius: 4 },

  statsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10, marginBottom: 20 },
  statBox: { width: "48%", padding: 14, borderRadius: 16, borderWidth: 1, gap: 6 },
  statValue: { fontSize: 18, marginTop: 4 },
  statLabel: { fontSize: 12 },

  sectionCard: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 20 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 },
  sectionTitle: { fontSize: 13, letterSpacing: 0.5 },
  sectionSub: { fontSize: 12, marginTop: 2 },

  barsContainer: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", height: 100, paddingTop: 10 },
  barColumn: { alignItems: "center", gap: 8, flex: 1 },
  barTrack: { width: 12, height: 75, backgroundColor: "rgba(255,255,255,0.05)", borderRadius: 6, justifyContent: "flex-end", overflow: "hidden" },
  selectedBarTrack: { width: 14, borderWidth: 1, borderColor: "rgba(255,87,34,0.6)" },
  barFill: { width: "100%", borderRadius: 6 },
  barDayText: { fontSize: 11 },

  achievementsWrapper: { marginBottom: 20 },
  sectionTitleHeader: { fontSize: 12, letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12, paddingLeft: 4 },
  badgesGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  badgeCard: { width: "48%", padding: 12, borderRadius: 16, borderWidth: 1, gap: 6 },
  badgeIconCircle: { width: 38, height: 38, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  badgeTitle: { fontSize: 13 },
  badgeDesc: { fontSize: 11 },

  settingRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 4 },
  settingLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  settingText: { fontSize: 14 },

  /* Modals */
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.75)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalContent: { width: "100%", padding: 24, borderRadius: 24, alignItems: "center", gap: 12 },
  modalBadgeCircle: { width: 72, height: 72, borderRadius: 36, alignItems: "center", justifyContent: "center", marginBottom: 4 },
  modalTitle: { fontSize: 18 },
  modalDesc: { fontSize: 13, textAlign: "center", lineHeight: 18 },
  statusPill: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginTop: 4 },

  /* Edit Profile Modal */
  editModalContent: { width: "100%", padding: 20, borderRadius: 24, gap: 16 },
  editModalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 4 },
  editModalTitle: { fontSize: 16, letterSpacing: 0.5 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12 },
  textInput: { height: 44, borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, fontSize: 14 },
  saveBtn: { height: 48, borderRadius: 14, alignItems: "center", justifyContent: "center", marginTop: 8 },
  saveBtnText: { color: "#FFFFFF", fontSize: 14 },
});