import { z } from "zod";
import { ClientStatus } from "@prisma/client";

export const getClientsQuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().trim().optional(),
  status: z.enum(ClientStatus).optional(),

  sortBy: z.enum(["createdAt", "name"]).default("createdAt"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
});
