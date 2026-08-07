import { Router } from "express";

import {
  createExamDuty,
  getExamDuties,
  getMyDuties,
  getMyUpcomingDuties,
  getEmployeeDuties,
  getExamDutiesByExam,
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

import { uuidParamSchema } from "../validators/common.validator.js";

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

router.get(
  "/me/upcoming",
  verifyJWT,
  authorizeRoles("FACULTY", "COE", "SUPER_ADMIN", "HOD"),
  getMyUpcomingDuties,
);

router.get(
  "/me",
  verifyJWT,
  authorizeRoles("FACULTY", "COE", "SUPER_ADMIN", "HOD"),
  getMyDuties,
);

router.get(
  "/employee/:employeeId",
  verifyJWT,
  authorizeRoles("FACULTY", "COE", "SUPER_ADMIN", "HOD"),
  validate(uuidParamSchema, "params"),
  getEmployeeDuties,
);

router.get(
  "/exam/:examId",
  verifyJWT,
  authorizeRoles("FACULTY", "COE", "SUPER_ADMIN", "HOD"),
  validate(uuidParamSchema, "params"),
  getExamDutiesByExam,
);

/**
 * Get Exam Duty By ID
 */
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  validate(uuidParamSchema, "params"),
  getExamDutyById,
);

/**
 * Update Exam Duty
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(uuidParamSchema, "params"),
  validate(updateExamDutySchema),
  updateExamDuty,
);

router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(uuidParamSchema, "params"),
  deleteExamDuty,
);

export default router;
