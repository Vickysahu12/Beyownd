import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  Pressable,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { apiClient } from '@/api/client';

export default function TaskSubmissionModal({
  visible,
  onClose,
  onSubmitSuccess,
  taskId,
  colors,
  fonts,
}) {
  const [submissionUrl, setSubmissionUrl] = useState('');
  const [notes, setNotes] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [step, setStep] = useState('form'); // 'form' | 'submitting' | 'success'

  const shakeOffset = useSharedValue(0);
  const successScale = useSharedValue(0.3);

  const animatedShakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: shakeOffset.value }],
  }));

  const animatedSuccessStyle = useAnimatedStyle(() => ({
    transform: [{ scale: successScale.value }],
  }));

  const triggerErrorShake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    shakeOffset.value = withSequence(
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(-10, { duration: 50 }),
      withTiming(10, { duration: 50 }),
      withTiming(0, { duration: 50 })
    );
  };

  const handleSubmit = async () => {
    if (!submissionUrl.trim()) {
      setErrorMessage('Please enter your GitHub Repo or Google Doc URL.');
      triggerErrorShake();
      return;
    }

    if (!submissionUrl.toLowerCase().startsWith('http')) {
      setErrorMessage('URL must start with http:// or https://');
      triggerErrorShake();
      return;
    }

    setErrorMessage('');
    setStep('submitting');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    try {
      await apiClient.post(`/tasks/${taskId}/submit`, {
        submissionType: 'link',
        submissionUrl: submissionUrl.trim(),
        notes: notes.trim() || undefined,
      });

      setStep('success');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      successScale.value = withSpring(1, { damping: 12 });

      onSubmitSuccess({ url: submissionUrl, notes });
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        'Submission failed. Please check your connection and try again.';
      console.error('Task submission failed:', err.response?.data || err.message);
      setErrorMessage(message);
      setStep('form');
      triggerErrorShake();
    }
  };

  const handleCloseModal = () => {
    setStep('form');
    setSubmissionUrl('');
    setNotes('');
    setErrorMessage('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={handleCloseModal}>
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ width: '100%' }}
          >
            <View style={[styles.modalContent, { backgroundColor: colors.surface, borderColor: colors.border }]}>
              <View style={[styles.modalHandle, { backgroundColor: colors.border }]} />

              {step === 'form' && (
                <>
                  <View style={styles.modalHeader}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="paper-plane" size={20} color={colors.accent} />
                      <Text style={[styles.modalTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                        Submit Task Solution
                      </Text>
                    </View>
                    <Pressable onPress={handleCloseModal}>
                      <Ionicons name="close-circle" size={24} color={colors.textMuted} />
                    </Pressable>
                  </View>

                  {errorMessage ? (
                    <Animated.View style={[styles.errorBanner, animatedShakeStyle]}>
                      <Ionicons name="alert-circle" size={18} color="#FF4D4D" />
                      <Text style={[styles.errorBannerText, { fontFamily: fonts.bodyMedium }]}>
                        {errorMessage}
                      </Text>
                    </Animated.View>
                  ) : null}

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>
                      Project Link <Text style={{ color: '#FF4D4D' }}>*</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.modalInput,
                        {
                          backgroundColor: colors.bg,
                          borderColor: errorMessage ? '#FF4D4D' : colors.border,
                          color: colors.textPrimary,
                        },
                      ]}
                      placeholder="https://github.com/username/repo or Docs URL"
                      placeholderTextColor={colors.textMuted}
                      value={submissionUrl}
                      onChangeText={(text) => {
                        setSubmissionUrl(text);
                        if (errorMessage) setErrorMessage('');
                      }}
                      autoCapitalize="none"
                      keyboardType="url"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={[styles.inputLabel, { color: colors.textPrimary, fontFamily: fonts.bodyMedium }]}>
                      Notes / Remarks <Text style={{ color: colors.textMuted }}>(Optional)</Text>
                    </Text>
                    <TextInput
                      style={[
                        styles.modalInput,
                        styles.textArea,
                        { backgroundColor: colors.bg, borderColor: colors.border, color: colors.textPrimary },
                      ]}
                      placeholder="Any comments, features, or notes for the evaluation team..."
                      placeholderTextColor={colors.textMuted}
                      value={notes}
                      onChangeText={setNotes}
                      multiline
                      numberOfLines={3}
                      textAlignVertical="top"
                    />
                  </View>

                  <Pressable
                    style={[styles.modalSubmitBtn, { backgroundColor: colors.accent }]}
                    onPress={handleSubmit}
                  >
                    <Ionicons name="checkmark-done" size={18} color="#FFFFFF" />
                    <Text style={[styles.modalSubmitBtnText, { fontFamily: fonts.headingBold }]}>
                      Confirm & Submit
                    </Text>
                  </Pressable>
                </>
              )}

              {step === 'submitting' && (
                <View style={styles.centerContainer}>
                  <ActivityIndicator size="large" color={colors.accent} />
                  <Text style={[styles.loadingTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
                    Submitting your solution...
                  </Text>
                  <Text style={[styles.loadingSub, { color: colors.textMuted }]}>
                    Securing your entry and notifying evaluation team.
                  </Text>
                </View>
              )}

              {step === 'success' && (
                <View style={styles.centerContainer}>
                  <Animated.View style={[styles.successBadge, animatedSuccessStyle, { backgroundColor: colors.accentSoft }]}>
                    <Ionicons name="trophy" size={48} color={colors.accent} />
                  </Animated.View>
                  <Text style={[styles.successTitle, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
                    Hurray! Task Submitted 🎉
                  </Text>
                  <Text style={[styles.successDesc, { color: colors.textMuted, fontFamily: fonts.body }]}>
                    Awesome work! Our engineering team will review your link. You'll receive updates shortly on your profile.
                  </Text>
                  <Pressable
                    style={[styles.modalSubmitBtn, { backgroundColor: colors.accent, width: '100%' }]}
                    onPress={handleCloseModal}
                  >
                    <Text style={[styles.modalSubmitBtnText, { fontFamily: fonts.headingBold }]}>
                      Done & Return
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.75)', justifyContent: 'flex-end' },
  modalContent: { borderTopLeftRadius: 28, borderTopRightRadius: 28, borderTopWidth: 1, padding: 24, paddingBottom: 36, gap: 16 },
  modalHandle: { width: 36, height: 4, borderRadius: 2, alignSelf: 'center', marginBottom: 4 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  modalTitle: { fontSize: 16 },
  errorBanner: { flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: 'rgba(255, 77, 77, 0.12)', borderWidth: 1, borderColor: 'rgba(255, 77, 77, 0.4)', paddingHorizontal: 12, paddingVertical: 10, borderRadius: 12 },
  errorBannerText: { color: '#FF4D4D', fontSize: 12, flex: 1 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 13 },
  modalInput: { height: 48, borderRadius: 12, borderWidth: 1, paddingHorizontal: 14, fontSize: 13 },
  textArea: { height: 80, paddingTop: 12 },
  modalSubmitBtn: { height: 50, borderRadius: 14, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 6 },
  modalSubmitBtnText: { color: '#FFFFFF', fontSize: 15 },
  centerContainer: { alignItems: 'center', paddingVertical: 20, gap: 12 },
  loadingTitle: { fontSize: 16, marginTop: 12 },
  loadingSub: { fontSize: 12, textAlign: 'center', paddingHorizontal: 20 },
  successBadge: { width: 88, height: 88, borderRadius: 44, alignItems: 'center', justifyContent: 'center', marginBottom: 8 },
  successTitle: { fontSize: 20, textAlign: 'center' },
  successDesc: { fontSize: 13, textAlign: 'center', lineHeight: 20, paddingHorizontal: 10, marginBottom: 12 },
});