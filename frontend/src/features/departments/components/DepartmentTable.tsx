import DataTable from "@/components/common/DataTable";
import { useMemo } from "react";
import { useDepartments } from "../hooks/useDepartments";
import { getDepartmentColumns } from "../columns";

interface DepartmentTableProps {
  search: string;
}

export default function DepartmentTable({ search }: DepartmentTableProps) {
  const { data = [], isLoading } = useDepartments();

  const filteredDepartments = useMemo(() => {
    if (!search.trim()) return data;

    return data.filter((department) =>
      department.name.toLowerCase().includes(search.toLowerCase()),
    );
  }, [data, search]);

  const columns = useMemo(() => getDepartmentColumns(), []);

  return (
    <DataTable
      columns={columns}
      data={filteredDepartments}
      loading={isLoading}
      emptyMessage={
        search ? "No matching departments found." : "No departments found."
      }
    />
  );
}
