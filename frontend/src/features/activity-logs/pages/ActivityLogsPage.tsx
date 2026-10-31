import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import Button from "@/components/ui/Button";
import Skeleton from "@/components/ui/Skeleton";
import { getActivityLogs } from "../api/activityLog.service";
import type { ActivityLogFilters } from "../types/activityLog";

const ACTIONS = [
  "LOGIN", "LOGOUT", "CREATE_DEPARTMENT", "UPDATE_DEPARTMENT", "DELETE_DEPARTMENT",
  "CREATE_EMPLOYEE", "UPDATE_EMPLOYEE", "DELETE_EMPLOYEE", "CREATE_EXAM", "UPDATE_EXAM",
  "DELETE_EXAM", "ASSIGN_EXAM_DUTY", "UPDATE_EXAM_DUTY", "DELETE_EXAM_DUTY",
  "CREATE_TRANSFER_REQUEST", "APPROVE_TRANSFER_REQUEST", "REJECT_TRANSFER_REQUEST",
  "CANCEL_TRANSFER_REQUEST", "CREATE_SWAP_REQUEST", "ACCEPT_SWAP_REQUEST",
  "APPROVE_SWAP_REQUEST", "CANCEL_SWAP_REQUEST", "REJECT_SWAP_REQUEST_BY_RECEIVER",
  "CREATE_EXAM_OPT_IN", "CANCEL_EXAM_OPT_IN", "CONFIRM_EXAM_OPT_IN", "REJECT_EXAM_OPT_IN",
  "COMPLETE_SWAP_REQUEST",
];

const DEFAULT_FILTERS: ActivityLogFilters = {
  page: 1,
  limit: 20,
  search: "",
  action: "",
  fromDate: "",
  toDate: "",
};

export default function ActivityLogsPage() {
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const { data, isLoading, isFetching, error } = useQuery({
    queryKey: ["activity-logs", filters],
    queryFn: () => getActivityLogs(filters),
  });

  const updateFilter = <K extends keyof ActivityLogFilters>(
    key: K,
    value: ActivityLogFilters[K],
  ) => setFilters((current) => ({
    ...current,
    [key]: value,
    page: key === "page" ? (value as number) : 1,
  }));

  if (error) {
    return <p className="p-6 text-sm text-red-600">Failed to load activity logs.</p>;
  }

  return (
    <div className="space-y-6 p-6">
      <header>
        <h1 className="text-2xl font-semibold">Activity Logs</h1>
        <p className="mt-1 text-sm text-gray-500">Review account and workflow activity across the system.</p>
      </header>

      <div className="grid gap-4 rounded-xl border bg-white p-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-medium">Search
          <input value={filters.search} onChange={(event) => updateFilter("search", event.target.value)} placeholder="User, employee code or description" className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-medium">Action
          <select value={filters.action} onChange={(event) => updateFilter("action", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal">
            <option value="">All actions</option>
            {ACTIONS.map((action) => <option key={action} value={action}>{action.replaceAll("_", " ")}</option>)}
          </select>
        </label>
        <label className="text-sm font-medium">From date
          <input type="date" value={filters.fromDate} max={filters.toDate || undefined} onChange={(event) => updateFilter("fromDate", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
        </label>
        <label className="text-sm font-medium">To date
          <input type="date" value={filters.toDate} min={filters.fromDate || undefined} onChange={(event) => updateFilter("toDate", event.target.value)} className="mt-1 w-full rounded-lg border px-3 py-2 font-normal" />
        </label>
      </div>

      <div className="rounded-xl border bg-white">
        {isLoading ? <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div> : <>
          <div className="overflow-x-auto">
            <table className="min-w-220 w-full">
              <thead><tr className="border-b bg-gray-50 text-left text-sm font-semibold">
                <th className="px-4 py-3">Date</th><th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Action</th><th className="px-4 py-3">Entity</th>
                <th className="px-4 py-3">Description</th>
              </tr></thead>
              <tbody>
                {data?.logs.length === 0 ? <tr><td colSpan={5} className="px-4 py-10 text-center text-sm text-gray-500">No activity matches these filters.</td></tr> : data?.logs.map((log) => <tr key={log.id} className="border-b last:border-b-0">
                  <td className="whitespace-nowrap px-4 py-3 text-sm">{new Date(log.createdAt).toLocaleString()}</td>
                  <td className="px-4 py-3 text-sm"><span className="font-medium">{log.employee.name}</span><span className="block text-xs text-gray-500">{log.employee.employeeCode} · {log.employee.role}</span></td>
                  <td className="px-4 py-3 text-sm">{log.action.replaceAll("_", " ")}</td>
                  <td className="px-4 py-3 text-sm">{log.entityType?.replaceAll("_", " ") ?? "—"}</td>
                  <td className="max-w-100 px-4 py-3 text-sm">{log.description}</td>
                </tr>)}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between border-t px-4 py-3">
            <p className="text-sm text-gray-500">{data?.total ?? 0} records · Page {filters.page} of {data?.totalPages ?? 1}{isFetching ? " · Updating" : ""}</p>
            <div className="flex gap-2">
              <Button size="sm" variant="secondary" disabled={filters.page <= 1 || isFetching} onClick={() => updateFilter("page", filters.page - 1)}>Previous</Button>
              <Button size="sm" variant="secondary" disabled={!data || filters.page >= data.totalPages || isFetching} onClick={() => updateFilter("page", filters.page + 1)}>Next</Button>
            </div>
          </div>
        </>}
      </div>
    </div>
  );
}
