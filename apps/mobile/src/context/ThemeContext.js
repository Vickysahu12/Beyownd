import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(false);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = isDark
    ? {
        bg: "#0E1512",
        surface: "#16211C",
        border: "rgba(255,255,255,0.08)",
        divider: "rgba(255,255,255,0.08)",
        card: "#16211C",
        textPrimary: "#FFFFFF",
        textMuted: "#9CA69E",
        accent: "#3DDC84",
        accentSoft: "rgba(61,220,132,0.15)",
        danger: "#EF4444",
        success: "#3AA655",
        successSoft: "rgba(58,166,85,0.15)",
        info: "#3B82F6",
        pro: "#8B5CF6",
      }
    : {
        bg: "#F8F7F4",
        surface: "#FFFFFF",
        border: "#E9E5DE",
        divider: "#E9E5DE",
        card: "#FFFFFF",
        textPrimary: "#1A1A17",
        textMuted: "#79766F",
        accent: "#16281E",
        accentSoft: "#E4EAE6",
        danger: "#EF4444",
        success: "#3AA655",
        successSoft: "#E3F5E7",
        info: "#3B82F6",
        pro: "#8B5CF6",
      };

  const fonts = {
    headingBold: "Sora_700Bold",
    headingSemi: "Sora_600SemiBold",
    body: "Inter_400Regular",
    bodyMedium: "Inter_500Medium",
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme, colors, fonts }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppTheme = () => useContext(ThemeContext);
export const useHomeTheme = useAppTheme;
export const HomeThemeProvider = ThemeProvider;