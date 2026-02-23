import { create } from "zustand";

interface ClientData {
  id: string;
  name: string;
  email: string;
  totalHours: number | "";
  hourlyRate: number | "";
  currency: string;
  refillLink: string | null;
}

interface UpdateClientState {
  formData: ClientData;

  setFormData: (data: Partial<ClientData>) => void;
  reset: () => void;
}

const initialState: ClientData = {
  id: "",
  name: "",
  email: "",
  totalHours: "",
  hourlyRate: "",
  currency: "USD",
  refillLink: "",
};

export const useUpdateClientStore = create<UpdateClientState>((set) => ({
  formData: initialState,

  setFormData: (updates) =>
    set((state) => ({
      formData: { ...state.formData, ...updates },
    })),

  reset: () => set({ formData: initialState }),
}));
