import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/auth.routes.js";
import { errorHandler } from "./middleware/error.middleware.js";
import departmentRoutes from "./routes/department.routes.js";

const app = express();

app.use(express.json());

app.use(cors());

app.use(helmet());

app.use(morgan("dev"));

app.use("/api/auth", authRoutes);

app.use("/api/departments", departmentRoutes);

console.log("App initialized");

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "Exam Management API",
  });
});

app.use(errorHandler);

export default app;