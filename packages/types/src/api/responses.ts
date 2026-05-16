export interface ApiMeta {
  page?: number;
  limit?: number;
  total?: number;
  totalPages?: number;
}

export interface ApiResponse<T> {
  data: T;
  meta?: ApiMeta;
}

export interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>;
  };
}

export type PaginatedResponse<T> = ApiResponse<T[]> & { meta: Required<ApiMeta> };
