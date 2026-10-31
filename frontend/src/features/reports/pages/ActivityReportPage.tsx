import { useState } from "react";
import { Download, FileSpreadsheet, FileText } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { reportsService } from "../api/reports.service";
import { downloadBlob } from "../utils/downloadReport";
import type { StatusReportFilters } from "../types/report";

const initialFilters: StatusReportFilters & { action?: string } = { page: 1, limit: 20, search: "", status: "", fromDate: "", toDate: "", sortBy: "createdAt", sortOrder: "desc", action: "" };
export default function ActivityReportPage() {
  const [filters, setFilters] = useState(initialFilters);
  const [exporting, setExporting] = useState<"csv" | "excel" | "pdf" | null>(null);
  const [exportError, setExportError] = useState("");
  const { data, isLoading, isFetching, error } = useQuery({ queryKey: ["reports", "activity", filters], queryFn: () => reportsService.getActivityReport(filters) });
  const update = <K extends keyof typeof initialFilters>(key: K, value: (typeof initialFilters)[K]) => setFilters((old) => ({ ...old, [key]: value, page: key === "page" ? value as number : 1 }));
  const exportAs = async (format: "csv" | "excel" | "pdf") => {
    setExporting(format); setExportError("");
    try { const blob = await reportsService.exportActivityReport({ ...filters, page: 1 }, format); downloadBlob(blob, `activity-report.${format === "excel" ? "xlsx" : format}`); }
    catch { setExportError("Could not export the activity report."); }
    finally { setExporting(null); }
  };
  if (error) return <p className="p-6 text-sm text-red-600">Failed to load activity report.</p>;
  const actions = Object.keys(data?.summary.actionCounts ?? {}).sort();
  return <main className="space-y-6 p-6">
    <header><h1 className="text-2xl font-semibold">Activity Report</h1><p className="mt-1 text-sm text-gray-500">Audit trail by user, action, entity and timestamp.</p></header>
    <section className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4"><div className="rounded-xl border bg-white p-4"><p className="text-sm text-gray-500">Matching activity</p><p className="mt-2 text-2xl font-semibold">{data?.summary.total ?? 0}</p></div>{actions.slice(0, 3).map((action) => <div key={action} className="rounded-xl border bg-white p-4"><p className="truncate text-sm text-gray-500">{action}</p><p className="mt-2 text-2xl font-semibold">{data?.summary.actionCounts[action] ?? 0}</p></div>)}</section>
    <section className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-2 lg:grid-cols-4">
      <label className="text-sm font-medium">Search<input value={filters.search} onChange={(e) => update("search", e.target.value)} placeholder="User, description or entity" className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" /></label>
      <label className="text-sm font-medium">Action<select value={filters.action} onChange={(e) => update("action", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal"><option value="">All actions</option>{actions.map((action) => <option key={action}>{action}</option>)}</select></label>
      <label className="text-sm font-medium">From date<input type="date" value={filters.fromDate} max={filters.toDate || undefined} onChange={(e) => update("fromDate", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" /></label>
      <label className="text-sm font-medium">To date<input type="date" value={filters.toDate} min={filters.fromDate || undefined} onChange={(e) => update("toDate", e.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" /></label>
    </section>
    <div className="flex flex-wrap items-center justify-between gap-3"><p className="text-sm text-gray-500">{data?.pagination.total ?? 0} activity entries</p><div className="flex gap-2">{(["csv", "excel", "pdf"] as const).map((format) => <Button key={format} size="sm" variant="secondary" disabled={!!exporting} loading={exporting === format} onClick={() => void exportAs(format)}>{format === "csv" ? <Download size={16} /> : format === "excel" ? <FileSpreadsheet size={16} /> : <FileText size={16} />}{format.toUpperCase()}</Button>)}</div></div>
    {exportError && <p className="text-sm text-red-600">{exportError}</p>}
    <div className="overflow-x-auto rounded-xl border bg-white">{isLoading ? <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div> : <table className="w-full min-w-[850px] text-left text-sm"><thead className="bg-gray-50"><tr>{["User", "Action", "Description", "Entity", "Timestamp"].map((h) => <th key={h} className="px-4 py-3 font-semibold">{h}</th>)}</tr></thead><tbody>{!data?.rows.length ? <tr><td colSpan={5} className="px-4 py-10 text-center text-gray-500">No activity matches these filters.</td></tr> : data.rows.map((row) => <tr key={row.id} className="border-t"><td className="px-4 py-3">{row.user}</td><td className="px-4 py-3">{row.action}</td><td className="max-w-[28rem] px-4 py-3">{row.description}</td><td className="px-4 py-3">{row.entity}</td><td className="whitespace-nowrap px-4 py-3">{new Date(row.timestamp).toLocaleString()}</td></tr>)}</tbody></table>}</div>
    <div className="flex items-center justify-between"><span className="text-sm text-gray-500">Page {filters.page} of {data?.pagination.totalPages ?? 1}{isFetching ? " · Updating…" : ""}</span><div className="flex gap-2"><Button size="sm" variant="secondary" disabled={filters.page <= 1 || isFetching} onClick={() => update("page", filters.page - 1)}>Previous</Button><Button size="sm" variant="secondary" disabled={!data || filters.page >= data.pagination.totalPages || isFetching} onClick={() => update("page", filters.page + 1)}>Next</Button></div></div>
  </main>;
}
