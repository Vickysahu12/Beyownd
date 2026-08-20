import React from "react";
import { View, StyleSheet } from "react-native";
import { useHomeTheme } from "@/context/ThemeContext";
import Skeleton from "@/components/common/Skeleton";

export default function NoteRowSkeleton() {
  const { colors } = useHomeTheme();

  return (
    <View style={[styles.rowCard, { backgroundColor: colors.surface || "#18181B" }]}>
      <Skeleton width={38} height={38} borderRadius={11} />
      <View style={styles.textContainer}>
        <Skeleton width="65%" height={13} style={{ marginBottom: 10 }} />
        <Skeleton width="100%" height={4} borderRadius={2} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  rowCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 20,
    marginBottom: 10,
  },
  textContainer: { flex: 1, paddingRight: 10 },
});