import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet } from "react-native";
import Svg, { Circle } from "react-native-svg";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";

const AnimatedCircle = Animated.createAnimatedComponent(Circle);
const SIZE = 190;
const STROKE = 14;
const RADIUS = (SIZE - STROKE) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function ReadinessMeter({ percent, message, weeklyChange }) {
  const { colors, fonts } = useHomeTheme();
  const progress = useSharedValue(0);
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    progress.value = withTiming(percent / 100, {
      duration: 1400,
      easing: Easing.out(Easing.cubic),
    });

    const start = Date.now();
    const duration = 1400;
    const tick = () => {
      const elapsed = Date.now() - start;
      const t = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplayValue(Math.round(eased * percent));
      if (t < 1) requestAnimationFrame(tick);
    };
    const raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [percent]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: CIRCUMFERENCE * (1 - progress.value),
  }));

  return (
    <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
          Your Readiness Meter
        </Text>
        <Ionicons name="information-circle-outline" size={16} color={colors.textMuted} />
      </View>

      <View style={styles.body}>
        <View style={styles.ringWrap}>
          <Svg width={SIZE} height={SIZE}>
            <Circle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.divider}
              strokeWidth={STROKE}
              fill="none"
            />
            <AnimatedCircle
              cx={SIZE / 2}
              cy={SIZE / 2}
              r={RADIUS}
              stroke={colors.accent}
              strokeWidth={STROKE}
              strokeLinecap="round"
              fill="none"
              strokeDasharray={CIRCUMFERENCE}
              animatedProps={animatedProps}
              rotation="-90"
              origin={`${SIZE / 2}, ${SIZE / 2}`}
            />
          </Svg>

          <View style={styles.ringLabel}>
            <Text style={[styles.percentText, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              {displayValue}
              <Text style={[styles.percentSign, { fontFamily: fonts.headingSemi }]}>%</Text>
            </Text>
            <Text style={[styles.percentCaption, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
              Career Ready
            </Text>
          </View>
        </View>

        <View style={styles.info}>
          <Text style={[styles.message, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
            {message}
          </Text>
          <Text style={[styles.subMessage, { color: colors.textMuted, fontFamily: fonts.body }]}>
            Keep completing tasks to reach the next level.
          </Text>

          <View style={[styles.trendBadge, { backgroundColor: colors.successSoft }]}>
            <Ionicons name="trending-up" size={14} color={colors.success} />
            <Text style={[styles.trendText, { color: colors.success, fontFamily: fonts.bodyMedium }]}>
              +{weeklyChange}% this week
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 24,
    padding: 20,
    borderWidth: 1,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 15,
  },
  body: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  ringWrap: {
    width: SIZE,
    height: SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  ringLabel: {
    position: "absolute",
    alignItems: "center",
  },
  percentText: {
    fontSize: 40,
  },
  percentSign: {
    fontSize: 20,
  },
  percentCaption: {
    fontSize: 13,
    marginTop: 2,
  },
  info: {
    flex: 1,
  },
  message: {
    fontSize: 17,
    lineHeight: 23,
  },
  subMessage: {
    fontSize: 12,
    marginTop: 6,
    lineHeight: 17,
  },
  trendBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    marginTop: 14,
  },
  trendText: {
    fontSize: 12,
  },
});