import { Router } from "express";

import {
  createSwapRequest,
  acceptSwapRequest,
  approveSwapRequest,
  rejectSwapRequest,
} from "../controllers/swapRequest.controller.js";

import {
  createSwapRequestSchema,
  acceptSwapRequestSchema,
  approveSwapRequestSchema,
  rejectSwapRequestSchema,
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

router.patch(
  "/:id/accept",
  verifyJWT,
  authorizeRoles("FACULTY"),
  acceptSwapRequest,
);

router.patch(
  "/:id/reject",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(rejectSwapRequestSchema),
  rejectSwapRequest,
);

router.patch(
  "/:id/approve",
  verifyJWT,
  authorizeRoles("COE"),
  validate(approveSwapRequestSchema),
  approveSwapRequest,
);

export default router;
