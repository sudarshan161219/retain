import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import api from "@/lib/api/api";
import { toast } from "sonner";
import { useCreateClientStore } from "@/store/createClientStore/useCreateClientStore";
import { useModalStore } from "@/store/modalStore/useModalStore";

type Data = {
  name: string;
  totalHours: number | "";
  hourlyRate: number | "";
  currency: string;
  refillLink?: string;
};

interface ApiError {
  message: string;
}

export const useCreateClient = () => {
  const queryClient = useQueryClient();
  const { reset } = useCreateClientStore();
  const { closeModal } = useModalStore();

  return useMutation({
    mutationFn: async (data: Data) => {
      const res = await api.post("/clients", data);
      console.log(res.data);
      return res.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["clients"] });
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
