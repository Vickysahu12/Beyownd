import React from "react";
import { View, StyleSheet } from "react-native";
import { useHomeTheme } from "@/context/ThemeContext";
import Skeleton from "@/components/common/Skeleton";

export default function NotifCardSkeleton() {
  const { colors } = useHomeTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface }]}>
      <Skeleton width={42} height={42} borderRadius={14} />
      <View style={styles.textCol}>
        <Skeleton width="70%" height={13} style={{ marginBottom: 8 }} />
        <Skeleton width="90%" height={11} style={{ marginBottom: 6 }} />
        <Skeleton width="50%" height={11} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    gap: 12,
    alignItems: "flex-start",
    padding: 16,
    borderRadius: 18,
    marginBottom: 12,
  },
  textCol: { flex: 1 },
});