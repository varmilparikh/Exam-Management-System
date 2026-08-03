export interface Employee {
  id: string;

  employeeCode: string;

  name: string;

  email: string;

  designation: string;

  role: "SUPER_ADMIN" | "COE" | "HOD" | "FACULTY";

  phone?: string;

  isActive: boolean;

  departmentId: string;

  department: {
    id: string;
    name: string;
  };

  createdAt: string;

  updatedAt: string;
}

export type EmployeeResponseDto = Employee;
