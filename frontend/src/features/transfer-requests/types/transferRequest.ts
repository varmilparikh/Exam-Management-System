export type TransferStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

interface Person {
  id: string;
  employeeCode: string;
  name: string;
  role: string;
}

export interface TransferRequest {
  id: string;
  fromEmployeeId: string;
  toEmployeeId: string | null;
  examDutyId: string;
  status: TransferStatus;
  reason: string;
  approvedById: string | null;
  approvedAt: string | null;
  approvalRemark: string | null;
  createdAt: string;
  updatedAt: string;
  fromEmployee: Person;
  toEmployee: Person | null;
  approvedBy: Person | null;
  examDuty: {
    id: string;
    status: string;
    exam: { id: string; examName: string; examDate: string; status: string };
  };
}
