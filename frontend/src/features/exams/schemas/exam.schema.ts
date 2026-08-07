import { z } from "zod";

export const examSchema = z.object({
  examName: z
    .string()
    .trim()
    .min(2, "Exam name must be at least 2 characters.")
    .max(100, "Exam name cannot exceed 100 characters."),

  examDate: z.string().min(1, "Exam date is required."),

  requiredFaculty: z
    .number()
    .int()
    .min(1, "Required faculty must be at least 1."),
});

export type ExamFormValues = z.output<typeof examSchema>;
export type ExamFormInput = z.input<typeof examSchema>;
