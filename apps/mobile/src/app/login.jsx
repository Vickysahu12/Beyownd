import React, { useState } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import AuthInput from "@/components/ui/auth/AnimatedInput";
import AuthButton from "@/components/ui/auth/PrimaryButton";
import GoogleButton from "@/components/ui/auth/GoogleButton";
import { colors, fonts } from "@/constants/theme";

import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";

export default function Login() {
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    Keyboard.dismiss();

    const nextErrors = {};
    if (!emailOrPhone.trim()) nextErrors.emailOrPhone = "This field is required";
    if (!password.trim()) nextErrors.password = "Password is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const startTime = Date.now();

    try {
      const { data } = await apiClient.post("/auth/login", {
        email: emailOrPhone,
        password,
      });

      const { user, accessToken, refreshToken } = data.data;

      // Minimum 600ms loading feel — bahut fast response pe bhi spinner
      // ka flash-jaisa dikhna avoid karta hai, thoda "processed" feel deta hai
      const elapsed = Date.now() - startTime;
      if (elapsed < 600) {
        await new Promise((resolve) => setTimeout(resolve, 600 - elapsed));
      }

      login(user, accessToken, refreshToken);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      if (!user.hasCompletedProfileSetup) {
        router.replace("/Profile-setup");
      } else if (!user.hasCompletedWorkspaceSetup) {
        router.replace("/WorkspaceSetupScreen");
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Login failed. Please check your credentials.";
      setErrors({ password: message });
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Login failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      image={require("@/assets/image/onboarding.png")}
      title="Welcome back!"
      subtitle="Let's continue your journey"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <Text
            style={styles.footerLink}
            onPress={() => !loading && router.replace("/signup")}
          >
            Create one
          </Text>
        </View>
      }
    >
      <AuthInput
        icon="mail-outline"
        label="Email or phone number"
        value={emailOrPhone}
        onChangeText={(text) => {
          setEmailOrPhone(text);
          if (errors.emailOrPhone) setErrors((prev) => ({ ...prev, emailOrPhone: null }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.emailOrPhone}
        editable={!loading}
      />

      <AuthInput
        icon="lock-closed-outline"
        label="Password"
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
        }}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
        editable={!loading}
      />

      <AuthButton
        label={loading ? "Logging in..." : "Log in"}
        onPress={handleLogin}
        loading={loading}
        disabled={loading}
      />

      <View style={styles.dividerRow}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>OR</Text>
        <View style={styles.dividerLine} />
      </View>

      <GoogleButton onPress={() => {}} />
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: colors.textMuted,
  },
  footerLink: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.accent,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 22,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: colors.divider,
  },
  dividerText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
    color: colors.textMuted,
  },
});