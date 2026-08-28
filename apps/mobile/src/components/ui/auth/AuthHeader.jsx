import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/constants/theme";

export default function AuthHeader({ image, title, subtitle, compact = false }) {
  return (
    <View style={[styles.container, compact && styles.containerCompact]}>
      {!compact && <View style={styles.glow} />}

      {image && (
        <Image
          source={image}
          resizeMode="contain"
          style={compact ? styles.imageCompact : styles.image}
        />
      )}

      <Text style={[styles.title, compact && styles.titleCompact]}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 30 },
  containerCompact: { marginBottom: 18 },
  glow: {
    position: "absolute",
    top: 20,
    width: 160,
    height: 160,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    opacity: 0.6,
  },
  image: { width: 140, height: 168, marginBottom: 16 },
  imageCompact: { width: 64, height: 76, marginBottom: 10 },
  title: {
    fontSize: 28,
    lineHeight: 34,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.5,
  },
  titleCompact: { fontSize: 24, lineHeight: 29 },
  subtitle: {
    marginTop: 8,
    textAlign: "center",
    fontSize: 14.5,
    lineHeight: 21,
    color: colors.textMuted,
    fontFamily: fonts.body,
    paddingHorizontal: 24,
  },
});