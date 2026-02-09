import { create } from "zustand";

interface CreateClientState {
  name: string;
  hours: number | "";
  rate: number | "";
  currency: string;
  refillLink: string;

  // Actions
  setName: (name: string) => void;
  setHours: (hours: number | "") => void;
  setRate: (rate: number | "") => void;
  setCurrency: (currency: string) => void;
  setRefillLink: (link: string) => void;
  reset: () => void;
}

export const useCreateClientStore = create<CreateClientState>((set) => ({
  name: "",
  hours: "",
  rate: "",
  currency: "USD",
  refillLink: "",

  setName: (name) => set({ name }),
  setHours: (hours) => set({ hours }),
  setRate: (rate) => set({ rate }),
  setCurrency: (currency) => set({ currency }),
  setRefillLink: (refillLink) => set({ refillLink }),

  reset: () =>
    set({
      name: "",
      hours: "",
      rate: "",
      currency: "USD",
      refillLink: "",
    }),
}));
