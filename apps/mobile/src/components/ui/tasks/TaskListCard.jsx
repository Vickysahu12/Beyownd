import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useHomeTheme } from '@/context/ThemeContext';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TaskListCard({ task, onPress }) {
  const { colors, fonts } = useHomeTheme();
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const STATUS_CONFIG = {
    completed: { label: 'Completed', color: colors.success, bg: colors.successSoft },
    in_progress: { label: 'In Progress', color: colors.accent, bg: colors.accentSoft },
    open: { label: 'Open', color: colors.info, bg: colors.infoSoft },
    pending: { label: 'Open', color: colors.info, bg: colors.infoSoft },
    locked: { label: 'Locked', color: colors.textMuted, bg: colors.divider },
  };

  const statusKey = task.status || 'open';
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.open;
  const isLocked = task.status === 'locked';

  const displayId = task.id ? (task.id.length > 8 ? `${task.id.slice(0, 8)}` : task.id) : 'TASK';

  return (
    <AnimatedPressable
      style={[style, styles.cardWrapper]}
      disabled={isLocked}
      onPress={() => {
        Haptics.selectionAsync();
        onPress?.();
      }}
      onPressIn={() => (scale.value = withSpring(0.97, { damping: 12, stiffness: 200 }))}
      onPressOut={() => (scale.value = withSpring(1))}
    >
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.card,
            borderColor: colors.divider,
            opacity: isLocked ? 0.55 : 1,
          },
        ]}
      >
        <View style={styles.topRow}>
          <View style={[styles.idTag, { backgroundColor: colors.bg }]}>
            <Text style={[styles.idText, { color: colors.textMuted }]}>#{displayId}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <View style={[styles.dot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        <Text
          style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}
          numberOfLines={2}
        >
          {task.title}
        </Text>

        <View style={styles.bottomRow}>
          <View style={styles.metaGroup}>
            <View style={[styles.chip, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="flame-outline" size={12} color={colors.accent} />
              <Text style={[styles.chipText, { color: colors.accent }]}>{task.difficulty}</Text>
            </View>

            <View style={styles.dueRow}>
              {!isLocked ? (
                <>
                  <Ionicons name="time-outline" size={13} color={colors.textMuted} />
                  <Text style={[styles.dueText, { color: colors.textMuted }]}>{task.due}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="lock-closed-outline" size={13} color={colors.textMuted} />
                  <Text style={[styles.dueText, { color: colors.textMuted }]}>Unlocks soon</Text>
                </>
              )}
            </View>
          </View>

          {!isLocked && (
            <View style={[styles.chevronCircle, { backgroundColor: colors.accentSoft }]}>
              <Ionicons name="arrow-forward" size={14} color={colors.accent} />
            </View>
          )}
        </View>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 14,
    borderRadius: 22,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    padding: 18,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idTag: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    gap: 6,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    marginBottom: 16,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  metaGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    fontSize: 12,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
});