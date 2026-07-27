/**
 * @swagger
 * tags:
 *   - name: Activity Logs
 *     description: Audit trail for important system activities.
 */

/**
 * @swagger
 * /api/activity-logs:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get all activity logs
 *     description: >
 *       Returns all activity logs recorded in the system.
 *       Accessible only by SUPER_ADMIN and COE.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Activity logs retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/activity-logs/{id}:
 *   get:
 *     tags:
 *       - Activity Logs
 *     summary: Get activity log by ID
 *     description: Returns a specific activity log.
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
 *         description: Activity log retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Activity log not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/activity-logs/{id}:
 *   delete:
 *     tags:
 *       - Activity Logs
 *     summary: Delete activity log
 *     description: >
 *       Soft deletes an activity log.
 *       Accessible only by SUPER_ADMIN and COE.
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
 *         description: Activity log deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Activity log not found.
 *       500:
 *         description: Internal server error.
 */