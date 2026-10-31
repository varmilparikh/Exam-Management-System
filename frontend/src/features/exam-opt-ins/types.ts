export type ExamOptInStatus = "PENDING" | "CONFIRMED" | "REJECTED" | "CANCELLED";

export interface UpcomingExamOptIn {
  id: string;
  examName: string;
  examDate: string;
  sessionName: string;
  startTime: string;
  endTime: string;
  requiredFaculty: number;
  status: string;
  assignedFaculty: number;
  optedInFaculty: number;
  availablePositions: number;
  myOptIn: ExamOptInStatus | null;
  myOptInId: string | null;
}

export interface ExamOptIn {
  id: string;
  employeeId: string;
  examId: string;
  status: ExamOptInStatus;
  reviewRemark: string | null;
  reviewedAt: string | null;
  createdAt: string;
  employee: {
    id: string;
    employeeCode: string;
    name: string;
    role: string;
    department: { id: string; name: string };
  };
  exam: {
    id: string;
    examName: string;
    examDate: string;
    sessionName: string;
    startTime: string;
    endTime: string;
    requiredFaculty: number;
    status: string;
  };
}
