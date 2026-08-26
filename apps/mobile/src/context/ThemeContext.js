import React, { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  const toggleTheme = () => setIsDark((prev) => !prev);

  const colors = isDark
    ? {
        bg: "#09090B",
        surface: "#18181B",
        border: "rgba(255,255,255,0.08)",
        divider: "rgba(255,255,255,0.08)",
        card: "#18181B",
        textPrimary: "#FFFFFF",
        textMuted: "#A1A1AA",
        accent: "#FF5722",
        accentSoft: "rgba(255,87,34,0.15)",
        danger: "#EF4444",
      }
    : {
        bg: "#FAF9F6", // Clean Off-White Premium Look
        surface: "#FFFFFF",
        border: "rgba(0,0,0,0.06)",
        divider: "rgba(0,0,0,0.06)",
        card: "#FFFFFF",
        textPrimary: "#18181B",
        textMuted: "#71717A",
        accent: "#FF5722",
        accentSoft: "rgba(255,87,34,0.1)",
        danger: "#EF4444",
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

// Main Export
export const useAppTheme = () => useContext(ThemeContext);

// Backwards Compatibility Aliases
export const useHomeTheme = useAppTheme;
export const HomeThemeProvider = ThemeProvider;