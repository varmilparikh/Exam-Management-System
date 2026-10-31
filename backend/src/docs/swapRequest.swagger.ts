/**
 * @swagger
 * /api/swap-requests:
 *   get:
 *     tags: [Swap Requests]
 *     summary: List swap requests visible to the current user
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Swap requests with both faculty members and duties. }
 *   post:
 *     tags: [Swap Requests]
 *     summary: Request an examination duty swap
 *     description: The receiver must accept. The system then validates and exchanges both duties in a transaction; no authority approval is used.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [receiverId, requesterDutyId, receiverDutyId, reason]
 *             properties:
 *               receiverId: { type: string, format: uuid }
 *               requesterDutyId: { type: string, format: uuid }
 *               receiverDutyId: { type: string, format: uuid }
 *               reason: { type: string, minLength: 5, maxLength: 500 }
 *     responses:
 *       201: { description: Swap request created and receiver notified. }
 *       400: { description: Request validation failed. }
 *       409: { description: A duplicate or conflicting swap exists. }
 * /api/swap-requests/{id}/accept:
 *   patch:
 *     tags: [Swap Requests]
 *     summary: Accept and complete a swap request
 *     description: Only the receiving faculty can accept. The system verifies duty ownership, exam status, schedule conflicts and active opt-ins before exchanging assignments.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Duties exchanged and swap marked COMPLETED. Authorities and both faculty members are notified; actions are logged. }
 *       403: { description: Only the receiver may accept. }
 *       409: { description: The swap was processed or a schedule conflict exists. }
 * /api/swap-requests/{id}/reject:
 *   patch:
 *     tags: [Swap Requests]
 *     summary: Reject a swap request
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema: { type: object, required: [reason], properties: { reason: { type: string, minLength: 5 } } }
 *     responses:
 *       200: { description: Request rejected, parties notified, and action logged. }
 * /api/swap-requests/{id}/cancel:
 *   patch:
 *     tags: [Swap Requests]
 *     summary: Cancel a pending swap request
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Request cancelled and receiver and authorities notified. }
 */
