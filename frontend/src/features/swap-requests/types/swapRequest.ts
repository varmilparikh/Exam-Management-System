export type SwapStatus =
  | "PENDING"
  | "ACCEPTED"
  | "APPROVED"
  | "COMPLETED"
  | "REJECTED"
  | "CANCELLED";

export interface SwapRequest {
  id: string;

  requesterId: string;
  receiverId: string;

  requesterDutyId: string;
  receiverDutyId: string;

  status: SwapStatus;

  reason?: string;

  completedAt?: string | null;

  createdAt: string;
  updatedAt: string;

  requester: {
    id: string;
    employeeCode: string;
    name: string;
    role: string;
  };

  receiver: {
    id: string;
    employeeCode: string;
    name: string;
    role: string;
  };

  requesterDuty: {
    id: string;
    status: string;

    exam: {
      id: string;
      examName: string;
      examDate: string;
    };
  };

  receiverDuty: {
    id: string;
    status: string;

    exam: {
      id: string;
      examName: string;
      examDate: string;
    };
  };
}
