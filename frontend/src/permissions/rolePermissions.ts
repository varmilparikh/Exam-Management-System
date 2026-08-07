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

    // Duties
    "duty:view",
    "duty:assign",
    "duty:edit",

    // Transfers
    "transfer:view",
    "transfer:approve",

    // Swaps
    "swap:view",
    "swap:approve",

    // Notifications
    "notification:view",

    // Reports
    "reports:view",
  ],

  COE: [
    "employee:view",

    "department:view",

    "exam:view",
    "exam:create",
    "exam:edit",
    "exam:delete",

    "duty:view",
    "duty:assign",

    "transfer:view",
    "transfer:approve",

    "swap:view",
    "swap:approve",

    "notification:view",

    "reports:view",
  ],

  HOD: [
    "department:view",

    "exam:view",

    "duty:view",

    "transfer:view",

    "swap:view",

    "reports:view",

    "notification:view",
  ],

  FACULTY: [
    "exam:view",

    "duty:view",

    "transfer:view",

    "swap:view",
    "swap:create",

    "notification:view",
  ],
};
