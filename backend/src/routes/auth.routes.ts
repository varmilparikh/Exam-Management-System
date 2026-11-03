import { Router } from "express";

import {
  login,
  logout,
  me,
  refresh,
  register,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { loginRateLimiter } from "../middleware/loginRateLimiter.js";

import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

/* ---------- Local Authentication ---------- */

router.post(
  "/register",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN"),
  validate(registerSchema),
  register,
);

router.post("/login", loginRateLimiter, validate(loginSchema), login);

router.post("/logout", verifyJWT, logout);

/* ---------- Current User ---------- */

router.get("/me", verifyJWT, me);

router.post("/refresh", refresh);

export default router;
