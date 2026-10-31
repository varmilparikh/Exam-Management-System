import { z } from "zod";

export const createTransferRequestSchema = z.object({
  examDutyId: z.string().uuid(),

  requestType: z.enum(["REPLACEMENT_FOUND", "NEEDS_ASSISTANCE"]),

  toEmployeeId: z.string().uuid().optional().or(z.literal("")),

  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters.")
    .max(500, "Reason cannot exceed 500 characters."),
}).refine((data) => data.requestType !== "REPLACEMENT_FOUND" || Boolean(data.toEmployeeId), {
  path: ["toEmployeeId"],
  message: "Select the replacement faculty member you have found.",
}).refine((data) => data.requestType !== "NEEDS_ASSISTANCE" || !data.toEmployeeId, {
  path: ["toEmployeeId"],
  message: "Leave replacement blank when requesting assistance.",
});

export type CreateTransferRequestFormValues = z.infer<
  typeof createTransferRequestSchema
>;
