import { ExamStatus } from "../../../src/generated/prisma/enums.js";

const generalSession = {
  sessionName: "General",
  startTime: new Date("1970-01-01T09:00:00.000Z"),
  endTime: new Date("1970-01-01T12:00:00.000Z"),
};

export const exams = [
  {
    ...generalSession,
    examName: "Database Management Systems",
    examDate: new Date("2026-09-10T09:00:00"),
    requiredFaculty: 4,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Operating Systems",
    examDate: new Date("2026-09-12T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Computer Networks",
    examDate: new Date("2026-09-15T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Data Structures",
    examDate: new Date("2026-07-01T09:00:00"),
    requiredFaculty: 4,
    status: ExamStatus.ACTIVE,
  },
  {
    ...generalSession,
    examName: "Machine Learning",
    examDate: new Date("2026-05-15T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.COMPLETED,
  },
  {
    ...generalSession,
    examName: "Cloud Computing",
    examDate: new Date("2026-09-18T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Artificial Intelligence",
    examDate: new Date("2026-09-20T09:00:00"),
    requiredFaculty: 4,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Software Engineering",
    examDate: new Date("2026-06-05T09:00:00"),
    requiredFaculty: 2,
    status: ExamStatus.COMPLETED,
  },
  {
    ...generalSession,
    examName: "Compiler Design",
    examDate: new Date("2026-08-25T09:00:00"),
    requiredFaculty: 2,
    status: ExamStatus.CANCELLED,
  },
  {
    ...generalSession,
    examName: "Cyber Security",
    examDate: new Date("2026-07-10T09:00:00"),
    requiredFaculty: 3,
    status: ExamStatus.ACTIVE,
  },
];
