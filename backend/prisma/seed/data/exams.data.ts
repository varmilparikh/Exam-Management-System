import { ExamStatus } from "../../../src/generated/prisma/enums.js";

const generalSession = {
  sessionName: "General",
  startTime: new Date("1970-01-01T09:00:00.000Z"),
  endTime: new Date("1970-01-01T12:00:00.000Z"),
};

const dateOffset = (days: number) => {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date;
};

export const exams = [
  {
    ...generalSession,
    examName: "Database Management Systems",
    examDate: dateOffset(7),
    requiredFaculty: 4,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Operating Systems",
    examDate: dateOffset(9),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Computer Networks",
    examDate: dateOffset(12),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Data Structures",
    examDate: dateOffset(0),
    requiredFaculty: 4,
    status: ExamStatus.ACTIVE,
  },
  {
    ...generalSession,
    examName: "Machine Learning",
    examDate: dateOffset(-14),
    requiredFaculty: 3,
    status: ExamStatus.COMPLETED,
  },
  {
    ...generalSession,
    examName: "Cloud Computing",
    examDate: dateOffset(16),
    requiredFaculty: 3,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Artificial Intelligence",
    examDate: dateOffset(18),
    requiredFaculty: 4,
    status: ExamStatus.UPCOMING,
  },
  {
    ...generalSession,
    examName: "Software Engineering",
    examDate: dateOffset(-30),
    requiredFaculty: 2,
    status: ExamStatus.COMPLETED,
  },
  {
    ...generalSession,
    examName: "Compiler Design",
    examDate: dateOffset(21),
    requiredFaculty: 2,
    status: ExamStatus.CANCELLED,
  },
  {
    ...generalSession,
    examName: "Cyber Security",
    examDate: dateOffset(0),
    requiredFaculty: 3,
    status: ExamStatus.ACTIVE,
  },
];
