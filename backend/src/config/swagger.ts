import swaggerJsdoc from "swagger-jsdoc";

const swaggerOptions: swaggerJsdoc.Options = {
  definition: {
    openapi: "3.0.3",

    info: {
      title: "Exam Duty Management System API",

      version: "1.2.0",

      description:
        "REST API documentation for the Exam Duty Management System.",
    },

    servers: [
      {
        url: "http://localhost:5000",
        description: "Development Server",
      },
    ],

    components: {
      parameters: {
        ReportPage: {
          name: "page",
          in: "query",
          schema: { type: "integer", minimum: 1, default: 1 },
        },
        ReportLimit: {
          name: "limit",
          in: "query",
          schema: { type: "integer", minimum: 1, maximum: 100, default: 10 },
        },
        ReportSearch: {
          name: "search",
          in: "query",
          schema: { type: "string" },
        },
        ReportStatus: {
          name: "status",
          in: "query",
          schema: { type: "string" },
        },
        EmployeeRole: {
          name: "role",
          in: "query",
          schema: {
            type: "string",
            enum: ["SUPER_ADMIN", "COE", "HOD", "FACULTY"],
          },
        },
        EmployeeIsActive: {
          name: "isActive",
          in: "query",
          schema: { type: "boolean" },
        },
        ReportDepartmentId: {
          name: "departmentId",
          in: "query",
          schema: { type: "string", format: "uuid" },
        },
        ReportFromDate: {
          name: "fromDate",
          in: "query",
          schema: { type: "string", format: "date" },
        },
        ReportToDate: {
          name: "toDate",
          in: "query",
          schema: { type: "string", format: "date" },
        },
        ReportSortBy: {
          name: "sortBy",
          in: "query",
          schema: { type: "string" },
        },
        ReportSortOrder: {
          name: "sortOrder",
          in: "query",
          schema: { type: "string", enum: ["asc", "desc"], default: "asc" },
        },
      },
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },

    security: [
      {
        bearerAuth: [],
      },
    ],

    tags: [
      {
        name: "Authentication",
        description: "Authentication APIs",
      },
      {
        name: "Departments",
        description: "Department Management",
      },
      {
        name: "Employees",
        description: "Employee Management",
      },
      {
        name: "Exams",
        description: "Exam Management",
      },
      {
        name: "Exam Duties",
        description: "Exam Duty Management",
      },
      {
        name: "Transfer Requests",
        description: "Transfer Request Workflow",
      },
      {
        name: "Swap Requests",
        description: "Swap Request Workflow",
      },
      {
        name: "Notifications",
        description: "Notification APIs",
      },
      {
        name: "Activity Logs",
        description: "Activity Log APIs",
      },
      {
        name: "Reports",
        description: "Employee, exam, workflow, and workload reports.",
      },
    ],
  },

  apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
