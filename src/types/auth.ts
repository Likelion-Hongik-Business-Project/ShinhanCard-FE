export interface LoginResponse {
  is_success: boolean;
  message: string;
  code: number;
  result: null | {
    access_token: string;
    refresh_token: string;
  };
}
