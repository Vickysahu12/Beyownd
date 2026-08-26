import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { darkColors as colors } from '@/constants/darkTheme';
import { fonts } from '@/constants/theme';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

const STATUS_CONFIG = {
  completed: { label: 'Completed', color: '#10B981', bg: 'rgba(16, 185, 129, 0.12)' },
  in_progress: { label: 'In Progress', color: '#FF5722', bg: 'rgba(255, 87, 34, 0.12)' },
  open: { label: 'Open', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)' },
  pending: { label: 'Open', color: '#60A5FA', bg: 'rgba(96, 165, 250, 0.12)' },
  locked: { label: 'Locked', color: '#71717A', bg: 'rgba(113, 113, 122, 0.12)' },
};

export default function TaskListCard({ task, onPress }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const statusKey = task.status || 'open';
  const status = STATUS_CONFIG[statusKey] || STATUS_CONFIG.open;
  const isLocked = task.status === 'locked';

  // Short ID display (e.g. 94f61282)
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
      <LinearGradient
        colors={
          isLocked
            ? ['#18181B', '#121215']
            : task.status === 'in_progress'
            ? ['#201A18', '#141417']
            : ['#1C1C21', '#141417']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={[styles.card, { opacity: isLocked ? 0.55 : 1 }]}
      >
        {/* Top Header Row */}
        <View style={styles.topRow}>
          <View style={styles.idTag}>
            <Text style={styles.idText}>#{displayId}</Text>
          </View>

          <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
            <View style={[styles.dot, { backgroundColor: status.color }]} />
            <Text style={[styles.statusText, { color: status.color }]}>
              {status.label}
            </Text>
          </View>
        </View>

        {/* Task Title */}
        <Text style={[styles.title, { fontFamily: fonts.headingBold }]} numberOfLines={2}>
          {task.title}
        </Text>

        {/* Bottom Metadata & Arrow CTA */}
        <View style={styles.bottomRow}>
          <View style={styles.metaGroup}>
            <View style={styles.chip}>
              <Ionicons name="flame-outline" size={12} color="#FF5722" />
              <Text style={styles.chipText}>{task.difficulty}</Text>
            </View>

            <View style={styles.dueRow}>
              {!isLocked ? (
                <>
                  <Ionicons name="time-outline" size={13} color="#A1A1AA" />
                  <Text style={styles.dueText}>{task.due}</Text>
                </>
              ) : (
                <>
                  <Ionicons name="lock-closed-outline" size={13} color="#71717A" />
                  <Text style={styles.dueText}>Unlocks soon</Text>
                </>
              )}
            </View>
          </View>

          {!isLocked && (
            <View style={styles.chevronCircle}>
              <Ionicons name="arrow-forward" size={14} color="#FF5722" />
            </View>
          )}
        </View>
      </LinearGradient>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  cardWrapper: {
    marginBottom: 14,
    borderRadius: 22,
  },
  card: {
    borderRadius: 22,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    padding: 18,
    overflow: 'hidden',
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idTag: {
    backgroundColor: '#27272A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  idText: {
    color: '#A1A1AA',
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
    color: '#F4F4F5',
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
    backgroundColor: 'rgba(255, 87, 34, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    gap: 4,
  },
  chipText: {
    color: '#FF5722',
    fontSize: 12,
    fontWeight: '600',
  },
  dueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueText: {
    color: '#A1A1AA',
    fontSize: 12,
  },
  chevronCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#27272A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});