import examDutyRepository from "../repositories/examDuty.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import examRepository from "../repositories/exam.repository.js";

import { ApiError } from "../utils/apiError.js";

import { DutyStatus, ExamStatus } from "../generated/prisma/client.js";

import type {
  CreateExamDutyDto,
  UpdateExamDutyDto,
} from "../types/examDuty.types.js";

import type { ExamDutyResponse } from "../constants/prismaSelect.js";

class ExamDutyService {
  /**
   * Create Exam Duty
   */
  async create(data: CreateExamDutyDto): Promise<ExamDutyResponse> {
    // Check employee
    const employee = await employeeRepository.findById(data.employeeId);

    if (!employee) {
      throw new ApiError(404, "Employee not found");
    }

    if (!employee.isActive) {
      throw new ApiError(400, "Employee is inactive");
    }

    // Check exam
    const exam = await examRepository.findById(data.examId);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    if (exam.status !== ExamStatus.UPCOMING) {
      throw new ApiError(
        400,
        "Only upcoming exams can receive duty assignments",
      );
    }

    // Check duplicate assignment
    const existingDuty = await examDutyRepository.findByEmployeeAndExam(
      data.employeeId,
      data.examId,
    );

    if (existingDuty) {
      throw new ApiError(409, "Employee is already assigned to this exam");
    }

    // Check faculty limit
    const assignedFaculty = await examDutyRepository.countByExam(data.examId);

    if (assignedFaculty >= exam.requiredFaculty) {
      throw new ApiError(400, "Required faculty limit reached");
    }

    return examDutyRepository.create({
      employee: {
        connect: {
          id: data.employeeId,
        },
      },

      exam: {
        connect: {
          id: data.examId,
        },
      },

      status: DutyStatus.ASSIGNED,
    });
  }

  /**
   * Get All Exam Duties
   */
  async getAll(): Promise<ExamDutyResponse[]> {
    return examDutyRepository.findAll();
  }

  
  /**
   * Get Exam Duty By ID
   */
  async getById(id: string): Promise<ExamDutyResponse> {
    const examDuty = await examDutyRepository.findById(id);

    if (!examDuty) {
      throw new ApiError(404, "Exam duty not found");
    }

    return examDuty;
  }

  /**
   * Update Exam Duty
   */
  async update(id: string, data: UpdateExamDutyDto): Promise<ExamDutyResponse> {
    const examDuty = await examDutyRepository.findById(id);

    if (!examDuty) {
      throw new ApiError(404, "Exam duty not found");
    }

    return examDutyRepository.update(id, {
      ...data,
    });
  }

  /**
   * Soft Delete Exam Duty
   */
  async delete(id: string): Promise<ExamDutyResponse> {
    const examDuty = await examDutyRepository.findById(id);

    if (!examDuty) {
      throw new ApiError(404, "Exam duty not found");
    }

    return examDutyRepository.softDelete(id);
  }
}

export default new ExamDutyService();
