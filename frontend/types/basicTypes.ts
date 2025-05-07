export interface BaseResponse {
  data: unknown;
  message: string;
  code: number;
  meta: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    itemsPerPage: number;
    sortBy: string[];
    filters: Record<string, string>;
  };
}
