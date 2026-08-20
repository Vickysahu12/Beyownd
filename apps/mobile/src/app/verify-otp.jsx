import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import AuthInput from "@/components/ui/auth/AnimatedInput";
import PrimaryButton from "@/components/ui/auth/PrimaryButton";
import { fonts, colors } from "@/constants/theme";

import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const login = useAuthStore((state) => state.login);

  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    if (!otp.trim() || otp.trim().length !== 6) {
      setError("Enter the 6-digit code sent to your email");
      return;
    }
    setError("");
    setLoading(true);

    try {
      const { data } = await apiClient.post("/auth/verify-otp", {
        email,
        otp: otp.trim(),
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
        err.response?.data?.message || "Invalid or expired code. Try again.";
      setError(message);
      console.error("OTP verification failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      image={require("@/assets/image/onboarding.png")}
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${email || "your email"}`}
    >
      <AuthInput
        icon="keypad-outline"
        label="6-digit code"
        value={otp}
        onChangeText={setOtp}
        keyboardType="number-pad"
        maxLength={6}
        error={error}
      />

      <PrimaryButton
        label={loading ? "Verifying..." : "Verify"}
        onPress={handleVerify}
        disabled={loading}
      />

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>Didn't get the code? </Text>
        <Text style={styles.footerLink} onPress={() => router.replace("/signup")}>
          Try signing up again
        </Text>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  footerRow: { flexDirection: "row", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: 16 },
  footerText: { fontFamily: fonts.body, fontSize: 13, color: colors.textMuted },
  footerLink: { fontFamily: fonts.bodyMedium, fontSize: 13, color: colors.accent },
});