import { useQuery } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { type Client } from "@/types/client/client";

export type ClientsResponse = {
  data: Client;
  role: string;
};

// const queryKey = ["client", clientId];

export const clientKeys = {
  all: ["clients"] as const,
  lists: () => [...clientKeys.all, "list"] as const,
  detail: (id: string) => [...clientKeys.all, "detail", id] as const,
};

export const useGetClientById = (clientId: string | null) => {
  return useQuery({
    queryKey: clientKeys.detail(clientId!),
    queryFn: async ({ signal }) => {
      const { data } = await api.get<ClientsResponse>(`/clients/${clientId}`, {
        signal,
      });
      return data;
    },

    enabled: !!clientId,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60 * 24,
  });
};
