import { z } from "zod";

const timeOfDaySchema = z
  .string()
  .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Time must use HH:mm format")
  .transform((value) => {
    const [hours, minutes] = value.split(":").map(Number);
    const time = new Date("1970-01-01T00:00:00.000Z");
    time.setUTCHours(hours ?? 0, minutes ?? 0, 0, 0);
    return time;
  });

/**
 * Create Exam Validation
 */
export const createExamSchema = z
  .object({
    examName: z
      .string()
      .trim()
      .min(2, "Exam name must be at least 2 characters")
      .max(100, "Exam name cannot exceed 100 characters"),

    examDate: z.coerce
      .date()
      .refine((date) => !Number.isNaN(date.getTime()), "Invalid exam date"),

    sessionName: z.string().trim().min(2).max(60),
    startTime: timeOfDaySchema,
    endTime: timeOfDaySchema,

    requiredFaculty: z
      .number()
      .int()
      .min(1, "Required faculty must be at least 1"),
  })
  .refine((data) => data.endTime > data.startTime, {
    path: ["endTime"],
    message: "Session end time must be after its start time",
  })
  .strict();

/**
 * Update Exam Validation
 */
export const updateExamSchema = z
  .object({
    examName: z
      .string()
      .trim()
      .min(2, "Exam name must be at least 2 characters")
      .max(100, "Exam name cannot exceed 100 characters")
      .optional(),

    examDate: z.coerce.date().optional(),
    sessionName: z.string().trim().min(2).max(60).optional(),
    startTime: timeOfDaySchema.optional(),
    endTime: timeOfDaySchema.optional(),

    requiredFaculty: z
      .number()
      .int()
      .positive("Required faculty must be greater than zero")
      .optional(),
  })
  .strict();
