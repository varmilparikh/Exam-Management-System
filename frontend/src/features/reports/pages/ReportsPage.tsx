import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Download, FileSpreadsheet, FileText } from "lucide-react";
import { Link } from "react-router-dom";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

import { useEmployees } from "@/features/employees/hooks/useEmployees";
import { useEmployeeReport } from "../hooks/useEmployeeReport";
import { reportsService } from "../api/reports.service";
import { downloadBlob } from "../utils/downloadReport";

import type { EmployeeReportFilters } from "../types/report";
import { ROUTES } from "@/constants/routes";

const DEFAULT_FILTERS: EmployeeReportFilters = {
  page: 1,
  limit: 20,
  search: "",
  departmentId: "",
  role: "",
  isActive: "",
  sortBy: "name",
  sortOrder: "asc",
};

export default function ReportsPage() {
  const [filters, setFilters] =
    useState<EmployeeReportFilters>(DEFAULT_FILTERS);

  const [exporting, setExporting] = useState<"csv" | "excel" | "pdf" | null>(
    null,
  );
  const [exportError, setExportError] = useState("");
  const { data: overview } = useQuery({ queryKey: ["reports", "overview"], queryFn: reportsService.getReportsOverview });

  const { data: employees = [] } = useEmployees();

  const {
    data: report,
    isLoading,
    isFetching,
    error,
  } = useEmployeeReport(filters);

  const departmentOptions = useMemo(() => {
    const map = new Map<string, string>();

    employees.forEach((employee) => {
      if (employee.department) {
        map.set(employee.department.id, employee.department.name);
      }
    });

    return Array.from(map.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [employees]);

  const updateFilter = <K extends keyof EmployeeReportFilters>(
    key: K,
    value: EmployeeReportFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? (value as number) : 1,
    }));
  };

  const handleExport = async (type: "csv" | "excel" | "pdf") => {
    try {
      setExportError("");
      setExporting(type);

      const blob =
        type === "csv"
          ? await reportsService.exportEmployeeCSV(filters)
          : type === "excel"
            ? await reportsService.exportEmployeeExcel(filters)
            : await reportsService.exportEmployeePDF(filters);

      const extension =
        type === "csv" ? "csv" : type === "excel" ? "xlsx" : "pdf";

      downloadBlob(blob, `employee-report.${extension}`);
    } catch {
      setExportError("Could not export the employee report. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Reports</h1>

        <p className="mt-4 text-sm text-red-600">
          Failed to load employee report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-2xl font-semibold">Reports</h1>

        <p className="mt-1 text-sm text-gray-500">
          Employee and faculty workload reports with CSV, Excel and PDF exports.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6">
        {[
          ["Active exams", overview?.activeExams ?? 0],
          ["Upcoming exams", overview?.upcomingExams ?? 0],
          ["Duties", overview?.duties ?? 0],
          ["Pending transfers", overview?.pendingTransfers ?? 0],
          ["Pending opt-ins", overview?.pendingOptIns ?? 0],
          ["Completed swaps", overview?.completedSwaps ?? 0],
        ].map(([label, value]) => <div key={label} className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>)}
      </div>

      <Link
        to={ROUTES.REPORTS_WORKLOAD}
        className="flex items-center justify-between rounded-xl border bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
      >
        <div>
          <h2 className="font-semibold">Faculty workload report</h2>
          <p className="mt-1 text-sm text-gray-500">
            Review duty assignments, attendance, absences and transfers by
            faculty.
          </p>
        </div>
        <ArrowRight size={18} aria-hidden="true" />
      </Link>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {[
          { to: ROUTES.REPORTS_EXAMS, title: "Exam report", detail: "Sessions, assigned faculty, open positions and status." },
          { to: ROUTES.REPORTS_DUTIES, title: "Duty report", detail: "Faculty assignments, exam sessions and duty status." },
          { to: ROUTES.REPORTS_TRANSFERS, title: "Transfer requests", detail: "Replacement and assistance requests with review outcomes." },
          { to: ROUTES.REPORTS_SWAPS, title: "Swap requests", detail: "Both faculties, exchanged duties and completion." },
          { to: ROUTES.REPORTS_ACTIVITY, title: "Activity report", detail: "Audited user actions with filters and exports." },
        ].map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className="flex items-center justify-between rounded-xl border bg-white p-4 transition-colors hover:border-blue-300 hover:bg-blue-50"
          >
            <div>
              <h2 className="font-semibold">{item.title}</h2>
              <p className="mt-1 text-sm text-gray-500">{item.detail}</p>
            </div>
            <ArrowRight size={18} aria-hidden="true" />
          </Link>
        ))}
      </div>

      <div className="rounded-xl border bg-white p-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Search</label>

            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Name, code or email"
              className="w-full rounded-lg border px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Department</label>

            <select
              value={filters.departmentId}
              onChange={(event) =>
                updateFilter("departmentId", event.target.value)
              }
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All Departments</option>

              {departmentOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Role</label>

            <select
              value={filters.role}
              onChange={(event) => updateFilter("role", event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All Roles</option>
              <option value="SUPER_ADMIN">Super Admin</option>
              <option value="COE">COE</option>
              <option value="HOD">HOD</option>
              <option value="FACULTY">Faculty</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Status</label>

            <select
              value={filters.isActive}
              onChange={(event) => updateFilter("isActive", event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="">All</option>
              <option value="true">Active</option>
              <option value="false">Inactive</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Sort by</label>
            <select
              value={filters.sortBy}
              onChange={(event) => updateFilter("sortBy", event.target.value)}
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="name">Name</option>
              <option value="employeeCode">Employee code</option>
              <option value="email">Email</option>
              <option value="attendedCount">Attended duties</option>
              <option value="transferCount">Transfers</option>
              <option value="averageDuty">Average duty</option>
              <option value="createdAt">Created date</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(event) =>
                updateFilter("sortOrder", event.target.value as "asc" | "desc")
              }
              className="w-full rounded-lg border px-3 py-2 text-sm"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-gray-500">
          {report?.pagination.total ?? 0} employees
        </p>

        <div className="flex flex-wrap gap-2">
          <Button
            size="sm"
            variant="secondary"
            disabled={!!exporting}
            loading={exporting === "csv"}
            onClick={() => handleExport("csv")}
          >
            <Download size={16} />
            CSV
          </Button>

          <Button
            size="sm"
            variant="secondary"
            disabled={!!exporting}
            loading={exporting === "excel"}
            onClick={() => handleExport("excel")}
          >
            <FileSpreadsheet size={16} />
            Excel
          </Button>

          <Button
            size="sm"
            variant="secondary"
            disabled={!!exporting}
            loading={exporting === "pdf"}
            onClick={() => handleExport("pdf")}
          >
            <FileText size={16} />
            PDF
          </Button>
        </div>
      </div>

      {exportError && <p className="text-sm text-red-600">{exportError}</p>}

      <div className="overflow-hidden rounded-xl border bg-white">
        {isLoading ? (
          <div className="space-y-3 p-6">
            <Skeleton />
            <Skeleton />
            <Skeleton />
            <Skeleton />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-250 w-full">
                <thead>
                  <tr className="border-b bg-gray-50">
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Employee Code
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Name
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Email
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Designation
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Role
                    </th>
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Department
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Attended
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Transfers
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Average
                    </th>
                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Status
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report?.employees.length === 0 ? (
                    <tr>
                      <td
                        colSpan={10}
                        className="px-4 py-10 text-center text-sm text-gray-500"
                      >
                        No employees found.
                      </td>
                    </tr>
                  ) : (
                    report?.employees.map((employee) => (
                      <tr
                        key={employee.id}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3 text-sm">
                          {employee.employeeCode}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium">
                          {employee.name}
                        </td>

                        <td className="px-4 py-3 text-sm">{employee.email}</td>

                        <td className="px-4 py-3 text-sm">
                          {employee.designation}
                        </td>

                        <td className="px-4 py-3 text-sm">{employee.role}</td>

                        <td className="px-4 py-3 text-sm">
                          {employee.department.name}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {employee.attendedCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {employee.transferCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {employee.averageDuty}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {employee.isActive ? "Active" : "Inactive"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-gray-500">
                Page {report?.pagination.page ?? 1} of{" "}
                {report?.pagination.totalPages ?? 1}
                {isFetching ? " • Updating..." : ""}
              </p>

              <div className="flex gap-2">
                <Button
                  size="sm"
                  variant="secondary"
                  disabled={filters.page <= 1 || isFetching}
                  onClick={() => updateFilter("page", filters.page - 1)}
                >
                  Previous
                </Button>

                <Button
                  size="sm"
                  variant="secondary"
                  disabled={
                    !report ||
                    filters.page >= report.pagination.totalPages ||
                    isFetching
                  }
                  onClick={() => updateFilter("page", filters.page + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
