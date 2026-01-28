import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api/api";
import { toast } from "sonner";
import type { Client } from "@/types/client/client";

export type ClientStatus = "ACTIVE" | "PAUSED" | "ARCHIVED";

export const useRetainerAdmin = (clientId: string | undefined) => {
  const queryClient = useQueryClient();
  // Unique cache key for this specific client
  const queryKey = ["client", clientId];

  // 1. FETCH CLIENT DATA
  const query = useQuery({
    queryKey,
    queryFn: async () => {
      const { data } = await api.get(`/clients/${clientId}`);
      return data as Client;
    },
    enabled: !!clientId, // Only fetch if ID is present
    staleTime: 1000 * 60 * 5, // Cache for 5 mins
  });

  // 2. MUTATION: ADD LOG
  const addLogMutation = useMutation({
    mutationFn: async (payload: {
      description: string;
      hours: number;
      date?: string;
    }) => {
      const { data } = await api.post(`/clients/${clientId}/logs`, payload);
      return data.data;
    },
    onSuccess: (newLog) => {
      toast.success("Hours logged successfully");
      // Optimistic Update or Cache Invalidation
      queryClient.setQueryData(queryKey, (old: Client | undefined) => {
        if (!old) return old;
        return {
          ...old,
          logs: [newLog, ...(old.logs || [])],
          // Optionally update local balance here if returned by API
        };
      });
      // Invalidate to ensure balance calculations are perfect
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to log hours");
    },
  });

  // 3. MUTATION: DELETE LOG
  const deleteLogMutation = useMutation({
    mutationFn: async (logId: string) => {
      // Note: Endpoint changed to match resource-oriented logic
      await api.delete(`/clients/logs/${logId}`);
      return logId;
    },
    onSuccess: (deletedLogId) => {
      toast.success("Log removed");
      queryClient.invalidateQueries({ queryKey });
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete log");
    },
  });

  // 4. MUTATION: UPDATE STATUS
  const updateStatusMutation = useMutation({
    mutationFn: async (status: ClientStatus) => {
      const { data } = await api.patch(`/clients/${clientId}/status`, {
        status,
      });
      return data.data;
    },
    onSuccess: (updatedClient) => {
      toast.success(`Status updated to ${updatedClient.status}`);
      queryClient.setQueryData(queryKey, (old: Client | undefined) => ({
        ...old,
        status: updatedClient.status,
      }));
    },
  });

  // 5. MUTATION: UPDATE DETAILS (Settings)
  const updateDetailsMutation = useMutation({
    mutationFn: async (payload: { name?: string; refillLink?: string }) => {
      const { data } = await api.patch(`/clients/${clientId}`, payload);
      return data.data;
    },
    onSuccess: (updatedClient) => {
      toast.success("Project updated successfully");
      queryClient.setQueryData(queryKey, (old: Client | undefined) => {
        if (!old) return updatedClient;
        return { ...old, ...updatedClient };
      });
    },
    onError: () => toast.error("Failed to update project"),
  });

  // 6. MUTATION: DELETE PROJECT
  const deleteProjectMutation = useMutation({
    mutationFn: async () => {
      await api.delete(`/clients/${clientId}`);
    },
    onSuccess: () => {
      toast.success("Project deleted");
      queryClient.removeQueries({ queryKey });
      // Usually you'd navigate back to dashboard here
    },
    onError: (err: any) => {
      toast.error(err.response?.data?.message || "Failed to delete project");
    },
  });

  // 7. ACTION: EXPORT EXCEL REPORT
  const exportReportMutation = useMutation({
    mutationFn: async () => {
      const response = await api.get(`/clients/${clientId}/export`, {
        responseType: "blob",
      });
      return response;
    },
    onSuccess: (response) => {
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;

      // Extract filename from headers
      const contentDisposition = response.headers["content-disposition"];
      let fileName = "Retainer_Report.xlsx";

      if (contentDisposition) {
        const fileNameMatch = contentDisposition.match(/filename="?([^"]+)"?/);
        if (fileNameMatch && fileNameMatch.length === 2)
          fileName = fileNameMatch[1];
      }

      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      toast.success("Report downloaded");
    },
    onError: () => toast.error("Failed to download report"),
  });

  return {
    client: query.data,
    isLoading: query.isLoading,
    isError: query.isError,

    addLog: addLogMutation.mutate,
    isAddingLog: addLogMutation.isPending,

    deleteLog: deleteLogMutation.mutate,
    isDeletingLog: deleteLogMutation.isPending,

    updateDetails: updateDetailsMutation.mutate,
    isUpdatingDetails: updateDetailsMutation.isPending,

    updateStatus: updateStatusMutation.mutate,
    isUpdatingStatus: updateStatusMutation.isPending,

    deleteProject: deleteProjectMutation.mutate,
    isDeletingProject: deleteProjectMutation.isPending,

    exportReport: exportReportMutation.mutate,
    isExporting: exportReportMutation.isPending,
  };
};
