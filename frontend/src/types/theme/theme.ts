export type Theme = "light" | "dark" | "system";
export interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  toggleLight: () => void;
  toggleDark: () => void;
  setTheme: (theme: Theme) => void;
}
