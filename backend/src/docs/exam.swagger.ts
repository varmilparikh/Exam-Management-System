/**
 * @swagger
 * /api/exams:
 *   post:
 *     tags:
 *       - Exams
 *     summary: Create a new exam
 *     description: Creates a new examination. Only SUPER_ADMIN and COE can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examName
 *               - examDate
 *               - requiredFaculty
 *             properties:
 *               examName:
 *                 type: string
 *                 example: Operating Systems Final
 *               examDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2026-12-15T09:00:00.000Z
 *               requiredFaculty:
 *                 type: integer
 *                 example: 10
 *     responses:
 *       201:
 *         description: Exam created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/exams:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get all exams
 *     description: Returns all examinations.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exams retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/exams/{id}:
 *   get:
 *     tags:
 *       - Exams
 *     summary: Get exam by ID
 *     description: Returns an examination by its unique ID.
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
 *         description: Exam retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Exam not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/exams/{id}:
 *   put:
 *     tags:
 *       - Exams
 *     summary: Update exam
 *     description: Updates an existing examination. Only SUPER_ADMIN and COE can perform this operation.
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
 *               examName:
 *                 type: string
 *                 example: Operating Systems Final
 *               examDate:
 *                 type: string
 *                 format: date-time
 *               requiredFaculty:
 *                 type: integer
 *                 example: 15
 *     responses:
 *       200:
 *         description: Exam updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Exam not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/exams/{id}:
 *   delete:
 *     tags:
 *       - Exams
 *     summary: Delete exam
 *     description: Soft deletes an examination. Only SUPER_ADMIN and COE can perform this operation.
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
 *         description: Exam deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Exam not found.
 *       500:
 *         description: Internal server error.
 */