import { create } from "zustand";

interface AuthLayoutState {
  isLogin: boolean;
  toggleLayout: () => void;
  setIsLogin: (value: boolean) => void;
}

export const useAuthLayoutStore = create<AuthLayoutState>((set) => ({
  isLogin: false,

  toggleLayout: () =>
    set((state) => ({
      isLogin: !state.isLogin,
    })),

  setIsLogin: (value: boolean) => set({ isLogin: value }),
}));
