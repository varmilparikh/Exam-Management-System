import { TransferStatus } from "../../../src/generated/prisma/enums.js";

export const transferRequests = [
  {
    fromEmployeeCode: "EMP006",
    toEmployeeCode: "EMP009",
    examName: "Database Management Systems",
    status: TransferStatus.APPROVED,
    reason: "Medical leave",
    approvalRemark: "Approved due to medical reason",
    approvedByCode: "EMP002",
  },

  {
    fromEmployeeCode: "EMP010",
    toEmployeeCode: "EMP013",
    examName: "Operating Systems",
    status: TransferStatus.PENDING,
    reason: "Personal work",
    approvalRemark: null,
    approvedByCode: null,
  },

  {
    fromEmployeeCode: "EMP013",
    toEmployeeCode: "EMP015",
    examName: "Cyber Security",
    status: TransferStatus.REJECTED,
    reason: "Conference attendance",
    approvalRemark: "Insufficient justification",
    approvedByCode: "EMP002",
  },

  {
    fromEmployeeCode: "EMP008",
    toEmployeeCode: "EMP011",
    examName: "Cloud Computing",
    status: TransferStatus.CANCELLED,
    reason: "No longer required",
    approvalRemark: null,
    approvedByCode: null,
  },
];