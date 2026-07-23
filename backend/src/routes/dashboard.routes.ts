import { Router } from "express";

import {
  getCoeDashboard,
  getFacultyDashboard,
  getHodDashboard,
} from "../controllers/dashboard.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import {
  getRecentActivities,
  getUpcomingExams,
  getPendingRequests,
  getFacultyWorkload,
} from "../controllers/dashboard.controller.js";

const router = Router();

router.get(
  "/coe",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getCoeDashboard,
);

router.get(
  "/faculty",
  verifyJWT,
  authorizeRoles("FACULTY"),
  getFacultyDashboard,
);

router.get("/hod", verifyJWT, authorizeRoles("HOD"), getHodDashboard);

router.get(
  "/recent-activities",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getRecentActivities,
);

router.get("/upcoming-exams", verifyJWT, getUpcomingExams);

router.get(
  "/pending-requests",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getPendingRequests,
);

router.get(
  "/faculty-workload",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD"),
  getFacultyWorkload,
);

export default router;
