import { useMemo, type ReactNode } from "react";

import { AuthContext, type AuthContextValue } from "./auth-context";

import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";
import { useLogin } from "@/features/auth/hooks/useLogin";
import { useLogout } from "@/features/auth/hooks/useLogout";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const currentUser = useCurrentUser();
  const login = useLogin();
  const logout = useLogout();

  const user = currentUser.data ?? null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: !currentUser.isLoading && user !== null,
      isLoading: currentUser.isLoading,
      isFetching: currentUser.isFetching,
      login,
      logout,
      refetchUser: currentUser.refetch,
    }),
    [
      user,
      currentUser.isLoading,
      currentUser.isFetching,
      currentUser.refetch,
      login,
      logout,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
