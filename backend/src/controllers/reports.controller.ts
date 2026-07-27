import { Request, Response } from "express";

import reportsService from "../services/reports.service.js";
import { employeeReportQuerySchema } from "../validators/reports.validator.js";

import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiResponse } from "../utils/apiResponse.js";

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
