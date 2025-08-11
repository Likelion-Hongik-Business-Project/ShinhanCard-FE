export interface PostLoginRequest {
  employeeId: string;
  password: string;
}

export interface PostLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface PostLogoutResponse {
  success: boolean;
}
