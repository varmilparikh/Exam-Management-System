import { z } from "zod";

export const createTransferRequestSchema = z.object({
  examDutyId: z.string().uuid(),

  toEmployeeId: z.string().uuid().optional().or(z.literal("")),

  reason: z
    .string()
    .trim()
    .min(5, "Reason must be at least 5 characters.")
    .max(500, "Reason cannot exceed 500 characters."),
});

export type CreateTransferRequestFormValues = z.infer<
  typeof createTransferRequestSchema
>;
