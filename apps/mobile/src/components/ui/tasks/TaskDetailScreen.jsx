import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useHomeTheme } from '@/context/ThemeContext';
import { apiClient } from '@/api/client';
import { formatDifficulty } from '@/utils/taskHelpers';
import TaskSubmissionModal from '@/components/modals/TaskSubmissionModal';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { colors, fonts, isDark } = useHomeTheme();

  // 1. All State Hooks
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  // 2. All Reanimated Hooks
  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  // 3. Callback & Effect Hooks
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

  // 4. Handlers
  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleSubmissionSuccess = () => {
    setModalVisible(false);
    fetchTask();
  };

  // 5. Early Return
  if (loading || !task) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]}>
        {/* Skeleton or Loader component here */}
      </SafeAreaView>
    );
  }

  // 6. Derived Data
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

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border || '#27272A' }]}>
        <Pressable
          style={[styles.backButton, { backgroundColor: colors.surface || '#18181B', borderColor: colors.border || '#27272A' }]}
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
        
        {/* Task Badges Row */}
        <View style={styles.metaRow}>
          <View style={[styles.idBadge, { backgroundColor: colors.surface, borderColor: colors.border || '#27272A' }]}>
            <Text style={[styles.idText, { color: colors.textMuted }]}>ID: {task.id.slice(0, 8)}</Text>
          </View>

          <View style={[
            styles.duoStatusPill,
            {
              backgroundColor: isSubmitted ? 'rgba(88, 204, 2, 0.15)' : 'rgba(255, 87, 34, 0.15)',
              borderColor: isSubmitted ? '#58CC02' : colors.accent || '#FF5722',
            }
          ]}>
            <Ionicons
              name={isSubmitted ? "checkmark-circle-sharp" : "time-sharp"}
              size={14}
              color={isSubmitted ? '#58CC02' : colors.accent || '#FF5722'}
            />
            <Text style={[
              styles.duoStatusText,
              { color: isSubmitted ? '#58CC02' : colors.accent || '#FF5722', fontFamily: fonts.headingBold }
            ]}>
              {isSubmitted ? 'COMPLETED' : task.status === 'in_progress' ? 'IN PROGRESS' : 'OPEN'}
            </Text>
          </View>
        </View>

        {/* Task Title */}
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          {task.title}
        </Text>

        {/* 3D Visual Card */}
        <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border || '#27272A' }]}>
          <Image
            source={{ uri: task.image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80' }}
            style={styles.mockupImage}
            resizeMode="cover"
          />
        </View>

        {/* Description Section */}
        <View style={[styles.duoCard, { backgroundColor: colors.surface || '#18181B', borderColor: colors.border || '#27272A' }]}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            PROJECT DESCRIPTION
          </Text>
          <Text style={[styles.bodyText, { color: colors.textMuted, fontFamily: fonts.body }]}>
            {task.description}
          </Text>
        </View>

        {/* Deliverables Required */}
        <View style={[styles.duoCard, { backgroundColor: colors.surface || '#18181B', borderColor: colors.border || '#27272A' }]}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            DELIVERABLES REQUIRED
          </Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumBadge, { backgroundColor: colors.accent || '#FF5722', borderColor: '#D03B0D' }]}>
                <Text style={[styles.stepNumber, { fontFamily: fonts.headingBold }]}>{index + 1}</Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>{step}</Text>
            </View>
          ))}
        </View>

        {/* Required Tech Stack */}
        <View style={[styles.duoCard, { backgroundColor: colors.surface || '#18181B', borderColor: colors.border || '#27272A' }]}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            REQUIRED TECH STACK
          </Text>
          <View style={styles.skillsWrapper}>
            {skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Ionicons name="sparkles-sharp" size={12} color="#FFD700" />
                <Text style={[styles.skillText, { fontFamily: fonts.headingBold }]}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Stats Grid */}
        <View style={styles.metaGrid}>
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>DIFFICULTY</Text>
            <Text style={[styles.gridValue, { color: '#FFD700', fontFamily: fonts.headingBold }]}>
              ⚡ {formatDifficulty(task.difficulty)}
            </Text>
          </View>
          <View style={styles.gridCard}>
            <Text style={styles.gridLabel}>EST. TIME</Text>
            <Text style={[styles.gridValue, { color: '#1CB0F6', fontFamily: fonts.headingBold }]}>
              ⏳ {task.estimatedHours || '—'}
            </Text>
          </View>
        </View>

        {/* Action Card */}
        <View style={[styles.actionCard, { backgroundColor: colors.surface || '#18181B', borderColor: colors.border || '#27272A' }]}>
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
                style={[styles.duoSubmitBtn, animatedButtonStyle]}
                onPress={handleOpenModal}
                onPressIn={() => (buttonScale.value = withSpring(0.96))}
                onPressOut={() => (buttonScale.value = withSpring(1))}
              >
                <Ionicons name="cloud-upload-sharp" size={20} color="#FFFFFF" />
                <Text style={[styles.submitTriggerText, { fontFamily: fonts.headingBold }]}>
                  SUBMIT SOLUTION
                </Text>
              </AnimatedPressable>
            </>
          ) : (
            <View style={styles.submittedBox}>
              <View style={styles.submittedIconBox}>
                <Ionicons name="checkmark-done-sharp" size={26} color="#FFFFFF" />
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
    borderBottomWidth: 2,
  },
  backButton: {
    width: 38,
    height: 38,
    borderRadius: 12,
    borderWidth: 2,
    borderBottomWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: { fontSize: 16, letterSpacing: 0.8 },
  scrollContent: { padding: 20 },

  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  idBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10, borderWidth: 2, borderBottomWidth: 3 },
  idText: { fontSize: 11, fontWeight: '800' },

  duoStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 3,
    gap: 6,
  },
  duoStatusText: { fontSize: 11, letterSpacing: 0.5 },

  title: { fontSize: 22, lineHeight: 28, marginBottom: 16, letterSpacing: -0.3 },

  previewCard: {
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 5,
    overflow: 'hidden',
    marginBottom: 16,
    height: 180,
  },
  mockupImage: { width: '100%', height: '100%' },

  duoCard: {
    padding: 16,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 5,
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
    borderWidth: 1,
    borderBottomWidth: 3,
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
    backgroundColor: '#1CB0F615',
    borderColor: '#1CB0F6',
    borderWidth: 2,
    borderBottomWidth: 4,
    gap: 6,
  },
  skillText: { fontSize: 12, color: '#1CB0F6' },

  metaGrid: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  gridCard: {
    flex: 1,
    padding: 14,
    borderRadius: 18,
    backgroundColor: '#18181B',
    borderColor: '#27272A',
    borderWidth: 2,
    borderBottomWidth: 5,
    gap: 4,
  },
  gridLabel: { fontSize: 10, fontWeight: '800', color: '#A1A1AA', letterSpacing: 0.5 },
  gridValue: { fontSize: 15 },

  actionCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 2,
    borderBottomWidth: 5,
    gap: 14,
  },
  actionCardTitle: { fontSize: 14, letterSpacing: 0.5 },
  actionCardDesc: { fontSize: 12, lineHeight: 18 },

  duoSubmitBtn: {
    height: 50,
    borderRadius: 16,
    backgroundColor: '#58CC02',
    borderColor: '#46A302',
    borderWidth: 2,
    borderBottomWidth: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitTriggerText: { color: '#FFFFFF', fontSize: 14, letterSpacing: 0.5 },

  submittedBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  submittedIconBox: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: '#58CC02',
    alignItems: 'center',
    justifyContent: 'center',
  },
  submittedTitle: { fontSize: 14, letterSpacing: 0.5 },
  submittedSub: { fontSize: 12, marginTop: 2 },
});