import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface SidebarState {
  collapsed: boolean;
  setCollapsed: (value: boolean) => void;
  toggleSidebar: () => void;
}

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      collapsed: true, // Default state

      setCollapsed: (value) => set({ collapsed: value }),

      toggleSidebar: () => set((state) => ({ collapsed: !state.collapsed })),
    }),
    {
      name: "sidebar-storage",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
