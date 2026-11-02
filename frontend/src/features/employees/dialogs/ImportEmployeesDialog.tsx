import { useState, type ChangeEvent } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import { downloadBlob } from "@/features/reports/utils/downloadReport";
import { useDepartments } from "@/features/departments/hooks/useDepartments";
import { getErrorMessage } from "@/lib/getErrorMessage";

import {
  employeeService,
  type CreateEmployeeDto,
} from "../api/employee.service";
import { employeeKeys } from "../queryKeys";
import { createEmployeeSchema } from "../schemas/employee.schema";

interface ImportRow {
  line: number;
  employee: CreateEmployeeDto;
}

const TEMPLATE =
  "employeeCode,name,email,password,designation,department,role,phone\r\n";
const REQUIRED_HEADERS = [
  "employeecode",
  "name",
  "email",
  "password",
  "designation",
  "department",
  "role",
];
const VALID_ROLES = ["SUPER_ADMIN", "COE", "HOD", "FACULTY"] as const;

function parseCsv(text: string): string[][] {
  const content = text.replace(/^\uFEFF/, "");
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < content.length; index += 1) {
    const character = content[index];

    if (quoted) {
      if (character === '"' && content[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field);
      field = "";
    } else if (character === "\n" || character === "\r") {
      row.push(field);
      if (row.some((value) => value.trim() !== "")) rows.push(row);
      row = [];
      field = "";
      if (character === "\r" && content[index + 1] === "\n") index += 1;
    } else {
      field += character;
    }
  }

  if (quoted) throw new Error("The CSV contains an unclosed quoted field.");
  row.push(field);
  if (row.some((value) => value.trim() !== "")) rows.push(row);

  return rows;
}

function csvRowsToEmployees(
  csvRows: string[][],
  departments: Array<{ id: string; name: string }>,
): { employees: ImportRow[]; errors: string[] } {
  if (csvRows.length < 2) {
    return { employees: [], errors: ["Add at least one employee row below the header."] };
  }

  const headers = csvRows[0].map((header) => header.trim().toLowerCase());
  const missing = REQUIRED_HEADERS.filter((header) => !headers.includes(header));
  if (missing.length > 0) {
    return {
      employees: [],
      errors: [`Missing required column(s): ${missing.join(", ")}.`],
    };
  }

  const column = (name: string) => headers.indexOf(name.toLowerCase());
  const seenEmails = new Set<string>();
  const seenCodes = new Set<string>();
  const errors: string[] = [];
  const employees: ImportRow[] = [];

  csvRows.slice(1).forEach((values, index) => {
    const line = index + 2;
    const role = values[column("role")]?.trim().toUpperCase();
    const departmentName = values[column("department")]?.trim() ?? "";
    const department = departments.find(
      (item) => item.name.trim().toLowerCase() === departmentName.toLowerCase(),
    );
    const employeeCode = values[column("employeeCode")]?.trim() ?? "";
    const email = values[column("email")]?.trim() ?? "";
    const keyEmail = email.toLowerCase();
    const keyCode = employeeCode.toLowerCase();

    if (!department) {
      errors.push(`Row ${line}: department “${departmentName}” was not found.`);
      return;
    }
    if (!VALID_ROLES.includes(role as (typeof VALID_ROLES)[number])) {
      errors.push(`Row ${line}: role must be SUPER_ADMIN, COE, HOD, or FACULTY.`);
      return;
    }
    if (seenEmails.has(keyEmail)) {
      errors.push(`Row ${line}: duplicate email in this CSV.`);
      return;
    }
    if (seenCodes.has(keyCode)) {
      errors.push(`Row ${line}: duplicate employee code in this CSV.`);
      return;
    }

    const validation = createEmployeeSchema.safeParse({
      employeeCode,
      name: values[column("name")]?.trim() ?? "",
      email,
      password: values[column("password")] ?? "",
      designation: values[column("designation")]?.trim() ?? "",
      departmentId: department.id,
      role,
      phone: values[column("phone")]?.trim() ?? "",
    });

    if (!validation.success) {
      const message = validation.error.issues
        .map((issue) => `${issue.path.join(".") || "row"}: ${issue.message}`)
        .join("; ");
      errors.push(`Row ${line}: ${message}.`);
      return;
    }

    seenEmails.add(keyEmail);
    seenCodes.add(keyCode);
    employees.push({
      line,
      employee: validation.data as CreateEmployeeDto,
    });
  });

  return { employees, errors };
}

