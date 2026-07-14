import { Router } from "express";

import { register, login, me } from "../controllers/auth.controller.js";

import { verifyJWT } from "../middleware/auth.middleware.js";

import { validate } from "../middleware/validate.middleware.js";

import { authorizeRoles } from "../middleware/role.middleware.js";

import { ApiResponse } from "../utils/apiResponse.js";

import { registerSchema, loginSchema } from "../validators/auth.validator.js";

const router = Router();

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Register a new employee
 *     description: Creates a new employee account in the system.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeCode
 *               - name
 *               - email
 *               - password
 *               - role
 *               - departmentId
 *             properties:
 *               employeeCode:
 *                 type: string
 *                 example: EMP005
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rahul@example.com
 *               password:
 *                 type: string
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 example: FACULTY
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       201:
 *         description: Employee registered successfully.
 *       400:
 *         description: Validation error.
 *       409:
 *         description: Employee already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * Register
 */
router.post("/register", validate(registerSchema), register);

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     summary: Login user
 *     description: Authenticate a user using email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: john@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Login successful.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Invalid email or password.
 *       500:
 *         description: Internal server error.
 */

/**
 * Login
 */
router.post("/login", validate(loginSchema), login);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     tags:
 *       - Authentication
 *     summary: Get current logged-in user
 *     description: Returns the profile of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

router.get("/me", verifyJWT, me);

export default router;
