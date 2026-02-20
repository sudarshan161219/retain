import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";

export type Client = {
  id: string;
  userId: string;
  slug: string;
  name: string;
  email: string;
  status: "ACTIVE" | "PAUSED" | "ARCHIVED";
  refillLink: string | null;
  lastLogAt: string | null;
  totalHours: string;
  hoursLogged: string;
  hourlyRate: string;
  currency: string;
  createdAt: string;
  updatedAt: string;

  hoursRemaining?: number;
};

export type Query = {
  search?: string;
  status?: "ACTIVE" | "PAUSED";
  page?: number;
  limit?: number;
};

export const useSearchFilterClients = (query: Query) => {
  const { search, status, page, limit } = query;

  return useQuery({
    queryKey: ["clients", { search, status, page, limit }],

    queryFn: async ({ signal }) => {
      const { data } = await api.get<{ data: Client[] }>("/clients", {
        signal,
        params: { search, status, page, limit },
      });

      return data.data;
    },

    // PERFORMANCE OPTIMIZATIONS:
    //  Don't refetch on window focus
    refetchOnWindowFocus: false,

    //  Keep data "fresh" for 5 minutes
    staleTime: 5 * 60 * 1000,
    gcTime: 1000 * 60 * 60 * 24,

    //  Keep previous data while fetching new data
    placeholderData: (previousData) => previousData,

    //  Only fetch if we have the minimum requirements
    enabled: true,
    refetchOnMount: false,
  });
};
