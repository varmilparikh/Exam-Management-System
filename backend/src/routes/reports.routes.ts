import { Router } from "express";

import { verifyJWT } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import {
  getEmployeeReport,
  exportEmployeeCSV,
  exportEmployeeExcel,
  exportEmployeePDF,
  getFacultyWorkloadReport,
  exportFacultyWorkloadCSV,
  exportFacultyWorkloadExcel,
  exportFacultyWorkloadPDF,
  getExamReport,
  exportExamCSV,
  exportExamExcel,
  exportExamPDF,
  getTransferReport,
  exportTransferCSV,
  exportTransferExcel,
  exportTransferPDF,
  getSwapReport,
  exportSwapCSV,
  exportSwapExcel,
  exportSwapPDF,
  getReportsOverview,
  getDutyReport,
  exportDutyReport,
  getActivityReport,
  exportActivityReport,
} from "../controllers/reports.controller.js";

const router = Router();

router.get("/overview", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), getReportsOverview);
router.get("/duties", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"), getDutyReport);
router.get("/duties/export/:format", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"), exportDutyReport);
router.get("/activity", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), getActivityReport);
router.get("/activity/export/:format", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportActivityReport);

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
  authorizeRoles("SUPER_ADMIN", "COE"),
  exportEmployeePDF,
);

router.get(
  "/workload",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  getFacultyWorkloadReport,
);

router.get(
  "/workload/export/csv",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  exportFacultyWorkloadCSV,
);

router.get(
  "/workload/export/excel",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  exportFacultyWorkloadExcel,
);

router.get(
  "/workload/export/pdf",
  verifyJWT,
  authorizeRoles("SUPER_ADMIN", "COE", "HOD", "FACULTY"),
  exportFacultyWorkloadPDF,
);

router.get("/exams", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), getExamReport);
router.get("/exams/export/csv", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportExamCSV);
router.get("/exams/export/excel", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportExamExcel);
router.get("/exams/export/pdf", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportExamPDF);

router.get("/transfers", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), getTransferReport);
router.get("/transfers/export/csv", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportTransferCSV);
router.get("/transfers/export/excel", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportTransferExcel);
router.get("/transfers/export/pdf", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportTransferPDF);

router.get("/swaps", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), getSwapReport);
router.get("/swaps/export/csv", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportSwapCSV);
router.get("/swaps/export/excel", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportSwapExcel);
router.get("/swaps/export/pdf", verifyJWT, authorizeRoles("SUPER_ADMIN", "COE"), exportSwapPDF);

export default router;
