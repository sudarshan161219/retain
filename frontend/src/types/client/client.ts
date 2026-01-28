export type ClientStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

export type LogType = "WORK" | "REFILL";

export interface WorkLog {
  id: string;
  clientId: string;
  description: string;

  /**
   * For WORK: This is the amount spent (e.g., 2.5)
   * For REFILL: This is the amount added (e.g., 10.0)
   */
  hours: number;

  type: LogType;

  /** ISO Date String (e.g. "2024-01-25T14:00:00.000Z") */
  date: string;
  createdAt: string;
}

export interface Client {
  id: string;
  userId: string;

  name: string;
  slug: string; // Used for public links

  /** The initial "opening balance" or contract size */
  totalHours: number;

  /** The dynamic calculated remaining hours */
  currentBalance: number;

  status: ClientStatus;

  /** Optional URL for the client to pay for more hours */
  refillLink?: string | null;

  /** List of history items (optional, as lists are often fetched separately) */
  logs?: WorkLog[];

  createdAt: string;
  updatedAt: string;
}
