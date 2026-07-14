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
 * @swagger
 * /api/departments:
 *   post:
 *     tags:
 *       - Departments
 *     summary: Create a new department
 *     description: Creates a new department. Only SUPER_ADMIN and COE can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: Computer Engineering
 *     responses:
 *       201:
 *         description: Department created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Department already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * Create Department
 */
router.post(
  "/",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(createDepartmentSchema),
  createDepartment
);

/**
 * @swagger
 * /api/departments:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get all departments
 *     description: Returns a list of all departments.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Departments retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * Get All Departments
 */
router.get(
  "/",
  verifyJWT,
  getDepartments
);

/**
 * @swagger
 * /api/departments/{id}:
 *   get:
 *     tags:
 *       - Departments
 *     summary: Get department by ID
 *     description: Returns a department by its ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department retrieved successfully.
 *       404:
 *         description: Department not found.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * Get Department By ID
 */
router.get(
  "/:id",
  verifyJWT,
  getDepartmentById
);

/**
 * @swagger
 * /api/departments/{id}:
 *   put:
 *     tags:
 *       - Departments
 *     summary: Update department
 *     description: Updates an existing department. Only SUPER_ADMIN and COE can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: Information Technology
 *     responses:
 *       200:
 *         description: Department updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Department not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * Update Department
 */
router.put(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  validate(updateDepartmentSchema),
  updateDepartment
);

/**
 * @swagger
 * /api/departments/{id}:
 *   delete:
 *     tags:
 *       - Departments
 *     summary: Delete department
 *     description: Soft deletes a department. Only SUPER_ADMIN can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *     responses:
 *       200:
 *         description: Department deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Department not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * Delete Department
 */
router.delete(
  "/:id",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN"),
  deleteDepartment
);

export default router;