import React from "react";
import { View, Text, Pressable, ScrollView, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import NoteCard from "./NoteCard";
import { useHomeTheme } from "@/context/ThemeContext";

const NOTES = [
  { id: "html", icon: "code-slash", color: "accent", title: "HTML & CSS Cheatsheet", progress: 80 },
  { id: "js", icon: "logo-javascript", color: "success", title: "JavaScript Fundamentals", progress: 65 },
  { id: "dsa", icon: "git-branch-outline", color: "pro", title: "DSA Patterns Quick Guide", progress: 40 },
  { id: "uiux", icon: "bulb", color: "accent", title: "UI/UX Design Principles", progress: 70 },
];

export default function QuickAccessNotes() {
  const { colors, fonts } = useHomeTheme();
  const router = useRouter();

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

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingRight: 24 }}
      >
        {NOTES.map((note) => (
          <NoteCard
            key={note.id}
            icon={note.icon}
            color={note.color}
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
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  sectionTitle: { fontSize: 16 },
  seeAll: { fontSize: 13 },
});