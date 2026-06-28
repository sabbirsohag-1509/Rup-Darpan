import { createContext, useContext, useEffect, useState } from "react";

const THEME_STORAGE_KEY = "rupdarpan-theme";

export const THEMES = {
  dark: "rupdarpan",
  light: "rupdarpan-light",
};

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setTheme] = useState(
    () => localStorage.getItem(THEME_STORAGE_KEY) || THEMES.dark,
  );

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem(THEME_STORAGE_KEY, theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) =>
      current === THEMES.dark ? THEMES.light : THEMES.dark,
    );
  };

  const isDark = theme === THEMES.dark;

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme, isDark }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within ThemeProvider");
  }
  return context;
}
