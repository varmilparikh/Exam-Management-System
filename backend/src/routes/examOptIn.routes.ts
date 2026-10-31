import { Router } from "express";
import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import { uuidParamSchema } from "../validators/common.validator.js";
import { createExamOptInSchema, rejectExamOptInSchema, reviewExamOptInSchema } from "../validators/examOptIn.validator.js";
import {
  cancelExamOptIn,
  confirmExamOptIn,
  createExamOptIn,
  getExamOptIns,
  getUpcomingExamOptIns,
  rejectExamOptIn,
} from "../controllers/examOptIn.controller.js";

const router = Router();

router.get("/upcoming", verifyJWT, authorizeRoles("FACULTY"), getUpcomingExamOptIns);
router.get("/", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE", "HOD"), getExamOptIns);
router.post("/", verifyJWT, authorizeRoles("FACULTY"), validate(createExamOptInSchema), createExamOptIn);
router.patch("/:id/cancel", verifyJWT, authorizeRoles("FACULTY"), validate(uuidParamSchema, "params"), cancelExamOptIn);
router.patch("/:id/confirm", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), validate(uuidParamSchema, "params"), validate(reviewExamOptInSchema), confirmExamOptIn);
router.patch("/:id/reject", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), validate(uuidParamSchema, "params"), validate(rejectExamOptInSchema), rejectExamOptIn);

export default router;
