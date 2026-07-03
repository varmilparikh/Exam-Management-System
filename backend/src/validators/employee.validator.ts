import { z } from "zod";

/**
 * Create Employee Validation
 */
export const createEmployeeSchema = z.object({
  employeeCode: z
    .string()
    .trim()
    .min(2)
    .max(20),

  name: z
    .string()
    .trim()
    .min(2)
    .max(100),

  email: z
    .email(),

  password: z
    .string()
    .min(8)
    .max(100),

  designation: z
    .string()
    .trim()
    .min(2)
    .max(100),

  departmentId: z
    .uuid(),

  role: z.enum([
    "SUPER_ADMIN",
    "COE",
    "HOD",
    "FACULTY",
  ]),

  phone: z
    .string()
    .trim()
    .optional(),
});

/**
 * Update Employee Validation
 */
export const updateEmployeeSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  designation: z
    .string()
    .trim()
    .min(2)
    .max(100)
    .optional(),

  departmentId: z
    .uuid()
    .optional(),

  role: z
    .enum([
      "SUPER_ADMIN",
      "COE",
      "HOD",
      "FACULTY",
    ])
    .optional(),

  phone: z
    .string()
    .trim()
    .optional(),

  isActive: z
    .boolean()
    .optional(),
});