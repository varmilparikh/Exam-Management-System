import { Repeat } from "lucide-react";

import DashboardCard from "@/components/ui/DashboardCard";
import EmptyState from "@/components/ui/EmptyState";
import StatusChip from "@/components/ui/StatusChip";
import Skeleton from "@/components/ui/Skeleton";

import { usePendingRequests } from "../hooks/usePendingRequests";

export default function PendingRequestsCard() {
  const { data, isLoading } = usePendingRequests();

  if (isLoading) {
    return (
      <DashboardCard
        title="Pending Requests"
        icon={<Repeat className="h-5 w-5 text-orange-600" />}
      >
        <div className="space-y-3">
          <Skeleton className="h-16 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      </DashboardCard>
    );
  }

  const transfers = data?.transfers ?? [];
  const swaps = data?.swaps ?? [];

  if (transfers.length === 0 && swaps.length === 0) {
    return (
      <DashboardCard
        title="Pending Requests"
        icon={<Repeat className="h-5 w-5 text-orange-600" />}
      >
        <EmptyState
          title="No Pending Requests"
          description="There are no transfer or swap requests awaiting approval."
        />
      </DashboardCard>
    );
  }

  return (
    <DashboardCard
      title="Pending Requests"
      icon={<Repeat className="h-5 w-5 text-orange-600" />}
    >
      <div className="space-y-4">
        {transfers.map((request) => (
          <div key={request.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Transfer Request</p>

                <p className="text-sm text-gray-500">
                  {request.fromEmployee.name}
                </p>
              </div>

              <StatusChip status={request.status} />
            </div>
          </div>
        ))}

        {swaps.map((request) => (
          <div key={request.id} className="rounded-lg border p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Swap Request</p>

                <p className="text-sm text-gray-500">
                  {request.requester.name}
                </p>
              </div>

              <StatusChip status={request.status} />
            </div>
          </div>
        ))}
      </div>
    </DashboardCard>
  );
}
