import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

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
    const nextErrors = {};
    if (!emailOrPhone.trim()) nextErrors.emailOrPhone = "This field is required";
    if (!password.trim()) nextErrors.password = "Password is required";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) return;

    setLoading(true);

    try {
      const { data } = await apiClient.post("/auth/login", {
        email: emailOrPhone,
        password,
      });

      const { user, accessToken, refreshToken } = data.data;

      login(user, accessToken, refreshToken);

      if (!user.hasCompletedProfileSetup) {
        router.replace("/Profile-setup");
      } else if (!user.hasCompletedWorkspaceSetup) {
        router.replace("/WorkspaceSetupScreen");
      } else {
        router.replace("/(tabs)/home");
      }
    } catch (err) {
      const message =
        err.response?.data?.error?.message ||
        "Login failed. Please check your credentials.";
      setErrors({ password: message });
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
          <Text style={styles.footerLink} onPress={() => router.replace("/signup")}>
            Create one
          </Text>
        </View>
      }
    >
      <AuthInput
        icon="mail-outline"
        label="Email or phone number"
        value={emailOrPhone}
        onChangeText={setEmailOrPhone}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.emailOrPhone}
      />

      <AuthInput
        icon="lock-closed-outline"
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
        error={errors.password}
      />

      <Pressable style={styles.forgotWrap} hitSlop={8} onPress={() => router.push("/forgot-password")}>
        <Text style={styles.forgotText}>Forgot password?</Text>
      </Pressable>

      <AuthButton
        label={loading ? "Logging in..." : "Log in"}
        onPress={handleLogin}
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
  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap" },
  footerText: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  footerLink: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
  forgotWrap: { alignItems: "flex-end", marginBottom: 12 },
  forgotText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.accent },
  dividerRow: { flexDirection: "row", alignItems: "center", marginVertical: 22, gap: 12 },
  dividerLine: { flex: 1, height: 1, backgroundColor: colors.divider },
  dividerText: { fontFamily: fonts.bodyMedium, fontSize: 12, color: colors.textMuted },
});