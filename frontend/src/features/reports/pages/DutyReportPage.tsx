import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import QueryErrorState from "@/components/common/QueryErrorState/QueryErrorState";
import { reportsService } from "../api/reports.service";
import { downloadBlob } from "../utils/downloadReport";
import type { StatusReportFilters } from "../types/report";

const initialFilters: StatusReportFilters = { page: 1, limit: 20, search: "", status: "", fromDate: "", toDate: "", sortBy: "examDate", sortOrder: "asc" };
const statuses = ["ASSIGNED", "ATTENDED", "ABSENT", "TRANSFERRED"];

export default function DutyReportPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [exporting, setExporting] = useState<"csv" | "excel" | "pdf" | null>(null);
  const [exportError, setExportError] = useState("");
  const { data, isLoading, isFetching, error, refetch } = useQuery({ queryKey: ["reports", "duties", filters], queryFn: () => reportsService.getDutyReport(filters) });
  const update = <K extends keyof StatusReportFilters>(key: K, value: StatusReportFilters[K]) => setFilters((old) => ({ ...old, [key]: value, page: key === "page" ? value as number : 1 }));
  const exportAs = async (format: "csv" | "excel" | "pdf") => {
    setExporting(format); setExportError("");
    try { const blob = await reportsService.exportDutyReport({ ...filters, page: 1 }, format); downloadBlob(blob, `duty-report.${format === "excel" ? "xlsx" : format}`); }
    catch { setExportError("Could not export the duty report."); }
    finally { setExporting(null); }
  };
  if (error) return <QueryErrorState title="Duty report is unavailable" message="Check your connection and try again." onRetry={() => void refetch()} />;
  return <div className="space-y-6">
    <header><h1 className="text-2xl font-semibold">Duty Report</h1><p className="mt-1 text-sm text-slate-500">Faculty, exam session, department and duty status.</p></header>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">{["Matching duties", ...statuses].map((status) => <div key={status} className="rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)]"><p className="text-sm text-slate-500">{status}</p><p className="mt-2 text-2xl font-semibold">{status === "Matching duties" ? data?.summary.total ?? 0 : data?.summary.statusCounts[status] ?? 0}</p></div>)}</section>
    <section className="grid gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-[0_6px_20px_rgba(15,23,42,0.035)] md:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-medium">Search<input value={filters.search} onChange={(e) => update("search", e.target.value)} placeholder="Faculty or exam" className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" /></label>
      <label className="text-sm font-medium">Status<select value={filters.status} onChange={(e) => update("status", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"><option value="">All statuses</option>{statuses.map((s) => <option key={s}>{s}</option>)}</select></label>
      <label className="text-sm font-medium">From date<input type="date" value={filters.fromDate} max={filters.toDate || undefined} onChange={(e) => update("fromDate", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" /></label>
      <label className="text-sm font-medium">To date<input type="date" value={filters.toDate} min={filters.fromDate || undefined} onChange={(e) => update("toDate", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" /></label>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-slate-500">{data?.pagination.total ?? 0} duties</p><div className="flex gap-2">{(["csv", "excel", "pdf"] as const).map((format) => <Button key={format} size="sm" variant="secondary" disabled={!!exporting} loading={exporting === format} onClick={() => void exportAs(format)}>{format === "csv" ? <Download size={16} /> : format === "excel" ? <FileSpreadsheet size={16} /> : <FileText size={16} />}{format.toUpperCase()}</Button>)}</div></div>
    {exportError && <p className="text-sm text-red-600">{exportError}</p>}
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.035)]">{isLoading ? <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div> : <table className="w-full min-w-[760px] text-left text-sm"><thead className="bg-slate-50"><tr>{["Faculty", "Exam", "Date", "Session", "Department", "Status"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{!data?.rows.length ? <tr><td colSpan={6} className="px-4 py-10 text-center text-slate-500">No duties match these filters.</td></tr> : data.rows.map((row) => <tr key={row.id} className="border-t"><td className="px-4 py-3">{row.faculty}</td><td className="px-4 py-3">{row.exam}</td><td className="whitespace-nowrap px-4 py-3">{new Date(row.examDate).toLocaleDateString()}</td><td className="px-4 py-3">{row.sessionName} · {new Date(row.startTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}–{new Date(row.endTime).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: "UTC" })}</td><td className="px-4 py-3">{row.department}</td><td className="px-4 py-3">{row.status}</td></tr>)}</tbody></table>}</div>
    <div className="flex items-center justify-between"><span className="text-sm text-slate-500">Page {filters.page} of {data?.pagination.totalPages ?? 1}{isFetching ? " · Updating…" : ""}</span><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={filters.page <= 1 || isFetching} onClick={() => update("page", filters.page - 1)}>Previous</Button><Button size="sm" variant="secondary" disabled={!data || filters.page >= data.pagination.totalPages || isFetching} onClick={() => update("page", filters.page + 1)}>Next</Button></div></div>
  </div>;
}
