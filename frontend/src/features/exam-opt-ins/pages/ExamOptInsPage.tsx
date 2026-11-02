import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { toast } from "sonner";
import { examOptInService } from "../api/examOptIn.service";
import type { ExamOptIn, ExamOptInStatus } from "../types";
import StatusChip from "@/components/ui/StatusChip";
import { Dialog } from "@/components/ui/Dialog";
import QueryErrorState from "@/components/common/QueryErrorState/QueryErrorState";

const queryKey = ["exam-opt-ins"] as const;

export default function ExamOptInsPage() {
  const [status, setStatus] = useState<ExamOptInStatus | "">("PENDING");
  const [rejectTarget, setRejectTarget] = useState<ExamOptIn | null>(null);
  const [rejectRemark, setRejectRemark] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data = [], isLoading, error, refetch } = useQuery({
    queryKey: [...queryKey, "all", status],
    queryFn: () => examOptInService.getAll({ status: status || undefined }),
  });
  const review = useMutation({
    mutationFn: ({ id, action, remark }: { id: string; action: "confirm" | "reject"; remark?: string }) => examOptInService.review(id, action, remark),
    onSuccess: (_, variables) => {
      toast.success(variables.action === "confirm" ? "Participation confirmed." : "Opt-in rejected.");
      if (variables.action === "reject") {
        setRejectTarget(null);
        setRejectRemark("");
      }
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const canReview = user?.role === "SUPER_ADMIN" || user?.role === "COE";

  return (
    <div className="space-y-6">
      <PageHeader title="Faculty session requests" description={canReview ? "Review faculty requests to join upcoming exam sessions." : "View session requests from faculty in your department."} />
      <div className="flex items-center gap-3">
        <label htmlFor="opt-in-status" className="text-sm font-semibold text-slate-700">Filter by status</label>
        <select id="opt-in-status" value={status} onChange={(event) => setStatus(event.target.value as ExamOptInStatus | "")} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-800 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-[0_6px_20px_rgba(15,23,42,0.035)]">
        {isLoading ? <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div>
          : error ? <QueryErrorState compact title="Session requests are unavailable" message="Check your connection and try again." onRetry={() => void refetch()} />
          : data.length === 0 ? <p className="p-8 text-center text-sm text-slate-500">No opt-ins match this filter.</p>
          : <table className="min-w-240 w-full text-left text-sm">
            <thead><tr className="border-b border-slate-200 bg-slate-50/90 text-left text-xs font-semibold uppercase tracking-wide text-slate-500"><th className="whitespace-nowrap px-4 py-3">Faculty</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Exam session</th><th className="whitespace-nowrap px-4 py-3">Date and time</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
            <tbody>{data.map((item) => <tr key={item.id} className="border-b border-slate-100 transition-colors odd:bg-white even:bg-slate-50/35 hover:bg-blue-50/45 last:border-0">
              <td className="px-4 py-3"><span className="font-medium">{item.employee.name}</span><span className="block text-xs text-slate-500">{item.employee.employeeCode}</span></td>
              <td className="px-4 py-3">{item.employee.department.name}</td>
              <td className="px-4 py-3">{item.exam.examName} · {item.exam.sessionName}</td>
              <td className="whitespace-nowrap px-4 py-3">{new Date(item.exam.examDate).toLocaleDateString()} · {time(item.exam.startTime)}–{time(item.exam.endTime)}</td>
              <td className="px-4 py-3"><StatusChip status={item.status} /></td>
              <td className="px-4 py-3">{canReview && item.status === "PENDING" ? <div className="flex gap-2">
                <Button size="sm" disabled={review.isPending} loading={review.isPending} onClick={() => review.mutate({ id: item.id, action: "confirm" })}>Confirm</Button>
                <Button size="sm" variant="danger" disabled={review.isPending} onClick={() => {
                  setRejectTarget(item);
                  setRejectRemark("");
                }}>Reject</Button>
              </div> : item.reviewRemark || "—"}</td>
            </tr>)}</tbody>
          </table>}
      </div>

      <Dialog.Root
        open={Boolean(rejectTarget)}
        onOpenChange={(open) => {
          if (!open && !review.isPending) {
            setRejectTarget(null);
            setRejectRemark("");
          }
        }}
      >
        <Dialog.Content maxWidth="sm">
          <Dialog.Header
            title="Reject participation request"
            description={rejectTarget ? `Add a reason for ${rejectTarget.employee.name}'s request to join ${rejectTarget.exam.examName}.` : undefined}
          />
          <form
            onSubmit={(event) => {
              event.preventDefault();
              const remark = rejectRemark.trim();
              if (rejectTarget && remark.length >= 5) {
                review.mutate({ id: rejectTarget.id, action: "reject", remark });
              }
            }}
          >
            <Dialog.Body>
              <label htmlFor="reject-opt-in-reason" className="block text-sm font-semibold text-slate-700">
                Reason <span className="text-rose-600">*</span>
              </label>
              <textarea
                id="reject-opt-in-reason"
                required
                minLength={5}
                maxLength={500}
                rows={4}
                value={rejectRemark}
                onChange={(event) => setRejectRemark(event.target.value)}
                placeholder="Explain why this request cannot be approved."
                className="mt-2 w-full resize-y rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-900 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                aria-describedby="reject-opt-in-reason-help"
              />
              <p id="reject-opt-in-reason-help" className="mt-1.5 text-xs leading-5 text-slate-500">
                Enter 5–500 characters. The faculty member will see this reason.
              </p>
            </Dialog.Body>
            <Dialog.Footer>
              <Button type="button" variant="secondary" disabled={review.isPending} onClick={() => {
                setRejectTarget(null);
                setRejectRemark("");
              }}>
                Keep request
              </Button>
              <Button type="submit" variant="danger" loading={review.isPending} disabled={rejectRemark.trim().length < 5}>
                Reject request
              </Button>
            </Dialog.Footer>
          </form>
        </Dialog.Content>
      </Dialog.Root>
    </div>
  );
}

function time(value: string) {
  return new Date(value).toLocaleTimeString([], { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
}
