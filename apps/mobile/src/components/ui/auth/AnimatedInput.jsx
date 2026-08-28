import React, { useState } from "react";
import { View, TextInput, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  interpolateColor,
  interpolate,
} from "react-native-reanimated";
import { colors, fonts } from "@/constants/theme";

export default function AuthInput({
  icon,
  label,
  value,
  onChangeText,
  secureTextEntry = false,
  keyboardType = "default",
  autoCapitalize = "sentences",
  error,
  editable = true,
}) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const focus = useSharedValue(0);
  const shake = useSharedValue(0);

  const hasValue = !!(value && value.length > 0);

  const containerStyle = useAnimatedStyle(() => {
    const borderColor = interpolateColor(
      focus.value,
      [0, 1],
      [
        error ? colors.danger : colors.border,
        error ? colors.danger : colors.borderFocus,
      ]
    );

    return {
      borderColor,
      transform: [{ translateX: shake.value }],
    };
  });

  const labelStyle = useAnimatedStyle(() => {
    const active = focus.value > 0 || hasValue ? 1 : 0;

    return {
      transform: [
        { translateY: interpolate(active, [0, 1], [14, 0]) },
        { scale: interpolate(active, [0, 1], [1, 0.82]) },
      ],
      opacity: interpolate(active, [0, 1], [0.5, 1]),
    };
  });

  const triggerError = () => {
    shake.value = withSequence(
      withTiming(-6, { duration: 40 }),
      withTiming(6, { duration: 40 }),
      withTiming(-4, { duration: 40 }),
      withTiming(0, { duration: 40 })
    );
  };

  React.useEffect(() => {
    if (error) {
      triggerError();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
  }, [error]);

  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={styles.row}>
        <Ionicons
          name={icon}
          size={18}
          color={colors.textMuted}
          style={{ marginTop: 14 }}
        />
        <View style={{ flex: 1 }}>
          <Animated.Text style={[styles.label, labelStyle]}>
            {label}
          </Animated.Text>
          <TextInput
            value={value}
            onChangeText={onChangeText}
            style={styles.input}
            secureTextEntry={hidden}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            placeholderTextColor={colors.textMuted}
            selectionColor={colors.accent}
            editable={editable}
            onFocus={() => {
              focus.value = withTiming(1, { duration: 160 });
              Haptics.selectionAsync();
            }}
            onBlur={() => {
              focus.value = withTiming(hasValue ? 1 : 0, { duration: 160 });
            }}
          />
        </View>
        {secureTextEntry && (
          <Pressable
            onPress={() => {
              setHidden(!hidden);
              Haptics.selectionAsync();
            }}
            hitSlop={10}
            style={{ paddingTop: 14 }}
          >
            <Ionicons
              name={hidden ? "eye-off-outline" : "eye-outline"}
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: 1.25,
    marginBottom: 14,
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 12,
  },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  label: {
    fontSize: 12.5,
    color: colors.textMuted,
    fontFamily: fonts.bodyMedium,
  },
  input: {
    fontSize: 16,
    color: colors.textPrimary,
    fontFamily: fonts.body,
    paddingVertical: 4,
    marginTop: 3,
  },
  error: {
    fontSize: 12,
    color: colors.danger,
    fontFamily: fonts.body,
    marginTop: 6,
    marginLeft: 4,
  },
});