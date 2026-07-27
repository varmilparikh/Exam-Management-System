import notificationService from "./notification.service.js";

class NotificationHelperService {
  /**
   * Send notification to one employee
   */
  async notify(employeeId: string, title: string, message: string) {
    return notificationService.create({
      employeeId,
      title,
      message,
    });
  }

  /**
   * Send same notification to multiple employees
   */
  async notifyMany(employeeIds: string[], title: string, message: string) {
    await Promise.all(
      employeeIds.map((employeeId) =>
        notificationService.create({
          employeeId,
          title,
          message,
        }),
      ),
    );
  }

  async notifySwapApproved(requesterId: string, receiverId: string) {
    await this.notify(
      requesterId,
      "Swap Request Approved",
      "Your swap request has been approved by the COE.",
    );

    await this.notify(
      receiverId,
      "Swap Request Approved",
      "Your accepted swap request has been approved by the COE.",
    );
  }
}

export default new NotificationHelperService();
