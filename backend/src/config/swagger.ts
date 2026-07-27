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
    ],
  },

  apis: ["./src/routes/*.ts", "./src/docs/*.ts"],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);

export default swaggerSpec;
