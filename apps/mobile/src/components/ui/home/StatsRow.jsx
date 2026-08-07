import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeIn } from "react-native-reanimated";
import { useHomeTheme } from "@/context/ThemeContext";

const STATS = [
  { key: "tasks", icon: "checkmark-circle", color: "success", value: 24, label: "Tasks Done" },
  { key: "notes", icon: "book", color: "info", value: 15, label: "Notes Read" },
  { key: "skills", icon: "flag", color: "pro", value: 7, label: "Skills Practiced" },
  { key: "streak", icon: "star", color: "accent", value: 3, label: "Streak Days" },
];

export default function StatsRow() {
  const { colors, fonts } = useHomeTheme();

  return (
    <View style={[styles.row, { borderTopColor: colors.divider }]}>
      {STATS.map((stat, i) => (
        <Animated.View key={stat.key} entering={FadeIn.delay(400 + i * 80)} style={styles.item}>
          <View
            style={[
              styles.iconCircle,
              { backgroundColor: colors[`${stat.color}Soft`] || colors.accentSoft },
            ]}
          >
            <Ionicons name={stat.icon} size={16} color={colors[stat.color] || colors.accent} />
          </View>
          <Text style={[styles.value, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            {stat.value}
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
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 18,
    paddingTop: 16,
    borderTopWidth: 1,
  },
  item: {
    alignItems: "center",
    flex: 1,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 6,
  },
  value: {
    fontSize: 16,
  },
  label: {
    fontSize: 10,
    textAlign: "center",
    marginTop: 2,
  },
});