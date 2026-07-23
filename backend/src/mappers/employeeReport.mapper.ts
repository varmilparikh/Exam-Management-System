export function mapEmployeeReportRows(employees: any[]) {
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
