import { ExamStatus } from "../../../src/generated/prisma/enums.js";

export const exams = [
  {
    examName: "Database Management Systems",
    examDate: new Date("2026-09-10T09:00:00"),
    requiredFaculty: 4,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "Operating Systems",
    examDate: new Date("2026-09-12T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "Computer Networks",
    examDate: new Date("2026-09-15T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "Data Structures",
    examDate: new Date("2026-07-01T09:00:00"),
    requiredFaculty: 4,
    status: ExamStatus.ACTIVE,
  },
  {
    examName: "Machine Learning",
    examDate: new Date("2026-05-15T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.COMPLETED,
  },
  {
    examName: "Cloud Computing",
    examDate: new Date("2026-09-18T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "Artificial Intelligence",
    examDate: new Date("2026-09-20T09:00:00"),
    requiredFaculty: 4,
    status: ExamStatus.UPCOMING,
  },
  {
    examName: "Software Engineering",
    examDate: new Date("2026-06-05T09:00:00"),
    requiredFaculty: 2,
    status: ExamStatus.COMPLETED,
  },
  {
    examName: "Compiler Design",
    examDate: new Date("2026-08-25T09:00:00"),
    requiredFaculty: 2,
    status: ExamStatus.CANCELLED,
  },
  {
    examName: "Cyber Security",
    examDate: new Date("2026-07-10T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.ACTIVE,
  },
];