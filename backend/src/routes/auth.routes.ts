import { Router } from "express";

import {
  register,
  login,
  me,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import {
  registerSchema,
  loginSchema,
} from "../validators/auth.validator.js";

const router = Router();

/**
 * Register
 */
router.post(
  "/register",
  validate(registerSchema),
  register
);

/**
 * Login
 */
router.post(
  "/login",
  validate(loginSchema),
  login
);

router.get(
  "/me",
  verifyJWT,
  me
);

router.get("/test", (_req, res) => {
  res.json({
    success: true,
    message: "Auth router is working",
  });
});
console.log("Auth routes loaded");
export default router;