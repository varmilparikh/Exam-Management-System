import type { Employee } from "@/features/employees/types/employee";
import type { Permission } from "./permissions";

type Role = Employee["role"];

export const rolePermissions: Record<Role, Permission[]> = {
  SUPER_ADMIN: [
    // Employees
    "employee:view",
    "employee:create",
    "employee:edit",
    "employee:delete",

    // Departments
    "department:view",
    "department:create",
    "department:edit",
    "department:delete",

    // Exams
    "exam:view",
    "exam:create",
    "exam:edit",
    "exam:delete",

    "exam-opt-in:view",
    "exam-opt-in:review",

    // Duties
    "duty:view",
    "duty:assign",
    "duty:edit",

    // Transfers
    "transfer:view",
    "transfer:approve",

    // Swaps
    "swap:view",

    // Notifications
    "notification:view",

    // Reports
    "reports:view",
    "workload:view",
    "activity:view",
  ],

  COE: [
    "employee:view",

    "department:view",

    "exam:view",
    "exam:create",
    "exam:edit",
    "exam:delete",

    "exam-opt-in:view",
    "exam-opt-in:review",

    "duty:view",
    "duty:assign",

    "transfer:view",
    "transfer:approve",

    "swap:view",

    "notification:view",

    "reports:view",
    "workload:view",
    "activity:view",
  ],

  HOD: [
    "workload:view",
    "department:view",

    "exam-opt-in:view",

    "exam:view",

    "duty:view",

    "transfer:view",

    "swap:view",

    "notification:view",
  ],

  FACULTY: [
    "workload:view",
    "exam:view",

    "duty:view",

    "transfer:view",

    "swap:view",
    "swap:create",

    "notification:view",
  ],
};
