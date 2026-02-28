export type ClientQueryParams = {
  status?: "ALL" | "ACTIVE" | "PAUSED" | "ARCHIVED";
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
};

const normalizeListParams = (params?: ClientQueryParams) => ({
  status: params?.status ?? "ALL",
  sortOrder: params?.sortOrder ?? "desc",
  page: params?.page ?? 1,
  limit: params?.limit ?? 10,
});

export const clientKeys = {
  // root
  all: ["clients"] as const,

  // ------------------------
  // lists
  // ------------------------
  lists: () => [...clientKeys.all, "list"] as const,

  list: (params?: ClientQueryParams) => {
    const normalized = normalizeListParams(params);

    return [
      ...clientKeys.lists(),
      normalized.status,
      normalized.sortOrder,
      normalized.page,
      normalized.limit,
    ] as const;
  },

  // ------------------------
  // details/detail
  // ------------------------
  details: () => [...clientKeys.all, "detail"] as const,

  detail: (clientId: string) => [...clientKeys.details(), clientId] as const,

  // ------------------------
  // Work logs (if separated later)
  // ------------------------
  logsRoot: () => [...clientKeys.all, "logs"] as const,

  logs: (clientId: string) => [...clientKeys.logsRoot(), clientId] as const,

  log: (clientId: string, logId: string) =>
    [...clientKeys.logs(clientId), logId] as const,
};
