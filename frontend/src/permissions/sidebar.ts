// permissions/sidebar.ts

import type { NavigationItem } from "@/constants/navigation";
import { ROUTES } from "@/constants/routes";
import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  ClipboardList,
  Repeat,
  RefreshCw,
  FileText,
  Bell,
  History,
} from "lucide-react";

import { type UserRole } from "./roles";

export function getNavigation(role?: UserRole): NavigationItem[] {
  switch (role) {
    case "SUPER_ADMIN":
      return [
        { label: "Dashboard", path: ROUTES.HOME, icon: LayoutDashboard },
        { label: "Employees", path: ROUTES.EMPLOYEES, icon: Users },
        { label: "Departments", path: ROUTES.DEPARTMENTS, icon: Building2 },
        { label: "Exams", path: ROUTES.EXAMS, icon: CalendarDays },
        { label: "Session requests", path: ROUTES.EXAM_OPT_INS, icon: CalendarDays },
        { label: "Exam Duties", path: ROUTES.DUTIES, icon: ClipboardList },
        {
          label: "Transfer Requests",
          path: ROUTES.TRANSFER_REQUESTS,
          icon: Repeat,
        },
        { label: "Swap Requests", path: ROUTES.SWAP_REQUESTS, icon: RefreshCw },
        { label: "Reports", path: ROUTES.REPORTS, icon: FileText },
        { label: "Activity Logs", path: ROUTES.ACTIVITY_LOGS, icon: History },
        { label: "Notifications", path: ROUTES.NOTIFICATIONS, icon: Bell },
      ];

    case "COE":
      return [
        { label: "Dashboard", path: ROUTES.HOME, icon: LayoutDashboard },
        { label: "Employees", path: ROUTES.EMPLOYEES, icon: Users },
        { label: "Exams", path: ROUTES.EXAMS, icon: CalendarDays },
        { label: "Session requests", path: ROUTES.EXAM_OPT_INS, icon: CalendarDays },
        { label: "Exam Duties", path: ROUTES.DUTIES, icon: ClipboardList },
        {
          label: "Transfer Requests",
          path: ROUTES.TRANSFER_REQUESTS,
          icon: Repeat,
        },
        { label: "Swap Requests", path: ROUTES.SWAP_REQUESTS, icon: RefreshCw },
        { label: "Reports", path: ROUTES.REPORTS, icon: FileText },
        { label: "Activity Logs", path: ROUTES.ACTIVITY_LOGS, icon: History },
        { label: "Notifications", path: ROUTES.NOTIFICATIONS, icon: Bell },
      ];

    case "HOD":
      return [
        { label: "Dashboard", path: ROUTES.HOME, icon: LayoutDashboard },
        { label: "Session requests", path: ROUTES.EXAM_OPT_INS, icon: CalendarDays },
        { label: "Exam Duties", path: ROUTES.DUTIES, icon: ClipboardList },
        {
          label: "Transfer Requests",
          path: ROUTES.TRANSFER_REQUESTS,
          icon: Repeat,
        },
        {
          label: "Swap Requests",
          path: ROUTES.SWAP_REQUESTS,
          icon: RefreshCw,
        },
        { label: "Notifications", path: ROUTES.NOTIFICATIONS, icon: Bell },
        { label: "Department Workload", path: ROUTES.REPORTS_WORKLOAD, icon: FileText },
        { label: "Department Duties", path: ROUTES.REPORTS_DUTIES, icon: ClipboardList },
      ];

    case "FACULTY":
      return [
        { label: "Dashboard", path: ROUTES.HOME, icon: LayoutDashboard },
        { label: "My Duties", path: ROUTES.DUTIES, icon: ClipboardList },
        {
          label: "Transfer Requests",
          path: ROUTES.TRANSFER_REQUESTS,
          icon: Repeat,
        },
        { label: "Swap Requests", path: ROUTES.SWAP_REQUESTS, icon: RefreshCw },
        { label: "Notifications", path: ROUTES.NOTIFICATIONS, icon: Bell },
        { label: "My Workload", path: ROUTES.REPORTS_WORKLOAD, icon: FileText },
        { label: "My Duty Report", path: ROUTES.REPORTS_DUTIES, icon: ClipboardList },
      ];

    default:
      return [];
  }
}
