import { Router } from "express";

import {
  createSwapRequest,
} from "../controllers/swapRequest.controller.js";

import {
  createSwapRequestSchema,
} from "../validators/swapRequest.validator.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router.post(
  "/",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(createSwapRequestSchema),
  createSwapRequest,
);

export default router;