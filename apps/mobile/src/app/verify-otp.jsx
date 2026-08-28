import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  View,
  StyleSheet,
  TextInput,
  Dimensions,
  Animated,
  Pressable,
  Platform,
  Keyboard,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";

import AuthScreenLayout from "@/components/ui/auth/AuthScreenLayout";
import { fonts, colors } from "@/constants/theme";

import { useAuthStore } from "@/store/useAuthStore";
import { apiClient } from "@/api/client";

const { width } = Dimensions.get("window");

const PRIMARY_COLOR = colors.accent;
const TEXT_MUTED = colors.textMuted;

export default function VerifyOtp() {
  const router = useRouter();
  const { email } = useLocalSearchParams();
  const login = useAuthStore((state) => state.login);

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const inputRefs = useRef([]);
  const buttonPressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const timer = setTimeout(() => {
      inputRefs.current[0]?.focus();
    }, 500);
    return () => clearTimeout(timer);
  }, []);

  const handleTextChange = (text, index) => {
    if (loading) return;
    setError("");

    if (text.length > 1) {
      const pasteOtp = text.slice(0, 6).split("");
      const newOtp = [...otp];
      pasteOtp.forEach((char, i) => {
        newOtp[i] = char;
      });
      setOtp(newOtp);
      inputRefs.current[5]?.focus();
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (loading) return;
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const getFullOtp = () => otp.join("");

  const handleVerify = async () => {
    Keyboard.dismiss();

    const combinedOtp = getFullOtp();

    if (combinedOtp.length !== 6) {
      setError("Please enter the 6-digit code");
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      return;
    }

    setError("");
    setLoading(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    const startTime = Date.now();

    try {
      const { data } = await apiClient.post("/auth/verify-otp", {
        email,
        otp: combinedOtp,
      });

      const { user, accessToken, refreshToken } = data.data;

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
        err.response?.data?.message || "Invalid or expired code. Try again.";
      setError(message);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      console.error(
        "OTP verification failed:",
        err.response?.data || err.message
      );
    } finally {
      setLoading(false);
    }
  };

  const onPressIn = () => {
    Animated.spring(buttonPressAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const onPressOut = () => {
    Animated.spring(buttonPressAnim, {
      toValue: 0,
      useNativeDriver: true,
      friction: 5,
    }).start();
  };

  const buttonTranslate = buttonPressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 4],
  });

  return (
    <AuthScreenLayout
      image={require("@/assets/image/onboarding.png")}
      title="Verify your email"
      subtitle={`Enter the 6-digit code sent to ${email || "your email"}`}
      compact
    >
      <View style={styles.contentContainer}>
        <View style={styles.otpCard}>
          <View style={styles.otpLabelGroup}>
            <Ionicons
              name="mail-open-outline"
              size={16}
              color={error ? colors.danger : colors.accent}
            />
            <Text
              style={[styles.otpLabel, error ? { color: colors.danger } : {}]}
            >
              Verification Code
            </Text>
          </View>

          <View style={styles.otpCellsContainer}>
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref) => (inputRefs.current[index] = ref)}
                style={[
                  styles.otpCell,
                  digit ? styles.otpCellFilled : {},
                  error ? styles.otpCellError : {},
                  loading ? styles.otpCellDisabled : {},
                  index === 2 ? { marginRight: 18 } : { marginRight: 8 },
                ]}
                value={digit}
                onChangeText={(text) => handleTextChange(text, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={2}
                selectTextOnFocus
                cursorColor={PRIMARY_COLOR}
                contextMenuHidden
                editable={!loading}
              />
            ))}
          </View>

          {error ? (
            <View style={styles.errorContainer}>
              <Ionicons name="alert-circle" size={14} color={colors.danger} />
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
        </View>

        <View style={{ height: 26 }} />

        <View style={styles.buttonShadowContainer}>
          <Animated.View
            style={{ transform: [{ translateY: buttonTranslate }] }}
          >
            <Pressable
              onPressIn={onPressIn}
              onPressOut={onPressOut}
              onPress={handleVerify}
              disabled={loading}
              style={[styles.button3D, loading ? styles.buttonDisabled : {}]}
            >
              <Text style={styles.buttonText}>
                {loading ? "VERIFYING..." : "VERIFY"}
              </Text>
              {!loading && (
                <Ionicons
                  name="checkmark-circle"
                  size={18}
                  color="#fff"
                  style={{ marginLeft: 8, opacity: 0.9 }}
                />
              )}
            </Pressable>
          </Animated.View>
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.footerText}>Didn't get the code? </Text>
          <Text
            style={styles.footerLink}
            onPress={() => !loading && router.replace("/signup")}
          >
            Try signing up again
          </Text>
        </View>
      </View>
    </AuthScreenLayout>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    paddingTop: 4,
  },
  otpCard: {
    backgroundColor: colors.card,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 22,
    paddingHorizontal: 18,
    shadowColor: colors.shadow,
    shadowOpacity: 0.6,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  otpLabelGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    justifyContent: "center",
  },
  otpLabel: {
    fontFamily: fonts.bodyMedium,
    fontSize: 13,
    color: colors.textPrimary,
    letterSpacing: 0.2,
  },
  otpCellsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  otpCell: {
    width: (width - 148) / 6,
    height: 58,
    borderRadius: 16,
    backgroundColor: colors.bg,
    borderWidth: 1.5,
    borderColor: colors.border,
    fontFamily: fonts.headingBold,
    fontSize: 22,
    color: colors.textPrimary,
    textAlign: "center",
    paddingTop: Platform.OS === "ios" ? 4 : 0,
  },
  otpCellFilled: {
    backgroundColor: colors.accentSoft,
    borderColor: PRIMARY_COLOR,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.18,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  otpCellError: {
    borderColor: colors.danger,
  },
  otpCellDisabled: {
    opacity: 0.5,
  },
  errorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    marginTop: 14,
  },
  errorText: {
    fontFamily: fonts.body,
    fontSize: 12,
    color: colors.danger,
  },
  buttonShadowContainer: {
    width: "100%",
    height: 58,
    backgroundColor: colors.taskDarkAlt,
    borderRadius: 18,
  },
  button3D: {
    height: 54,
    borderRadius: 18,
    backgroundColor: PRIMARY_COLOR,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },
  buttonDisabled: {
    backgroundColor: colors.border,
    opacity: 0.7,
    borderWidth: 0,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: fonts.headingBold,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    marginTop: 22,
  },
  footerText: {
    fontFamily: fonts.body,
    fontSize: 13,
    color: TEXT_MUTED,
  },
  footerLink: {
    fontFamily: fonts.headingSemi,
    fontSize: 13,
    color: PRIMARY_COLOR,
    fontWeight: "700",
  },
});