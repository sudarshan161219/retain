import { useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { toast } from "sonner";

export const useClientRefill = (clientId: string | undefined) => {
  const queryClient = useQueryClient();
  const queryKey = ["admin-client", clientId];

  const refillMutation = useMutation({
    mutationFn: async (payload: { hours: number; createLog: boolean }) => {
      const { data } = await api.post(`/clients/${clientId}/refill`, payload);
      return data;
    },
    onSuccess: (_, variables) => {
      toast.success(`Added ${variables.hours} hours to budget`);
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to add hours");
    },
  });

  return {
    refillBalance: refillMutation.mutate,
    isRefilling: refillMutation.isPending,
  };
};
