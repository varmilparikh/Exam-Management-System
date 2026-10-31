import examRepository from "../repositories/exam.repository.js";
import { ApiError } from "../utils/apiError.js";

import type { CreateExamDto, UpdateExamDto } from "../types/exam.types.js";
import type { ExamResponse } from "../constants/prismaSelect.js";
import { ExamStatus } from "../generated/prisma/client.js";
import { isPastDate } from "../utils/date.utils.js";
import type { ExamFilters } from "../types/examFilter.types.js";

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

    if (data.endTime <= data.startTime) {
      throw new ApiError(400, "Session end time must be after its start time");
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
      sessionName: data.sessionName,
      startTime: data.startTime,
      endTime: data.endTime,
      requiredFaculty: data.requiredFaculty,
      status: ExamStatus.UPCOMING,
    });
  }

  /**
   * Get All Exams
   */
  async getAll(filters: ExamFilters) {
    return examRepository.findAll(filters);
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

    if (data.requiredFaculty !== undefined) {
      const reserved = await examRepository.countReservedPositions(id);
      if (data.requiredFaculty < reserved) {
        throw new ApiError(409, `Required faculty cannot be reduced below ${reserved} assigned or opted-in positions.`);
      }
    }

    if (data.examDate !== undefined && isPastDate(data.examDate)) {
      throw new ApiError(400, "Exam date cannot be in the past");
    }

    const startTime = data.startTime ?? exam.startTime;
    const endTime = data.endTime ?? exam.endTime;
    if (endTime <= startTime) {
      throw new ApiError(400, "Session end time must be after its start time");
    }

    const sessionChanged =
      (data.examDate !== undefined && data.examDate.getTime() !== exam.examDate.getTime()) ||
      (data.sessionName !== undefined && data.sessionName !== exam.sessionName) ||
      (data.startTime !== undefined && data.startTime.getTime() !== exam.startTime.getTime()) ||
      (data.endTime !== undefined && data.endTime.getTime() !== exam.endTime.getTime());
    if (sessionChanged && await examRepository.hasDutiesOrOptIns(id)) {
      throw new ApiError(409, "An exam session cannot change after duties or opt-ins have been created.");
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
