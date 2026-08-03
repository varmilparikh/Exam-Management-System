import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";

import CreateDepartmentDialog from "../dialogs/CreateDepartmentDialog";
import DepartmentTable from "../components/DepartmentTable";

export default function DepartmentsPage() {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      <PageHeader
        title="Departments"
        description="Manage university departments."
        action={<CreateDepartmentDialog />}
      />

      <SearchInput
        value={search}
        onChange={setSearch}
        placeholder="Search departments..."
      />

      <DepartmentTable search={search} />
    </div>
  );
}
