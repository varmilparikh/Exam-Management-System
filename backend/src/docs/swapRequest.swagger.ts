/**
 * @swagger
 * tags:
 *   - name: Swap Requests
 *     description: |
 *       Workflow for swapping examination duties.
 *
 *       Swap lifecycle:
 *       1. Faculty A creates a swap request.
 *       2. Faculty B accepts or rejects the request.
 *       3. If accepted, the request is sent to the COE.
 *       4. COE approves or rejects the request.
 *       5. If approved, both examination duties are exchanged.
 */

/**
 * @swagger
 * /api/swap-requests:
 *   post:
 *     tags:
 *       - Swap Requests
 *     summary: Create a swap request
 *     description: >
 *       Creates a new examination duty swap request.
 *       Only FACULTY members can initiate a swap.
 *       The request is sent to another faculty member for acceptance.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - receiverId
 *               - requesterDutyId
 *               - receiverDutyId
 *             properties:
 *               receiverId:
 *                 type: string
 *                 format: uuid
 *               requesterDutyId:
 *                 type: string
 *                 format: uuid
 *               receiverDutyId:
 *                 type: string
 *                 format: uuid
 *               reason:
 *                 type: string
 *                 example: Personal emergency
 *     responses:
 *       201:
 *         description: Swap request created successfully.
 *       400:
 *         description: Invalid request or business rule violation.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Pending swap request already exists.
 *       500:
 *         description: Internal server error.
 */

/**
 * @swagger
 * /api/swap-requests/{id}/accept:
 *   patch:
 *     tags:
 *       - Swap Requests
 *     summary: Accept a swap request
 *     description: >
 *       Allows the receiving faculty member to accept the swap request.
 *       Once accepted, the request moves to the COE for approval.
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
 *         description: Swap request accepted successfully.
 *       400:
 *         description: Only pending requests can be accepted.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Swap request not found.
 */

/**
 * @swagger
 * /api/swap-requests/{id}/reject:
 *   patch:
 *     tags:
 *       - Swap Requests
 *     summary: Reject a swap request
 *     description: >
 *       Allows the receiving faculty member to reject the swap request.
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
 *                 example: Already committed to another duty.
 *     responses:
 *       200:
 *         description: Swap request rejected successfully.
 *       400:
 *         description: Only pending requests can be rejected.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Swap request not found.
 */

/**
 * @swagger
 * /api/swap-requests/{id}/cancel:
 *   patch:
 *     tags:
 *       - Swap Requests
 *     summary: Cancel a swap request
 *     description: >
 *       Allows the requester to cancel a pending swap request before it is accepted.
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
 *         description: Swap request cancelled successfully.
 *       400:
 *         description: Only pending requests can be cancelled.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Swap request not found.
 */

/**
 * @swagger
 * /api/swap-requests/{id}/approve:
 *   patch:
 *     tags:
 *       - Swap Requests
 *     summary: Approve a swap request
 *     description: >
 *       Allows the COE to approve an accepted swap request.
 *       When approved, the duties of both faculty members are exchanged,
 *       notifications are sent, and activity logs are created.
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
 *         description: Swap request approved successfully.
 *       400:
 *         description: Only accepted requests can be approved.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Swap request not found.
 */

/**
 * @swagger
 * /api/swap-requests/{id}/reject-by-coe:
 *   patch:
 *     tags:
 *       - Swap Requests
 *     summary: Reject a swap request by COE
 *     description: >
 *       Allows the COE to reject an accepted swap request.
 *       Both faculty members are notified of the decision.
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
 *                 example: Insufficient staffing for reassignment.
 *     responses:
 *       200:
 *         description: Swap request rejected successfully.
 *       400:
 *         description: Only accepted requests can be rejected.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Swap request not found.
 */