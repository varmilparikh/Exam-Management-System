import { Router } from "express";

import {
  createTransferRequest,
  getTransferRequests,
  getPendingTransferRequests,
  getTransferRequestById,
  getMyTransferRequests,
  approveTransferRequest,
  rejectTransferRequest,
  cancelTransferRequest,
} from "../controllers/transferRequest.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createTransferRequestSchema,
  approveTransferRequestSchema,
  rejectTransferRequestSchema,
  cancelTransferRequestSchema,
} from "../validators/transferRequest.validator.js";

import { uuidParamSchema } from "../validators/common.validator.js";

const router = Router();

/**
 * Create Transfer Request
 * Faculty, COE and SUPER_ADMIN can create requests
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(createTransferRequestSchema),
  createTransferRequest,
);

/**
 * Get All Transfer Requests
 */
router.get(
  "/",
  verifyJWT,
  authorizeRoles("COE", "SUPER_ADMIN"),
  getTransferRequests,
);

/**
 * Get Pending Transfer Requests
 */
router.get(
  "/pending",
  verifyJWT,
  authorizeRoles("COE", "SUPER_ADMIN"),
  getPendingTransferRequests,
);

/**
 * Get My Transfer Requests
 */
router.get(
  "/my",
  verifyJWT,
  authorizeRoles("FACULTY", "COE", "SUPER_ADMIN"),
  getMyTransferRequests,
);

/**
 * Get Transfer Request By ID
 */
router.get(
  "/:id",
  verifyJWT,
  validate(uuidParamSchema, "params"),
  getTransferRequestById,
);

router.patch(
  "/:id/approve",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(uuidParamSchema, "params"),
  validate(approveTransferRequestSchema),
  approveTransferRequest,
);

router.patch(
  "/:id/reject",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(uuidParamSchema, "params"),
  validate(rejectTransferRequestSchema),
  rejectTransferRequest,
);

router.patch(
  "/:id/cancel",
  verifyJWT,
  authorizeRoles("FACULTY"),
  validate(uuidParamSchema, "params"),
  validate(cancelTransferRequestSchema),
  cancelTransferRequest,
);

export default router;
