import api from "@/lib/api";

import type { ApiResponse } from "@/types/api";
import type { Department } from "../types/department";

import type { DepartmentFilters } from "../types/departmentFilters";

export interface CreateDepartmentDto {
  name: string;
}

export interface UpdateDepartmentDto {
  name: string;
}

const DEFAULT_FILTERS: DepartmentFilters = {
  search: "",
};

async function getAll(filters: DepartmentFilters = DEFAULT_FILTERS) {
  const response = await api.get<ApiResponse<Department[]>>("/departments", {
    params: {
      search: filters.search || undefined,
    },
  });

  return response.data.data;
}

async function getById(id: string) {
  const response = await api.get<ApiResponse<Department>>(`/departments/${id}`);

  return response.data.data;
}

async function create(data: CreateDepartmentDto) {
  const response = await api.post<ApiResponse<Department>>(
    "/departments",
    data,
  );

  return response.data.data;
}

async function update(id: string, data: UpdateDepartmentDto) {
  const response = await api.put<ApiResponse<Department>>(
    `/departments/${id}`,
    data,
  );

  return response.data.data;
}

async function remove(id: string) {
  const response = await api.delete<ApiResponse<Department>>(
    `/departments/${id}`,
  );

  return response.data.data;
}

export const departmentService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
