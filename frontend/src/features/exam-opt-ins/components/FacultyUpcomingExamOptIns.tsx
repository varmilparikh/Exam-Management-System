import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { CalendarDays } from "lucide-react";
import { toast } from "sonner";

import Button from "@/components/ui/Button";
import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import Skeleton from "@/components/ui/Skeleton";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { examOptInService } from "../api/examOptIn.service";
import type { UpcomingExamOptIn } from "../types";

const queryKey = ["exam-opt-ins"] as const;

export default function FacultyUpcomingExamOptIns() {
  const queryClient = useQueryClient();
  const { data: exams = [], isLoading, error } = useQuery({
    queryKey: [...queryKey, "upcoming"],
    queryFn: examOptInService.getUpcoming,
  });
  const optIn = useMutation({
    mutationFn: examOptInService.optIn,
    onSuccess: () => {
      toast.success("Your opt-in was sent for review.");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });
  const cancel = useMutation({
    mutationFn: examOptInService.cancel,
    onSuccess: () => {
      toast.success("Your pending opt-in was cancelled.");
      void queryClient.invalidateQueries({ queryKey });
    },
    onError: (error) => toast.error(getErrorMessage(error)),
  });

  return (
    <DashboardCard title="Upcoming Exams" icon={<CalendarDays className="h-5 w-5 text-blue-600" />}>
      {isLoading ? <div className="space-y-3"><Skeleton className="h-24 w-full" /><Skeleton className="h-24 w-full" /></div>
        : error ? <p className="text-sm text-red-600">Could not load upcoming exam sessions.</p>
        : exams.length === 0 ? <EmptyState title="No Upcoming Exams" description="There are no open exam sessions to opt into." />
        : <div className="space-y-3">
          {exams.map((exam) => <UpcomingExamCard key={exam.id} exam={exam} loading={optIn.isPending || cancel.isPending} onOptIn={() => optIn.mutate(exam.id)} onCancel={() => exam.myOptInId && cancel.mutate(exam.myOptInId)} />)}
        </div>}
    </DashboardCard>
  );
}

function UpcomingExamCard({ exam, loading, onOptIn, onCancel }: {
  exam: UpcomingExamOptIn;
  loading: boolean;
  onOptIn: () => void;
  onCancel: () => void;
}) {
  const canOptIn = exam.availablePositions > 0 && exam.myOptIn !== "PENDING" && exam.myOptIn !== "CONFIRMED";
  return <div className="rounded-lg border p-4">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="font-semibold">{exam.examName}</h3>
        <p className="mt-1 text-sm text-gray-500">{new Date(exam.examDate).toLocaleDateString()} · {exam.sessionName} · {time(exam.startTime)}–{time(exam.endTime)}</p>
      </div>
      <OptInStatus status={exam.myOptIn} available={exam.availablePositions} />
    </div>
    <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-sm text-gray-600">
      <span>Required faculty: {exam.requiredFaculty}</span>
      <span>Assigned: {exam.assignedFaculty}</span>
      <span>Opted in: {exam.optedInFaculty}</span>
      <span>{exam.availablePositions} positions available</span>
    </div>
    <div className="mt-3 flex justify-end">
      {exam.myOptIn === "PENDING" ? <Button size="sm" variant="secondary" disabled={loading} onClick={onCancel}>Cancel pending opt-in</Button>
        : exam.myOptIn === "CONFIRMED" ? <span className="text-sm font-medium text-green-700">Participation confirmed</span>
        : <Button size="sm" disabled={!canOptIn || loading} loading={loading} onClick={onOptIn}>{canOptIn ? "Opt In" : "Capacity reached"}</Button>}
    </div>
  </div>;
}

function OptInStatus({ status, available }: { status: UpcomingExamOptIn["myOptIn"]; available: number }) {
  const label = status === "PENDING" ? "Pending review" : status === "CONFIRMED" ? "Confirmed" : status === "REJECTED" ? "Previously rejected" : available > 0 ? "Open" : "Capacity reached";
  const color = status === "CONFIRMED" ? "text-green-700" : status === "REJECTED" ? "text-red-700" : status === "PENDING" ? "text-amber-700" : "text-gray-600";
  return <span className={`rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium ${color}`}>{label}</span>;
}

function time(value: string) {
  return new Date(value).toLocaleTimeString([], { timeZone: "UTC", hour: "2-digit", minute: "2-digit" });
}
