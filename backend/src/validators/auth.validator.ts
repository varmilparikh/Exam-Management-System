import { z } from "zod";

export const registerSchema = z.object({
  employeeCode: z.string().min(3),

  name: z.string().min(3),

  email: z.email(),

  password: z
    .string()
    .min(8)
    .max(30),

  designation: z.string(),

  departmentId: z.uuid(),
});

export const loginSchema = z.object({
  email: z
    .email("Please enter a valid email"),

  password: z
    .string()
    .min(1, "Password is required"),
});