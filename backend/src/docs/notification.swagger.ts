/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Notification management endpoints.
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     tags:
 *       - Notifications
 *     summary: Create a notification
 *     description: Creates a new notification. Only SUPER_ADMIN and COE can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeId
 *               - title
 *               - message
 *             properties:
 *               employeeId:
 *                 type: string
 *                 format: uuid
 *                 example: f088aa8a-f52b-4408-9a0e-eac8cba753ad
 *               title:
 *                 type: string
 *                 example: Swap Request Approved
 *               message:
 *                 type: string
 *                 example: Your swap request has been approved by the COE.
 *     responses:
 *       201:
 *         description: Notification created successfully.
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
 * /api/notifications:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get all notifications
 *     description: Returns all notifications.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   get:
 *     tags:
 *       - Notifications
 *     summary: Get notification by ID
 *     description: Returns a notification by its unique ID.
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
 *         description: Notification retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   put:
 *     tags:
 *       - Notifications
 *     summary: Update notification
 *     description: Updates an existing notification. Only SUPER_ADMIN and COE can perform this operation.
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
 *               title:
 *                 type: string
 *                 example: Swap Request Approved
 *               message:
 *                 type: string
 *                 example: Your swap request has been approved by the COE.
 *               isRead:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: Notification updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/notifications/{id}:
 *   delete:
 *     tags:
 *       - Notifications
 *     summary: Delete notification
 *     description: Soft deletes a notification. Only SUPER_ADMIN and COE can perform this operation.
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
 *         description: Notification deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Notification not found.
 *       500:
 *         description: Internal server error.
 */