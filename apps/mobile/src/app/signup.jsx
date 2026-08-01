import React, { useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import AuthInput from '@/components/ui/AuthInput';
import AuthButton from '@/components/ui/AuthButton';
import AuthBadge from '@/components/ui/AuthBadge';
import { colors, fonts } from '@/constants/theme';

export default function Signup() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');
  const [college, setCollege] = useState('');

  const handleCreateAccount = () => {
    router.replace('/(tabs)/home');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <Pressable onPress={() => router.back()} hitSlop={12} style={styles.backButton}>
            <Ionicons name="arrow-back" size={22} color={colors.textPrimary} />
          </Pressable>

          <View style={styles.centerBlock}>
            <AuthBadge icon="rocket-outline" />

            <Text style={styles.title}>Create account</Text>
            <Text style={styles.subtitle}>Start your journey with Beyownd</Text>

            <View style={styles.form}>
              <AuthInput
                icon="person-outline"
                placeholder="Full name"
                value={name}
                onChangeText={setName}
              />
              <AuthInput
                icon="mail-outline"
                placeholder="Email or phone number"
                value={emailOrPhone}
                onChangeText={setEmailOrPhone}
                keyboardType="email-address"
                autoCapitalize="none"
              />
              <AuthInput
                icon="lock-closed-outline"
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
              />
              <AuthInput
                icon="school-outline"
                placeholder="College (optional)"
                value={college}
                onChangeText={setCollege}
              />

              <AuthButton label="Create account" onPress={handleCreateAccount} />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Already have an account? </Text>
                <Pressable onPress={() => router.replace('/login')}>
                  <Text style={styles.footerLink}>Log in</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.bg },
  scrollContent: { paddingHorizontal: 26, paddingTop: 8, paddingBottom: 32, flexGrow: 1 },
  backButton: { marginBottom: 8 },
  centerBlock: { flex: 1, justifyContent: 'center' },
  title: { fontFamily: fonts.display, fontSize: 24, color: colors.textPrimary },
  subtitle: {
    fontFamily: fonts.body,
    fontSize: 14,
    color: colors.textMuted,
    marginTop: 4,
    marginBottom: 28,
  },
  form: {},
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  footerText: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  footerLink: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
});