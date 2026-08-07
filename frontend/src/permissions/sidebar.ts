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
        { label: "Exam Duties", path: ROUTES.DUTIES, icon: ClipboardList },
        {
          label: "Transfer Requests",
          path: ROUTES.TRANSFER_REQUESTS,
          icon: Repeat,
        },
        { label: "Swap Requests", path: ROUTES.SWAP_REQUESTS, icon: RefreshCw },
        { label: "Reports", path: ROUTES.REPORTS, icon: FileText },
      ];

    case "COE":
      return [
        { label: "Dashboard", path: ROUTES.HOME, icon: LayoutDashboard },
        { label: "Employees", path: ROUTES.EMPLOYEES, icon: Users },
        { label: "Exams", path: ROUTES.EXAMS, icon: CalendarDays },
        { label: "Exam Duties", path: ROUTES.DUTIES, icon: ClipboardList },
        {
          label: "Transfer Requests",
          path: ROUTES.TRANSFER_REQUESTS,
          icon: Repeat,
        },
        { label: "Swap Requests", path: ROUTES.SWAP_REQUESTS, icon: RefreshCw },
        { label: "Reports", path: ROUTES.REPORTS, icon: FileText },
      ];

    case "HOD":
      return [
        { label: "Dashboard", path: ROUTES.HOME, icon: LayoutDashboard },
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
        { label: "Reports", path: ROUTES.REPORTS, icon: FileText },
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
      ];

    default:
      return [];
  }
}
