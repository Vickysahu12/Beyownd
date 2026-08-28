import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { colors, fonts } from "@/constants/theme";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function GoogleButton({ onPress }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      style={[styles.button, animatedStyle]}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(0.98);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
    >
      <View style={styles.left}>
        <Image
          source={require("@/assets/image/google.png")}
          style={styles.logo}
        />
        <Text style={styles.text}>Continue with Google</Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 58,
    marginTop: 16,
    borderRadius: 18,
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 18,
    justifyContent: "center",
    shadowColor: colors.shadow,
    shadowOpacity: 0.5,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  logo: { width: 22, height: 22, resizeMode: "contain" },
  text: { fontSize: 15, color: colors.textPrimary, fontFamily: fonts.bodyMedium },
});