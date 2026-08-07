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
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {canCreateEmployee(user?.role) && (
          <Link to={ROUTES.EMPLOYEES}>
            <Button>
              <Users className="mr-2 h-4 w-4" />
              Employees
            </Button>
          </Link>
        )}

        {canCreateDepartment(user?.role) && (
          <Link to={ROUTES.DEPARTMENTS}>
            <Button>
              <Building2 className="mr-2 h-4 w-4" />
              Departments
            </Button>
          </Link>
        )}

        {canCreateExam(user?.role) && (
          <Link to={ROUTES.EXAMS}>
            <Button>
              <CalendarPlus className="mr-2 h-4 w-4" />
              Exams
            </Button>
          </Link>
        )}

        {canAssignDuty(user?.role) && (
          <Link to={ROUTES.DUTIES}>
            <Button>
              <ClipboardCheck className="mr-2 h-4 w-4" />
              Duties
            </Button>
          </Link>
        )}
      </div>
    </div>
  );
}
