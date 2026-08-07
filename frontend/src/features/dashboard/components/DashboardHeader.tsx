import { useAuth } from "@/hooks/useAuth";
import Avatar from "@/components/common/Avatar";

export default function DashboardHeader() {
  const { user } = useAuth();

  const hour = new Date().getHours();

  const greeting =
    hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  return (
    <div className="flex items-center justify-between rounded-xl bg-white p-6 shadow-sm">
      <div>
        <h1 className="text-3xl font-bold">{greeting},</h1>

        <p className="mt-2 text-xl">{user?.name}</p>

        <p className="text-gray-500">{user?.designation}</p>
      </div>

      <Avatar name={user?.name ?? ""} src={user?.profileImage} size="lg" />
    </div>
  );
}
