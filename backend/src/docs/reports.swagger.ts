/**
 * @swagger
 * /api/reports/employees:
 *   get:
 *     tags:
 *       - Reports
 *     summary: Get Employee Report
 *     description: Returns a paginated employee report with support for searching, filtering and sorting.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *         description: Page number.
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of records per page.
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by employee name, employee code or email.
 *       - in: query
 *         name: departmentId
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Filter by department.
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *           enum:
 *             - SUPER_ADMIN
 *             - COE
 *             - HOD
 *             - FACULTY
 *         description: Filter by employee role.
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter active or inactive employees.
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           example: name
 *         description: Field to sort by.
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum:
 *             - asc
 *             - desc
 *         description: Sort direction.
 *     responses:
 *       200:
 *         description: Employee report fetched successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       500:
 *         description: Internal server error.
 */