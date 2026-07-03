import { Router } from "express";

import {
  createEmployee,
  getEmployees,
  getEmployeeById,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createEmployeeSchema,
  updateEmployeeSchema,
} from "../validators/employee.validator.js";

const router = Router();

/**
 * Create Employee
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN"),
  validate(createEmployeeSchema),
  createEmployee
);

/**
 * Get All Employees
 */
router.get(
  "/",
  verifyJWT,
  getEmployees
);

/**
 * Get Employee By ID
 */
router.get(
  "/:id",
  verifyJWT,
  getEmployeeById
);

/**
 * Update Employee
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN"),
  validate(updateEmployeeSchema),
  updateEmployee
);

/**
 * Delete Employee
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN"),
  deleteEmployee
);

export default router;