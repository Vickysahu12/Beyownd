import React, { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import Animated, {
  useAnimatedStyle,
  withTiming,
  useSharedValue,
} from "react-native-reanimated";
import { Ionicons } from "@expo/vector-icons";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function OfflineBanner() {
  const [isConnected, setIsConnected] = useState(true);
  const insets = useSafeAreaInsets();
  const translateY = useSharedValue(-100);

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const online = state.isConnected && state.isInternetReachable !== false;
      setIsConnected(online);
      translateY.value = withTiming(online ? -100 : 0, { duration: 300 });
    });

    return () => unsubscribe();
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  if (isConnected) return null;

  return (
    <Animated.View
      style={[
        styles.container,
        { paddingTop: Math.max(insets.top, 12) },
        animatedStyle,
      ]}
    >
      <View style={styles.content}>
        <Ionicons name="wifi-outline" size={16} color="#FFFFFF" />
        <Text style={styles.text}>No Internet Connection • Offline Mode</Text>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "#EF4444",
    zIndex: 9999,
    paddingBottom: 8,
    paddingHorizontal: 16,
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "600",
  },
});