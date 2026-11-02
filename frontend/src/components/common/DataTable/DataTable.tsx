import type { DataTableProps } from "./types";
import Spinner from "@/components/ui/Spinner";

export default function DataTable<T extends { id: string }>({
  columns,
  data,
  loading = false,
  emptyMessage = "No data available.",
}: DataTableProps<T>) {
  if (loading) {
    return (
      <div className="flex min-h-40 items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/90">
            {columns.map((column) => (
              <th
                key={column.id}
                style={{ width: column.width }}
                className={`whitespace-nowrap px-4 py-3.5 text-xs font-semibold uppercase tracking-wide text-slate-500 ${
                  column.align === "center"
                    ? "text-center"
                    : column.align === "right"
                      ? "text-right"
                      : "text-left"
                }`}
              >
                {column.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-10 text-center text-sm text-slate-500"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr
                key={row.id}
                className="border-t border-slate-100 transition-colors odd:bg-white even:bg-slate-50/35 hover:bg-blue-50/45"
              >
                {columns.map((column) => (
                  <td
                    key={`${row.id}-${column.id}`}
                    className={`px-4 py-3.5 text-sm text-slate-700 ${
                      column.align === "center"
                        ? "text-center"
                        : column.align === "right"
                          ? "text-right"
                          : "text-left"
                    }`}
                  >
                    {column.render
                      ? column.render(row)
                      : column.key
                        ? (row[column.key] as React.ReactNode)
                        : null}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
