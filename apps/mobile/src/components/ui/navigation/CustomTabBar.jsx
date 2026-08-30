import React, { useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from "react-native-reanimated";
import { darkColors as colors } from "@/constants/darkTheme";
import { fonts } from "@/constants/theme";

const TABS = [
  { name: "home", label: "Home", icon: "home", iconOutline: "home-outline" },
  { name: "notes", label: "Notes", icon: "flag", iconOutline: "flag-outline" },
  { name: "tasks", label: "Tasks", icon: "checkbox", iconOutline: "checkbox-outline" },
  { name: "profile", label: "Profile", icon: "person", iconOutline: "person-outline" },
];

const SCREEN_WIDTH = Dimensions.get("window").width;
const BAR_MARGIN = 20;
const BAR_WIDTH = SCREEN_WIDTH - BAR_MARGIN * 2;
const TAB_WIDTH = BAR_WIDTH / TABS.length;

export default function CustomTabBar({ state, navigation }) {
  const insets = useSafeAreaInsets();
  const indicatorX = useSharedValue(state.index * TAB_WIDTH);

  useEffect(() => {
    indicatorX.value = withSpring(state.index * TAB_WIDTH, {
      damping: 14,
      stiffness: 200,
      mass: 0.6,
    });
  }, [state.index]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: indicatorX.value }],
  }));

  return (
    <View style={[styles.wrapper, { bottom: (insets.bottom || 12) + 12 }]}>
      <BlurView intensity={70} tint="dark" style={styles.blur}>
        <Animated.View style={[styles.indicator, { width: TAB_WIDTH - 12 }, indicatorStyle]} />

        <View style={styles.row}>
          {state.routes.map((route, index) => {
            const isFocused = state.index === index;
            const tab = TABS.find((t) => t.name === route.name) || TABS[0];

            return (
              <TabItem
                key={route.key}
                tab={tab}
                isFocused={isFocused}
                onPress={() => {
                  Haptics.selectionAsync();

                  const event = navigation.emit({
                    type: "tabPress",
                    target: route.key,
                    canPreventDefault: true,
                  });

                  if (!isFocused && !event.defaultPrevented) {
                    navigation.navigate(route.name);
                  }
                }}
              />
            );
          })}
        </View>
      </BlurView>
    </View>
  );
}

function TabItem({ tab, isFocused, onPress }) {
  const scale = useSharedValue(1);

  const iconStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      style={styles.item}
      onPress={() => {
        scale.value = withSpring(0.8, { damping: 10, stiffness: 300 }, () => {
          scale.value = withSpring(1, { damping: 8, stiffness: 200 });
        });
        onPress();
      }}
      hitSlop={8}
    >
      <Animated.View style={iconStyle}>
        <Ionicons
          name={isFocused ? tab.icon : tab.iconOutline}
          size={isFocused ? 21 : 20}
          color={isFocused ? colors.accent : colors.textMuted}
          style={{ opacity: isFocused ? 1 : 0.7 }}
        />
      </Animated.View>

      {isFocused && (
        <Text style={styles.label} numberOfLines={1}>
          {tab.label}
        </Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: BAR_MARGIN,
    right: BAR_MARGIN,
    zIndex: 100,
    elevation: 100,
  },
  blur: {
    height: 62,
    borderRadius: 31,
    overflow: "hidden",
    backgroundColor: "rgba(13,13,18,0.92)",
    borderWidth: 1,
    borderColor: "rgba(42,42,51,0.9)",
    shadowColor: "#000",
    shadowOpacity: 0.35,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  indicator: {
    position: "absolute",
    top: 6,
    left: 6,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.accentSoft,
  },
  row: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  item: {
    width: TAB_WIDTH,
    height: 62,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  label: {
    fontSize: 13,
    color: colors.accent,
    fontFamily: fonts.bodyMedium,
  },
});