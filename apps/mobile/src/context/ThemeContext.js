import React, { createContext, useContext, useState } from "react";
import { colors as lightColors, fonts } from "@/constants/theme";
import { darkColors } from "@/constants/darkTheme";

const ThemeContext = createContext();

export function HomeThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(true);

  const colors = isDark ? darkColors : lightColors;

  const toggleTheme = () => setIsDark((prev) => !prev);

  return (
    <ThemeContext.Provider value={{ colors, fonts, isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useHomeTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useHomeTheme must be used inside HomeThemeProvider");
  return ctx;
}