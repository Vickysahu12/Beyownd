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
  locked: { label: 'Locked', color: '#71717A', bg: 'rgba(113, 113, 122, 0.12)' },
};

const DIFFICULTY_MAP = {
  Beginner: '🔥 Beginner',
  Intermediate: '⚡ Intermediate',
  Advanced: '🚀 Advanced',
};

export default function TaskListCard({ task, onPress }) {
  const scale = useSharedValue(1);
  const style = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));

  const status = STATUS_CONFIG[task.status] || STATUS_CONFIG.locked;
  const isLocked = task.status === 'locked';

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
            <Text style={styles.idText}>{task.id}</Text>
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
              <Text style={styles.chipText}>
                {DIFFICULTY_MAP[task.difficulty] || task.difficulty}
              </Text>
            </View>

            <Text style={styles.dueText}>
              {isLocked ? '🔒 Unlocks soon' : `⏳ ${task.due}`}
            </Text>
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
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  idText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#A1A1AA',
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },
  title: {
    fontSize: 17,
    lineHeight: 23,
    color: '#FFFFFF',
    marginBottom: 16,
    letterSpacing: -0.3,
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
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  chipText: {
    fontSize: 11,
    color: '#D4D4D8',
    fontWeight: '600',
  },
  dueText: {
    fontSize: 11,
    color: '#A1A1AA',
    fontWeight: '500',
  },
  chevronCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 87, 34, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});