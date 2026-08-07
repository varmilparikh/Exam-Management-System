import api from "@/lib/api";

import type { ApiResponse } from "@/types/api";

import type { Employee } from "../types/employee";

import type { EmployeeFilters } from "../types/employeeFilters";

export interface CreateEmployeeDto {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  designation: string;
  departmentId: string;
  role: Employee["role"];
  phone?: string;
}

export interface UpdateEmployeeDto {
  employeeCode?: string;
  name?: string;
  email?: string;
  designation?: string;
  departmentId?: string;
  role?: Employee["role"];
  phone?: string;
  isActive?: boolean;
}

const DEFAULT_FILTERS: EmployeeFilters = {
  search: "",
  departmentId: "",
  role: "",
  status: "",
};

async function getAll(filters: EmployeeFilters = DEFAULT_FILTERS) {
  const response = await api.get<ApiResponse<Employee[]>>("/employees", {
    params: {
      search: filters.search || undefined,
      departmentId: filters.departmentId || undefined,
      role: filters.role || undefined,
      status: filters.status || undefined,
    },
  });

  return response.data.data;
}

async function getById(id: string) {
  const response = await api.get<ApiResponse<Employee>>(`/employees/${id}`);

  return response.data.data;
}

async function create(data: CreateEmployeeDto) {
  const response = await api.post<ApiResponse<Employee>>("/employees", data);

  return response.data.data;
}

async function update(id: string, data: UpdateEmployeeDto) {
  const response = await api.put<ApiResponse<Employee>>(
    `/employees/${id}`,
    data,
  );

  return response.data.data;
}

async function remove(id: string) {
  const response = await api.delete<ApiResponse<Employee>>(`/employees/${id}`);

  return response.data.data;
}

export const employeeService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
