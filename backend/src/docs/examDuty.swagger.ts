/**
 * @swagger
 * /api/exam-duties:
 *   post:
 *     tags:
 *       - Exam Duties
 *     summary: Create a new exam duty
 *     description: Creates a new examination duty. Only SUPER_ADMIN and COE can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examId
 *               - status
 *             properties:
 *               examId:
 *                 type: string
 *                 format: uuid
 *                 example: dacc80f8-da12-46b4-9336-421781ba2645
 *               employeeId:
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *                 example: f088aa8a-f52b-4408-9a0e-eac8cba753ad
 *               status:
 *                 type: string
 *                 enum:
 *                   - ASSIGNED
 *                   - ATTENDED
 *                   - TRANSFERRED
 *                   - ABSENT
 *                 example: ASSIGNED
 *     responses:
 *       201:
 *         description: Exam duty created successfully.
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
 * /api/exam-duties:
 *   get:
 *     tags:
 *       - Exam Duties
 *     summary: Get all exam duties
 *     description: Returns all examination duties.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Exam duties retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/exam-duties/{id}:
 *   get:
 *     tags:
 *       - Exam Duties
 *     summary: Get exam duty by ID
 *     description: Returns an examination duty by its unique ID.
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
 *         description: Exam duty retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Exam duty not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/exam-duties/{id}:
 *   put:
 *     tags:
 *       - Exam Duties
 *     summary: Update exam duty
 *     description: Updates an existing examination duty. Only SUPER_ADMIN and COE can perform this operation.
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
 *               employeeId:S
 *                 type: string
 *                 format: uuid
 *                 nullable: true
 *               status:
 *                 type: string
 *                 enum:
 *                   - ASSIGNED
 *                   - ATTENDED
 *                   - TRANSFERRED
 *                   - ABSENT
 *     responses:
 *       200:
 *         description: Exam duty updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Exam duty not found.
 *       500:
 *         description: Internal server error.
 */