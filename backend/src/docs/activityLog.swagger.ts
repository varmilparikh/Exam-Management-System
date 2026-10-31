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
 *       Returns a paginated list of activity logs and supports search, action, and date filters.
 *       Accessible only by SUPER_ADMIN and COE.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - in: query
 *         name: action
 *         schema:
 *           type: string
 *           enum:
 *             - LOGIN
 *             - LOGOUT
 *             - CREATE_DEPARTMENT
 *             - UPDATE_DEPARTMENT
 *             - DELETE_DEPARTMENT
 *             - CREATE_EMPLOYEE
 *             - UPDATE_EMPLOYEE
 *             - DELETE_EMPLOYEE
 *             - CREATE_EXAM
 *             - CREATE_EXAM_OPT_IN
 *             - CANCEL_EXAM_OPT_IN
 *             - CONFIRM_EXAM_OPT_IN
 *             - REJECT_EXAM_OPT_IN
 *             - UPDATE_EXAM
 *             - DELETE_EXAM
 *             - ASSIGN_EXAM_DUTY
 *             - UPDATE_EXAM_DUTY
 *             - DELETE_EXAM_DUTY
 *             - CREATE_TRANSFER_REQUEST
 *             - APPROVE_TRANSFER_REQUEST
 *             - REJECT_TRANSFER_REQUEST
 *             - CANCEL_TRANSFER_REQUEST
 *             - CREATE_SWAP_REQUEST
 *             - ACCEPT_SWAP_REQUEST
 *             - COMPLETE_SWAP_REQUEST
 *             - APPROVE_SWAP_REQUEST
 *             - CANCEL_SWAP_REQUEST
 *             - REJECT_SWAP_REQUEST_BY_RECEIVER
 *             - REJECT_SWAP_REQUEST_BY_COE
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
 * /api/activity-logs/me:
 *   get:
 *     tags: [Activity Logs]
 *     summary: Get the current user's activity logs
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       200: { description: Current user's activity logs. }
 *       401: { description: Unauthorized. }
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
