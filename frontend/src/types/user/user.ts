
export interface User {
  id: string;
  email: string;
  name: string | null;
  avatar: string | null;
  provider: "local" | "google" | "github";
  googleId?: string | null;
  githubId?: string | null;
  defaultRefillLink?: string | null;
  createdAt: Date;
  updatedAt: Date;
}
