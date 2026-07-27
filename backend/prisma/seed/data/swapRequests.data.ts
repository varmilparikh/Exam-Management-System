import { SwapStatus } from "../../../src/generated/prisma/enums.js";

export const swapRequests = [
  {
    requesterCode: "EMP006",
    receiverCode: "EMP010",
    requesterExam: "Database Management Systems",
    receiverExam: "Operating Systems",
    status: SwapStatus.APPROVED,
    reason: "Department meeting",
    approvedByCode: "EMP002",
    approvalRemark: "Approved",
  },

  {
    requesterCode: "EMP010",
    receiverCode: "EMP014",
    requesterExam: "Operating Systems",
    receiverExam: "Artificial Intelligence",
    status: SwapStatus.PENDING,
    reason: "Family function",
    approvedByCode: null,
    approvalRemark: null,
  },

  {
    requesterCode: "EMP013",
    receiverCode: "EMP017",
    requesterExam: "Cyber Security",
    receiverExam: "Artificial Intelligence",
    status: SwapStatus.REJECTED,
    reason: "Travel",
    approvedByCode: "EMP002",
    approvalRemark: "Receiver already has sufficient duties",
  },

  {
    requesterCode: "EMP008",
    receiverCode: "EMP015",
    requesterExam: "Cloud Computing",
    receiverExam: "Computer Networks",
    status: SwapStatus.CANCELLED,
    reason: "No longer required",
    approvedByCode: null,
    approvalRemark: null,
  },
];
