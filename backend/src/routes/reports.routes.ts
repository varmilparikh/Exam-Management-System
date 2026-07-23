import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import {
  getEmployeeReport,
  exportEmployeeCSV,
  exportEmployeeExcel,
  exportEmployeePDF
} from "../controllers/reports.controller.js";

const router = Router();

router.get(
  "/employees",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  getEmployeeReport,
);

router.get(
  "/employees/export/csv",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  exportEmployeeCSV,
);

router.get(
  "/employees/export/excel",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE"),
  exportEmployeeExcel,
);

router.get(
    "/employees/export/pdf",
    verifyJWT,
    authorizeRoles(
        "SUPER_ADMIN",
        "COE",
    ),
    exportEmployeePDF,
);

export default router;
