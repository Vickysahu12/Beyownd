import React, { useState, useEffect } from "react";
import { View, Text, Pressable, StyleSheet, Share } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import * as Clipboard from "expo-clipboard";
import { useHomeTheme } from "@/context/ThemeContext";
import { apiClient } from "@/api/client";

export default function InviteCard() {
  const { colors, fonts } = useHomeTheme();
  const [referral, setReferral] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    apiClient
      .get("/users/referrals")
      .then(({ data }) => setReferral(data.data))
      .catch((err) => console.error("Referral fetch failed:", err.response?.data || err.message));
  }, []);

  if (!referral) return null;

  const handleCopy = async () => {
    Haptics.selectionAsync();
    await Clipboard.setStringAsync(referral.referralCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    Haptics.selectionAsync();
    try {
      await Share.share({
        message: `Join me on Beyownd — real Reality Tasks, curated notes, and a path to internships. Use my code ${referral.referralCode} when you sign up!`,
      });
    } catch (e) {}
  };

  return (
    <View style={[styles.card, { backgroundColor: colors.surface || "#18181B", borderColor: colors.border || "rgba(255,255,255,0.08)" }]}>
      <View style={styles.headerRow}>
        <Ionicons name="gift" size={18} color={colors.accent || "#FF5722"} />
        <Text style={[styles.title, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
          Invite Friends
        </Text>
      </View>

      <Text style={[styles.subtitle, { color: colors.textMuted, fontFamily: fonts.body }]}>
        Share your code — {referral.referralCount} friend{referral.referralCount !== 1 ? "s" : ""} joined so far
      </Text>

      <View style={styles.row}>
        <Pressable style={[styles.codeBox, { borderColor: colors.border || "rgba(255,255,255,0.1)" }]} onPress={handleCopy}>
          <Text style={[styles.codeText, { color: colors.textPrimary, fontFamily: fonts.headingBold }]}>
            {referral.referralCode}
          </Text>
          <Ionicons name={copied ? "checkmark" : "copy-outline"} size={16} color={colors.textMuted} />
        </Pressable>

        <Pressable style={[styles.shareBtn, { backgroundColor: colors.accent || "#FF5722" }]} onPress={handleShare}>
          <Ionicons name="share-social-outline" size={16} color="#FFFFFF" />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 16, borderRadius: 20, borderWidth: 1, marginBottom: 20, gap: 4 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 4 },
  title: { fontSize: 15 },
  subtitle: { fontSize: 12, marginBottom: 12 },
  row: { flexDirection: "row", gap: 10 },
  codeBox: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 44,
  },
  codeText: { fontSize: 15, letterSpacing: 1 },
  shareBtn: { width: 44, height: 44, borderRadius: 12, alignItems: "center", justifyContent: "center" },
});