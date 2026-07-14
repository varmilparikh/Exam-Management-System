
/**
 * @swagger
 * /api/employees:
 *   post:
 *     tags:
 *       - Employees
 *     summary: Create a new employee
 *     description: Creates a new employee account. Only SUPER_ADMIN can perform this operation.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - employeeCode
 *               - name
 *               - email
 *               - password
 *               - role
 *               - departmentId
 *             properties:
 *               employeeCode:
 *                 type: string
 *                 example: EMP101
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rahul@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password@123
 *               role:
 *                 type: string
 *                 enum:
 *                   - SUPER_ADMIN
 *                   - COE
 *                   - HOD
 *                   - FACULTY
 *                 example: FACULTY
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *                 example: 7d8b5f5d-f17d-4a66-82b3-72d67e7e3c44
 *     responses:
 *       201:
 *         description: Employee created successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       409:
 *         description: Employee already exists.
 *       500:
 *         description: Internal server error.
 */



/**
 * @swagger
 * /api/employees:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get all employees
 *     description: Returns a list of all employees.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Employees retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/employees/{id}:
 *   get:
 *     tags:
 *       - Employees
 *     summary: Get employee by ID
 *     description: Returns an employee by their unique ID.
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
 *         description: Employee retrieved successfully.
 *       401:
 *         description: Unauthorized.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/employees/{id}:
 *   put:
 *     tags:
 *       - Employees
 *     summary: Update employee
 *     description: Updates an existing employee. Only SUPER_ADMIN can perform this operation.
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
 *               name:
 *                 type: string
 *                 example: Rahul Sharma
 *               email:
 *                 type: string
 *                 format: email
 *                 example: rahul@example.com
 *               role:
 *                 type: string
 *                 enum:
 *                   - SUPER_ADMIN
 *                   - COE
 *                   - HOD
 *                   - FACULTY
 *               departmentId:
 *                 type: string
 *                 format: uuid
 *     responses:
 *       200:
 *         description: Employee updated successfully.
 *       400:
 *         description: Validation error.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */


/**
 * @swagger
 * /api/employees/{id}:
 *   delete:
 *     tags:
 *       - Employees
 *     summary: Delete employee
 *     description: Soft deletes an employee. Only SUPER_ADMIN can perform this operation.
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
 *         description: Employee deleted successfully.
 *       401:
 *         description: Unauthorized.
 *       403:
 *         description: Forbidden.
 *       404:
 *         description: Employee not found.
 *       500:
 *         description: Internal server error.
 */