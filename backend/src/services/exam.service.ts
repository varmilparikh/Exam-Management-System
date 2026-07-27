import examRepository from "../repositories/exam.repository.js";
import { ApiError } from "../utils/apiError.js";

import type { CreateExamDto, UpdateExamDto } from "../types/exam.types.js";
import type { ExamResponse } from "../constants/prismaSelect.js";
import { ExamStatus } from "../generated/prisma/client.js";
import { isPastDate } from "../utils/date.utils.js";

class ExamService {
  /**
   * Create Exam
   */
  async create(data: CreateExamDto): Promise<ExamResponse> {
    // Check required faculty
    if (data.requiredFaculty <= 0) {
      throw new ApiError(400, "Required faculty must be greater than zero");
    }

    if (isPastDate(data.examDate)) {
      throw new ApiError(400, "Exam date cannot be in the past");
    }

    const duplicate = await examRepository.findDuplicate(
      data.examName,
      data.examDate,
    );

    if (duplicate) {
      throw new ApiError(
        409,
        "An exam with the same name and date already exists.",
      );
    }

    return examRepository.create({
      examName: data.examName,
      examDate: data.examDate,
      requiredFaculty: data.requiredFaculty,
      status: ExamStatus.UPCOMING,
    });
  }

  /**
   * Get All Exams
   */
  async getAll(): Promise<ExamResponse[]> {
    return examRepository.findAll();
  }

  /**
   * Get Exam By ID
   */
  async getById(id: string): Promise<ExamResponse> {
    const exam = await examRepository.findById(id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    return exam;
  }

  /**
   * Update Exam
   */
  async update(id: string, data: UpdateExamDto): Promise<ExamResponse> {
    const exam = await examRepository.findById(id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    if (data.requiredFaculty !== undefined && data.requiredFaculty <= 0) {
      throw new ApiError(400, "Required faculty must be greater than zero");
    }

    if (data.examDate !== undefined && isPastDate(data.examDate)) {
      throw new ApiError(400, "Exam date cannot be in the past");
    }

    if (
      exam.status === ExamStatus.COMPLETED ||
      exam.status === ExamStatus.CANCELLED
    ) {
      throw new ApiError(
        409,
        "Completed or cancelled exams cannot be modified.",
      );
    }

    if (data.examName || data.examDate) {
      const duplicate = await examRepository.findDuplicateExceptId(
        id,
        data.examName ?? exam.examName,
        data.examDate ?? exam.examDate,
      );

      if (duplicate) {
        throw new ApiError(
          409,
          "An exam with the same name and date already exists.",
        );
      }
    }

    return examRepository.update(id, {
      ...data,
    });
  }

  /**
   * Soft Delete Exam
   */
  async delete(id: string): Promise<ExamResponse> {
    const exam = await examRepository.findById(id);

    if (!exam) {
      throw new ApiError(404, "Exam not found");
    }

    if (
      exam.status === ExamStatus.COMPLETED ||
      exam.status === ExamStatus.CANCELLED
    ) {
      throw new ApiError(
        409,
        "Completed or cancelled exams cannot be deleted.",
      );
    }

    return examRepository.softDelete(id);
  }
}

export default new ExamService();
