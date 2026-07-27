import { z } from "zod";

export const registerSchema = z.object({
  employeeCode: z.string().min(3),

  name: z.string().min(3),

  email: z.email(),

  role: z.enum(["SUPER_ADMIN", "COE", "HOD", "FACULTY"]),

  password: z
    .string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).+$/,
      "Password must contain uppercase, lowercase, number and special character",
    ),

  designation: z.string(),

  departmentId: z.uuid(),
});

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});
