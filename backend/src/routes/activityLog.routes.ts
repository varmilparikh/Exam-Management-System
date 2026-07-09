import { Router } from "express";

import {
  getActivityLogs,
  getActivityLogById,
  deleteActivityLog,
} from "../controllers/activityLog.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

/**
 * Get All Activity Logs
 */
router.get(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getActivityLogs,
);

/**
 * Get Activity Log By ID
 */
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getActivityLogById,
);

/**
 * Delete Activity Log
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  deleteActivityLog,
);

export default router;