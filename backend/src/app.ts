import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import departmentRoutes from "./routes/department.routes.js";
import employeeRoutes from "./routes/employee.routes.js";
import examRoutes from "./routes/exam.routes.js";
import examDutyRoutes from "./routes/examDuty.routes.js";
import activityLogRoutes from "./routes/activityLog.routes.js";
import notificationRoutes from "./routes/notification.routes.js";
import transferRequestRoutes from "./routes/transferRequest.routes.js";
import swapRequestRoutes from "./routes/swapRequest.routes.js";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./config/swagger.js";
import cookieParser from "cookie-parser";
import { APP_NAME, APP_VERSION } from "./constants/app.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import reportsRoutes from "./routes/reports.routes.js";

const app = express();

// Security headers
app.use(helmet());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);

// Request logging
app.use(morgan("dev"));

// Parse JSON
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());




app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// API Routes
app.use("/api/auth", authRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/exam-duties", examDutyRoutes);

app.use("/api/activity-logs", activityLogRoutes);

app.use("/api/notifications", notificationRoutes);

app.use("/api/transfer-requests", transferRequestRoutes);

app.use("/api/swap-requests", swapRequestRoutes);

app.use("/api/dashboard", dashboardRoutes);

app.use("/api/reports", reportsRoutes);

app.get("/", (req, res) => {
  res.json({
    success: true,
    name: APP_NAME,
    version: APP_VERSION,
  });
});

app.use((req, res) => {
    res.status(404).json({
        success: false,
        message: "Route not found"
    });
});
app.use(errorHandler);

export default app;
