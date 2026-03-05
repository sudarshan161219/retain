import { create } from "zustand";

export const LogType = {
  WORK: "WORK",
  REFILL: "REFILL",
} as const;

export type LogType = (typeof LogType)[keyof typeof LogType];

export type WorkLog = {
  id: string;
  description: string;
  hours: number;
  date: string;
  type: LogType;
  clientId: string;
  createdAt: Date;
  updatedAt: Date;
};

interface EditLogDataState {
  selectedLog: WorkLog | null;
  setSelectedLog: (log: WorkLog) => void;
  clearSelectedLog: () => void;
}

export const useEditLogStore = create<EditLogDataState>((set) => ({
  selectedLog: null,

  setSelectedLog: (log) => set({ selectedLog: log }),
  clearSelectedLog: () => set({ selectedLog: null }),
}));
