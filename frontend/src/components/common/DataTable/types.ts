import type { ReactNode } from "react";

export interface Column<T> {
  /**
   * Property name from the row object.
   * Example: "name", "email", "role"
   */
  key: keyof T;

  /**
   * Column title displayed in the header.
   */
  title: string;

  /**
   * Optional width of the column.
   * Example: "200px", "20%"
   */
  width?: string;

  /**
   * Text alignment.
   */
  align?: "left" | "center" | "right";

  /**
   * Custom cell renderer.
   */
  render?: (row: T) => ReactNode;
}

export interface DataTableProps<T extends { id: string }> {
  columns: Column<T>[];
  data: T[];

  className?: string;

  loading?: boolean;

  emptyMessage?: string;
}
