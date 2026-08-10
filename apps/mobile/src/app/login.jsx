import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import AuthInput from "@/components/ui/auth/AnimatedInput";
import AuthButton from "@/components/ui/auth/PrimaryButton";
import GoogleButton from "@/components/ui/auth/GoogleButton";
import { colors, fonts } from "@/constants/theme";

// Auth Store
import { useAuthStore } from "@/store/useAuthStore";

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
      // TODO: Yaha actual API call karna hai. Abhi ke liye mock data.
      const mockUserData = {
        id: "usr_12345",
        email: emailOrPhone,
        name: "Aarav",
      };
      const mockToken = "mock_jwt_token_abc123";

      // Ye call zaroori hai — isse hi isAuthenticated true hota hai
      // aur AsyncStorage mein persist hota hai, taaki agli baar app
      // khulne pe SplashIntro seedha home pe bhej sake.
      login(mockUserData, mockToken);

      router.replace("/Profile-setup");
    } catch (err) {
      console.error("Login failed:", err);
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
            onPress={() => router.replace("/signup")}
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

      <Pressable
        style={styles.forgotWrap}
        hitSlop={8}
        onPress={() => router.push("/forgot-password")}
      >
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
  forgotWrap: {
    alignItems: "flex-end",
    marginBottom: 12,
  },
  forgotText: {
    fontFamily: fonts.bodyMedium,
    fontSize: 12,
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