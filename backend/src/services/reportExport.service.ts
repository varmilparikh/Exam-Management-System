import ExcelJS from "exceljs";
import PDFDocument from "pdfkit";
import { createObjectCsvStringifier } from "csv-writer";

import type { ReportColumn } from "../types/report.js";

class ReportExportService {
  /**
   * Generate CSV string
   */
  generateCSV<T extends object>(data: T[], columns: ReportColumn<T>[]): string {
    const csvStringifier = createObjectCsvStringifier({
      header: columns.map((column) => ({
        id: column.id as string,
        title: column.title,
      })),
    });

    return (
      csvStringifier.getHeaderString() + csvStringifier.stringifyRecords(data)
    );
  }

  async generateExcel<T extends object>(
    data: T[],
    columns: ReportColumn<T>[],
    worksheetName: string,
  ): Promise<Buffer> {
    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet(worksheetName);

    worksheet.columns = columns.map((column) => ({
      header: column.title,
      key: column.id as string,
      width: column.width ? Math.round(column.width / 7) : 20,
    }));

    worksheet.addRows(data);

    // Make header row bold
    worksheet.getRow(1).font = {
      bold: true,
    };

    return Buffer.from(await workbook.xlsx.writeBuffer());
  }

  async generatePDF<T extends object>(
    data: T[],
    columns: ReportColumn<T>[],
    title: string,
  ): Promise<Buffer> {
    return new Promise((resolve, reject) => {
      const doc = new PDFDocument({
        margin: 40,
        size: "A4",
      });

      const buffers: Buffer[] = [];

      doc.on("data", (chunk) => buffers.push(chunk));

      doc.on("end", () => {
        resolve(Buffer.concat(buffers));
      });

      doc.on("error", reject);

      // Title
      doc.fontSize(18).text(title, {
        align: "center",
      });

      doc.moveDown();

      // Headers
      doc.fontSize(10).font("Helvetica-Bold");

      columns.forEach((column) => {
        doc.text(column.title, {
          continued: true,
          width: 100,
        });
      });

      doc.moveDown();

      // Rows
      doc.font("Helvetica");

      data.forEach((row) => {
        columns.forEach((column) => {
          doc.text(String(row[column.id] ?? ""), {
            continued: true,
            width: 100,
          });
        });

        doc.moveDown();
      });

      doc.end();
    });
  }
}

export default new ReportExportService();
