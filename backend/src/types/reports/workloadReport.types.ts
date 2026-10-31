export interface FacultyWorkloadRow {
  employeeId: string;
  employeeCode: string;
  name: string;
  email: string;
  department: string;

  totalDuties: number;
  assignedCount: number;
  attendedCount: number;
  absentCount: number;
  transferCount: number;
}

export interface FacultyWorkloadReport {
  rows: FacultyWorkloadRow[];

  summary: {
    totalFaculty: number;
    totalDuties: number;
    totalAssigned: number;
    totalAttended: number;
    totalAbsent: number;
    totalTransferred: number;
    averageDutiesPerFaculty: number;
  };

  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
