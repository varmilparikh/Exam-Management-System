import { Router } from "express";

import {
  createNotification,
  getNotifications,
  getNotificationById,
  updateNotification,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createNotificationSchema,
  updateNotificationSchema,
} from "../validators/notification.validator.js";

const router = Router();

/**
 * Create Notification
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(createNotificationSchema),
  createNotification,
);

/**
 * Get All Notifications
 */
router.get(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getNotifications,
);

/**
 * Get Notification By ID
 */
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getNotificationById,
);

/**
 * Update Notification
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(updateNotificationSchema),
  updateNotification,
);

/**
 * Delete Notification
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  deleteNotification,
);

export default router;