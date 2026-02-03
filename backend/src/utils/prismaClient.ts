import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

console.log(
  "Database URL Check:",
  process.env.DATABASE_URL ? "Defined" : "UNDEFINED",
);

const connectionString = process.env.DATABASE_URL?.trim();

if (!connectionString || connectionString.length === 0) {
  throw new Error("DATABASE_URL is defined but empty or invalid.");
}

if (!connectionString) {
  throw new Error(
    "DATABASE_URL is not defined. Check your .env file and paths.",
  );
}

const adapter = new PrismaPg({
  connectionString,
});

export const prisma = new PrismaClient({
  adapter,
  log: ["query", "info", "warn", "error"],
});
