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

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/departments", departmentRoutes);

app.use("/api/employees", employeeRoutes);

app.use("/api/exams", examRoutes);

app.use("/api/exam-duties", examDutyRoutes);

app.use("/api/activity-logs", activityLogRoutes);

app.use("/api/notifications", notificationRoutes);

console.log("App initialized");

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Exam Management API",
  });
});

app.use(errorHandler);

export default app;