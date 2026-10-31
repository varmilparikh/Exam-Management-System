import { z } from "zod";
import { ExamOptInStatus } from "../generated/prisma/client.js";

export const createExamOptInSchema = z.object({
  examId: z.uuid(),
}).strict();

export const reviewExamOptInSchema = z.object({
  remark: z.string().trim().max(500).optional(),
}).strict().default({});

export const rejectExamOptInSchema = z.object({
  remark: z.string().trim().min(5).max(500),
}).strict();

export const listExamOptInsQuerySchema = z.object({
  status: z.nativeEnum(ExamOptInStatus).optional(),
  examId: z.uuid().optional(),
  departmentId: z.uuid().optional(),
}).strict();
