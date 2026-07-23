import { Router } from "express";

import {
  getActivityLogs,
  getActivityLogById,
  getMyActivityLogs,
} from "../controllers/activityLog.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uuidParamSchema } from "../validators/common.validator.js";

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

router.get("/me", verifyJWT, getMyActivityLogs);

/**
 * Get Activity Log By ID
 */
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(uuidParamSchema, "params"),
  getActivityLogById,
);


export default router;
