/**
 * Create Employee DTO
 */
export interface CreateEmployeeDto {
  employeeCode: string;
  name: string;
  email: string;
  password: string;
  designation: string;
  departmentId: string;
  role: "SUPER_ADMIN" | "COE" | "HOD" | "FACULTY";
  phone?: string;
}

/**
 * Update Employee DTO
 */
export interface UpdateEmployeeDto {
  name?: string;
  designation?: string;
  departmentId?: string;
  role?: "SUPER_ADMIN" | "COE" | "HOD" | "FACULTY";
  phone?: string;
  isActive?: boolean;
}