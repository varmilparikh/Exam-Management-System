import {
  ActivityAction,
  EntityType,
} from "../generated/prisma/client.js";

/**
 * Create Activity Log DTO
 */
export interface CreateActivityLogDto {
  employeeId: string;
  action: ActivityAction;
  description: string;
  entityType?: EntityType;
  entityId?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Update Activity Log DTO
 */
export interface UpdateActivityLogDto {
  description?: string;
}