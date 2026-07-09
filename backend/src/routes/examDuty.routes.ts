import { Router } from "express";

import {
  createExamDuty,
  getExamDuties,
  getExamDutyById,
  updateExamDuty,
  deleteExamDuty,
} from "../controllers/examDuty.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createExamDutySchema,
  updateExamDutySchema,
} from "../validators/examDuty.validator.js";

const router = Router();

/**
 * Create Exam Duty
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(createExamDutySchema),
  createExamDuty,
);

/**
 * Get All Exam Duties
 */
router.get(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  getExamDuties,
);

/**
 * Get Exam Duty By ID
 */
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  getExamDutyById,
);

/**
 * Update Exam Duty
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(updateExamDutySchema),
  updateExamDuty,
);

/**
 * Delete Exam Duty
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  deleteExamDuty,
);

export default router;