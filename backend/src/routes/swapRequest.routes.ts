import { Router } from "express";

import {
  createSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  approveSwapRequest,
} from "../controllers/swapRequest.controller.js";

import {
  createSwapRequestSchema,
  acceptSwapRequestSchema,
  rejectSwapRequestSchema,
  cancelSwapRequestSchema,
  approveSwapRequestSchema,
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
  validate(acceptSwapRequestSchema),
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
  "/:id/cancel",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(cancelSwapRequestSchema),
  cancelSwapRequest,
);

router.patch(
  "/:id/approve",
  verifyJWT,
  authorizeRoles("COE"),
  validate(approveSwapRequestSchema),
  approveSwapRequest,
);

export default router;
