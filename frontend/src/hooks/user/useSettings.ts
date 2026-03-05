import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { toast } from "sonner";

export const useSettings = () => {
  const queryClient = useQueryClient();

  // GET Settings
  const { data: settings, isLoading } = useQuery({
    queryKey: ["settings"],
    queryFn: async () => {
      const res = await api.get("/user/settings");
      return res.data.data; // Assumes { success: true, data: { ... } }
    },
  });

  // UPDATE Workspace
  const updateWorkspace = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/settings/workspace", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Workspace settings updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update workspace");
    },
  });

  // UPDATE Preferences
  const updatePreference = useMutation({
    mutationFn: async (data: any) => {
      const res = await api.put("/settings/preference", data);
      return res.data;
    },
    onSuccess: () => {
      toast.success("Preferences updated");
      queryClient.invalidateQueries({ queryKey: ["settings"] });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to update preferences");
    },
  });

  return { settings, isLoading, updateWorkspace, updatePreference };
};