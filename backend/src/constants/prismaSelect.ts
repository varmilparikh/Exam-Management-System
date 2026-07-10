import type { Prisma } from "../generated/prisma/client.js";

export const employeeSelect = {
  id: true,
  employeeCode: true,
  name: true,
  email: true,
  phone: true,
  loginProvider: true,
  isEmailVerified: true,
  lastLogin: true,
  profileImage: true,
  designation: true,
  role: true,
  averageDuty: true,
  attendedCount: true,
  transferCount: true,
  isActive: true,
  isDeleted: true,
  departmentId: true,
  createdAt: true,
  updatedAt: true,

  department: {
    select: {
      id: true,
      name: true,
    },
  },
} satisfies Prisma.EmployeeSelect;

export type EmployeeResponse = Prisma.EmployeeGetPayload<{
  select: typeof employeeSelect;
}>;


export const examSelect = {
  id: true,
  examName: true,
  examDate: true,
  requiredFaculty: true,
  status: true,
  isDeleted: true,
  createdAt: true,
  updatedAt: true,
} satisfies Prisma.ExamSelect;

export type ExamResponse = Prisma.ExamGetPayload<{
  select: typeof examSelect;
}>;


export const examDutySelect = {
  id: true,

  employeeId: true,

  examId: true,

  status: true,

  isDeleted: true,

  createdAt: true,

  updatedAt: true,

  employee: {
    select: {
      id: true,
      employeeCode: true,
      name: true,
      designation: true,

      department: {
        select: {
          id: true,
          name: true,
        },
      },
    },
  },

  exam: {
    select: {
      id: true,
      examName: true,
      examDate: true,
      requiredFaculty: true,
      status: true,
    },
  },
} satisfies Prisma.ExamDutySelect;

export type ExamDutyResponse =
  Prisma.ExamDutyGetPayload<{
    select: typeof examDutySelect;
  }>;


export const activityLogSelect = {
  id: true,

  employeeId: true,

  action: true,

  description: true,

  entityType: true,

  entityId: true,

  ipAddress: true,

  userAgent: true,

  isDeleted: true,

  createdAt: true,

  updatedAt: true,

  employee: {
    select: {
      id: true,
      employeeCode: true,
      name: true,
      role: true,
    },
  },
} satisfies Prisma.ActivityLogSelect;

export type ActivityLogResponse =
  Prisma.ActivityLogGetPayload<{
    select: typeof activityLogSelect;
  }>;


export const notificationSelect = {
  id: true,

  employeeId: true,

  title: true,

  message: true,

  isRead: true,

  isDeleted: true,

  createdAt: true,

  updatedAt: true,

  employee: {
    select: {
      id: true,
      employeeCode: true,
      name: true,
      role: true,
    },
  },
} satisfies Prisma.NotificationSelect;

export type NotificationResponse =
  Prisma.NotificationGetPayload<{
    select: typeof notificationSelect;
  }>;


export const transferRequestSelect = {
  id: true,

  fromEmployeeId: true,
  toEmployeeId: true,

  examDutyId: true,

  status: true,

  reason: true,

  approvedById: true,
  approvedAt: true,
  approvalRemark: true,

  isDeleted: true,

  createdAt: true,
  updatedAt: true,

  fromEmployee: {
    select: {
      id: true,
      employeeCode: true,
      name: true,
      role: true,
    },
  },

  toEmployee: {
    select: {
      id: true,
      employeeCode: true,
      name: true,
      role: true,
    },
  },

  approvedBy: {
    select: {
      id: true,
      employeeCode: true,
      name: true,
      role: true,
    },
  },

  examDuty: {
    select: {
      id: true,
      status: true,

      exam: {
        select: {
          id: true,
          examName: true,
          examDate: true,
          status: true,
        },
      },
    },
  },
} satisfies Prisma.TransferRequestSelect;

export type TransferRequestResponse =
  Prisma.TransferRequestGetPayload<{
    select: typeof transferRequestSelect;
  }>;