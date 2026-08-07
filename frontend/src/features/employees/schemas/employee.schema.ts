import { z } from "zod";

const baseSchema = {
  employeeCode: z.string().trim().min(2).max(20),

  name: z.string().trim().min(2).max(100),

  email: z.string().email(),

  designation: z.string().trim().min(2).max(100),

  departmentId: z.string().uuid(),

  role: z.enum(["SUPER_ADMIN", "COE", "HOD", "FACULTY"]),

  phone: z
    .union([z.literal(""), z.string().regex(/^[0-9]{10}$/)])
    .transform((value) => (value === "" ? undefined : value))
    .optional(),
};

export const createEmployeeSchema = z.object({
  ...baseSchema,

  password: z
    .string()
    .min(8)
    .max(100)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/),
});

export const updateEmployeeSchema = z.object(baseSchema);

/**
 * Shared form type
 */
export interface EmployeeFormValues {
  employeeCode: string;
  name: string;
  email: string;
  password?: string;
  designation: string;
  departmentId: string;
  role: "SUPER_ADMIN" | "COE" | "HOD" | "FACULTY";
  phone?: string;
}
