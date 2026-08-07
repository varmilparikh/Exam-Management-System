export type Permission =
  | "employee:view"
  | "employee:create"
  | "employee:edit"
  | "employee:delete"

  | "department:view"
  | "department:create"
  | "department:edit"
  | "department:delete"

  | "exam:view"
  | "exam:create"
  | "exam:edit"
  | "exam:delete"

  | "duty:view"
  | "duty:assign"
  | "duty:edit"

  | "transfer:view"
  | "transfer:approve"

  | "swap:view"
  | "swap:create"
  | "swap:approve"

  | "reports:view"

  | "notification:view";