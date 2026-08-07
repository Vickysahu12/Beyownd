import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

import Animated, {
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

import ProgressItem from "./ProgressItem";

import { colors, fonts } from "@/constants/theme";

const STEPS = [
  "Understanding your goals",
  "Creating your learning roadmap",
  "Assigning your first Reality Task",
  "Preparing notes & resources",
];

export default function SetupCard() {
  const [currentStep, setCurrentStep] = useState(0);

  const progress = useSharedValue(0);

  useEffect(() => {
    const timers = [];

    STEPS.forEach((_, index) => {
      timers.push(
        setTimeout(() => {
          setCurrentStep(index + 1);

          progress.value = withTiming(
            (index + 1) / STEPS.length,
            {
              duration: 500,
            }
          );
        }, index * 1500)
      );
    });

    return () => timers.forEach(clearTimeout);
  }, []);

  const progressStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
  }));

  return (
    <Animated.View
      entering={FadeInUp.springify()}
      style={styles.container}
    >
      <Text style={styles.title}>
        Preparing your workspace
      </Text>

      <Text style={styles.subtitle}>
        We're creating a personalized learning
        experience based on your goals.
      </Text>

      <View style={styles.steps}>
        {STEPS.map((step, index) => {
          let status = "pending";

          if (currentStep > index) status = "done";

          if (currentStep === index)
            status = "loading";

          return (
            <ProgressItem
              key={step}
              title={step}
              status={status}
              delay={index * 100}
            />
          );
        })}
      </View>

      <View style={styles.bottom}>
        <View style={styles.track}>
          <Animated.View
            style={[
              styles.fill,
              progressStyle,
            ]}
          />
        </View>

        <Text style={styles.footer}>
          Usually takes less than 10 seconds
        </Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 32,
    marginTop: 8,
  },

  title: {
    fontSize: 30,
    fontFamily: fonts.headingBold,
    color: colors.textPrimary,
    letterSpacing: -1,
    textAlign: "center",
  },

  subtitle: {
    marginTop: 10,
    fontSize: 15,
    lineHeight: 24,
    textAlign: "center",
    color: colors.textMuted,
    fontFamily: fonts.body,
    paddingHorizontal: 8,
  },

  steps: {
    marginTop: 42,
    gap: 15,
  },

  bottom: {
    marginTop: 36,
  },

  track: {
    height: 6,
    borderRadius: 99,
    overflow: "hidden",
    backgroundColor: colors.divider,
  },

  fill: {
    height: "100%",
    width: "0%",
    borderRadius: 99,
    backgroundColor: colors.accent,
  },

  footer: {
    marginTop: 18,
    textAlign: "center",
    fontSize: 13,
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
  },
});