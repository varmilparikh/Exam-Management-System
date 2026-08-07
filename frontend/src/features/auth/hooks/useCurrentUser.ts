import { useQuery } from "@tanstack/react-query";
import { QUERY_KEYS } from "@/constants/queryKeys";
import { me } from "@/features/auth/api/auth.service";

export function useCurrentUser() {
  return useQuery({
    queryKey: QUERY_KEYS.CURRENT_USER,
    queryFn: me,
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnReconnect: false,
  });
}
