export type GlobalResponse<T> = {
  is_success: boolean;
  code: string;
  message: string;
  result: T;
};

export type ApiResponse<T> = Promise<GlobalResponse<T>>;
export type ErrorResponse = GlobalResponse<Record<string, never>>;
