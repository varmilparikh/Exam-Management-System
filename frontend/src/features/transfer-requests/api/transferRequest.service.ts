import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";
import type { TransferRequest } from "../types/transferRequest";
import type { TransferRequestFilters } from "../types/transferRequestFilters";

export interface CreateTransferRequestDto {
  examDutyId: string;
  toEmployeeId?: string;
  reason: string;
}
export interface ApproveTransferRequestDto {
  toEmployeeId?: string;
  approvalRemark?: string;
}

const DEFAULT_FILTERS: TransferRequestFilters = {
  search: "",
  status: "",
};

async function getAll(filters: TransferRequestFilters = DEFAULT_FILTERS) {
  const response = await api.get<ApiResponse<TransferRequest[]>>(
    "/transfer-requests",
    {
      params: {
        search: filters.search || undefined,
        status: filters.status || undefined,
      },
    },
  );

  return response.data.data;
}
async function getMine() {
  const response = await api.get<ApiResponse<TransferRequest[]>>(
    "/transfer-requests/my",
  );
  return response.data.data;
}
async function create(data: CreateTransferRequestDto) {
  const response = await api.post<ApiResponse<TransferRequest>>(
    "/transfer-requests",
    data,
  );
  return response.data.data;
}
async function approve(id: string, data: ApproveTransferRequestDto) {
  const response = await api.patch<ApiResponse<TransferRequest>>(
    `/transfer-requests/${id}/approve`,
    data,
  );
  return response.data.data;
}
async function reject(id: string, approvalRemark: string) {
  const response = await api.patch<ApiResponse<TransferRequest>>(
    `/transfer-requests/${id}/reject`,
    { approvalRemark },
  );
  return response.data.data;
}
async function cancel(id: string) {
  const response = await api.patch<ApiResponse<TransferRequest>>(
    `/transfer-requests/${id}/cancel`,
    {},
  );
  return response.data.data;
}

export const transferRequestService = {
  getAll,
  getMine,
  create,
  approve,
  reject,
  cancel,
};
