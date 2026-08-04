import React, { useState, useMemo } from "react";
import { View, ScrollView, Text, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import * as Haptics from "expo-haptics";
import { useRouter } from "expo-router";
import Animated, { FadeIn } from "react-native-reanimated";

import ProgressBar from "@/components/ui/setup/ProgressDots";
import QuestionBlock from "@/components/ui/setup/QuestionBlock";
import AuthButton from "@/components/ui/auth/PrimaryButton";
import { colors, fonts } from "@/constants/theme";

const QUESTIONS = [
  {
    key: "year",
    question: "What year are you in?",
    options: ["1st year", "2nd year", "3rd year", "Final year", "Already graduated"],
    optional: false,
  },
  {
    key: "field",
    question: "Which field do you want to grow in?",
    options: [
      "Tech (dev / data)",
      "Design",
      "Marketing / Sales",
      "Content / Writing",
      "Government job prep",
      "Not sure yet",
    ],
    optional: false,
  },
  {
    key: "experience",
    question: "Have you done any internship or project before?",
    options: [
      "No, complete beginner",
      "A little bit of experience",
      "Yes, I have experience",
    ],
    optional: false,
  },
  {
    key: "time",
    question: "How much time can you give weekly?",
    options: ["2-3 hours", "5-7 hours", "10+ hours"],
    optional: false,
  },
  {
    key: "goal",
    question: "What matters most to you right now?",
    options: [
      "I need a job soon",
      "I want to learn skills",
      "I want a certificate / credibility",
      "Just exploring for now",
    ],
    optional: true,
  },
];

export default function ProfileSetup() {
  const router = useRouter();
  const [answers, setAnswers] = useState({});

  const requiredQuestions = QUESTIONS.filter((q) => !q.optional);
  const answeredCount = QUESTIONS.filter((q) => answers[q.key]).length;
  const progress = answeredCount / QUESTIONS.length;

  const canContinue = useMemo(
    () => requiredQuestions.every((q) => answers[q.key]),
    [answers]
  );

  const handleSelect = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
  };

  const handleContinue = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    router.replace("/profile-setup"); // TODO: change to actual home route once ready
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "bottom"]}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : undefined}>
        <View style={styles.headerFixed}>
          <ProgressBar progress={progress} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <Animated.View entering={FadeIn.duration(400)} style={styles.hero}>
            <Text style={styles.title}>Let's get to know you</Text>
            <Text style={styles.subtitle}>
              This helps us set the right tasks and roadmap for you
            </Text>
          </Animated.View>

          {QUESTIONS.map((q, index) => (
            <QuestionBlock
              key={q.key}
              index={index}
              question={q.question}
              optional={q.optional}
              options={q.options}
              selected={answers[q.key]}
              onSelect={(value) => handleSelect(q.key, value)}
            />
          ))}
        </ScrollView>

        <View style={styles.footer}>
          <AuthButton label="Continue" onPress={handleContinue} disabled={!canContinue} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  headerFixed: { paddingHorizontal: 24, paddingTop: 12 },
  scroll: { paddingHorizontal: 24, paddingBottom: 20 },
  hero: { marginBottom: 28 },
  title: {
    fontSize: 26,
    fontFamily: fonts.headingBold,
    color: colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    fontFamily: fonts.body,
    color: colors.textMuted,
    lineHeight: 20,
  },
  footer: {
    paddingHorizontal: 24,
    paddingBottom: 12,
    paddingTop: 10,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.divider,
  },
});