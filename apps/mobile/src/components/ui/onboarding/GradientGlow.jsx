import React from "react";
import { StyleSheet, View } from "react-native";

export default function GradientGlow() {
  return (
    <>
      {/* Top Right Glow */}
      <View style={styles.topGlow} />

      {/* Bottom Left Glow */}
      <View style={styles.bottomGlow} />

      {/* Center Glow */}
      <View style={styles.centerGlow} />
    </>
  );
}

const styles = StyleSheet.create({
  topGlow: {
    position: "absolute",
    top: -120,
    right: -100,

    width: 300,
    height: 300,

    borderRadius: 999,

    backgroundColor: "#FFE6D4",

    opacity: 0.9,
  },

  bottomGlow: {
    position: "absolute",
    bottom: -150,
    left: -120,

    width: 280,
    height: 280,

    borderRadius: 999,

    backgroundColor: "#FFF1E6",

    opacity: 0.9,
  },

  centerGlow: {
    position: "absolute",

    top: 210,
    alignSelf: "center",

    width: 240,
    height: 240,

    borderRadius: 999,

    backgroundColor: "#FFEEDF",

    opacity: 0.7,
  },
});