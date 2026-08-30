import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Linking, StatusBar } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";

const POLICY_SECTIONS = [
  {
    title: "1. Information We Collect",
    content:
      "We collect personal information that you provide directly to us, such as your name, email address, username, and profile picture. We also collect usage data automatically when you interact with the app.",
  },
  {
    title: "2. How We Use Your Information",
    content:
      "Your data is used to personalize your learning experience, track your study progress, generate XP streaks, manage your account, and improve our services.",
  },
  {
    title: "3. Data Security & Storage",
    content:
      "We implement end-to-end industry-standard encryption protocols (SSL/TLS) to safeguard your personal data. We do not sell or rent your personal data to third parties.",
  },
  {
    title: "4. Cookies & Analytics",
    content:
      "We use third-party analytics tools (like Google Analytics & Firebase) to analyze user engagement and crash reports to improve app performance.",
  },
  {
    title: "5. Your Rights & Account Deletion",
    content:
      "You have the right to request access to your stored personal data or request permanent deletion of your account at any time from the app settings.",
  },
];

export default function PrivacyPolicyScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark } = useHomeTheme();

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          PRIVACY POLICY
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        <Animated.View
          entering={FadeInDown.duration(400)}
          style={[styles.metaCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
        >
          <Ionicons name="shield-checkmark" size={20} color={colors.accent} />
          <View>
            <Text style={[styles.metaTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
              Privacy & Security Guaranteed
            </Text>
            <Text style={[styles.metaDate, { color: colors.textMuted, fontFamily: fonts.body }]}>
              Last updated: August 2026 • Version 1.4
            </Text>
          </View>
        </Animated.View>

        {POLICY_SECTIONS.map((sec, i) => (
          <Animated.View
            key={i}
            entering={FadeInDown.delay(100 * (i + 1)).duration(400)}
            style={[styles.sectionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}
          >
            <Text style={[styles.secTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              {sec.title}
            </Text>
            <Text style={[styles.secContent, { color: colors.textMuted, fontFamily: fonts.body }]}>
              {sec.content}
            </Text>
          </Animated.View>
        ))}

        <Animated.View entering={FadeInDown.delay(600).duration(400)} style={styles.footerBox}>
          <Text style={[styles.footerText, { color: colors.textMuted, fontFamily: fonts.body }]}>
            Have any questions or concerns regarding your privacy?
          </Text>
          <Pressable
            style={[styles.legalBtn, { borderColor: colors.accent }]}
            onPress={() => {
              Haptics.selectionAsync();
              Linking.openURL("mailto:privacy@yourcompany.com");
            }}
          >
            <Ionicons name="mail-outline" size={16} color={colors.accent} />
            <Text style={[styles.legalBtnText, { color: colors.accent, fontFamily: fonts.headingSemi }]}>
              Contact Data Protection Officer
            </Text>
          </Pressable>
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
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backBtn: { width: 36, height: 36, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontSize: 15, letterSpacing: 0.8 },
  scrollContent: { paddingHorizontal: 20, paddingTop: 16 },

  metaCard: {
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 16,
  },
  metaTitle: { fontSize: 13 },
  metaDate: { fontSize: 11, marginTop: 2 },

  sectionCard: { padding: 16, borderRadius: 18, borderWidth: 1, marginBottom: 12, gap: 8 },
  secTitle: { fontSize: 14 },
  secContent: { fontSize: 13, lineHeight: 20 },

  footerBox: { alignItems: "center", marginTop: 20, gap: 12 },
  footerText: { fontSize: 12, textAlign: "center" },
  legalBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  legalBtnText: { fontSize: 12 },
});