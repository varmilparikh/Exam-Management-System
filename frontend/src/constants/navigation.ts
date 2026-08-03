import {
  LayoutDashboard,
  Users,
  Building2,
  CalendarDays,
  ClipboardList,
 Repeat,
  FileText,
  Settings,
  type LucideIcon,
} from "lucide-react";

import { ROUTES } from "./routes";

export interface NavigationItem {
  label: string;
  path: string;
  icon: LucideIcon;
}

export const navigation: NavigationItem[] = [
  {
    label: "Dashboard",
    path: ROUTES.HOME,
    icon: LayoutDashboard,
  },
  {
    label: "Employees",
    path: ROUTES.EMPLOYEES,
    icon: Users,
  },
  {
    label: "Departments",
    path: ROUTES.DEPARTMENTS,
    icon: Building2,
  },
  {
    label: "Exams",
    path: ROUTES.EXAMS,
    icon: CalendarDays,
  },
  {
    label: "Exam Duties",
    path: ROUTES.DUTIES,
    icon: ClipboardList,
  },
  {
    label: "Requests",
    path: "/requests",
    icon: Repeat,
  },
  {
    label: "Reports",
    path: ROUTES.REPORTS,
    icon: FileText,
  },
  {
    label: "Settings",
    path: "/settings",
    icon: Settings,
  },
];