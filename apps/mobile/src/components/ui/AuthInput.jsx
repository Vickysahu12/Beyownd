import React, { useState } from 'react';
import { TextInput, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  interpolateColor,
} from 'react-native-reanimated';
import { colors, fonts } from '@/constants/theme';

export default function AuthInput({
  icon,
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType = 'default',
  autoCapitalize = 'sentences',
}) {
  const [hidden, setHidden] = useState(secureTextEntry);
  const focus = useSharedValue(0);

  const animatedWrapStyle = useAnimatedStyle(() => ({
    borderColor: interpolateColor(focus.value, [0, 1], [colors.divider, colors.accent]),
  }));

  return (
    <Animated.View style={[styles.wrap, animatedWrapStyle]}>
      <Ionicons name={icon} size={18} color={colors.textMuted} style={styles.icon} />
      <TextInput
        style={styles.input}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        value={value}
        onChangeText={onChangeText}
        secureTextEntry={hidden}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        onFocus={() => (focus.value = withTiming(1, { duration: 180 }))}
        onBlur={() => (focus.value = withTiming(0, { duration: 180 }))}
      />
      {secureTextEntry && (
        <Pressable onPress={() => setHidden(!hidden)} hitSlop={10}>
          <Ionicons
            name={hidden ? 'eye-off-outline' : 'eye-outline'}
            size={18}
            color={colors.textMuted}
          />
        </Pressable>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.surface,
    borderWidth: 1.5,
    borderColor: colors.divider,
    borderRadius: 14,
    paddingHorizontal: 16,
    height: 54,
    marginBottom: 14,
  },
  icon: { marginRight: 10 },
  input: { flex: 1, fontFamily: fonts.body, fontSize: 14, color: colors.textPrimary },
});