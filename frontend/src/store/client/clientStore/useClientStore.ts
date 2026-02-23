import { create } from "zustand";
import { persist } from "zustand/middleware";

interface ClientState {
  clientId: string | null;
  setClientId: (id: string) => void;
  clearClientId: () => void;
}

export const useClientStore = create<ClientState>()(
  persist(
    (set) => ({
      clientId: null,

      setClientId: (id) => set({ clientId: id }),
      clearClientId: () => set({ clientId: null }),
    }),
    {
      name: "client-storage",
    },
  ),
);
