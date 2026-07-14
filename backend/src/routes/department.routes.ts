import { Router } from "express";

import {
  createDepartment,
  getDepartments,
  getDepartmentById,
  updateDepartment,
  deleteDepartment,
} from "../controllers/department.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createDepartmentSchema,
  updateDepartmentSchema,
} from "../validators/department.validator.js";

const router = Router();

/**
 * Create Department
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(createDepartmentSchema),
  createDepartment,
);

/**
 * Get All Departments
 */
router.get("/", verifyJWT, getDepartments);

/**
 * Get Department By ID
 */
router.get("/:id", verifyJWT, getDepartmentById);

/**
 * Update Department
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(updateDepartmentSchema),
  updateDepartment,
);

/**
 * Delete Department
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN"),
  deleteDepartment,
);

export default router;
