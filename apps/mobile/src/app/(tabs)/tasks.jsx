import React, { useState, useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import * as Haptics from 'expo-haptics';
import { darkColors as colors } from '@/constants/darkTheme';
import { fonts } from '@/constants/theme';
import TaskListCard from '@/components/ui/tasks/TaskListCard';
import { TASKS } from '@/constants/tasks-data';

const FILTERS = ['All', 'In Progress', 'Completed'];

export default function Tasks() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState('All');

  const completedCount = TASKS.filter((t) => t.status === 'completed').length;
  const progressPercent = Math.round((completedCount / TASKS.length) * 100);

  const filteredTasks = useMemo(() => {
    if (activeFilter === 'In Progress') return TASKS.filter((t) => t.status === 'in_progress');
    if (activeFilter === 'Completed') return TASKS.filter((t) => t.status === 'completed');
    return TASKS;
  }, [activeFilter]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top']}>
      {/* --- HEADER SECTION --- */}
      <View style={styles.header}>
        <Text style={[styles.tagline, { color: colors.accent }]}>PROVE YOUR SKILLS</Text>
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          Reality Tasks ⚡
        </Text>

        {/* Apple Fitness style progress bar */}
        <View style={styles.progressCard}>
          <View style={styles.progressInfo}>
            <Text style={styles.progressLabel}>Level Progress</Text>
            <Text style={styles.progressVal}>{completedCount} of {TASKS.length} Done ({progressPercent}%)</Text>
          </View>
          <View style={styles.track}>
            <View style={[styles.fill, { width: `${progressPercent}%` }]} />
          </View>
        </View>

        {/* Filter Pills */}
        <View style={styles.filterRow}>
          {FILTERS.map((f) => {
            const isSelected = activeFilter === f;
            return (
              <Pressable
                key={f}
                onPress={() => {
                  Haptics.selectionAsync();
                  setActiveFilter(f);
                }}
                style={[
                  styles.filterPill,
                  isSelected && styles.filterPillActive
                ]}
              >
                <Text style={[
                  styles.filterText,
                  isSelected ? styles.filterTextActive : styles.filterTextInactive
                ]}>
                  {f}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* --- TASK LIST --- */}
      <FlatList
        data={filteredTasks}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TaskListCard task={item} onPress={() => router.push(`/task/${item.id}`)} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
  tagline: { fontSize: 11, fontWeight: '800', letterSpacing: 1.5, marginBottom: 4 },
  title: { fontSize: 28, letterSpacing: -0.5 },
  
  // Progress Box
  progressCard: {
    backgroundColor: '#18181B',
    borderRadius: 16,
    padding: 14,
    marginTop: 14,
    borderWidth: 1,
    borderColor: '#27272A',
  },
  progressInfo: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  progressLabel: { color: '#A1A1AA', fontSize: 12, fontWeight: '600' },
  progressVal: { color: '#F4F4F5', fontSize: 12, fontWeight: '700' },
  track: { height: 6, backgroundColor: '#27272A', borderRadius: 3, overflow: 'hidden' },
  fill: { height: '100%', backgroundColor: '#FF5722', borderRadius: 3 },

  // Filters
  filterRow: { flexDirection: 'row', gap: 8, marginTop: 16 },
  filterPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#18181B',
    borderWidth: 1,
    borderColor: '#27272A',
  },
  filterPillActive: {
    backgroundColor: '#FF5722',
    borderColor: '#FF5722',
  },
  filterText: { fontSize: 13, fontWeight: '600' },
  filterTextActive: { color: '#FFFFFF' },
  filterTextInactive: { color: '#A1A1AA' },

  list: { paddingHorizontal: 20, paddingBottom: 100 },
});