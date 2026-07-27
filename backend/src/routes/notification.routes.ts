import { Router } from "express";

import {
  createNotification,
  getMyNotifications,
  getNotificationById,
  getUnreadNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
} from "../controllers/notification.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import { createNotificationSchema } from "../validators/notification.validator.js";

import { uuidParamSchema } from "../validators/common.validator.js";

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
router.get("/", verifyJWT, getMyNotifications);

/**
 * Get Notification By ID
 */
router.get(
  "/:id",
  verifyJWT,
  validate(uuidParamSchema, "params"),
  getNotificationById,
);

/**
 * Update Notification
 */
router.patch(
  "/:id/read",
  verifyJWT,
  validate(uuidParamSchema, "params"),
  markNotificationAsRead,
);

router.get("/unread", verifyJWT, getUnreadNotifications);

router.patch("/read-all", verifyJWT, markAllNotificationsAsRead);

/**
 * Delete Notification
 */
router.delete(
  "/:id",
  verifyJWT,
  validate(uuidParamSchema, "params"),
  deleteNotification,
);

export default router;
