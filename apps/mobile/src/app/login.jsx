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

export default function Login() {
  const router = useRouter();
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
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
            <AuthBadge icon="compass-outline" />

            <Text style={styles.title}>Welcome back!</Text>
            <Text style={styles.subtitle}>Let's continue your journey</Text>

            <View style={styles.form}>
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

              <Pressable style={styles.forgotWrap}>
                <Text style={styles.forgotText}>Forgot password?</Text>
              </Pressable>

              <AuthButton label="Log in" onPress={handleLogin} />

              <View style={styles.footerRow}>
                <Text style={styles.footerText}>Don't have an account? </Text>
                <Pressable onPress={() => router.replace('/signup')}>
                  <Text style={styles.footerLink}>Create one</Text>
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
  forgotWrap: { alignItems: 'flex-end', marginBottom: 4 },
  forgotText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.accent },
  footerRow: { flexDirection: 'row', justifyContent: 'center', marginTop: 18 },
  footerText: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  footerLink: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
});