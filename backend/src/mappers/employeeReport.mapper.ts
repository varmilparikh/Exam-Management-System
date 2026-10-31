interface EmployeeReportSource {
  employeeCode: string;
  name: string;
  email: string;
  designation: string;
  role: string;
  department: { name: string };
  attendedCount: number;
  transferCount: number;
  averageDuty: number;
  isActive: boolean;
}

export function mapEmployeeReportRows(employees: EmployeeReportSource[]) {
  return employees.map((employee) => ({
    employeeCode: employee.employeeCode,
    name: employee.name,
    email: employee.email,
    designation: employee.designation,
    role: employee.role,
    department: employee.department.name,
    attendedCount: employee.attendedCount,
    transferCount: employee.transferCount,
    averageDuty: employee.averageDuty,
    isActive: employee.isActive ? "Active" : "Inactive",
  }));
}
