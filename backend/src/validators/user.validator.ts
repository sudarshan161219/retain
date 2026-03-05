import { z } from "zod";

export const ALLOWED_FORMATS = [
  "MMM d, yyyy", // Dec 31, 2026
  "dd/MM/yyyy", // 31/12/2026
  "MM/dd/yyyy", // 12/31/2026
  "yyyy-MM-dd", // 2026-12-31
] as const;

export const updateWorkspaceSchema = z.object({
  businessName: z.string().max(100).optional(),
  // Must be a valid URL, or an empty string to remove it
  logoUrl: z.url("Must be a valid URL").optional().or(z.literal("")),
  taxId: z.string().max(50).optional(),
  // Must be a positive number
  defaultHourlyRate: z.number().min(0, "Rate cannot be negative").optional(),
  // Standard 3-letter currency codes (USD, EUR, INR)
  defaultCurrency: z.string().length(3).uppercase().optional(),
  defaultRefillLink: z.url("Must be a valid URL").optional().or(z.literal("")),
});

export const updatePreferenceSchema = z.object({
  //    status: z.enum(ClientStatus).optional(),
  dateFormat: z.enum(ALLOWED_FORMATS).optional(),
  timezone: z.string().max(100).optional(),
});
