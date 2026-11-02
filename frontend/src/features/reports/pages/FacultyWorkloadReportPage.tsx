import { useMemo, useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";

import { useEmployees } from "@/features/employees/hooks/useEmployees";

import { useFacultyWorkloadReport } from "../hooks/useFacultyWorkloadReport";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { hasPermission } from "@/permissions/hasPermission";
import {
  exportFacultyWorkloadCSV,
  exportFacultyWorkloadExcel,
  exportFacultyWorkloadPDF,
} from "../api/reports.service";
import { downloadBlob } from "../utils/downloadReport";
import type { FacultyWorkloadFilters } from "../types/report";

const DEFAULT_FILTERS: FacultyWorkloadFilters = {
  page: 1,
  limit: 10,
  search: "",
  departmentId: "",
  facultyId: "",
  fromDate: "",
  toDate: "",
  sortBy: "name",
  sortOrder: "asc",
};

export default function FacultyWorkloadReportPage() {
  const [filters, setFilters] =
    useState<FacultyWorkloadFilters>(DEFAULT_FILTERS);

  const [exporting, setExporting] = useState<"csv" | "excel" | "pdf" | null>(
    null,
  );
  const [exportError, setExportError] = useState("");
  const { data: currentUser } = useCurrentUser();
  const canChooseScope = hasPermission(currentUser?.role, "employee:view");

  const { data: employees = [] } = useEmployees(undefined, canChooseScope);

  const {
    data: report,
    isLoading,
    isFetching,
    error,
  } = useFacultyWorkloadReport(filters);

  const faculty = useMemo(
    () =>
      employees.filter(
        (employee) => employee.role === "FACULTY" && employee.isActive,
      ),
    [employees],
  );

  const departments = useMemo(() => {
    const departmentMap = new Map<string, string>();

    faculty.forEach((employee) => {
      if (employee.department) {
        departmentMap.set(employee.department.id, employee.department.name);
      }
    });

    return Array.from(departmentMap.entries()).map(([value, label]) => ({
      value,
      label,
    }));
  }, [faculty]);

  const updateFilter = <K extends keyof FacultyWorkloadFilters>(
    key: K,
    value: FacultyWorkloadFilters[K],
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

      const exportFilters = { ...filters, page: 1 };
      const blob =
        type === "csv"
          ? await exportFacultyWorkloadCSV(exportFilters)
          : type === "excel"
            ? await exportFacultyWorkloadExcel(exportFilters)
            : await exportFacultyWorkloadPDF(exportFilters);

      const extension =
        type === "csv" ? "csv" : type === "excel" ? "xlsx" : "pdf";

      downloadBlob(blob, `faculty-workload-report.${extension}`);
    } catch {
      setExportError("Could not export the faculty workload report. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  if (error) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Faculty Workload Report</h1>

        <p className="mt-4 text-sm text-red-600">
          Failed to load faculty workload report.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Faculty Workload Report</h1>

        <p className="mt-1 text-sm text-slate-500">
          Analyze faculty duty allocation and attendance.
        </p>
      </div>

      {/* Summary */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Total Faculty</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.totalFaculty ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Total Duties</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.totalDuties ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Assigned</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.totalAssigned ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Attended</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.totalAttended ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Absent</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.totalAbsent ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Transferred</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.totalTransferred ?? 0}
          </p>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
          <p className="text-sm text-slate-500">Avg Duties</p>

          <p className="mt-2 text-2xl font-semibold">
            {report?.summary.averageDutiesPerFaculty ?? 0}
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-7">
          <div>
            <label className="mb-1 block text-sm font-medium">Search</label>

            <input
              value={filters.search}
              onChange={(event) => updateFilter("search", event.target.value)}
              placeholder="Name, code or email"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          {canChooseScope && <div>
            <label className="mb-1 block text-sm font-medium">Department</label>

            <select
              value={filters.departmentId}
              onChange={(event) =>
                updateFilter("departmentId", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Departments</option>

              {departments.map((department) => (
                <option key={department.value} value={department.value}>
                  {department.label}
                </option>
              ))}
            </select>
          </div>}

          {canChooseScope && <div>
            <label className="mb-1 block text-sm font-medium">Faculty</label>

            <select
              value={filters.facultyId}
              onChange={(event) =>
                updateFilter("facultyId", event.target.value)
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="">All Faculty</option>

              {faculty.map((employee) => (
                <option key={employee.id} value={employee.id}>
                  {employee.name}
                </option>
              ))}
            </select>
          </div>}

          <div>
            <label className="mb-1 block text-sm font-medium">From Date</label>

            <input
              type="date"
              value={filters.fromDate}
              max={filters.toDate || undefined}
              onChange={(event) => updateFilter("fromDate", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">To Date</label>

            <input
              type="date"
              value={filters.toDate}
              min={filters.fromDate || undefined}
              onChange={(event) => updateFilter("toDate", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Sort by</label>
            <select
              value={filters.sortBy}
              onChange={(event) => updateFilter("sortBy", event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="name">Faculty name</option>
              <option value="employeeCode">Employee code</option>
              <option value="totalDuties">Total duties</option>
              <option value="assignedCount">Assigned</option>
              <option value="attendedCount">Attended</option>
              <option value="absentCount">Absent</option>
              <option value="transferCount">Transferred</option>
            </select>
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">Order</label>
            <select
              value={filters.sortOrder}
              onChange={(event) =>
                updateFilter("sortOrder", event.target.value as "asc" | "desc")
              }
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm shadow-slate-900/[0.02] focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
            >
              <option value="asc">Ascending</option>
              <option value="desc">Descending</option>
            </select>
          </div>
        </div>
      </div>

      {/* Export */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">
          {report?.pagination.total ?? 0} faculty
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

      {/* Table */}
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
                  <tr className="border-b border-slate-200 bg-slate-50/90">
                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Employee Code
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Faculty
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Email
                    </th>

                    <th className="px-4 py-3 text-left text-sm font-semibold">
                      Department
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Total
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Assigned
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Attended
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Absent
                    </th>

                    <th className="px-4 py-3 text-center text-sm font-semibold">
                      Transferred
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {report?.rows.length === 0 ? (
                    <tr>
                      <td
                        colSpan={9}
                        className="px-4 py-10 text-center text-sm text-slate-500"
                      >
                        No faculty workload data found.
                      </td>
                    </tr>
                  ) : (
                    report?.rows.map((row) => (
                      <tr
                        key={row.employeeId}
                        className="border-b last:border-b-0"
                      >
                        <td className="px-4 py-3 text-sm">
                          {row.employeeCode}
                        </td>

                        <td className="px-4 py-3 text-sm font-medium">
                          {row.name}
                        </td>

                        <td className="px-4 py-3 text-sm">{row.email}</td>

                        <td className="px-4 py-3 text-sm">{row.department}</td>

                        <td className="px-4 py-3 text-center text-sm">
                          {row.totalDuties}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {row.assignedCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {row.attendedCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {row.absentCount}
                        </td>

                        <td className="px-4 py-3 text-center text-sm">
                          {row.transferCount}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between border-t px-4 py-3">
              <p className="text-sm text-slate-500">
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
