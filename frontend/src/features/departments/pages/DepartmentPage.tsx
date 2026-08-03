import { useState } from "react";

import PageHeader from "@/components/common/PageHeader";
import SearchInput from "@/components/common/SearchInput";

import CreateDepartmentDialog from "../dialogs/CreateDepartmentDialog";
import DepartmentTable from "../components/DepartmentTable";
import Select from "@/components/ui/Select/Select";

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
      <Select
        placeholder="Choose Department"
        options={[
          {
            label: "Computer Science",
            value: "cs",
          },
          {
            label: "Mechanical",
            value: "me",
          },
        ]}
      />

      <DepartmentTable search={search} />
    </div>
  );
}
