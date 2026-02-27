export type ClientStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

export type LogType = "WORK" | "REFILL";

export interface WorkLog {
  id: string;
  description: string;
  hours: number;
  date: string;
  type: LogType;
  clientId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Client {
  id: string;

  slug: string;

  name: string;
  email: string;
  status: ClientStatus;

  refillLink?: string | null;

  totalHours: number;
  hoursLogged: number;

  remainingHours: number;
  hourlyRate: number;
  currency: string;
  logs: WorkLog[];

  createdAt: string;
  updatedAt: string;
  lastLogAt?: string | null;
}
