import examOptInRepository from "../repositories/examOptIn.repository.js";
import employeeRepository from "../repositories/employee.repository.js";
import activityLogService from "./activityLog.service.js";
import notificationHelperService from "./notificationHelper.service.js";
import employeeValidationService from "./employeeValidation.service.js";
import { ActivityAction, EntityType, ExamOptInStatus, Role } from "../generated/prisma/client.js";

class ExamOptInService {
  async getUpcomingForFaculty(employeeId: string) {
    return examOptInRepository.findUpcomingForFaculty(employeeId);
  }

  async request(employeeId: string, examId: string) {
    const employee = await employeeValidationService.validateFaculty(employeeId, "Faculty");
    const optIn = await examOptInRepository.createOrReopen(employee.id, examId);

    await activityLogService.log({
      employeeId,
      action: ActivityAction.CREATE_EXAM_OPT_IN,
      description: `${employee.name} opted in for "${optIn.exam.examName}" (${optIn.exam.sessionName}).`,
      entityType: EntityType.EXAM,
      entityId: examId,
    });

    const approvers = await Promise.all([
      employeeRepository.findByRole(Role.SUPER_ADMIN),
      employeeRepository.findByRole(Role.COE),
    ]);
    await notificationHelperService.notifyMany(
      [...new Set(approvers.flat().map((approver) => approver.id))],
      "Faculty Exam Opt-in",
      `${employee.name} opted in for "${optIn.exam.examName}" (${optIn.exam.sessionName}). Review the opt-in to confirm or reject participation.`,
    );
    return optIn;
  }

  async cancel(employeeId: string, id: string) {
    const optIn = await examOptInRepository.cancelPending(employeeId, id);
    await activityLogService.log({
      employeeId,
      action: ActivityAction.CANCEL_EXAM_OPT_IN,
      description: `Faculty cancelled an opt-in for "${optIn.exam.examName}" (${optIn.exam.sessionName}).`,
      entityType: EntityType.EXAM,
      entityId: optIn.examId,
    });
    return optIn;
  }

  async list(filters: { status?: ExamOptInStatus; examId?: string; departmentId?: string; role: Role; employeeId: string }) {
    return examOptInRepository.list(filters);
  }

  async review(id: string, reviewerId: string, action: "CONFIRM" | "REJECT", remark?: string) {
    const reviewer = await employeeValidationService.validateEmployee(reviewerId, "Reviewer");
    const optIn = await examOptInRepository.review(id, reviewerId, action, remark);
    await activityLogService.log({
      employeeId: reviewerId,
      action: action === "CONFIRM" ? ActivityAction.CONFIRM_EXAM_OPT_IN : ActivityAction.REJECT_EXAM_OPT_IN,
      description: `${reviewer.name} ${action.toLowerCase()}ed ${optIn.employee.name}'s opt-in for "${optIn.exam.examName}" (${optIn.exam.sessionName}).`,
      entityType: EntityType.EXAM,
      entityId: optIn.examId,
    });
    await notificationHelperService.notify(
      optIn.employeeId,
      action === "CONFIRM" ? "Exam Participation Confirmed" : "Exam Opt-in Rejected",
      action === "CONFIRM"
        ? `Your participation in "${optIn.exam.examName}" (${optIn.exam.sessionName}) is confirmed.`
        : `Your opt-in for "${optIn.exam.examName}" (${optIn.exam.sessionName}) was not approved.${remark ? ` Reason: ${remark}` : ""}`,
    );
    return optIn;
  }
}

export default new ExamOptInService();
