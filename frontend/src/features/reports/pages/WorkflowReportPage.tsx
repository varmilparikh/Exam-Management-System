import { useState, type ReactNode } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { reportsService } from "../api/reports.service";
import { downloadBlob } from "../utils/downloadReport";
import type { StatusReportFilters } from "../types/report";
import type { SwapReportResponse, TransferReportResponse } from "../types/report";

type WorkflowReportKind = "transfers" | "swaps";
const DEFAULT_FILTERS: StatusReportFilters = {
  page: 1,
  limit: 20,
  search: "",
  status: "",
  fromDate: "",
  toDate: "",
  sortBy: "createdAt",
  sortOrder: "desc",
};
const TRANSFER_STATUSES = ["PENDING", "ACCEPTED", "APPROVED", "REJECTED", "CANCELLED"];
const SWAP_STATUSES = ["PENDING", "ACCEPTED", "APPROVED", "COMPLETED", "REJECTED", "CANCELLED"];

export default function WorkflowReportPage({ kind }: { kind: WorkflowReportKind }) {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [exporting, setExporting] = useState<"csv" | "excel" | "pdf" | null>(null);
  const [exportError, setExportError] = useState("");
  const isTransfer = kind === "transfers";
  const title = isTransfer ? "Transfer Request Report" : "Swap Request Report";
  const statuses = isTransfer ? TRANSFER_STATUSES : SWAP_STATUSES;

  const { data, isLoading, isFetching, error } = useQuery<TransferReportResponse | SwapReportResponse>({
    queryKey: ["reports", kind, filters],
    queryFn: () => isTransfer
      ? reportsService.getTransferReport(filters)
      : reportsService.getSwapReport(filters),
  });

  const updateFilter = <K extends keyof StatusReportFilters>(key: K, value: StatusReportFilters[K]) => {
    setFilters((current) => ({ ...current, [key]: value, page: key === "page" ? (value as number) : 1 }));
  };

  const handleExport = async (format: "csv" | "excel" | "pdf") => {
    try {
      setExportError("");
      setExporting(format);
      const exportFilters = { ...filters, page: 1 };
      const blob = isTransfer
        ? await reportsService.exportTransferReport(exportFilters, format)
        : await reportsService.exportSwapReport(exportFilters, format);
      downloadBlob(blob, `${isTransfer ? "transfer" : "swap"}-report.${format === "excel" ? "xlsx" : format}`);
    } catch {
      setExportError(`Could not export the ${isTransfer ? "transfer" : "swap"} report. Please try again.`);
    } finally {
      setExporting(null);
    }
  };

  if (error) return <p className="p-6 text-sm text-red-600">Failed to load {title.toLowerCase()}.</p>;

  const rows = (data?.rows ?? []).map((row) => "fromEmployee" in row
    ? { id: row.id, exam: row.exam, examDate: row.examDate, first: row.fromEmployee, second: row.toEmployee, requestType: row.requestType, status: row.status, reason: row.reason, reviewer: row.approvedBy, completion: row.approvedAt, createdAt: row.createdAt }
    : { id: row.id, exam: row.exam, examDate: "", first: row.requester, second: row.receiver, requestType: "", status: row.status, reason: row.reason, reviewer: "", completion: row.completedAt, createdAt: row.createdAt });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-semibold">{title}</h1>
        <p className="mt-1 text-sm text-slate-500">Search and export the full request history.</p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-6">
        <SummaryCard label="Matching requests" value={data?.summary.total ?? 0} />
        {statuses.map((status) => <SummaryCard key={status} label={status[0] + status.slice(1).toLowerCase()} value={data?.summary.statusCounts[status] ?? 0} />)}
      </div>

      <div className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)] md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <label className="text-sm font-medium">Search
          <input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="Exam or faculty name" className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-medium">Status
          <select value={filters.status} onChange={(event) => updateFilter("status", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal">
            <option value="">All statuses</option>{statuses.map((status) => <option key={status}>{status}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">From date
          <input type="date" value={filters.fromDate} max={filters.toDate || undefined} onChange={(event) => updateFilter("fromDate", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-medium">To date
          <input type="date" value={filters.toDate} min={filters.fromDate || undefined} onChange={(event) => updateFilter("toDate", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-medium">Sort by
          <select value={filters.sortBy} onChange={(event) => updateFilter("sortBy", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal">
            <option value="createdAt">Request date</option><option value="approvedAt">Approval date</option><option value="status">Status</option>
          </select>
        </label>
        <label className="text-sm font-medium">Order
          <select value={filters.sortOrder} onChange={(event) => updateFilter("sortOrder", event.target.value as "asc" | "desc")} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal">
            <option value="asc">Ascending</option><option value="desc">Descending</option>
          </select>
        </label>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-sm text-slate-500">{data?.pagination.total ?? 0} requests</p>
        <div className="flex gap-2">
          <ExportButton format="csv" exporting={exporting} onExport={handleExport}><Download size={16} /> CSV</ExportButton>
          <ExportButton format="excel" exporting={exporting} onExport={handleExport}><FileSpreadsheet size={16} /> Excel</ExportButton>
          <ExportButton format="pdf" exporting={exporting} onExport={handleExport}><FileText size={16} /> PDF</ExportButton>
        </div>
      </div>
      {exportError && <p className="text-sm text-red-600">{exportError}</p>}

      <div className="overflow-hidden rounded-xl border bg-white">
        {isLoading ? <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div> : <>
          <div className="overflow-x-auto">
            <table className="min-w-250 w-full">
              <thead><tr className="border-b border-slate-200 bg-slate-50/90 text-left text-sm font-semibold">
                <th className="px-4 py-3">Exam</th>
                {isTransfer && <th className="px-4 py-3">Exam date</th>}
                <th className="px-4 py-3">{isTransfer ? "From employee" : "Requester"}</th>
                <th className="px-4 py-3">{isTransfer ? "To employee" : "Receiver"}</th>
                <th className="px-4 py-3">{isTransfer ? "Request type" : "Swap status"}</th><th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">{isTransfer ? "Reviewed by" : "Completed on"}</th>
                <th className="px-4 py-3">Requested on</th>
              </tr></thead>
              <tbody>
                {rows.length === 0 ? <tr><td colSpan={isTransfer ? 9 : 8} className="px-4 py-10 text-center text-sm text-slate-500">No requests match these filters.</td></tr> : rows.map((row) => <tr key={row.id} className="border-b last:border-b-0">
                  <td className="px-4 py-3 text-sm">{row.exam}</td>
                  {isTransfer && <td className="whitespace-nowrap px-4 py-3 text-sm">{row.examDate ? new Date(row.examDate).toLocaleDateString() : "—"}</td>}
                  <td className="px-4 py-3 text-sm">{row.first}</td><td className="px-4 py-3 text-sm">{row.second}</td>
                  <td className="px-4 py-3 text-sm">{isTransfer ? `${row.requestType === "NEEDS_ASSISTANCE" ? "Needs assistance" : "Replacement found"} · ${row.status}` : row.status}</td><td className="max-w-60 px-4 py-3 text-sm">{row.reason || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">{row.completion ? new Date(row.completion).toLocaleString() : row.reviewer || "—"}</td>
                  <td className="whitespace-nowrap px-4 py-3 text-sm">{new Date(row.createdAt).toLocaleString()}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <Pagination page={filters.page} totalPages={data?.pagination.totalPages ?? 1} isFetching={isFetching} onPageChange={(page) => updateFilter("page", page)} />
        </>}
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
  return <div className="flex items-center justify-between border-t px-4 py-3"><p className="text-sm text-slate-500">Page {page} of {totalPages}{isFetching ? " • Updating..." : ""}</p><div className="flex gap-2">
    <Button size="sm" variant="secondary" disabled={page <= 1 || isFetching} onClick={() => onPageChange(page - 1)}>Previous</Button>
    <Button size="sm" variant="secondary" disabled={page >= totalPages || isFetching} onClick={() => onPageChange(page + 1)}>Next</Button>
  </div></div>;
}
