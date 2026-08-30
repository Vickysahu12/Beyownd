import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

import { useHomeTheme } from '@/context/ThemeContext';
import TaskListCard from '@/components/ui/tasks/TaskListCard';
import ScreenStateWrapper from '@/components/common/ScreenStateWrapper';
import { apiClient } from '@/api/client';
import { formatDifficulty, formatDueLabel } from '@/utils/taskHelpers';

const FILTERS = ['All', 'In Progress', 'Completed'];
const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function FilterPill({ label, isSelected, onPress, colors }) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPressIn={() => (scale.value = withSpring(0.95))}
      onPressOut={() => (scale.value = withSpring(1))}
      onPress={() => {
        Haptics.selectionAsync();
        onPress();
      }}
      style={[
        styles.filterPill,
        isSelected
          ? { backgroundColor: colors.accent, borderColor: colors.accent }
          : { backgroundColor: colors.card, borderColor: colors.divider },
        animatedStyle,
      ]}
    >
      <Text style={[styles.filterText, { color: isSelected ? '#FFFFFF' : colors.textMuted }]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
}

export default function Tasks() {
  const router = useRouter();
  const { colors, fonts, isDark, toggleTheme } = useHomeTheme();

  const [activeFilter, setActiveFilter] = useState('All');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await apiClient.get('/tasks');
      const mapped = data.data.map((t) => {
        const isCompleted =
          t.status === 'completed' ||
          (Array.isArray(t.submissions) && t.submissions.length > 0) ||
          t.isCompleted;

        return {
          id: t.id,
          title: t.title,
          difficulty: formatDifficulty(t.difficulty),
          status: isCompleted ? 'completed' : t.status || 'open',
          due: formatDueLabel(t),
          dueDate: t.dueDate,
          completedAt: t.completedAt,
        };
      });
      setTasks(mapped);
    } catch (err) {
      console.error('Tasks fetch failed:', err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [fetchTasks])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const completedCount = tasks.filter((t) => t.status === 'completed').length;
  const progressPercent =
    tasks.length > 0 ? Math.round((completedCount / tasks.length) * 100) : 0;

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'In Progress')
      return tasks.filter((t) => t.status !== 'completed');
    if (activeFilter === 'Completed')
      return tasks.filter((t) => t.status === 'completed');
    return tasks;
  }, [activeFilter, tasks]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      <StatusBar style={isDark ? 'light' : 'dark'} />

      <View style={styles.header}>
        <View style={styles.headerMainRow}>
          <View style={styles.headerTitleRow}>
            <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              Reality Tasks
            </Text>
          </View>

          <Pressable
            style={[styles.themeToggleBtn, { backgroundColor: colors.card, borderColor: colors.divider }]}
            onPress={() => {
              Haptics.selectionAsync();
              toggleTheme();
            }}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={colors.accent}
            />
          </Pressable>
        </View>

        <Text style={[styles.tagline, { color: colors.textMuted }]}>
          Prove your skills, one task at a time
        </Text>
      </View>

      <ScreenStateWrapper
        loading={loading}
        error={error}
        isEmpty={!loading && !error && tasks.length === 0}
        onRetry={fetchTasks}
        skeletonCount={4}
        emptyTitle="No tasks yet"
        emptySubtitle="Your first Reality Task will show up here soon."
      >
        <View style={styles.subHeader}>
          <View style={[styles.progressCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <View style={styles.progressInfo}>
              <View style={styles.progressLabelRow}>
                <Ionicons name="trophy-outline" size={16} color={colors.success} />
                <Text style={[styles.progressLabel, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                  Quest Progress
                </Text>
              </View>
              <Text style={[styles.progressVal, { color: colors.success, fontFamily: fonts.headingBold }]}>
                {completedCount} / {tasks.length} ({progressPercent}%)
              </Text>
            </View>

            <View style={[styles.track, { backgroundColor: colors.divider }]}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(Math.max(progressPercent, 0), 100)}%`,
                    backgroundColor: colors.success,
                  },
                ]}
              />
            </View>
          </View>

          <View style={styles.filterRow}>
            {FILTERS.map((f) => (
              <FilterPill
                key={f}
                label={f}
                isSelected={activeFilter === f}
                onPress={() => setActiveFilter(f)}
                colors={colors}
              />
            ))}
          </View>
        </View>

        <FlatList
          data={filteredTasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor={colors.accent}
              colors={[colors.accent]}
            />
          }
          renderItem={({ item }) => (
            <TaskListCard task={item} onPress={() => router.push(`/task/${item.id}`)} />
          )}
        />
      </ScreenStateWrapper>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 8 },
  headerMainRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  title: { fontSize: 24, letterSpacing: -0.4 },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  tagline: { fontSize: 13, marginTop: 2 },
  subHeader: { paddingHorizontal: 20 },

  progressCard: {
    borderRadius: 20,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    gap: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  progressLabelRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  progressLabel: { fontSize: 13 },
  progressVal: { fontSize: 13 },
  track: { height: 8, borderRadius: 4, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 4 },

  filterRow: { flexDirection: 'row', gap: 8, marginTop: 16, marginBottom: 10 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 14,
    borderWidth: 1,
  },
  filterText: { fontSize: 13, fontWeight: '600' },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
});