export interface DepartmentSummary {
  id: string;
  name: string;
}

export interface EmployeeResponseDto {
  id: string;

  employeeCode: string;

  name: string;

  email: string;

  phone: string | null;

  loginProvider: string;

  isEmailVerified: boolean;

  lastLogin: string | null;

  profileImage: string;

  designation: string;

  role: string;

  averageDuty: number;

  attendedCount: number;

  transferCount: number;

  isActive: boolean;

  isDeleted: boolean;

  departmentId: string;

  createdAt: string;

  updatedAt: string;

  department: DepartmentSummary;
}