/**
 * @swagger
 * tags:
 *   - name: Transfer Requests
 *     description: |
 *       Workflow for transferring examination duties.
 *
 *       Transfer Lifecycle:
 *
 *       Faculty creates request
 *            ↓
 *         PENDING
 *            ↓
 *       COE reviews
 *        ↙        ↘
 *   APPROVED   REJECTED
 *        ↓
 *   Duty transferred
 */

/**
 * @swagger
 * /api/transfer-requests:
 *   post:
 *     tags:
 *       - Transfer Requests
 *     summary: Create a transfer request
 *     description: >
 *       Creates a new examination duty transfer request.
 *
 *       A Faculty member, COE, or SUPER_ADMIN can request to transfer
 *       one of their assigned examination duties to another faculty member.
 *
 *       The request is created with **PENDING** status and must be
 *       approved by the COE before the duty is transferred.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - examDutyId
 *               - toEmployeeId
 *             properties:
 *               examDutyId:
 *                 type: string
 *                 format: uuid
 *                 example: 40c8f88a-ce8a-45fc-8375-20aae5ecdbb5
 *               toEmployeeId:
 *                 type: string
 *                 format: uuid
 *                 example: 409a5d6e-8aef-43b7-a534-34c501681a14
 *               reason:
 *                 type: string
 *                 example: Medical emergency
 *     responses:
 *       201:
 *         description: Transfer request created successfully.
 *       400:
 *         description: Invalid request or business rule violation.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Exam duty or employee not found.
 *       409:
 *         description: A pending transfer request already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests:
 *   get:
 *     tags:
 *       - Transfer Requests
 *     summary: Get all transfer requests
 *     description: >
 *       Returns all transfer requests in the system.
 *       Accessible only by COE and SUPER_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transfer requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests/pending:
 *   get:
 *     tags:
 *       - Transfer Requests
 *     summary: Get pending transfer requests
 *     description: >
 *       Returns all transfer requests that are waiting for approval.
 *       Accessible only by COE and SUPER_ADMIN.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Pending transfer requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests/my:
 *   get:
 *     tags:
 *       - Transfer Requests
 *     summary: Get my transfer requests
 *     description: >
 *       Returns all transfer requests created by the currently authenticated user.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Transfer requests retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests/{id}:
 *   get:
 *     tags:
 *       - Transfer Requests
 *     summary: Get transfer request by ID
 *     description: Returns a specific transfer request.
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
 *         description: Transfer request retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Transfer request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests/{id}/approve:
 *   patch:
 *     tags:
 *       - Transfer Requests
 *     summary: Approve a transfer request
 *     description: >
 *       Allows the COE or SUPER_ADMIN to approve a pending transfer request.
 *       Once approved, the examination duty is transferred to the target employee,
 *       activity logs are recorded, and notifications are sent.
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
 *               approvalRemark:
 *                 type: string
 *                 example: Approved after verification.
 *     responses:
 *       200:
 *         description: Transfer request approved successfully.
 *       400:
 *         description: Request has already been processed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Transfer request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests/{id}/reject:
 *   patch:
 *     tags:
 *       - Transfer Requests
 *     summary: Reject a transfer request
 *     description: >
 *       Allows the COE or SUPER_ADMIN to reject a pending transfer request.
 *       The requester is notified and the transfer request status becomes REJECTED.
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
 *               approvalRemark:
 *                 type: string
 *                 example: Faculty requirement cannot be changed.
 *     responses:
 *       200:
 *         description: Transfer request rejected successfully.
 *       400:
 *         description: Request has already been processed.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Transfer request not found.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/transfer-requests/{id}/cancel:
 *   patch:
 *     tags:
 *       - Transfer Requests
 *     summary: Cancel a transfer request
 *     description: >
 *       Allows the requester to cancel a pending transfer request before it is processed.
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
 *               reason:
 *                 type: string
 *                 example: No longer required.
 *     responses:
 *       200:
 *         description: Transfer request cancelled successfully.
 *       400:
 *         description: Only pending requests can be cancelled.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Transfer request not found.
 *       500:
 *         description: Internal server error.
 */