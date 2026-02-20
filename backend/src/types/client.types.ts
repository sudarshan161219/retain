export interface GetClientsParams {
  userId: string;
  search?: string;
  status?: string;
  page?: number;
  limit?: number;

  sortBy?: "createdAt" | "name";
  sortOrder?: "asc" | "desc";
}
