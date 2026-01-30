import { create } from "zustand";

interface AuthState {
  isSignUp: boolean;
  setIsSignUp: (value: boolean) => void;
  toggleAuthMode: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  isSignUp: false,

  setIsSignUp: (value) => set({ isSignUp: value }),

  toggleAuthMode: () => set((state) => ({ isSignUp: !state.isSignUp })),
}));
