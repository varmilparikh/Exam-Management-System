export type DutyStatus = "ASSIGNED" | "ACCEPTED" | "ATTENDED" | "ABSENT";

export interface ExamDuty {
  id: string;
  employeeId: string;
  examId: string;
  status: DutyStatus;
  createdAt: string;
  updatedAt: string;
  employee: {
    id: string;
    employeeCode: string;
    name: string;
    designation: string;
    department: { id: string; name: string };
  };
  exam: {
    id: string;
    examName: string;
    examDate: string;
    requiredFaculty: number;
    status: string;
  };
  transfers: {
    id: string;
    status: "PENDING";
  }[];
}
