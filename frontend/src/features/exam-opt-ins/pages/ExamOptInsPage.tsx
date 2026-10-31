import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Button from "@/components/ui/Button";
import PageHeader from "@/components/common/PageHeader";
import Skeleton from "@/components/ui/Skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { toast } from "sonner";
import { examOptInService } from "../api/examOptIn.service";
import type { ExamOptInStatus } from "../types";

const queryKey = ["exam-opt-ins"] as const;

export default function ExamOptInsPage() {
  const [status, setStatus] = useState<ExamOptInStatus | "">("PENDING");
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data = [], isLoading, error } = useQuery({
    queryKey: [...queryKey, "all", status],
    queryFn: () => examOptInService.getAll({ status: status || undefined }),
  });
  const review = useMutation({
    mutationFn: ({ id, action, remark }: { id: string; action: "confirm" | "reject"; remark?: string }) => examOptInService.review(id, action, remark),
    onSuccess: (_, variables) => {
      toast.success(variables.action === "confirm" ? "Participation confirmed." : "Opt-in rejected.");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const canReview = user?.role === "SUPER_ADMIN" || user?.role === "COE";

  return (
    <div className="space-y-6">
      <PageHeader title="Exam Opt-ins" description="Monitor faculty interest and confirm participation for upcoming sessions." />
      <div className="flex items-center gap-3">
        <label htmlFor="opt-in-status" className="text-sm font-medium">Status</label>
        <select id="opt-in-status" value={status} onChange={(event) => setStatus(event.target.value as ExamOptInStatus | "")} className="rounded-lg border bg-white px-3 py-2 text-sm">
          <option value="">All statuses</option>
          <option value="PENDING">Pending</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="REJECTED">Rejected</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-white">
        {isLoading ? <div className="space-y-3 p-6"><Skeleton /><Skeleton /><Skeleton /></div>
          : error ? <p className="p-6 text-sm text-red-600">Could not load faculty opt-ins.</p>
          : data.length === 0 ? <p className="p-8 text-center text-sm text-gray-500">No opt-ins match this filter.</p>
          : <table className="min-w-240 w-full text-left text-sm">
            <thead><tr className="border-b bg-gray-50 font-semibold"><th className="px-4 py-3">Faculty</th><th className="px-4 py-3">Department</th><th className="px-4 py-3">Exam session</th><th className="px-4 py-3">Date and time</th><th className="px-4 py-3">Status</th><th className="px-4 py-3">Action</th></tr></thead>
            <tbody>{data.map((item) => <tr key={item.id} className="border-b last:border-0">
              <td className="px-4 py-3"><span className="font-medium">{item.employee.name}</span><span className="block text-xs text-gray-500">{item.employee.employeeCode}</span></td>
              <td className="px-4 py-3">{item.employee.department.name}</td>
              <td className="px-4 py-3">{item.exam.examName} · {item.exam.sessionName}</td>
              <td className="whitespace-nowrap px-4 py-3">{new Date(item.exam.examDate).toLocaleDateString()} · {time(item.exam.startTime)}–{time(item.exam.endTime)}</td>
              <td className="px-4 py-3">{item.status}</td>
              <td className="px-4 py-3">{canReview && item.status === "PENDING" ? <div className="flex gap-2">
                <Button size="sm" disabled={review.isPending} loading={review.isPending} onClick={() => review.mutate({ id: item.id, action: "confirm" })}>Confirm</Button>
                <Button size="sm" variant="danger" disabled={review.isPending} onClick={() => {
                  const remark = window.prompt("Reason for rejecting this opt-in:");
                  if (remark?.trim()) review.mutate({ id: item.id, action: "reject", remark: remark.trim() });
                }}>Reject</Button>
              </div> : item.reviewRemark || "—"}</td>
            </tr>)}</tbody>
          </table>}
      </div>
    </div>
  );
}

function time(value: string) {
  return new Date(value).toLocaleTimeString([], { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
}
