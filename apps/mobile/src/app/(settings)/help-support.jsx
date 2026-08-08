import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Linking,
  StatusBar,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useHomeTheme } from "@/context/ThemeContext";

if (Platform.OS === "android" && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQ_DATA = [
  {
    id: "1",
    question: "How do I reset my password?",
    answer: "Go to the Settings page, tap on 'Security', and click 'Change Password'. If you forgot your password, logout and tap 'Forgot Password' on the Login screen.",
  },
  {
    id: "2",
    question: "How does the XP and Streak system work?",
    answer: "You earn XP by completing tasks and reading notes daily. Keeping a daily streak unlocks special badges and level-up milestones.",
  },
  {
    id: "3",
    question: "Can I download notes for offline study?",
    answer: "Yes, tap the download icon on any note to save it locally inside the app storage for offline access.",
  },
  {
    id: "4",
    question: "How do I request a refund for Pro subscription?",
    answer: "Send an email to support@app.com with your Order ID within 7 days of purchase to claim a full refund.",
  },
];

export default function HelpSupportScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { colors, fonts, isDark } = useHomeTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [expandedFaq, setExpandedFaq] = useState(null);

  const toggleFaq = (id) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  const filteredFaqs = FAQ_DATA.filter(
    (item) =>
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openEmailSupport = () => {
    Haptics.selectionAsync();
    Linking.openURL("mailto:support@yourcompany.com?subject=Support%20Request");
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={["top"]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border || "rgba(255,255,255,0.08)" }]}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          HELP & SUPPORT
        </Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 40 }]}
      >
        {/* Search Bar */}
        <Animated.View entering={FadeInDown.duration(400)} style={[styles.searchBox, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.1)" }]}>
          <Ionicons name="search-outline" size={18} color={colors.textMuted} />
          <TextInput
            style={[styles.searchInput, { color: colors.textPrimary, fontFamily: fonts.body }]}
            placeholder="Search help articles..."
            placeholderTextColor="#71717A"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery !== "" && (
            <Pressable onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color={colors.textMuted} />
            </Pressable>
          )}
        </Animated.View>

        {/* Support Categories */}
        <Animated.View entering={FadeInDown.delay(100).duration(400)}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted, fontFamily: fonts.headingSemi }]}>
            CATEGORIES
          </Text>
          <View style={styles.categoryGrid}>
            {[
              { icon: "person-outline", title: "Account", color: "#6366F1" },
              { icon: "card-outline", title: "Billing", color: "#10B981" },
              { icon: "book-outline", title: "Courses", color: "#EC4899" },
              { icon: "bug-outline", title: "Bugs", color: "#EAB308" },
            ].map((cat, i) => (
              <Pressable
                key={i}
                style={[styles.categoryCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}
                onPress={() => Haptics.selectionAsync()}
              >
                <View style={[styles.categoryIconCircle, { backgroundColor: cat.color + "20" }]}>
                  <Ionicons name={cat.icon} size={20} color={cat.color} />
                </View>
                <Text style={[styles.categoryTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                  {cat.title}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>

        {/* FAQs */}
        <Animated.View entering={FadeInDown.delay(200).duration(400)} style={{ marginTop: 24 }}>
          <Text style={[styles.sectionTitle, { color: colors.textMuted, fontFamily: fonts.headingSemi }]}>
            FREQUENTLY ASKED QUESTIONS
          </Text>

          {filteredFaqs.map((faq) => {
            const isOpen = expandedFaq === faq.id;
            return (
              <View
                key={faq.id}
                style={[styles.faqCard, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}
              >
                <Pressable style={styles.faqHeader} onPress={() => toggleFaq(faq.id)}>
                  <Text style={[styles.faqQuestion, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                    {faq.question}
                  </Text>
                  <Ionicons
                    name={isOpen ? "chevron-up" : "chevron-down"}
                    size={18}
                    color={colors.textMuted}
                  />
                </Pressable>
                {isOpen && (
                  <Text style={[styles.faqAnswer, { color: colors.textMuted, fontFamily: fonts.body }]}>
                    {faq.answer}
                  </Text>
                )}
              </View>
            );
          })}
        </Animated.View>

        {/* Direct Contact Banner */}
        <Animated.View entering={FadeInDown.delay(300).duration(400)} style={[styles.contactCard, { backgroundColor: (colors.accent || "#FF5722") + "15", borderColor: (colors.accent || "#FF5722") + "40" }]}>
          <Ionicons name="headset-outline" size={32} color={colors.accent || "#FF5722"} />
          <View style={{ flex: 1, gap: 2 }}>
            <Text style={[styles.contactTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              Still need help?
            </Text>
            <Text style={[styles.contactSub, { color: colors.textMuted, fontFamily: fonts.body }]}>
              Our support team usually replies within 2 hours.
            </Text>
          </View>
          <Pressable style={[styles.contactBtn, { backgroundColor: colors.accent || "#FF5722" }]} onPress={openEmailSupport}>
            <Text style={[styles.contactBtnText, { fontFamily: fonts.headingBold }]}>Email Us</Text>
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

  searchBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    gap: 10,
    marginBottom: 20,
  },
  searchInput: { flex: 1, fontSize: 14 },

  sectionTitle: { fontSize: 12, letterSpacing: 0.8, marginBottom: 12 },
  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: {
    width: "48%",
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  categoryIconCircle: { width: 36, height: 36, borderRadius: 10, alignItems: "center", justifyContent: "center" },
  categoryTitle: { fontSize: 13 },

  faqCard: { borderRadius: 16, borderWidth: 1, marginBottom: 10, overflow: "hidden" },
  faqHeader: { padding: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  faqQuestion: { fontSize: 14, flex: 1, paddingRight: 10 },
  faqAnswer: { paddingHorizontal: 16, paddingBottom: 16, fontSize: 13, lineHeight: 20 },

  contactCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginTop: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  contactTitle: { fontSize: 15 },
  contactSub: { fontSize: 11 },
  contactBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 10 },
  contactBtnText: { color: "#FFF", fontSize: 12 },
});