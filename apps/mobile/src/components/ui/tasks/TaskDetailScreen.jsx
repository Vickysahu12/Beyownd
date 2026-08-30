import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withRepeat,
  withTiming,
  useAnimatedProps,
} from 'react-native-reanimated';
import { useHomeTheme } from '@/context/ThemeContext';
import { apiClient } from '@/api/client';
import { formatDifficulty } from '@/utils/taskHelpers';
import TaskSubmissionModal from '@/components/modals/TaskSubmissionModal';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

function SkeletonBlock({ style, colors }) {
  const opacity = useSharedValue(0.5);

  useEffect(() => {
    opacity.value = withRepeat(withTiming(1, { duration: 700 }), -1, true);
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return (
    <Animated.View
      style={[{ backgroundColor: colors.divider, borderRadius: 12 }, style, animatedStyle]}
    />
  );
}

function TaskDetailSkeleton({ colors }) {
  return (
    <View style={styles.scrollContent}>
      <View style={styles.metaRow}>
        <SkeletonBlock colors={colors} style={{ width: 90, height: 24, borderRadius: 10 }} />
        <SkeletonBlock colors={colors} style={{ width: 110, height: 24, borderRadius: 20 }} />
      </View>
      <SkeletonBlock colors={colors} style={{ width: '85%', height: 26, marginBottom: 16 }} />
      <SkeletonBlock colors={colors} style={{ width: '100%', height: 180, borderRadius: 20, marginBottom: 16 }} />
      <SkeletonBlock colors={colors} style={{ width: '100%', height: 100, borderRadius: 20, marginBottom: 16 }} />
      <SkeletonBlock colors={colors} style={{ width: '100%', height: 140, borderRadius: 20, marginBottom: 16 }} />
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <SkeletonBlock colors={colors} style={{ flex: 1, height: 64, borderRadius: 18 }} />
        <SkeletonBlock colors={colors} style={{ flex: 1, height: 64, borderRadius: 18 }} />
      </View>
    </View>
  );
}

export default function TaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { colors, fonts, isDark } = useHomeTheme();

  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const fetchTask = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await apiClient.get(`/tasks/${id}`);
      setTask(data.data);
    } catch (err) {
      console.error('Task detail fetch failed:', err.response?.data || err.message);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchTask();
  }, [fetchTask]);

  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleSubmissionSuccess = () => {
    setModalVisible(false);
    fetchTask();
  };

  if (loading || !task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
        <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />
        <View style={[styles.header, { borderBottomColor: colors.divider }]}>
          <View style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <Ionicons name="arrow-back" size={20} color={colors.textMuted} />
          </View>
          <Text style={[styles.headerTitle, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            TASK DETAILS
          </Text>
          <View style={{ width: 40 }} />
        </View>

        {error ? (
          <View style={styles.errorWrap}>
            <Ionicons name="alert-circle-outline" size={36} color={colors.danger} />
            <Text style={[styles.errorText, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
              Couldn't load this task
            </Text>
            <Pressable
              style={[styles.retryBtn, { backgroundColor: colors.accent }]}
              onPress={() => {
                Haptics.selectionAsync();
                fetchTask();
              }}
            >
              <Text style={styles.retryText}>Try again</Text>
            </Pressable>
          </View>
        ) : (
          <TaskDetailSkeleton colors={colors} />
        )}
      </SafeAreaView>
    );
  }

  const isSubmitted = task.status === 'completed';
  const latestSubmission = task.submissions?.[0];

  const steps = task.challengeSteps || [
    'Define user journey & screen wireframes.',
    'Build UI components with tactile haptics.',
    'Test across devices for fluid animations.',
  ];
  const skills = task.skills || ['React Native', 'UI UX', 'Mobile Tech'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.header, { borderBottomColor: colors.divider }]}>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.card, borderColor: colors.divider }]}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={20} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          TASK DETAILS
        </Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: insets.bottom + 100 }]}>
        <View style={styles.metaRow}>
          <View style={[styles.idBadge, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <Text style={[styles.idText, { color: colors.textMuted }]}>ID: {task.id.slice(0, 8)}</Text>
          </View>

          <View
            style={[
              styles.statusPill,
              {
                backgroundColor: isSubmitted ? colors.successSoft : colors.accentSoft,
              },
            ]}
          >
            <Ionicons
              name={isSubmitted ? 'checkmark-circle' : 'time-outline'}
              size={14}
              color={isSubmitted ? colors.success : colors.accent}
            />
            <Text
              style={[
                styles.statusText,
                { color: isSubmitted ? colors.success : colors.accent, fontFamily: fonts.headingBold },
              ]}
            >
              {isSubmitted ? 'COMPLETED' : task.status === 'in_progress' ? 'IN PROGRESS' : 'OPEN'}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          {task.title}
        </Text>

        <View style={[styles.previewCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Image
            source={{ uri: task.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' }}
            style={styles.mockupImage}
            resizeMode="cover"
          />
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.sectionHeading, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            PROJECT DESCRIPTION
          </Text>
          <Text style={[styles.bodyText, { color: colors.textPrimary, fontFamily: fonts.body }]}>
            {task.description}
          </Text>
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.sectionHeading, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            DELIVERABLES REQUIRED
          </Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumBadge, { backgroundColor: colors.accent }]}>
                <Text style={[styles.stepNumber, { fontFamily: fonts.headingBold }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          <Text style={[styles.sectionHeading, { color: colors.textMuted, fontFamily: fonts.headingBold }]}>
            REQUIRED TECH STACK
          </Text>
          <View style={styles.skillsWrapper}>
            {skills.map((skill, index) => (
              <View key={index} style={[styles.skillBadge, { backgroundColor: colors.infoSoft }]}>
                <Ionicons name="sparkles-outline" size={12} color={colors.info} />
                <Text style={[styles.skillText, { color: colors.info, fontFamily: fonts.headingBold }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.metaGrid}>
          <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>DIFFICULTY</Text>
            <Text style={[styles.gridValue, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              {formatDifficulty(task.difficulty)}
            </Text>
          </View>
          <View style={[styles.gridCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>EST. TIME</Text>
            <Text style={[styles.gridValue, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
              {task.estimatedHours || '—'}
            </Text>
          </View>
        </View>

        <View style={[styles.actionCard, { backgroundColor: colors.card, borderColor: colors.divider }]}>
          {!isSubmitted ? (
            <>
              <View>
                <Text style={[styles.actionCardTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                  READY TO SUBMIT?
                </Text>
                <Text style={[styles.actionCardDesc, { color: colors.textMuted }]}>
                  Attach your repository link or documentation to complete the quest.
                </Text>
              </View>

              <AnimatedPressable
                style={[styles.submitBtn, { backgroundColor: colors.accent }, animatedButtonStyle]}
                onPress={handleOpenModal}
                onPressIn={() => (buttonScale.value = withSpring(0.96))}
                onPressOut={() => (buttonScale.value = withSpring(1))}
              >
                <Ionicons name="cloud-upload-outline" size={20} color="#FFFFFF" />
                <Text style={[styles.submitText, { fontFamily: fonts.headingBold }]}>
                  SUBMIT SOLUTION
                </Text>
              </AnimatedPressable>
            </>
          ) : (
            <View style={styles.submittedBox}>
              <View style={[styles.submittedIconBox, { backgroundColor: colors.success }]}>
                <Ionicons name="checkmark-done" size={26} color="#FFFFFF" />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.submittedTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                  QUEST COMPLETED!
                </Text>
                <Text style={[styles.submittedSub, { color: colors.textMuted }]} numberOfLines={1}>
                  Link: {latestSubmission?.submissionUrl || '—'}
                </Text>
              </View>
            </View>
          )}
        </View>
      </ScrollView>

      <TaskSubmissionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmitSuccess={handleSubmissionSuccess}
        taskId={task.id}
        colors={colors}
        fonts={fonts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 13, letterSpacing: 0.8 },
  scrollContent: { padding: 20 },
  errorWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12, paddingHorizontal: 40 },
  errorText: { fontSize: 15, textAlign: 'center' },
  retryBtn: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, marginTop: 4 },
  retryText: { color: '#FFFFFF', fontSize: 13, fontWeight: '700' },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  idBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 1 },
  idText: { fontSize: 11, fontWeight: '700' },

  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  statusText: { fontSize: 11, letterSpacing: 0.5 },

  title: { fontSize: 22, lineHeight: 28, marginBottom: 16, letterSpacing: -0.3 },

  previewCard: {
    borderRadius: 20,
    borderWidth: 1,
    overflow: 'hidden',
    marginBottom: 16,
    height: 180,
  },
  mockupImage: { width: '100%', height: '100%' },

  card: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    marginBottom: 16,
    gap: 12,
  },
  sectionHeading: { fontSize: 12, letterSpacing: 0.8 },
  bodyText: { fontSize: 14, lineHeight: 22 },

  stepRow: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  stepNumBadge: {
    width: 26,
    height: 26,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepNumber: { fontSize: 12, color: '#FFFFFF' },
  stepText: { fontSize: 13, flex: 1, lineHeight: 18 },

  skillsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6,
  },
  skillText: { fontSize: 12 },

  metaGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  gridCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    borderWidth: 1,
    gap: 4,
  },
  gridLabel: { fontSize: 10, fontWeight: '700', letterSpacing: 0.5 },
  gridValue: { fontSize: 15 },

  actionCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  actionCardTitle: { fontSize: 14, letterSpacing: 0.5 },
  actionCardDesc: { fontSize: 12, lineHeight: 18 },

  submitBtn: {
    height: 50,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitText: { color: '#FFFFFF', fontSize: 14, letterSpacing: 0.5 },

  submittedBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  submittedIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submittedTitle: { fontSize: 14, letterSpacing: 0.5 },
  submittedSub: { fontSize: 12, marginTop: 2 },
});