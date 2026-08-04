import React from "react";
import { View, Text, StyleSheet } from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import SelectPill from "./SelectPill";
import { colors, fonts } from "@/constants/theme";

export default function QuestionBlock({ index, question, optional, options, selected, onSelect }) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 90).springify().damping(16).mass(0.8)}
      style={styles.block}
    >
      <View style={styles.headerRow}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepText}>{index + 1}</Text>
        </View>
        <Text style={styles.question}>
          {question}
          {optional && <Text style={styles.optionalTag}>  · optional</Text>}
        </Text>
      </View>

      {options.map((opt) => (
        <SelectPill
          key={opt}
          label={opt}
          selected={selected === opt}
          onPress={() => onSelect(opt)}
        />
      ))}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  block: { marginBottom: 30 },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  stepBadge: {
    width: 24,
    height: 24,
    borderRadius: 8,
    backgroundColor: colors.accentSoft,
    alignItems: "center",
    justifyContent: "center",
  },
  stepText: {
    fontSize: 12,
    fontFamily: fonts.bodyMedium,
    color: colors.accent,
  },
  question: {
    fontSize: 16,
    fontFamily: fonts.headingSemi,
    color: colors.textPrimary,
    flex: 1,
    flexWrap: "wrap",
  },
  optionalTag: {
    fontSize: 12,
    fontFamily: fonts.body,
    color: colors.textMuted,
  },
});