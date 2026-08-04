import React, { useState } from "react";
import { Text, Pressable, View, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import AuthInput from "@/components/ui/auth/AnimatedInput";
import PrimaryButton from "@/components/ui/auth/PrimaryButton";
import GoogleButton from "@/components/ui/auth/GoogleButton";
import { fonts, colors } from "@/constants/theme";

export default function Signup() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [college, setCollege] = useState("");
  const [errors, setErrors] = useState({});

  const handleSignup = () => {
  const nextErrors = {};
  if (!name.trim()) nextErrors.name = "Name is required";
  if (!email.trim()) nextErrors.email = "Email or phone is required";
  if (!password.trim() || password.length < 6)
    nextErrors.password = "Min 6 characters";

  setErrors(nextErrors);
  if (Object.keys(nextErrors).length > 0) return;

  router.replace("/Profile-setup");
};

  return (
    <AuthScreenLayout
      image={require("@/assets/image/onboarding.png")}
      title="Create account"
      subtitle="Start your journey with Beyownd"
      footer={
  <View style={styles.footerRow}>
    <Text style={styles.footerText}>Already have an account? </Text>
    <Text style={styles.footerLink} onPress={() => router.replace("/login")}>
      Log in
    </Text>
  </View>
}
    >
      <AuthInput
        icon="person-outline"
        label="Full name"
        value={name}
        onChangeText={setName}
        error={errors.name}
      />

      <AuthInput
        icon="mail-outline"
        label="Email or phone number"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        error={errors.email}
      />

      <AuthInput
        icon="lock-closed-outline"
        label="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        autoCapitalize="none"
        error={errors.password}
      />

      <AuthInput
        icon="school-outline"
        label="College (optional)"
        value={college}
        onChangeText={setCollege}
      />

      <PrimaryButton label="Create account" onPress={handleSignup} />

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