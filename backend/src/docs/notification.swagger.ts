/**
 * @swagger
 * tags:
 *   - name: Notifications
 *     description: Personal notification history and read actions.
 */

/**
 * @swagger
 * /api/notifications:
 *   post:
 *     tags: [Notifications]
 *     summary: Create a notification
 *     description: Creates a notification for an employee. Restricted to SUPER_ADMIN and COE.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [employeeId, title, message]
 *             properties:
 *               employeeId: { type: string, format: uuid }
 *               title: { type: string, minLength: 3, maxLength: 100 }
 *               message: { type: string, minLength: 5, maxLength: 500 }
 *     responses:
 *       201: { description: Notification created successfully. }
 *       400: { description: Validation error. }
 *       401: { description: Unauthorized. }
 *       403: { description: Forbidden. }
 */

/**
 * @swagger
 * /api/notifications:
 *   get:
 *     tags: [Notifications]
 *     summary: Get the current user's notifications
 *     description: Returns a paginated notification history belonging to the signed-in employee.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema: { type: integer, minimum: 1, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, minimum: 1, maximum: 100, default: 20 }
 *     responses:
 *       200: { description: Paginated notifications and pagination metadata. }
 *       400: { description: Invalid pagination parameters. }
 *       401: { description: Unauthorized. }
 */

/**
 * @swagger
 * /api/notifications/unread:
 *   get:
 *     tags: [Notifications]
 *     summary: Get the current user's unread notifications
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Unread notifications. }
 *       401: { description: Unauthorized. }
 * /api/notifications/unread-count:
 *   get:
 *     tags: [Notifications]
 *     summary: Get the current user's unread notification count
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Unread notification count. }
 *       401: { description: Unauthorized. }
 */

/**
 * @swagger
 * /api/notifications/read-all:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark all of the current user's notifications as read
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Number of notifications marked as read. }
 *       401: { description: Unauthorized. }
 * /api/notifications/{id}/read:
 *   patch:
 *     tags: [Notifications]
 *     summary: Mark a notification as read
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Notification marked as read. }
 *       401: { description: Unauthorized. }
 *       403: { description: The notification belongs to another employee. }
 *       404: { description: Notification not found. }
 * /api/notifications/{id}:
 *   get:
 *     tags: [Notifications]
 *     summary: Get one of the current user's notifications
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Notification details. }
 *       401: { description: Unauthorized. }
 *       403: { description: The notification belongs to another employee. }
 *       404: { description: Notification not found. }
 *   delete:
 *     tags: [Notifications]
 *     summary: Delete one of the current user's notifications
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Notification deleted successfully. }
 *       401: { description: Unauthorized. }
 *       403: { description: The notification belongs to another employee. }
 *       404: { description: Notification not found. }
 */
