import employeeRepository from "../repositories/employee.repository.js";

import { ApiError } from "../utils/apiError.js";

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
}

export default new EmployeeValidationService();
