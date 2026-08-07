import PageHeader from "@/components/common/PageHeader";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import TransferRequestTable from "../components/TransferRequestTable";

import { useState } from "react";

import TransferRequestToolbar from "../components/TransferRequestToolbar";

import type { TransferRequestFilters } from "../types/transferRequestFilters";

import { hasPermission } from "@/permissions/hasPermission";

export default function TransferRequestsPage() {
  const { data: user, isLoading } = useCurrentUser();

  const [filters, setFilters] = useState<TransferRequestFilters>({
    search: "",
    status: "",
  });

  if (isLoading) return null;

  const canView = hasPermission(user?.role, "transfer:view");

  const canApprove = hasPermission(user?.role, "transfer:approve");

  if (!canView) {
    return (
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Transfer Requests</h1>

        <p className="text-muted-foreground">
          You do not have access to transfer requests.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Transfer Requests"
        description="Review and manage transfer requests."
      />

      <TransferRequestToolbar filters={filters} onFiltersChange={setFilters} />

      <TransferRequestTable
        filters={filters}
        canApprove={canApprove}
        userId={user?.id}
      />
    </div>
  );
}
