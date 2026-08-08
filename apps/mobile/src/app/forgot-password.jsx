import React, { useState } from "react";
import { Text, View, StyleSheet, Alert } from "react-native";
import { useRouter } from "expo-router";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import AuthInput from "@/components/ui/auth/AnimatedInput";
import PrimaryButton from "@/components/ui/auth/PrimaryButton";
import { fonts, colors } from "@/constants/theme";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const handleReset = () => {
    if (!email.trim()) {
      setError("Email address is required");
      return;
    }

    Alert.alert(
      "Reset Link Sent",
      "If an account exists with this email, you will receive password reset instructions shortly.",
      [{ text: "Back to Login", onPress: () => router.replace("/login") }]
    );
  };

  return (
    <AuthScreenLayout
      image={require("@/assets/image/onboarding.png")}
      title="Reset Password"
      subtitle="Enter your email to receive reset instructions"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Remembered your password? </Text>
          <Text
            style={styles.footerLink}
            onPress={() => router.replace("/login")}
          >
            Log in
          </Text>
        </View>
      }
    >
      <AuthInput
        icon="mail-outline"
        label="Email address"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          setError("");
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={error}
      />

      <PrimaryButton label="Send Reset Link" onPress={handleReset} />
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
});