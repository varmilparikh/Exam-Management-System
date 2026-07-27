// common.validator.ts
import { z } from "zod";

export const uuidParamSchema = z.object({
  id: z.uuid("Invalid UUID"),
}).strict();

export const phoneSchema = z
  .string()
  .regex(/^[0-9]{10}$/, "Phone number must contain exactly 10 digits");


export const passwordSchema = z
  .string()
  .min(8)
  .max(100)
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+$/,
    "Password must contain uppercase, lowercase and a number",
  );