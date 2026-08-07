import api from "@/lib/axios";
import axios from "axios";

import type {
  ApiResponse,
  EmployeeResponseDto,
  LoginRequest,
  LoginResponse,
} from "@/types";

export async function login(payload: LoginRequest): Promise<LoginResponse> {
  const response = await api.post<ApiResponse<LoginResponse>>(
    "/auth/login",
    payload,
  );

  return response.data.data;
}

export async function me(): Promise<EmployeeResponseDto | null> {
  try {
    const response =
      await api.get<ApiResponse<EmployeeResponseDto>>("/auth/me");

    return response.data.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      return null;
    }

    throw error;
  }
}

export async function logout(): Promise<void> {
  await api.post("/auth/logout");
}

export async function refresh(): Promise<void> {
  await api.post("/auth/refresh");
}
