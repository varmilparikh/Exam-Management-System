import { Router } from "express";

import {
  register,
  login,
  me,
} from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { ApiResponse } from "../utils/apiResponse.js";

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


export default router;