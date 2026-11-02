import { useState, type ReactNode } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import QueryErrorState from "@/components/common/QueryErrorState/QueryErrorState";
import { reportsService } from "../api/reports.service";
import { downloadBlob } from "../utils/downloadReport";
import type { StatusReportFilters } from "../types/report";

const STATUSES = ["UPCOMING", "ACTIVE", "COMPLETED", "CANCELLED"];
const DEFAULT_FILTERS: StatusReportFilters = {
  page: 1,
  limit: 20,
  search: "",
  status: "",
  fromDate: "",
  toDate: "",
  sortBy: "examDate",
  sortOrder: "asc",
};

export default function ExamReportPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [exporting, setExporting] = useState<"csv" | "excel" | "pdf" | null>(null);
  const [exportError, setExportError] = useState("");

  const { data, isLoading, isFetching, error, refetch } = useQuery({
    queryKey: ["reports", "exams", filters],
    queryFn: () => reportsService.getExamReport(filters),
  });

  const updateFilter = <K extends keyof StatusReportFilters>(
    key: K,
    value: StatusReportFilters[K],
  ) => {
    setFilters((current) => ({
      ...current,
      [key]: value,
      page: key === "page" ? (value as number) : 1,
    }));
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      setExportError("");
      setExporting(format);
      const blob = await reportsService.exportExamReport(
        { ...filters, page: 1 },
        format,
      );
      downloadBlob(blob, `exam-report.${format === "excel" ? "xlsx" : format}`);
    } catch {
      setExportError("Could not export the exam report. Please try again.");
    } finally {
      setExporting(null);
    }
  };

  if (error) return <QueryErrorState title="Exam report is unavailable" message="Check your connection and try again." onRetry={() => void refetch()} />;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">Exam Report</h1>
        <p className="mt-1 text-sm text-slate-500">
          Review examination schedules, staffing requirements and status.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        <SummaryCard label="Matching exams" value={data?.summary.total ?? 0} />
        {STATUSES.map((status) => (
          <SummaryCard
            key={status}
            label={status[0] + status.slice(1).toLowerCase()}
            value={data?.summary.statusCounts[status] ?? 0}
          />
        ))}
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="text-sm font-medium">
          Search
          <input
            value={filters.search}
            onChange={(event) => updateFilter("search", event.target.value)}
            placeholder="Exam name"
            className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Status
          <select
            value={filters.status}
            onChange={(event) => updateFilter("status", event.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"
          >
            <option value="">All statuses</option>
            {STATUSES.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">
          From date
          <input
            type="date"
            value={filters.fromDate}
            max={filters.toDate || undefined}
            onChange={(event) => updateFilter("fromDate", event.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          To date
          <input
            type="date"
            value={filters.toDate}
            min={filters.fromDate || undefined}
            onChange={(event) => updateFilter("toDate", event.target.value)}
            className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"
          />
        </label>
        <label className="text-sm font-medium">
          Sort by
          <select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal">
            <option value="examDate">Exam date</option>
            <option value="examName">Exam name</option>
            <option value="requiredFaculty">Required faculty</option>
            <option value="status">Status</option>
            <option value="createdAt">Created date</option>
          </select>
        </label>
        <label className="text-sm font-medium">
          Order
          <select value={filters.sortOrder} onChange={(event) => updateFilter("sortOrder", event.target.value as "asc" | "desc")} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal">
            <option value="asc">Ascending</option><option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{data?.pagination.total ?? 0} exams</p>
        <div className="flex gap-2">
          <ExportButton format="csv" exporting={exporting} onExport={handleExport}>
            <Download size={16} /> CSV
          </ExportButton>
          <ExportButton format="excel" exporting={exporting} onExport={handleExport}>
            <FileSpreadsheet size={16} /> Excel
          </ExportButton>
          <ExportButton format="pdf" exporting={exporting} onExport={handleExport}>
            <FileText size={16} /> PDF
          </ExportButton>
        </div>
      </div>
      {exportError && <p className="text-sm text-red-600">{exportError}</p>}

      <div className="overflow-hidden rounded-xl border bg-white">
        {isLoading ? (
          <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-200 w-full">
                <thead><tr className="border-b border-slate-200 bg-slate-50/90 text-left text-sm font-semibold">
                  <th className="px-4 py-3">Exam</th><th className="px-4 py-3">Date</th>
                  <th className="px-4 py-3 text-center">Required faculty</th>
                  <th className="px-4 py-3 text-center">Assigned</th><th className="px-4 py-3 text-center">Positions left</th>
                  <th className="px-4 py-3">Session</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Created</th>
                </tr></thead>
                <tbody>
                  {data?.rows.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-10 text-center text-sm text-slate-500">No exams match these filters.</td></tr>
                  ) : data?.rows.map((exam) => (
                    <tr key={exam.id} className="border-b last:border-b-0">
                      <td className="px-4 py-3 text-sm font-medium">{exam.examName}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(exam.examDate)}</td>
                      <td className="px-4 py-3 text-center text-sm">{exam.requiredFaculty}</td>
                      <td className="px-4 py-3 text-center text-sm">{exam.assignedFaculty}</td>
                      <td className="px-4 py-3 text-center text-sm">{exam.remainingPositions}</td>
                      <td className="whitespace-nowrap px-4 py-3 text-sm">{exam.sessionName} · {formatTime(exam.startTime)}–{formatTime(exam.endTime)}</td>
                      <td className="px-4 py-3 text-sm">{exam.status}</td>
                      <td className="px-4 py-3 text-sm">{formatDate(exam.createdAt)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Pagination
              page={filters.page}
              totalPages={data?.pagination.totalPages ?? 1}
              isFetching={isFetching}
              onPageChange={(page) => updateFilter("page", page)}
            />
          </>
        )}
      </div>
    </div>
  );
}

function SummaryCard({ label, value }: { label: string; value: number }) {
  return <div className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]"><p className="text-sm text-slate-500">{label}</p><p className="mt-2 text-2xl font-semibold">{value}</p></div>;
}

function ExportButton({ format, exporting, onExport, children }: {
  format: "csv" | "excel" | "pdf";
  exporting: "csv" | "excel" | "pdf" | null;
  onExport: (format: "csv" | "excel" | "pdf") => void;
  children: ReactNode;
}) {
  return <Button size="sm" variant="secondary" disabled={!!exporting} loading={exporting === format} onClick={() => onExport(format)}>{children}</Button>;
}

function Pagination({ page, totalPages, isFetching, onPageChange }: {
  page: number;
  totalPages: number;
  isFetching: boolean;
  onPageChange: (page: number) => void;
}) {
  return <div className="flex items-center justify-between border-t px-4 py-3">
    <p className="text-sm text-slate-500">Page {page} of {totalPages}{isFetching ? " • Updating..." : ""}</p>
    <div className="flex gap-2">
      <Button size="sm" variant="secondary" disabled={page <= 1 || isFetching} onClick={() => onPageChange(page - 1)}>Previous</Button>
      <Button size="sm" variant="secondary" disabled={page >= totalPages || isFetching} onClick={() => onPageChange(page + 1)}>Next</Button>
    </div>
  </div>;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString();
}

function formatTime(value: string) {
  return new Date(value).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" });
}
