import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import api from "@/lib/api/api";
import { toast } from "sonner";

type User = {
  name: string;
  email: string;
  password: string;
};

interface ApiError {
  message: string;
}

export const useRegister = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (credentials: User) => {
      const response = await api.post("/auth/register", credentials);
      return response.data;
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["user"] });
      navigate(`/dashboard/${data.user.id}`);
      toast.success("You have registered successfully.");
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
