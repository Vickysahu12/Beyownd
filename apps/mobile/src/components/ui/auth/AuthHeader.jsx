import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { colors, fonts } from "@/constants/theme";

export default function AuthHeader({ image, title, subtitle }) {
  return (
    <View style={styles.container}>
      <View style={styles.glow} />

      {image && (
        <Image source={image} resizeMode="contain" style={styles.image} />
      )}

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.subtitle}>{subtitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "center", marginBottom: 32 },
  glow: {
    position: "absolute",
    top: 10,
    width: 180,
    height: 180,
    borderRadius: 999,
    backgroundColor: colors.accentSoft,
    opacity: 0.8,
  },
  image: {
    width: 150,
    height: 180,
    marginBottom: 18,
  },
  title: {
    fontSize: 30,
    lineHeight: 36,
    textAlign: "center",
    color: colors.textPrimary,
    fontFamily: fonts.headingBold,
    letterSpacing: -0.6,
  },
  subtitle: {
    marginTop: 10,
    textAlign: "center",
    fontSize: 15,
    lineHeight: 22,
    color: colors.textMuted,
    fontFamily: fonts.body,
    paddingHorizontal: 20,
  },
});