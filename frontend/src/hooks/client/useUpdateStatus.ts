import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { toast } from "sonner";
import axios, { AxiosError } from "axios";

export type ClientStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

interface ApiError {
  message: string;
}

export const useUpdateStatus = (clientId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (status: ClientStatus) => {
      const { data } = await api.patch(`/clients/${clientId}/status`, {
        status,
      });
      return data.data;
    },
    onSuccess: (updatedClient) => {
      toast.success(`Status updated to ${updatedClient.status}`);
      queryClient.invalidateQueries({ queryKey: ["clients"] });
    },
    onError: (err: unknown) => {
      if (axios.isAxiosError(err)) {
        const axiosErr = err as AxiosError<ApiError>;
        const errorMessage =
          axiosErr.response?.data?.message || "An unexpected error occurred";
        console.error("Register failed:", axiosErr);
        toast.error(`Register failed: ${errorMessage}`);
      } else {
        toast.error("An unexpected error occurred");
      }
    },
  });
};
