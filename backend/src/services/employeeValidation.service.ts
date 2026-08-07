import employeeRepository from "../repositories/employee.repository.js";

import { ApiError } from "../utils/apiError.js";

import { Role } from "../generated/prisma/enums.js";

class EmployeeValidationService {
  /**
   * Validate employee exists and is active
   */
  async validateEmployee(employeeId: string, role = "Employee") {
    const employee = await employeeRepository.findById(employeeId);

    if (!employee) {
      throw new ApiError(404, `${role} not found`);
    }

    if (!employee.isActive) {
      throw new ApiError(400, `${role} account is inactive`);
    }

    return employee;
  }

  async validateFaculty(employeeId: string, label = "Employee") {
    const employee = await this.validateEmployee(employeeId, label);

    if (employee.role !== Role.FACULTY) {
      throw new ApiError(400, `${label} must be a faculty member.`);
    }
    return employee;
  }
}

export default new EmployeeValidationService();
