import React, { useEffect, useRef } from "react";
import {
  Animated,
  Image,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function FeatureCard({
  icon,
  title,
  subtitle,
  style,
}) {
  const float = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(float, {
          toValue: -6,
          duration: 1800,
          useNativeDriver: true,
        }),
        Animated.timing(float, {
          toValue: 0,
          duration: 1800,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);

  return (
    <Animated.View
      style={[
        styles.card,
        style,
        { transform: [{ translateY: float }] },
      ]}
    >
      <Image source={icon} style={styles.icon} />

      <View style={{ marginLeft: 10 }}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.subtitle}>{subtitle}</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 22,

    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 8,
  },

  icon: {
    width: 40,
    height: 40,
  },

  title: {
    fontWeight: "700",
    fontSize: 15,
    color: "#1B1715",
  },

  subtitle: {
    fontSize: 12,
    color: "#6E6A67",
    marginTop: 2,
  },
});