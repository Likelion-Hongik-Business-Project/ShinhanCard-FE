import { AxiosError } from "axios";

export const is404 = (e: unknown) =>
  (e as AxiosError)?.response?.status === 404;
export const retryIf404 = (failureCount: number, error: unknown) =>
  is404(error) && failureCount < 15;
export const retryDelay = (attempt: number) =>
  Math.min(300 * 2 ** attempt, 3000); // 0.3s → 3s
