import { z } from "zod";

export const departmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Department name must contain at least 2 characters.")
    .max(100, "Department name cannot exceed 100 characters."),
});

export type DepartmentFormValues = z.infer<typeof departmentSchema>;
