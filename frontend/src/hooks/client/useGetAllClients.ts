import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";

export type Client = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  email: string;
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED";
  refillLink: string | null;
  lastLogAt: string | null;
  totalHours: string;
  hoursLogged: string;
  hourlyRate: string;
  currency: string;
  createdAt: string;
  updatedAt: string;
};

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
};

export const useGetAllClients = () => {
  const query = useQuery({
    queryKey: clientKeys.lists(),

    queryFn: async ({ signal }) => {
      const { data } = await api.get<{ data: Client[] }>("/clients", {
        signal,
      });
      return data.data;
    },
    staleTime: 1000 * 60 * 5,
    refetchOnWindowFocus: false,
  });

  return query;
};

// import { useQuery } from "@tanstack/react-query";
// import api from "@/lib/api/api";
// import type { User } from "@/types/user/user";

// export const useUser = () => {
//   return useQuery({
//     queryKey: ["user"],
//     queryFn: async () => {
//       const { data } = await api.get("/auth/me");
//       return data.data as User;
//     },
//     retry: (failureCount, error: any) => {
//       if (error.response?.status === 401) return false;
//       return failureCount < 2;
//     },
//     staleTime: 1000 * 60 * 10,
//   });
// };
