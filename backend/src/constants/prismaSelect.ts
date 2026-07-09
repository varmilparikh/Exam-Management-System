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