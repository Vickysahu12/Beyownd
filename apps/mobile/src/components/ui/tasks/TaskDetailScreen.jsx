import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { useHomeTheme } from '@/context/ThemeContext';
import { TASKS } from '@/constants/tasks-data';
import TaskSubmissionModal from '@/components/modals/TaskSubmissionModal'; // 👈 Isolated Modal Component

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function TaskDetailScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { id } = useLocalSearchParams();
  const { colors, fonts, isDark } = useHomeTheme();

  const task = TASKS.find((t) => t.id === id) || TASKS[0];

  const steps = task.challengeSteps || [
    'Define user journey & screen wireframes.',
    'Build UI components with tactile haptics.',
    'Test across devices for fluid animations.',
  ];
  const skills = task.skills || ['React Native', 'UI UX', 'Mobile Tech'];

  // Screen Level States
  const [modalVisible, setModalVisible] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(task.status === 'completed');
  const [submittedData, setSubmittedData] = useState(null);

  const buttonScale = useSharedValue(1);
  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: buttonScale.value }],
  }));

  const handleOpenModal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setModalVisible(true);
  };

  const handleSubmissionSuccess = (data) => {
    setIsSubmitted(true);
    setSubmittedData(data);
  };

  const handleResetDemo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setIsSubmitted(false);
    setSubmittedData(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.bg }]} edges={['top', 'left', 'right']}>
      <StatusBar barStyle={isDark ? 'light-content' : 'dark-content'} />

      <View style={[styles.glowBar, { backgroundColor: colors.accent }]} />

      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <Pressable
          style={styles.backButton}
          onPress={() => {
            Haptics.selectionAsync();
            router.back();
          }}
        >
          <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
        </Pressable>
        <Text style={[styles.headerTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          TASK DETAIL ⚡
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Main Content Area */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 100 },
        ]}
      >
        {/* Meta Row */}
        <View style={styles.metaRow}>
          <View style={[styles.idBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.idText, { color: colors.textMuted }]}>{task.id}</Text>
          </View>

          <View
            style={[
              styles.statusBadge,
              { backgroundColor: isSubmitted ? 'rgba(76, 175, 80, 0.15)' : colors.accentSoft },
            ]}
          >
            <View style={[styles.statusDot, { backgroundColor: isSubmitted ? '#4CAF50' : colors.accent }]} />
            <Text
              style={[
                styles.statusText,
                { color: isSubmitted ? '#4CAF50' : colors.accent, fontFamily: fonts.bodyMedium },
              ]}
            >
              {isSubmitted ? 'Under Review' : task.status === 'in_progress' ? 'In Progress' : 'Open'}
            </Text>
          </View>
        </View>

        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
          {task.title}
        </Text>

        <View style={[styles.previewCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          <Image
            source={{
              uri:
                task.image ||
                'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
            }}
            style={styles.mockupImage}
            resizeMode="cover"
          />
        </View>

        {/* Description */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
            Project Description
          </Text>
          <Text style={[styles.bodyText, { color: colors.textMuted, fontFamily: fonts.body }]}>
            {task.description}
          </Text>
        </View>

        {/* Deliverables */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
            Deliverables Required
          </Text>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepRow}>
              <View style={[styles.stepNumBadge, { backgroundColor: colors.surface, borderColor: colors.border }]}>
                <Text style={[styles.stepNumber, { color: colors.accent, fontFamily: fonts.bodyMedium }]}>
                  {index + 1}
                </Text>
              </View>
              <Text style={[styles.stepText, { color: colors.textMuted, fontFamily: fonts.body }]}>
                {step}
              </Text>
            </View>
          ))}
        </View>

        {/* Skills */}
        <View style={styles.section}>
          <Text style={[styles.sectionHeading, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
            Required Tech Stack
          </Text>
          <View style={styles.skillsWrapper}>
            {skills.map((skill, index) => (
              <View
                key={index}
                style={[
                  styles.skillBadge,
                  { backgroundColor: colors.surface, borderColor: colors.border },
                ]}
              >
                <Ionicons name="sparkles" size={12} color={colors.accent} />
                <Text style={[styles.skillText, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>
                  {skill}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Meta Grid */}
        <View style={styles.metaGrid}>
          <View style={[styles.gridCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>DIFFICULTY</Text>
            <Text style={[styles.gridValue, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
              ⚡ {task.difficulty}
            </Text>
          </View>

          <View style={[styles.gridCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
            <Text style={[styles.gridLabel, { color: colors.textMuted }]}>EST. TIME</Text>
            <Text style={[styles.gridValue, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
              ⏳ {task.hours}
            </Text>
          </View>
        </View>

        {/* Submit Action Card */}
        <View style={[styles.actionCard, { backgroundColor: colors.surface, borderColor: colors.border }]}>
          {!isSubmitted ? (
            <>
              <View>
                <Text style={[styles.actionCardTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                  Ready to submit?
                </Text>
                <Text style={[styles.actionCardDesc, { color: colors.textMuted }]}>
                  Attach your code repository or documentation link for review.
                </Text>
              </View>

              <AnimatedPressable
                style={[styles.submitTriggerBtn, { backgroundColor: colors.accent }, animatedButtonStyle]}
                onPress={handleOpenModal}
                onPressIn={() => (buttonScale.value = withSpring(0.96))}
                onPressOut={() => (buttonScale.value = withSpring(1))}
              >
                <Ionicons name="cloud-upload" size={18} color="#FFFFFF" />
                <Text style={[styles.submitTriggerText, { fontFamily: fonts.headingBold }]}>
                  Submit Solution
                </Text>
              </AnimatedPressable>
            </>
          ) : (
            <View style={{ gap: 10 }}>
              <View style={styles.submittedBox}>
                <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.submittedTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                    Submission Under Review
                  </Text>
                  <Text style={[styles.submittedSub, { color: colors.textMuted }]}>
                    Link: {submittedData?.url || 'https://github.com/...'}
                  </Text>
                </View>
              </View>

              <Pressable onPress={handleResetDemo} style={styles.resetBtn}>
                <Ionicons name="refresh-outline" size={14} color={colors.textMuted} />
                <Text style={[styles.resetText, { color: colors.textMuted }]}>Reset (Demo Test)</Text>
              </Pressable>
            </View>
          )}
        </View>
      </ScrollView>

      {/* --- ISOLATED SUBMISSION MODAL COMPONENT --- */}
      <TaskSubmissionModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSubmitSuccess={handleSubmissionSuccess}
        colors={colors}
        fonts={fonts}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  glowBar: { height: 3, width: '100%' },
  header: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    borderBottomWidth: 1,
  },
  backButton: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center' },
  headerTitle: { fontSize: 16, letterSpacing: 0.5 },
  scrollContent: { padding: 20 },
  metaRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 },
  idBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1 },
  idText: { fontSize: 12, fontWeight: '700' },
  statusBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 5, borderRadius: 20, gap: 6 },
  statusText: { fontSize: 12 },
  statusDot: { width: 8, height: 8, borderRadius: 4 },
  title: { fontSize: 22, lineHeight: 28, marginBottom: 20 },
  previewCard: { borderRadius: 20, borderWidth: 1, overflow: 'hidden', marginBottom: 24, height: 190 },
  mockupImage: { width: '100%', height: '100%' },
  section: { marginBottom: 22 },
  sectionHeading: { fontSize: 16, marginBottom: 10 },
  bodyText: { fontSize: 14, lineHeight: 22 },
  stepRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10, gap: 12 },
  stepNumBadge: { width: 26, height: 26, borderRadius: 8, borderWidth: 1, alignItems: 'center', justifyContent: 'center' },
  stepNumber: { fontSize: 13 },
  stepText: { fontSize: 14, flex: 1, lineHeight: 20 },
  skillsWrapper: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillBadge: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 14, borderWidth: 1, gap: 6 },
  skillText: { fontSize: 12 },
  metaGrid: { flexDirection: 'row', gap: 12, marginTop: 6, marginBottom: 24 },
  gridCard: { flex: 1, padding: 14, borderRadius: 16, borderWidth: 1 },
  gridLabel: { fontSize: 10, marginBottom: 4, letterSpacing: 0.5 },
  gridValue: { fontSize: 14 },

  actionCard: {
    padding: 18,
    borderRadius: 20,
    borderWidth: 1,
    gap: 14,
  },
  actionCardTitle: { fontSize: 16, marginBottom: 4 },
  actionCardDesc: { fontSize: 12, lineHeight: 18 },
  submitTriggerBtn: {
    height: 48,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitTriggerText: { color: '#FFFFFF', fontSize: 14 },
  submittedBox: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  submittedTitle: { fontSize: 15 },
  submittedSub: { fontSize: 12, marginTop: 2 },
  resetBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, alignSelf: 'flex-start', marginTop: 4 },
  resetText: { fontSize: 11, textDecorationLine: 'underline' },
});