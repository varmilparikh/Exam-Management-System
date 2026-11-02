import { Link } from "react-router-dom";

import { ClipboardList, ArrowRightLeft, Repeat, Bell } from "lucide-react";

import Button from "@/components/ui/Button";

import { ROUTES } from "@/constants/routes";

export default function FacultyQuickActions() {
  return (
    <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_8px_24px_rgba(15,23,42,0.045)] sm:p-6">
      <div className="mb-5">
        <h2 className="text-base font-semibold tracking-tight text-slate-900">Quick links</h2>
        <p className="mt-1 text-sm text-slate-500">Open your duties and requests.</p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        <Link to={ROUTES.DUTIES}>
          <Button variant="outline" className="w-full justify-start">
            <ClipboardList className="h-4 w-4 text-blue-700" />
            My Duties
          </Button>
        </Link>

        <Link to={ROUTES.TRANSFER_REQUESTS}>
          <Button variant="outline" className="w-full justify-start">
            <ArrowRightLeft className="h-4 w-4 text-amber-700" />
            Request a transfer
          </Button>
        </Link>

        <Link to={ROUTES.SWAP_REQUESTS}>
          <Button variant="outline" className="w-full justify-start">
            <Repeat className="h-4 w-4 text-indigo-700" />
            Request a swap
          </Button>
        </Link>

        <Link to={ROUTES.NOTIFICATIONS}>
          <Button variant="outline" className="w-full justify-start">
            <Bell className="h-4 w-4 text-teal-700" />
            Open notifications
          </Button>
        </Link>
      </div>
    </div>
  );
}
