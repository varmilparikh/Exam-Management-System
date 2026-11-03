import assert from "node:assert/strict";
import test from "node:test";
import reportExportService from "./reportExport.service.js";
import type { ReportColumn } from "../types/report.js";

type Row = { label: string; note: string; normal: string };

const columns: ReportColumn<Row>[] = [
  { id: "label", title: "Label" },
  { id: "note", title: "Note" },
  { id: "normal", title: "Normal" },
];

test("CSV exports neutralize spreadsheet formulas in text values", () => {
  const csv = reportExportService.generateCSV(
    [
      {
        label: "=HYPERLINK(\"https://example.com\",\"open\")",
        note: "  @SUM(A1:A2), user supplied",
        normal: "Faculty member",
      },
      { label: "+1+1", note: "-2+3", normal: "ordinary text" },
      { label: "\t=2+2", note: "\r@SUM(A1)", normal: "unchanged" },
    ],
    columns,
  );

  assert.match(csv, /'=HYPERLINK/);
  assert.ok(csv.includes("\"'  @SUM(A1:A2), user supplied\""));
  assert.match(csv, /'\+1\+1,'-2\+3/);
  assert.match(csv, /'\t=2\+2,'\r@SUM\(A1\)/);
  assert.match(csv, /Faculty member/);
  assert.match(csv, /ordinary text/);
  assert.match(csv, /unchanged/);
});

test("Excel exports remain readable with the patched UUID dependency", async () => {
  const buffer = await reportExportService.generateExcel(
    [{ employee: "Example Faculty", dutyCount: 2 }],
    [
      { id: "employee", title: "Employee" },
      { id: "dutyCount", title: "Duty count" },
    ],
    "Security smoke",
  );

  assert.equal(buffer.subarray(0, 2).toString("ascii"), "PK");
  assert.ok(buffer.length > 100);
});
