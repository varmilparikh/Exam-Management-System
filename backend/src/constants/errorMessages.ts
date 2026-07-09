export const ERROR_MESSAGES = {
  // Employee
  EMPLOYEE_NOT_FOUND: "Employee not found",
  EMPLOYEE_ALREADY_EXISTS: "Employee already exists",
  EMPLOYEE_CODE_ALREADY_EXISTS: "Employee code already exists",

  // Department
  DEPARTMENT_NOT_FOUND: "Department not found",

  // Exam
  EXAM_NOT_FOUND: "Exam not found",

  // Exam Duty
  EXAM_DUTY_NOT_FOUND: "Exam duty not found",
  DUPLICATE_EXAM_DUTY:
    "Employee is already assigned to this exam",
  REQUIRED_FACULTY_LIMIT:
    "Required faculty limit reached",

  // Activity Log
  ACTIVITY_LOG_NOT_FOUND:
    "Activity log not found",

  // Authentication
  INVALID_CREDENTIALS:
    "Invalid email or password",
  SOCIAL_LOGIN_ONLY:
    "This account uses social login",

  // Common
  EMAIL_ALREADY_EXISTS:
    "Email already exists",
} as const;