export default function ImportEmployeesDialog() {
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [rows, setRows] = useState<ImportRow[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [result, setResult] = useState<{ created: number; failed: string[] }>();
  const [isParsing, setIsParsing] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const { data: departments = [] } = useDepartments();
  const queryClient = useQueryClient();

  const reset = () => {
    setFileName("");
    setRows([]);
    setErrors([]);
    setResult(undefined);
    setIsParsing(false);
    setIsImporting(false);
  };

  const handleOpenChange = (nextOpen: boolean) => {
    setOpen(nextOpen);
    if (!nextOpen) reset();
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    setFileName(file.name);
    setRows([]);
    setErrors([]);
    setResult(undefined);
    setIsParsing(true);

    try {
      const parsed = parseCsv(await file.text());
      const validation = csvRowsToEmployees(parsed, departments);
      setRows(validation.employees);
      setErrors(validation.errors);
    } catch (error) {
      setErrors([getErrorMessage(error)]);
    } finally {
      setIsParsing(false);
    }
  };

  const handleImport = async () => {
    if (rows.length === 0 || errors.length > 0) return;

    setIsImporting(true);
    const failed: string[] = [];
    let created = 0;

    for (const row of rows) {
      try {
        await employeeService.create(row.employee);
        created += 1;
      } catch (error) {
        failed.push(`Row ${row.line}: ${getErrorMessage(error)}`);
      }
    }

    if (created > 0) {
      await queryClient.invalidateQueries({ queryKey: employeeKeys.all });
      toast.success(`Imported ${created} employee(s).`);
    }
    if (failed.length > 0) {
      toast.error(`${failed.length} employee row(s) could not be imported.`);
    }

    setResult({ created, failed });
    setIsImporting(false);
  };

  return (
    <>
      <Button variant="secondary" onClick={() => setOpen(true)}>
        Import CSV
      </Button>

      <Dialog.Root open={open} onOpenChange={handleOpenChange}>
        <Dialog.Content maxWidth="lg">
          <Dialog.Header
            title="Import employees from CSV"
            description="Create employee accounts from a CSV file. Imported accounts receive the password provided in the file."
          />
          <Dialog.Body>
            <div className="space-y-4">
              <div className="rounded-lg bg-slate-50 p-4 text-sm text-slate-700">
                Required headers: <code>{REQUIRED_HEADERS.join(", ")}</code>.
                Add optional <code>phone</code>. The department value must match
                an existing department name. Passwords must meet the account
                password rules.
                <Button
                  className="mt-3"
                  size="sm"
                  variant="outline"
                  onClick={() =>
                    downloadBlob(
                      new Blob([`\uFEFF${TEMPLATE}`], {
                        type: "text/csv;charset=utf-8",
                      }),
                      "employee-import-template.csv",
                    )
                  }
                >
                  Download CSV template
                </Button>
              </div>

              <label className="block space-y-2 text-sm font-medium text-slate-700">
                Select CSV file
                <input
                  type="file"
                  accept=".csv,text/csv"
                  onChange={(event) => void handleFileChange(event)}
                  disabled={isParsing || isImporting || !!result}
                  className="block w-full rounded-lg border border-slate-300 p-2 text-sm"
                />
              </label>

              {fileName && <p className="text-sm text-slate-600">{fileName}</p>}
              {isParsing && (
                <p className="text-sm text-slate-500">Checking CSV…</p>
              )}
              {rows.length > 0 && errors.length === 0 && !result && (
                <p className="text-sm text-green-700">
                  {rows.length} employee row(s) are valid and ready to import.
                </p>
              )}
              {errors.length > 0 && (
                <div className="space-y-1 text-sm text-red-700" role="alert">
                  {errors.map((error) => (
                    <p key={error}>{error}</p>
                  ))}
                  <p>Fix the CSV and select it again. No rows were imported.</p>
                </div>
              )}
              {result && (
                <div className="space-y-1 text-sm" role="status">
                  <p className="text-green-700">
                    Created {result.created} employee(s).
                  </p>
                  {result.failed.map((error) => (
                    <p key={error} className="text-red-700">
                      {error}
                    </p>
                  ))}
                </div>
              )}
            </div>
          </Dialog.Body>
          <Dialog.Footer>
            <Button variant="outline" onClick={() => handleOpenChange(false)}>
              Close
            </Button>
            <Button
              onClick={() => void handleImport()}
              loading={isImporting}
              disabled={
                isParsing ||
                isImporting ||
                !!result ||
                rows.length === 0 ||
                errors.length > 0
              }
            >
              Import {rows.length || "employees"}
            </Button>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
}
