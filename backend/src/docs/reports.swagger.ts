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

/**
 * @swagger
 * /api/reports/exams:
 *   get:
 *     tags: [Reports]
 *     summary: Get exam report
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportPage'
 *       - $ref: '#/components/parameters/ReportLimit'
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: Paginated exam report and status summary. }
 *       400: { description: Invalid report filters. }
 *       401: { description: Unauthorized. }
 *       403: { description: Forbidden. }
 * /api/reports/exams/export/csv:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching exams as CSV
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: CSV file. }
 * /api/reports/exams/export/excel:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching exams as Excel
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: Excel workbook. }
 * /api/reports/exams/export/pdf:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching exams as PDF
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: PDF document. }
 * /api/reports/transfers:
 *   get:
 *     tags: [Reports]
 *     summary: Get transfer request report
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportPage'
 *       - $ref: '#/components/parameters/ReportLimit'
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: Paginated transfer report and status summary. }
 *       400: { description: Invalid report filters. }
 * /api/reports/transfers/export/csv:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching transfer requests as CSV
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: CSV file. }
 * /api/reports/transfers/export/excel:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching transfer requests as Excel
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: Excel workbook. }
 * /api/reports/transfers/export/pdf:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching transfer requests as PDF
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: PDF document. }
 * /api/reports/swaps:
 *   get:
 *     tags: [Reports]
 *     summary: Get swap request report
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportPage'
 *       - $ref: '#/components/parameters/ReportLimit'
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: Paginated swap report and status summary. }
 *       400: { description: Invalid report filters. }
 * /api/reports/swaps/export/csv:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching swap requests as CSV
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: CSV file. }
 * /api/reports/swaps/export/excel:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching swap requests as Excel
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: Excel workbook. }
 * /api/reports/swaps/export/pdf:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching swap requests as PDF
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportStatus'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *     responses:
 *       200: { description: PDF document. }
 */

/**
 * @swagger
 * /api/reports/workload:
 *   get:
 *     tags: [Reports]
 *     summary: Get faculty workload report
 *     description: SUPER_ADMIN and COE may filter all faculty. HOD results are forced to their department and faculty results are forced to the signed-in user.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportPage'
 *       - $ref: '#/components/parameters/ReportLimit'
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *       - in: query
 *         name: departmentId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: facultyId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Paginated faculty workload and overall summary. }
 *       400: { description: Invalid report filters. }
 * /api/reports/workload/export/csv:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching faculty workloads as CSV
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - in: query
 *         name: departmentId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: facultyId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: CSV file. }
 * /api/reports/workload/export/excel:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching faculty workloads as Excel
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - in: query
 *         name: departmentId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: facultyId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: Excel workbook. }
 * /api/reports/workload/export/pdf:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching faculty workloads as PDF
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *       - in: query
 *         name: departmentId
 *         schema: { type: string, format: uuid }
 *       - in: query
 *         name: facultyId
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200: { description: PDF document. }
 * /api/reports/employees/export/csv:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching employees as CSV
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *       - $ref: '#/components/parameters/EmployeeRole'
 *       - $ref: '#/components/parameters/EmployeeIsActive'
 *       - $ref: '#/components/parameters/ReportDepartmentId'
 *     responses:
 *       200: { description: CSV file. }
 * /api/reports/employees/export/excel:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching employees as Excel
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *       - $ref: '#/components/parameters/EmployeeRole'
 *       - $ref: '#/components/parameters/EmployeeIsActive'
 *       - $ref: '#/components/parameters/ReportDepartmentId'
 *     responses:
 *       200: { description: Excel workbook. }
 * /api/reports/employees/export/pdf:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching employees as PDF
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportSortBy'
 *       - $ref: '#/components/parameters/ReportSortOrder'
 *       - $ref: '#/components/parameters/EmployeeRole'
 *       - $ref: '#/components/parameters/EmployeeIsActive'
 *       - $ref: '#/components/parameters/ReportDepartmentId'
 *     responses:
 *       200: { description: PDF document. }
 */

/**
 * @swagger
 * /api/reports/overview:
 *   get:
 *     tags: [Reports]
 *     summary: Get combined report overview statistics
 *     security: [{ bearerAuth: [] }]
 *     responses:
 *       200: { description: Summary counts for employees, exams, duties, transfers, swaps, opt-ins and activity. }
 * /api/reports/duties:
 *   get:
 *     tags: [Reports]
 *     summary: Get the paginated duty report
 *     description: HOD results are restricted to their department and faculty results to their own duties.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportPage'
 *       - $ref: '#/components/parameters/ReportLimit'
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *     responses:
 *       200: { description: Faculty, exam session, department and duty status rows with status totals. }
 * /api/reports/activity:
 *   get:
 *     tags: [Reports]
 *     summary: Get the paginated activity report
 *     description: Restricted to SUPER_ADMIN and COE.
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - $ref: '#/components/parameters/ReportPage'
 *       - $ref: '#/components/parameters/ReportLimit'
 *       - $ref: '#/components/parameters/ReportSearch'
 *       - $ref: '#/components/parameters/ReportFromDate'
 *       - $ref: '#/components/parameters/ReportToDate'
 *     responses:
 *       200: { description: "User, action, description, entity and timestamp rows with action totals." }
 * /api/reports/duties/export/{format}:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching duty rows
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         schema: { type: string, enum: [csv, excel, pdf] }
 *     responses:
 *       200: { description: Complete duty report export in the requested format. }
 * /api/reports/activity/export/{format}:
 *   get:
 *     tags: [Reports]
 *     summary: Export all matching activity rows
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: format
 *         required: true
 *         schema: { type: string, enum: [csv, excel, pdf] }
 *     responses:
 *       200: { description: Complete activity report export in the requested format. }
 */
