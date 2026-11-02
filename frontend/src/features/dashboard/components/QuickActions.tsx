import { Link } from "react-router-dom";

import { Users, Building2, CalendarPlus, ClipboardCheck } from "lucide-react";

import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

import {
  canCreateEmployee,
  canCreateDepartment,
  canCreateExam,
  canAssignDuty,
} from "@/permissions";

import { ROUTES } from "@/constants/routes";

export default function QuickActions() {
  const { user } = useAuth();

  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">Common tasks</h2>
        <p className="mt-1 text-sm text-slate-500">Jump straight to a frequent task.</p>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {canCreateEmployee(user?.role) && (
          <Link to={ROUTES.EMPLOYEES}>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 text-blue-700" />
              Manage employees
            </Button>
          </Link>
        )}

        {canCreateDepartment(user?.role) && (
          <Link to={ROUTES.DEPARTMENTS}>
            <Button variant="outline" className="w-full justify-start">
              <Building2 className="h-4 w-4 text-teal-700" />
              Manage departments
            </Button>
          </Link>
        )}

        {canCreateExam(user?.role) && (
          <Link to={ROUTES.EXAMS}>
            <Button variant="outline" className="w-full justify-start">
              <CalendarPlus className="h-4 w-4 text-indigo-700" />
              Create an exam
            </Button>
          </Link>
        )}

        {canAssignDuty(user?.role) && (
          <Link to={ROUTES.DUTIES}>
            <Button variant="outline" className="w-full justify-start">
              <ClipboardCheck className="h-4 w-4 text-violet-700" />
              Assign exam duties
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
