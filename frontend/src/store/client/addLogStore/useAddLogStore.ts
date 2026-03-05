import { create } from "zustand";

export const LogType = {
  WORK: "WORK",
  REFILL: "REFILL",
} as const;

export type LogType = (typeof LogType)[keyof typeof LogType];

export type WorkLog = {
  description: string;
  hours: number;
  date: string;
  type: LogType;
};

interface AddLogDataState {
  log: WorkLog | null;
  setLog: (log: WorkLog) => void;
  clearLog: () => void;
}

export const useAddLogStore = create<AddLogDataState>((set) => ({
  log: null,

  setLog: (log) => set({ log: log }),
  clearLog: () => set({ log: null }),
}));
