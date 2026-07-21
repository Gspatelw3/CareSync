"use client";

import {
  createContext,
  useContext,
  useEffect,
  useCallback,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { THEME } from "@/lib/config";

type Theme = "light" | "dark";
type ThemePreference = Theme | "system";

interface ThemeContextValue {
  theme: Theme;
  preference: ThemePreference;
  setThemePreference: (preference: ThemePreference) => void;
  toggleTheme: () => void;
  mounted: boolean;
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: THEME.default,
  preference: THEME.default,
  setThemePreference: () => {},
  toggleTheme: () => {},
  mounted: false,
});

export function useTheme() {
  return useContext(ThemeContext);
}

function resolveTheme(): Theme {
  if (typeof window === "undefined") return THEME.default;
  const stored = localStorage.getItem(THEME.storageKey);
  if (stored === "dark" || stored === "light") return stored;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function resolvePreference(): ThemePreference {
  if (typeof window === "undefined") return THEME.default;
  const stored = localStorage.getItem(THEME.storageKey);
  if (stored === "dark" || stored === "light" || stored === "system") {
    return stored;
  }
  return THEME.default;
}

function resolveThemeFromPreference(preference: ThemePreference): Theme {
  if (preference !== "system") return preference;
  if (typeof window === "undefined") return THEME.default;
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  document.documentElement.classList.toggle("dark", theme === "dark");
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState<Theme>(THEME.default);
  const [preference, setPreference] = useState<ThemePreference>(THEME.default);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const storedPreference = resolvePreference();
    const resolved = resolveThemeFromPreference(storedPreference);
    setPreference(storedPreference);
    setTheme(resolved);
    applyTheme(resolved);
    setMounted(true);
  }, []);

  useEffect(() => {
    if (preference !== "system" || typeof window === "undefined") return;

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = () => {
      const resolved = resolveTheme();
      setTheme(resolved);
      applyTheme(resolved);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, [preference]);

  const setThemePreference = useCallback((nextPreference: ThemePreference) => {
    const nextTheme = resolveThemeFromPreference(nextPreference);
    setPreference(nextPreference);
    setTheme(nextTheme);
    if (typeof window !== "undefined") {
      localStorage.setItem(THEME.storageKey, nextPreference);
      applyTheme(nextTheme);
    }
  }, []);

  const toggleTheme = useCallback(() => {
    setThemePreference(theme === "dark" ? "light" : "dark");
  }, [setThemePreference, theme]);

  const contextValue = useMemo(
    () => ({ theme, preference, setThemePreference, toggleTheme, mounted }),
    [mounted, preference, setThemePreference, theme, toggleTheme],
  );

  return (
    <ThemeContext.Provider value={contextValue}>
      {children}
    </ThemeContext.Provider>
  );
}
