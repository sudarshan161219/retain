import { create } from "zustand";
import type { Theme } from "@/types/theme/theme";

interface ThemeState {
  theme: Theme;
  setTheme: (newTheme: Theme) => void;
  toggleTheme: () => void;
  toggleLight: () => void;
  toggleDark: () => void;
  initializeTheme: () => void;
}

function getSystemTheme(): "light" | "dark" {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

function applyTheme(theme: Theme) {
  const resolved = theme === "system" ? getSystemTheme() : theme;

  document.documentElement.classList.toggle("dark", resolved === "dark");
}

function getInitialTheme(): Theme {
  if (typeof window === "undefined") return "light";

  const stored = localStorage.getItem("theme") as Theme | null;

  const theme = stored ?? "system";

  applyTheme(theme);

  return theme;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: getInitialTheme(),

  initializeTheme: () => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const theme = stored ?? "system";

    get().setTheme(theme);

    const media = window.matchMedia("(prefers-color-scheme: dark)");

    media.addEventListener("change", () => {
      if (get().theme === "system") {
        applyTheme("system");
      }
    });
  },

  setTheme: (newTheme: Theme) => {
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
    set({ theme: newTheme });
  },

  toggleTheme: () => {
    const { theme, setTheme } = get();
    const resolved = theme === "system" ? getSystemTheme() : theme;
    setTheme(resolved === "dark" ? "light" : "dark");
  },

  toggleLight: () => get().setTheme("light"),

  toggleDark: () => get().setTheme("dark"),
}));
