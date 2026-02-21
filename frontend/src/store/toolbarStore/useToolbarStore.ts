import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export type StatusFilter = "ACTIVE" | "PAUSED" | "ARCHIVED" | "ALL";
// currentPage, setCurrentPage
interface ToolbarState {
  currentPage: number;
  setCurrentPage: (value: number) => void;
  currentStatus: StatusFilter;
  onStatusChange: (value: StatusFilter) => void;
  sortOrder: "asc" | "desc";
  onSortChange: (order: "asc" | "desc") => void;
}

export const useToolbarStore = create<ToolbarState>()(
  persist(
    (set) => ({
      currentPage: 1,
      currentStatus: "ALL",
      sortOrder: "asc",

      setCurrentPage: (value) => {
        set({ currentPage: value });
      },

      onStatusChange: (value) => {
        set({ currentStatus: value });
      },

      onSortChange: (order) => {
        set({ sortOrder: order });
      },
    }),
    {
      name: "toolbar",
      storage: createJSONStorage(() => localStorage),
    },
  ),
);
