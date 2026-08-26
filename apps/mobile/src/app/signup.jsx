import React, { useState } from "react";
import { Text, View, StyleSheet, Keyboard } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import AuthInput from "@/components/ui/auth/AnimatedInput";
import PrimaryButton from "@/components/ui/auth/PrimaryButton";
import GoogleButton from "@/components/ui/auth/GoogleButton";
import { fonts, colors } from "@/constants/theme";

import { apiClient } from "@/api/client";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    Keyboard.dismiss();

    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Name is required";
    if (!email.trim()) nextErrors.email = "Email or phone is required";
    if (!password.trim() || password.length < 6)
      nextErrors.password = "Min 6 characters";

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      return;
    }

    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const startTime = Date.now();

    try {
      await apiClient.post("/auth/signup", {
        name: name.trim(),
        email: email.trim(),
        password,
        college: college.trim() || undefined,
        referralCode: referralCode.trim() || undefined,
      });

      const elapsed = Date.now() - startTime;
      if (elapsed < 600) {
        await new Promise((resolve) => setTimeout(resolve, 600 - elapsed));
      }

      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      router.push({
        pathname: "/verify-otp",
        params: { email: email.trim() },
      });
    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Signup failed. Please try again.";

      if (message.toLowerCase().includes("email")) {
        setErrors({ email: message });
      } else {
        setErrors({ password: message });
      }
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error("Signup failed:", err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthScreenLayout
      image={require("@/assets/image/onboarding.png")}
      title="Create account"
      subtitle="Start your journey with Beyownd"
      footer={
        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <Text
            style={styles.footerLink}
            onPress={() => !loading && router.replace("/login")}
          >
            Log in
          </Text>
        </View>
      }
    >
      <AuthInput
        icon="person-outline"
        label="Full name"
        value={name}
        onChangeText={(text) => {
          setName(text);
          if (errors.name) setErrors((prev) => ({ ...prev, name: null }));
        }}
        error={errors.name}
        editable={!loading}
      />

      <AuthInput
        icon="mail-outline"
        label="Email or phone number"
        value={email}
        onChangeText={(text) => {
          setEmail(text);
          if (errors.email) setErrors((prev) => ({ ...prev, email: null }));
        }}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
        editable={!loading}
      />

      <AuthInput
        icon="lock-closed-outline"
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={(text) => {
          setPassword(text);
          if (errors.password) setErrors((prev) => ({ ...prev, password: null }));
        }}
        autoCapitalize="none"
        error={errors.password}
        editable={!loading}
      />

      <AuthInput
        icon="school-outline"
        label="College (optional)"
        value={college}
        onChangeText={setCollege}
        editable={!loading}
      />

      <AuthInput
        icon="gift-outline"
        label="Referral Code (optional)"
        value={referralCode}
        onChangeText={setReferralCode}
        autoCapitalize="characters"
        editable={!loading}
      />

      <PrimaryButton
        label={loading ? "Creating account..." : "Create account"}
        onPress={handleSignup}
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