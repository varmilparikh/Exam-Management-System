import examDutyRepository from "../repositories/examDuty.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import examRepository from "../repositories/exam.repository.js";

import { ApiError } from "../utils/apiError.js";

import { DutyStatus, ExamStatus, Role } from "../generated/prisma/client.js";

import type {
  CreateExamDutyDto,
  UpdateExamDutyDto,
} from "../types/examDuty.types.js";

import type { ExamDutyResponse } from "../constants/prismaSelect.js";
import { hasSessionStarted } from "../utils/examSession.utils.js";

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

    if (exam.status !== ExamStatus.UPCOMING || hasSessionStarted(exam)) {
      throw new ApiError(
        400,
        "Only upcoming exam sessions can receive duty assignments",
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

    return examDutyRepository.createAssignedWithCapacity(
      data.employeeId,
      data.examId,
    );
  }

  /**
   * Get All Exam Duties
   */
  async getAll(
    page: number,
    limit: number,
    filters: {
      examId?: string;
      employeeId?: string;
      status?: DutyStatus;
    },
  ) {
    return examDutyRepository.findAll(page, limit, filters);
  }

  /**
   * Duties of an employee
   */
  async getByEmployee(employeeId: string): Promise<ExamDutyResponse[]> {
    return examDutyRepository.findByEmployee(employeeId);
  }

  async getEmployeeDutiesForUser(
    employeeId: string,
    user: { id: string; role: Role },
  ): Promise<ExamDutyResponse[]> {
    if (user.role === Role.FACULTY && user.id !== employeeId) {
      throw new ApiError(403, "You can only view your own examination duties.");
    }

    if (user.role === Role.HOD) {
      const [userDepartmentId, employeeDepartmentId] = await Promise.all([
        employeeRepository.findDepartmentIdByEmployee(user.id),
        employeeRepository.findDepartmentIdByEmployee(employeeId),
      ]);
      if (!userDepartmentId) {
        throw new ApiError(404, "Department not found.");
      }
      if (employeeDepartmentId !== userDepartmentId) {
        throw new ApiError(404, "Employee not found in your department.");
      }
    }

    return examDutyRepository.findByEmployee(employeeId);
  }

  /**
   * Upcoming duties of an employee
   */
  async getUpcomingByEmployee(employeeId: string): Promise<ExamDutyResponse[]> {
    return examDutyRepository.findUpcomingByEmployee(employeeId);
  }

  async getUpcomingByFaculty(employeeId: string): Promise<ExamDutyResponse[]> {
    const employee = await employeeRepository.findById(employeeId);
    if (
      !employee ||
      employee.role !== Role.FACULTY ||
      !employee.isActive
    ) {
      throw new ApiError(404, "Active faculty member not found.");
    }

    return examDutyRepository.findUpcomingByEmployee(employeeId);
  }

  /**
   * Duties of an exam
   */
  async getByExam(examId: string): Promise<ExamDutyResponse[]> {
    return examDutyRepository.findByExam(examId);
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

    if (
      examDuty.exam.status === ExamStatus.COMPLETED ||
      examDuty.exam.status === ExamStatus.CANCELLED
    ) {
      throw new ApiError(
        409,
        "Exam duties cannot be modified after the exam is completed or cancelled.",
      );
    }

    if (data.status) {
      if (
        (data.status === DutyStatus.ATTENDED ||
          data.status === DutyStatus.ABSENT) &&
        !hasSessionStarted(examDuty.exam)
      ) {
        throw new ApiError(
          409,
          "Duty attendance can only be recorded after the session starts.",
        );
      }

      if (
        examDuty.status === DutyStatus.ATTENDED ||
        examDuty.status === DutyStatus.ABSENT
      ) {
        throw new ApiError(409, "Final duty status cannot be changed.");
      }
    }

    return examDutyRepository.update(id, {
      ...data,
    });
  }

  /**
   * Delete Exam Duty
   */
  async delete(id: string): Promise<ExamDutyResponse> {
    const examDuty = await examDutyRepository.findById(id);

    if (!examDuty) {
      throw new ApiError(404, "Exam duty not found");
    }

    if (
      examDuty.exam.status === ExamStatus.COMPLETED ||
      examDuty.exam.status === ExamStatus.CANCELLED
    ) {
      throw new ApiError(
        409,
        "Completed or cancelled exam duties cannot be deleted.",
      );
    }

    return examDutyRepository.softDelete(id);
  }
}

export default new ExamDutyService();
