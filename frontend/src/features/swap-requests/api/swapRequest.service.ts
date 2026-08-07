import api from "@/lib/api";
import type { ApiResponse } from "@/types/api";

import type { SwapRequest } from "../types/swapRequest";
import type { SwapRequestFilters } from "../types/swapRequestFilters";

export interface CreateSwapRequestDto {
  receiverId: string;
  requesterDutyId: string;
  receiverDutyId: string;
  reason?: string;
}

export interface ApproveSwapRequestDto {
  approvalRemark: string;
}

export interface RejectSwapRequestDto {
  reason?: string;
}

export interface CancelSwapRequestDto {
  reason?: string;
}

export interface RejectSwapByCoeDto {
  approvalRemark: string;
}

const DEFAULT_FILTERS: SwapRequestFilters = {
  search: "",
  status: "",
};

async function getAll(
  filters: SwapRequestFilters = DEFAULT_FILTERS,
  page = 1,
  limit = 100,
) {
  const response = await api.get<ApiResponse<SwapRequest[]>>("/swap-requests", {
    params: {
      page,
      limit,
      search: filters.search || undefined,
      status: filters.status || undefined,
    },
  });

  return response.data.data;
}

async function create(data: CreateSwapRequestDto) {
  const response = await api.post<ApiResponse<SwapRequest>>(
    "/swap-requests",
    data,
  );

  return response.data.data;
}

async function accept(id: string) {
  const response = await api.patch<ApiResponse<SwapRequest>>(
    `/swap-requests/${id}/accept`,
  );

  return response.data.data;
}

async function reject(id: string, data: RejectSwapRequestDto) {
  const response = await api.patch<ApiResponse<SwapRequest>>(
    `/swap-requests/${id}/reject`,
    data,
  );

  return response.data.data;
}

async function cancel(id: string, data: CancelSwapRequestDto) {
  const response = await api.patch<ApiResponse<SwapRequest>>(
    `/swap-requests/${id}/cancel`,
    data,
  );

  return response.data.data;
}

async function approve(id: string, data: ApproveSwapRequestDto) {
  const response = await api.patch<ApiResponse<SwapRequest>>(
    `/swap-requests/${id}/approve`,
    data,
  );

  return response.data.data;
}

async function rejectByCoe(id: string, data: RejectSwapByCoeDto) {
  const response = await api.patch<ApiResponse<SwapRequest>>(
    `/swap-requests/${id}/reject-by-coe`,
    data,
  );

  return response.data.data;
}

export const swapRequestService = {
  getAll,
  create,
  accept,
  reject,
  cancel,
  approve,
  rejectByCoe,
};
