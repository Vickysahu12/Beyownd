import React from "react";
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
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

        <Text style={styles.text}>
          Continue with Google
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({

  button: {

    height: 58,

    marginTop: 18,

    borderRadius: 20,

    backgroundColor: "#FFFFFF",

    borderWidth: 1,
    borderColor: "#ECE7E2",

    paddingHorizontal: 18,

    justifyContent: "center",

    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },

    elevation: 5,

  },

  left: {

    flexDirection: "row",

    alignItems: "center",

    justifyContent: "center",

    gap: 12,

  },

  logo: {

    width: 22,

    height: 22,

    resizeMode: "contain",

  },

  text: {

    fontSize: 15,

    color: colors.textPrimary,

    fontFamily: fonts.bodyMedium,

  },

});