import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import api from "@/lib/api/api";
import { toast } from "sonner";
import { useUpdateClientStore } from "@/store/updateClientStore/useUpdateClientStore";
import { useModalStore } from "@/store/modalStore/useModalStore";

type Data = {
  id: string;
  name: string;
  email: string;
  totalHours: number | "";
  hourlyRate: number | "";
  currency: string;
  refillLink?: string | null;
};

interface ApiError {
  message: string;
}

export const useUpdateClient = () => {
  const queryClient = useQueryClient();
  const {
    formData: { id },
    reset,
  } = useUpdateClientStore();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async (data: Data) => {
      const res = await api.patch(`/clients/${id}`, data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
      console.log(data);
      toast.success(data.message);
      closeModal();
      reset();
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
