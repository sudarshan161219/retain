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
};

export type ClientQueryParams = {
  status?: "ALL" | "ACTIVE" | "PAUSED" | "ARCHIVED";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

export type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
};

export type PaginatedClientsResponse = {
  data: Client[];
  meta: PaginationMeta;
};

export const clientKeys = {
  all: ["clients"] as const,
  lists: (params?: ClientQueryParams) =>
    [...clientKeys.all, "list", params] as const,
};

export const useGetAllClients = (params: ClientQueryParams) => {
  const { status, sortOrder, page, limit } = params;
  const query = useQuery({
    queryKey: clientKeys.lists(params),

    queryFn: async ({ signal }) => {
      const { data } = await api.get<PaginatedClientsResponse>("/clients", {
        signal,
        params: { status, sortOrder, page, limit },
      });

      return { clients: data.data, meta: data.meta };
    },

    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
    placeholderData: (previousData) => previousData,
    enabled: true,
    refetchOnMount: false,
  });

  return query;
};
