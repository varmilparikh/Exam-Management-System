import { Request, Response } from "express";

import reportsService from "../services/reports.service.js";
import { employeeReportQuerySchema } from "../validators/reports.validator.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

import { workloadReportQuerySchema } from "../validators/workloadReport.validator.js";
import { examReportQuerySchema } from "../validators/examReport.validator.js";
import { transferReportQuerySchema } from "../validators/transferReport.validator.js";
import { swapReportQuerySchema } from "../validators/swapReport.validator.js";
import { dutyReportQuerySchema } from "../validators/dutyReport.validator.js";
import { activityReportQuerySchema } from "../validators/activityReport.validator.js";
import employeeRepository from "../repositories/employee.repository.js";
import { Role } from "../generated/prisma/client.js";
import { ApiError } from "../utils/apiError.js";

async function workloadScope(req: Request, filters: ReturnType<typeof workloadReportQuerySchema.parse>) {
  if (req.user?.role === Role.FACULTY) return { ...filters, facultyId: req.user.id, departmentId: undefined };
  if (req.user?.role === Role.HOD) {
    const employee = await employeeRepository.findById(req.user.id);
    if (!employee?.departmentId) throw new ApiError(403, "A department must be assigned before viewing this report.");
    return { ...filters, departmentId: employee.departmentId, facultyId: undefined };
  }
  return filters;
}

async function dutyScope(req: Request, filters: ReturnType<typeof dutyReportQuerySchema.parse>) {
  if (req.user?.role === Role.FACULTY) return { ...filters, employeeId: req.user.id, departmentId: undefined };
  if (req.user?.role === Role.HOD) {
    const employee = await employeeRepository.findById(req.user.id);
    if (!employee?.departmentId) throw new ApiError(403, "A department must be assigned before viewing this report.");
    return { ...filters, departmentId: employee.departmentId, employeeId: undefined };
  }
  return filters;
}

/**
 * Employee Report
 */
export const getEmployeeReport = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = employeeReportQuerySchema.parse(req.query);

    const report = await reportsService.getEmployeeReport(filters);

    res
      .status(200)
      .json(
        new ApiResponse(200, report, "Employee report fetched successfully"),
      );
  },
);

export const exportEmployeeCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = employeeReportQuerySchema.parse(req.query);

    const csv = await reportsService.exportEmployeeCSV(filters);

    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="employee-report.csv"',
    );

    res.status(200).send(csv);
  },
);

export const exportEmployeeExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = employeeReportQuerySchema.parse(req.query);

    const buffer = await reportsService.exportEmployeeExcel(filters);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="employee-report.xlsx"',
    );

    res.send(buffer);
  },
);

export const exportEmployeePDF = asyncHandler(async (req, res) => {
  const filters = employeeReportQuerySchema.parse(req.query);

  const pdf = await reportsService.exportEmployeePDF(filters);

  res.setHeader("Content-Type", "application/pdf");

  res.setHeader(
    "Content-Disposition",
    'attachment; filename="employee-report.pdf"',
  );

  res.send(pdf);
});

export const getFacultyWorkloadReport = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = await workloadScope(req, workloadReportQuerySchema.parse(req.query));

    const report = await reportsService.getFacultyWorkloadReport(filters);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          report,
          "Faculty workload report fetched successfully",
        ),
      );
  },
);

export const exportFacultyWorkloadCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = await workloadScope(req, workloadReportQuerySchema.parse(req.query));

    const csv = await reportsService.exportFacultyWorkloadCSV(filters);

    res.setHeader("Content-Type", "text/csv");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="faculty-workload-report.csv"',
    );

    res.status(200).send(csv);
  },
);

export const exportFacultyWorkloadExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = await workloadScope(req, workloadReportQuerySchema.parse(req.query));

    const buffer = await reportsService.exportFacultyWorkloadExcel(filters);

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="faculty-workload-report.xlsx"',
    );

    res.send(buffer);
  },
);

export const exportFacultyWorkloadPDF = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = await workloadScope(req, workloadReportQuerySchema.parse(req.query));

    const pdf = await reportsService.exportFacultyWorkloadPDF(filters);

    res.setHeader("Content-Type", "application/pdf");

    res.setHeader(
      "Content-Disposition",
      'attachment; filename="faculty-workload-report.pdf"',
    );

    res.send(pdf);
  },
);

export const getExamReport = asyncHandler(async (req: Request, res: Response) => {
  const filters = examReportQuerySchema.parse(req.query);
  const report = await reportsService.getExamReport(filters);
  res
    .status(200)
    .json(new ApiResponse(200, report, "Exam report fetched successfully"));
});

export const exportExamCSV = asyncHandler(async (req: Request, res: Response) => {
  const filters = examReportQuerySchema.parse(req.query);
  const csv = await reportsService.exportExamCSV(filters);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", 'attachment; filename="exam-report.csv"');
  res.status(200).send(csv);
});

