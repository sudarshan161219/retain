import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { toast } from "sonner";
import { type Client } from "@/types/client/client";
import axios, { AxiosError } from "axios";

export type logData = {
  description: string;
  hours: number;
  date?: string;
};

interface ApiError {
  message: string;
}

export const useAddLog = (clientId: string) => {
  const queryClient = useQueryClient();
  const queryKey = ["clients", clientId];
  return useMutation({
    mutationFn: async (logData: logData) => {
      const { data } = await api.post(`/clients/${clientId}/logs`, logData);
      return data.data;
    },
    onSuccess: (newLog) => {
      toast.success("Hours logged successfully");
      queryClient.setQueryData(queryKey, (old: Client | undefined) => {
        if (!old) return old;
        return {
          ...old,
          logs: [newLog, ...(old.logs || [])],
        };
      });
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<ApiError>;
        const errorMessage =
          axiosErr.response?.data?.message || "An unexpected error occurred";
        console.error("Status Update failed:", axiosErr);
        toast.error(`Register failed: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
