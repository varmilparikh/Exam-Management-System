import SwapRequestTable from "../components/SwapRequestTable";
import PageHeader from "@/components/common/PageHeader";
import type { SwapRequestFilters } from "../types/swapRequestFilters";
import { useState } from "react";
import SwapRequestToolbar from "../components/SwapRequestToolbar";
import { hasPermission } from "@/permissions/hasPermission";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

export default function SwapRequestsPage() {
  const [filters, setFilters] = useState<SwapRequestFilters>({
    search: "",
    status: "",
  });

  const { data: user } = useCurrentUser();

  const canApprove = hasPermission(user?.role, "swap:approve");

  const canView = hasPermission(user?.role, "swap:view");

  if (!canView) {
    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Swap Requests</h1>

        <p className="text-muted-foreground">
          You do not have access to swap requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Swap Requests"
        description="Manage examination duty swap requests."
      />

      <SwapRequestToolbar filters={filters} onFiltersChange={setFilters} />

      <SwapRequestTable
        filters={filters}
        canApprove={canApprove}
        currentUserId={user?.id ?? ""}
      />
    </div>
  );
}