export const exportExamExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = examReportQuerySchema.parse(req.query);
    const buffer = await reportsService.exportExamExcel(filters);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="exam-report.xlsx"',
    );
    res.send(buffer);
  },
);

export const exportExamPDF = asyncHandler(async (req: Request, res: Response) => {
  const filters = examReportQuerySchema.parse(req.query);
  const pdf = await reportsService.exportExamPDF(filters);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="exam-report.pdf"');
  res.send(pdf);
});

export const getTransferReport = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = transferReportQuerySchema.parse(req.query);
    const report = await reportsService.getTransferReport(filters);
    res
      .status(200)
      .json(new ApiResponse(200, report, "Transfer report fetched successfully"));
  },
);

export const exportTransferCSV = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = transferReportQuerySchema.parse(req.query);
    const csv = await reportsService.exportTransferCSV(filters);
    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transfer-report.csv"',
    );
    res.status(200).send(csv);
  },
);

export const exportTransferExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = transferReportQuerySchema.parse(req.query);
    const buffer = await reportsService.exportTransferExcel(filters);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transfer-report.xlsx"',
    );
    res.send(buffer);
  },
);

export const exportTransferPDF = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = transferReportQuerySchema.parse(req.query);
    const pdf = await reportsService.exportTransferPDF(filters);
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="transfer-report.pdf"',
    );
    res.send(pdf);
  },
);

export const getSwapReport = asyncHandler(async (req: Request, res: Response) => {
  const filters = swapReportQuerySchema.parse(req.query);
  const report = await reportsService.getSwapReport(filters);
  res
    .status(200)
    .json(new ApiResponse(200, report, "Swap report fetched successfully"));
});

export const exportSwapCSV = asyncHandler(async (req: Request, res: Response) => {
  const filters = swapReportQuerySchema.parse(req.query);
  const csv = await reportsService.exportSwapCSV(filters);
  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    'attachment; filename="swap-report.csv"',
  );
  res.status(200).send(csv);
});

export const exportSwapExcel = asyncHandler(
  async (req: Request, res: Response) => {
    const filters = swapReportQuerySchema.parse(req.query);
    const buffer = await reportsService.exportSwapExcel(filters);
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    );
    res.setHeader(
      "Content-Disposition",
      'attachment; filename="swap-report.xlsx"',
    );
    res.send(buffer);
  },
);

export const exportSwapPDF = asyncHandler(async (req: Request, res: Response) => {
  const filters = swapReportQuerySchema.parse(req.query);
  const pdf = await reportsService.exportSwapPDF(filters);
  res.setHeader("Content-Type", "application/pdf");
  res.setHeader("Content-Disposition", 'attachment; filename="swap-report.pdf"');
  res.send(pdf);
});

export const getReportsOverview = asyncHandler(async (_req, res) => {
  const overview = await reportsService.getReportsOverview();
  res.status(200).json(new ApiResponse(200, overview, "Reports overview fetched successfully"));
});

export const getDutyReport = asyncHandler(async (req, res) => {
  const filters = await dutyScope(req, dutyReportQuerySchema.parse(req.query));
  const report = await reportsService.getDutyReport(filters);
  res.status(200).json(new ApiResponse(200, report, "Duty report fetched successfully"));
});

export const exportDutyReport = asyncHandler(async (req, res) => {
  const filters = await dutyScope(req, dutyReportQuerySchema.parse(req.query));
  const rawFormat = req.params.format;
  if (rawFormat !== "csv" && rawFormat !== "excel" && rawFormat !== "pdf") throw new ApiError(400, "Unsupported export format.");
  const file = await reportsService.exportDutyReport(filters, rawFormat);
  const extension = rawFormat === "excel" ? "xlsx" : rawFormat;
  const contentType = rawFormat === "csv" ? "text/csv" : rawFormat === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="duty-report.${extension}"`);
  res.status(200).send(file);
});

export const getActivityReport = asyncHandler(async (req, res) => {
  const filters = activityReportQuerySchema.parse(req.query);
  const report = await reportsService.getActivityReport(filters);
  res.status(200).json(new ApiResponse(200, report, "Activity report fetched successfully"));
});

export const exportActivityReport = asyncHandler(async (req, res) => {
  const filters = activityReportQuerySchema.parse(req.query);
  const rawFormat = req.params.format;
  if (rawFormat !== "csv" && rawFormat !== "excel" && rawFormat !== "pdf") throw new ApiError(400, "Unsupported export format.");
  const file = await reportsService.exportActivityReport(filters, rawFormat);
  const extension = rawFormat === "excel" ? "xlsx" : rawFormat;
  const contentType = rawFormat === "csv" ? "text/csv" : rawFormat === "pdf" ? "application/pdf" : "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
  res.setHeader("Content-Type", contentType);
  res.setHeader("Content-Disposition", `attachment; filename="activity-report.${extension}"`);
  res.status(200).send(file);
});
