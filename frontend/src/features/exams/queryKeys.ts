export const examKeys = {
  all: ["exams"] as const,

  detail: (id: string) => ["exams", id] as const,
};
