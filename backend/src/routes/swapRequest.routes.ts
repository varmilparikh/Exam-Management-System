import { Router } from "express";

import {
  createSwapRequest,
  acceptSwapRequest,
  rejectSwapRequest,
  cancelSwapRequest,
  approveSwapRequest,
  rejectSwapByCoe,
  getSwapRequests,
} from "../controllers/swapRequest.controller.js";

import {
  createSwapRequestSchema,
  rejectSwapRequestSchema,
  cancelSwapRequestSchema,
  approveSwapRequestSchema,
  rejectSwapByCoeSchema,
} from "../validators/swapRequest.validator.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { uuidParamSchema } from "../validators/common.validator.js";

const router = Router();

router.get("/", verifyJWT, getSwapRequests);

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
  validate(uuidParamSchema, "params"),
  acceptSwapRequest,
);

router.patch(
  "/:id/reject",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(uuidParamSchema, "params"),
  validate(rejectSwapRequestSchema),
  rejectSwapRequest,
);

router.patch(
  "/:id/cancel",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(uuidParamSchema, "params"),
  validate(cancelSwapRequestSchema),
  cancelSwapRequest,
);

router.patch(
  "/:id/approve",
  verifyJWT,
  authorizeRoles("COE"),
  validate(uuidParamSchema, "params"),
  validate(approveSwapRequestSchema),
  approveSwapRequest,
);

router.patch(
  "/:id/reject-by-coe",
  verifyJWT,
  authorizeRoles("COE"),
  validate(uuidParamSchema, "params"),
  validate(rejectSwapByCoeSchema),
  rejectSwapByCoe,
);

export default router;
