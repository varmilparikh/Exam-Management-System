/**
 * @swagger
 * /api/exam-opt-ins/upcoming:
 *   get:
 *     tags: [Exam Opt-ins]
 *     summary: List upcoming sessions and the signed-in faculty member's opt-in status
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Upcoming exam sessions with capacity and the current opt-in state. }
 * /api/exam-opt-ins:
 *   post:
 *     tags: [Exam Opt-ins]
 *     summary: Opt into an upcoming examination session
 *     description: Duplicate active opt-ins, full sessions, duties and overlapping pending/confirmed opt-ins are rejected.
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [examId]
 *             properties:
 *               examId: { type: string, format: uuid }
 *     responses:
 *       201: { description: Opt-in saved and authorities notified. }
 *       409: { description: Duplicate opt-in, capacity reached, or schedule conflict. }
 * /api/exam-opt-ins/{id}/confirm:
 *   patch:
 *     tags: [Exam Opt-ins]
 *     summary: Confirm a faculty opt-in and assign the duty
 *     description: Restricted to COE and SUPER_ADMIN. Capacity and schedule availability are rechecked transactionally.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Opt-in confirmed, duty assigned, and faculty notified. }
 *       409: { description: Capacity or schedule conflict. }
 * /api/exam-opt-ins/{id}/reject:
 *   patch:
 *     tags: [Exam Opt-ins]
 *     summary: Reject a faculty opt-in
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     requestBody:
 *       content:
 *         application/json:
 *           schema: { type: object, properties: { remark: { type: string, maxLength: 500 } } }
 *     responses:
 *       200: { description: Opt-in rejected and faculty notified. }
 */
