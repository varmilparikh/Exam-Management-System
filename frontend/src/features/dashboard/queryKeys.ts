// src/features/dashboard/queryKeys.ts

export const dashboardKeys = {
  all: ["dashboard"] as const,

  coe: ["dashboard", "coe"] as const,

  faculty: ["dashboard", "faculty"] as const,

  hod: ["dashboard", "hod"] as const,

  upcomingExams: ["dashboard", "upcoming-exams"] as const,

  DashboardPendingRequests: ["dashboard", "pending-requests"] as const,

  recentActivities: ["dashboard", "recent-activities"] as const,

  facultyWorkload: ["dashboard", "faculty-workload"] as const,
};
