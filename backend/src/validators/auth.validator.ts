import { z } from "zod";

import { createEmployeeSchema } from "./employee.validator.js";

export const registerSchema = createEmployeeSchema;

export const loginSchema = z.object({
  email: z.email("Please enter a valid email"),

  password: z.string().min(1, "Password is required"),
});
