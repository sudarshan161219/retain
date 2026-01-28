import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import type { User } from "@/types/user/user";

export const useUser = () => {
  return useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await api.get("/auth/me");
      return data.data as User;
    },
    // Don't retry if 401 (Unauthorized)
    retry: (failureCount, error: any) => {
      if (error.response?.status === 401) return false;
      return failureCount < 2;
    },
    // Cache user for 10 mins, but re-fetch on window focus
    staleTime: 1000 * 60 * 10,
  });
};
