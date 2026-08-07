import { Link } from "react-router-dom";

import { ClipboardList, ArrowRightLeft, Repeat, Bell } from "lucide-react";

import Button from "@/components/ui/Button";

import { ROUTES } from "@/constants/routes";

export default function FacultyQuickActions() {
  return (
    <div className="rounded-xl border bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-lg font-semibold">Quick Actions</h2>

      <div className="grid gap-4 md:grid-cols-4">
        <Link to={ROUTES.DUTIES}>
          <Button className="w-full">
            <ClipboardList className="mr-2 h-4 w-4" />
            My Duties
          </Button>
        </Link>

        <Link to={ROUTES.TRANSFER_REQUESTS}>
          <Button className="w-full">
            <ArrowRightLeft className="mr-2 h-4 w-4" />
            Transfer Requests
          </Button>
        </Link>

        <Link to={ROUTES.SWAP_REQUESTS}>
          <Button className="w-full">
            <Repeat className="mr-2 h-4 w-4" />
            Swap Requests
          </Button>
        </Link>

        <Link to={ROUTES.NOTIFICATIONS}>
          <Button className="w-full">
            <Bell className="mr-2 h-4 w-4" />
            Notifications
          </Button>
        </Link>
      </div>
    </div>
  );
}
