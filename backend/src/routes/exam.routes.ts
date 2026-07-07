import { Router } from "express";

import {
  createExam,
  getExams,
  getExamById,
  updateExam,
  deleteExam,
} from "../controllers/exam.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createExamSchema,
  updateExamSchema,
} from "../validators/exam.validator.js";

const router = Router();

/**
 * Create Exam
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(createExamSchema),
  createExam
);

/**
 * Get All Exams
 */
router.get(
  "/",
  verifyJWT,
  authorizeRoles(
    "SUPER_ADMIN",
    "COE",
    "HOD",
    "FACULTY"
  ),
  getExams
);

/**
 * Get Exam By ID
 */
router.get(
  "/:id",
  verifyJWT,
  authorizeRoles(
    "SUPER_ADMIN",
    "COE",
    "HOD",
    "FACULTY"
  ),
  getExamById
);

/**
 * Update Exam
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(updateExamSchema),
  updateExam
);

/**
 * Delete Exam
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  deleteExam
);

export default router;