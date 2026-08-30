import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
  Switch,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";

export default function SecurityScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark } = useHomeTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPasswords, setShowPasswords] = useState(false);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricsEnabled, setBiometricsEnabled] = useState(true);

  const handleUpdatePassword = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert("Error", "Please fill in all password fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "New passwords do not match.");
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert("Error", "Password must be at least 6 characters long.");
      return;
    }

    Alert.alert("Success", "Your password has been updated successfully!", [
      {
        text: "OK",
        onPress: () => {
          setCurrentPassword("");
          setNewPassword("");
          setConfirmPassword("");
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={[styles.backBtn, { backgroundColor: colors.surface }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          SECURITY & PASSWORD
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <Animated.View entering={FadeInDown.duration(350)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            CHANGE PASSWORD
          </Text>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Current Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                secureTextEntry={!showPasswords}
                placeholder="Enter current password"
                placeholderTextColor={colors.textMuted}
                value={currentPassword}
                onChangeText={setCurrentPassword}
              />
              <Pressable onPress={() => setShowPasswords(!showPasswords)}>
                <Ionicons name={showPasswords ? "eye-off-outline" : "eye-outline"} size={20} color={colors.textMuted} />
              </Pressable>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>New Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                secureTextEntry={!showPasswords}
                placeholder="Enter new password"
                placeholderTextColor={colors.textMuted}
                value={newPassword}
                onChangeText={setNewPassword}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={[styles.label, { color: colors.textPrimary }]}>Confirm New Password</Text>
            <View style={[styles.inputWrapper, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <TextInput
                style={[styles.input, { color: colors.textPrimary }]}
                secureTextEntry={!showPasswords}
                placeholder="Confirm new password"
                placeholderTextColor={colors.textMuted}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
              />
            </View>
          </View>

          <Pressable
            style={({ pressed }) => [
              styles.saveBtn,
              { backgroundColor: colors.accent, opacity: pressed ? 0.8 : 1 },
            ]}
            onPress={handleUpdatePassword}
          >
            <Text style={styles.saveBtnText}>Update Password</Text>
          </Pressable>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(100).duration(350)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            TWO-FACTOR AUTHENTICATION
          </Text>

          <View style={[styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="shield-checkmark-outline" size={20} color={colors.success} />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>2-Factor Authentication</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>
                  Secure login with SMS or authenticator
                </Text>
              </View>
            </View>
            <Switch
              value={twoFactorEnabled}
              onValueChange={(val) => {
                Haptics.selectionAsync();
                setTwoFactorEnabled(val);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={[styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="finger-print-outline" size={20} color={colors.info} />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Biometric Unlock</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>Use Face ID or Fingerprint</Text>
              </View>
            </View>
            <Switch
              value={biometricsEnabled}
              onValueChange={(val) => {
                Haptics.selectionAsync();
                setBiometricsEnabled(val);
              }}
              trackColor={{ false: colors.border, true: colors.accent }}
              thumbColor="#FFFFFF"
            />
          </View>
        </Animated.View>

        <Animated.View entering={FadeInDown.delay(200).duration(350)} style={styles.section}>
          <Text style={[styles.sectionHeader, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            ACTIVE SESSIONS
          </Text>

          <View style={[styles.rowCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <View style={styles.rowLeft}>
              <Ionicons name="phone-portrait-outline" size={20} color="#6366F1" />
              <View style={styles.rowText}>
                <Text style={[styles.rowTitle, { color: colors.textPrimary }]}>Current Device (This Phone)</Text>
                <Text style={[styles.rowSubtitle, { color: colors.textMuted }]}>Active now • India</Text>
              </View>
            </View>
          </View>
        </Animated.View>
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
  headerTitle: { fontSize: 13, letterSpacing: 0.8 },
  backBtn: { width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  scrollContent: { paddingHorizontal: 20, paddingTop: 20, gap: 24 },
  section: { gap: 12 },
  sectionHeader: { fontSize: 11, letterSpacing: 1, marginLeft: 4 },
  inputGroup: { gap: 6 },
  label: { fontSize: 12, fontWeight: "600" },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 14,
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
  },
  input: { flex: 1, fontSize: 14 },
  saveBtn: { height: 48, borderRadius: 12, alignItems: "center", justifyContent: "center", marginTop: 8 },
  saveBtnText: { color: "#FFFFFF", fontWeight: "700", fontSize: 14 },
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 14,
    borderRadius: 14,
    borderWidth: 1,
  },
  rowLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  rowText: { flex: 1, gap: 2 },
  rowTitle: { fontSize: 13, fontWeight: "600" },
  rowSubtitle: { fontSize: 11 },
});