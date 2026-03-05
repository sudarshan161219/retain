import { create } from "zustand";

interface DateState {
  date: string;
  setDate: (date: string) => void;
}

export const useDateStore = create<DateState>((set) => ({
  date: new Intl.DateTimeFormat("en-GB").format(new Date()),
  setDate: (newDate) => set({ date: newDate }),
}));
