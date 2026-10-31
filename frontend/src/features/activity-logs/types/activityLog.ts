export interface ActivityLog {
  id: string;
  employeeId: string;
  action: string;
  description: string;
  entityType: string | null;
  entityId: string | null;
  createdAt: string;
  employee: {
    id: string;
    employeeCode: string;
    name: string;
    role: string;
  };
}

export interface ActivityLogResponse {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  logs: ActivityLog[];
}

export interface ActivityLogFilters {
  page: number;
  limit: number;
  search: string;
  action: string;
  fromDate: string;
  toDate: string;
}
