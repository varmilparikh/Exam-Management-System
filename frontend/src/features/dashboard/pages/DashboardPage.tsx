import { Building2, CalendarDays, ClipboardList, Users } from "lucide-react";

import DashboardSection from "@/components/dashboard/DashboardSection";
import StatCard from "@/components/dashboard/StatCard";
import Button from "@/components/ui/Button";

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Statistics */}
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Employees"
          value={125}
          subtitle="+5 this month"
          icon={<Users className="h-6 w-6 text-blue-600" />}
        />

        <StatCard
          title="Departments"
          value={8}
          subtitle="Active departments"
          icon={<Building2 className="h-6 w-6 text-blue-600" />}
        />

        <StatCard
          title="Upcoming Exams"
          value={12}
          subtitle="Scheduled"
          icon={<CalendarDays className="h-6 w-6 text-blue-600" />}
        />

        <StatCard
          title="Pending Requests"
          value={5}
          subtitle="Awaiting approval"
          icon={<ClipboardList className="h-6 w-6 text-blue-600" />}
        />
      </section>

      {/* Dashboard Sections */}
      <div className="grid gap-6 lg:grid-cols-2">
        <DashboardSection title="Recent Activity">
          <ul className="space-y-3 text-sm text-gray-600">
            <li>Faculty A accepted exam duty.</li>
            <li>Faculty B transferred duty.</li>
            <li>New employee added.</li>
            <li>Exam schedule updated.</li>
          </ul>
        </DashboardSection>

        <DashboardSection title="Upcoming Exams">
          <ul className="space-y-3 text-sm text-gray-600">
            <li>Semester Examination - June 20</li>
            <li>Practical Examination - June 24</li>
            <li>Internal Assessment - June 28</li>
          </ul>
        </DashboardSection>
      </div>

      <DashboardSection title="Quick Actions">
        <div className="flex flex-wrap gap-4">
          <Button variant="primary">Add Employee</Button>

          <Button variant="secondary">Create Exam</Button>

          <Button variant="outline">Assign Duty</Button>
        </div>
      </DashboardSection>
    </div>
  );
}
