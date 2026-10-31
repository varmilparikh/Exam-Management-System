import { z } from "zod";

export const examSchema = z.object({
  examName: z
    .string()
    .trim()
    .min(2, "Exam name must be at least 2 characters.")
    .max(100, "Exam name cannot exceed 100 characters."),

  examDate: z.string().min(1, "Exam date is required."),

  sessionName: z.string().trim().min(2, "Session name is required.").max(60),

  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time."),

  endTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid end time."),

  requiredFaculty: z
    .number()
    .int()
    .min(1, "Required faculty must be at least 1."),
}).refine((values) => values.endTime > values.startTime, {
  path: ["endTime"],
  message: "Session end time must be after its start time.",
});

export type ExamFormValues = z.output<typeof examSchema>;
export type ExamFormInput = z.input<typeof examSchema>;
