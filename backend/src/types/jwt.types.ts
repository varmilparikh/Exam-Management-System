import type { Role } from "../generated/prisma/client.js";

export interface JwtPayload {
  id: string;
  email: string;
  role: Role;
}