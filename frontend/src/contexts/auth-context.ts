import { createContext } from "react";

import type { EmployeeResponseDto } from "@/types";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useLogout } from "@/features/auth/hooks/useLogout";

export type RefetchUser = ReturnType<typeof useCurrentUser>["refetch"];

export interface AuthContextValue {
  user: EmployeeResponseDto | null;

  isAuthenticated: boolean;

  isLoading: boolean;

  isFetching: boolean;

  login: ReturnType<typeof useLogin>;

  logout: ReturnType<typeof useLogout>;

  refetchUser: RefetchUser;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
