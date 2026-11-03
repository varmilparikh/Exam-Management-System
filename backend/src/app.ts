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
import examOptInRoutes from "./routes/examOptIn.routes.js";
import prisma from "./config/prisma.js";
import { env } from "./config/env.js";

const app = express();

app.set("trust proxy", 1);

// Security headers
app.use(helmet());

// Same-origin production requests need no CORS headers. Cross-origin browser
// access receives CORS headers only for the explicit CLIENT_URL allowlist.
const allowedClientOrigins = new Set([
  ...env.clientOrigins,
  ...(env.NODE_ENV === "production"
    ? []
    : ["http://localhost:5173", "http://127.0.0.1:5173"]),
]);

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        callback(null, false);
        return;
      }

      callback(null, allowedClientOrigins.has(origin) ? origin : false);
    },
    credentials: true,
  }),
);

// Do not log query strings: report searches and filters can contain personal
// information. Keep health probes out of the normal request log as well.
app.use(
  morgan((tokens, req, res) => {
    const path = new URL(req.url ?? "/", "http://localhost").pathname;

    if (path.startsWith("/health/")) return undefined;

    return JSON.stringify({
      method: tokens.method?.(req, res) ?? req.method,
      path,
      status: tokens.status?.(req, res) ?? res.statusCode,
      durationMs: Number(tokens["response-time"]?.(req, res) ?? 0),
    });
  }),
);

// Parse JSON
app.use(express.json());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

app.get("/health/live", (_req, res) => {
  res.status(200).json({ status: "live" });
});

app.get("/health/ready", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.status(200).json({ status: "ready" });
  } catch {
    res.status(503).json({ status: "not_ready" });
  }
});
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

app.use("/api/exam-opt-ins", examOptInRoutes);

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
    message: "Route not found",
  });
});
app.use(errorHandler);

export default app;
