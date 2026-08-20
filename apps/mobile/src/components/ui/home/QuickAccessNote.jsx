import React, { useState, useEffect } from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import NoteCard from "./NoteCard";
import { useHomeTheme } from "@/context/ThemeContext";
import { apiClient } from "@/api/client";

export default function QuickAccessNotes() {
  const { colors, fonts } = useHomeTheme();
  const router = useRouter();
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    apiClient
      .get("/notes")
      .then(({ data }) => setNotes(data.data.slice(0, 6)))
      .catch((err) => console.error("Quick notes fetch failed:", err.response?.data || err.message));
  }, []);

  if (notes.length === 0) return null;

  return (
    <View>
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: colors.textPrimary, fontFamily: fonts.headingSemi }]}>
          Quick Access Notes
        </Text>
        <Pressable
          hitSlop={10}
          onPress={() => {
            Haptics.selectionAsync();
            router.push('/(tabs)/notes');
          }}
        >
          <Text style={[styles.seeAll, { color: colors.textMuted, fontFamily: fonts.bodyMedium }]}>
            See all
          </Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 24 }}>
        {notes.map((note) => (
          <NoteCard
            key={note.id}
            icon={note.icon}
            color="accent"
            title={note.title}
            progress={note.progress}
            onPress={() => {
              Haptics.selectionAsync();
              router.push(`/note/${note.id}`);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 },
  sectionTitle: { fontSize: 16 },
  seeAll: { fontSize: 13 },
});