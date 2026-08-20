import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";

export default function StatsRow({ stats }) {
  const { colors, fonts } = useHomeTheme();

  const STAT_CONFIG = [
    { key: "tasksDone", icon: "checkmark-circle", color: "success", label: "Tasks Done" },
    { key: "notesRead", icon: "book", color: "info", label: "Notes Read" },
    { key: "skillsPracticed", icon: "flag", color: "pro", label: "Skills Practiced" },
    { key: "streakDays", icon: "star", color: "accent", label: "Streak Days" },
  ];

  return (
    <View style={[styles.row, { borderTopColor: colors.divider }]}>
      {STAT_CONFIG.map((stat, i) => (
        <Animated.View key={stat.key} entering={FadeIn.delay(400 + i * 80)} style={styles.item}>
          <View style={[styles.iconCircle, { backgroundColor: colors[`${stat.color}Soft`] || colors.accentSoft }]}>
            <Ionicons name={stat.icon} size={16} color={colors[stat.color] || colors.accent} />
          </View>
          <Text style={[styles.value, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            {stats?.[stat.key] ?? 0}
          </Text>
          <Text style={[styles.label, { color: colors.textMuted, fontFamily: fonts.body }]}>
            {stat.label}
          </Text>
        </Animated.View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: "row", justifyContent: "space-between", marginTop: 18, paddingTop: 16, borderTopWidth: 1 },
  item: { alignItems: "center", flex: 1 },
  iconCircle: { width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", marginBottom: 6 },
  value: { fontSize: 16 },
  label: { fontSize: 10, textAlign: "center", marginTop: 2 },
});