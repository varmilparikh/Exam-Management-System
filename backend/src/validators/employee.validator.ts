import { z } from "zod";

/**
 * Create Employee Validation
 */
export const createEmployeeSchema = z
  .object({
    employeeCode: z.string().trim().min(2).max(20),

    name: z.string().trim().min(2).max(100),

    email: z.string().email(),

    password: z
      .string()
      .min(8)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/)
      .max(100),

    designation: z.string().trim().min(2).max(100),

    departmentId: z.uuid(),

    role: z.enum(["SUPER_ADMIN", "COE", "HOD", "FACULTY"]),

    phone: z
      .union([z.literal(""), z.string().regex(/^[0-9]{10}$/)])
      .transform((v) => (v === "" ? undefined : v))
      .optional(),
  })
  .strict();

/**
 * Update Employee Validation
 */
export const updateEmployeeSchema = z
  .object({
    employeeCode: z.string().trim().min(2).max(20).optional(),

    name: z.string().trim().min(2).max(100).optional(),

    email: z.string().email().optional(),

    designation: z.string().trim().min(2).max(100).optional(),

    departmentId: z.uuid().optional(),

    role: z.enum(["SUPER_ADMIN", "COE", "HOD", "FACULTY"]).optional(),

    phone: z
      .union([z.literal(""), z.string().regex(/^[0-9]{10}$/)])
      .transform((v) => (v === "" ? undefined : v))
      .optional(),

    isActive: z.boolean().optional(),
  })
  .strict();
